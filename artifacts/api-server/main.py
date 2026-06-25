"""
VentureIQ AI - FastAPI ML Backend
===================================
Serves the trained Random Forest model via a REST API.

Endpoints:
  GET  /api/healthz  — liveness check
  POST /api/predict  — business success prediction

The response schema exactly matches the OpenAPI contract so the React
frontend requires zero changes.

Start the server:
    uvicorn artifacts.api-server.main:app --reload
or (from inside artifacts/api-server/):
    uvicorn main:app --host 0.0.0.0 --port 8080
"""

import os
import sys
import math
import logging
from contextlib import asynccontextmanager
from enum import Enum
from typing import List

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ── Model path ────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

# Global model handle (loaded once at startup)
rf_model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model when the server starts, release on shutdown."""
    global rf_model
    if not os.path.exists(MODEL_PATH):
        logger.error(
            "model.pkl not found at %s — run train_model.py first!", MODEL_PATH
        )
        sys.exit(1)
    rf_model = joblib.load(MODEL_PATH)
    logger.info("Random Forest model loaded from %s", MODEL_PATH)
    yield
    rf_model = None
    logger.info("Server shutting down.")


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="VentureIQ AI",
    description="Business Success Predictor — Python + ML backend",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Enums matching the OpenAPI spec ──────────────────────────────────────────
class BusinessType(str, Enum):
    technology    = "Technology"
    ecommerce     = "E-commerce"
    healthcare    = "Healthcare"
    education     = "Education"
    finance       = "Finance"
    food_beverage = "Food & Beverage"
    other         = "Other"


class CompetitionLevel(str, Enum):
    low    = "Low"
    medium = "Medium"
    high   = "High"


class MarketSize(str, Enum):
    small  = "Small"
    medium = "Medium"
    large  = "Large"


# ── Request / response schemas ────────────────────────────────────────────────
class BusinessInput(BaseModel):
    businessName:      str   = Field(..., min_length=1)
    businessType:      BusinessType
    initialInvestment: float = Field(..., ge=0)
    teamSize:          int   = Field(..., ge=1)
    founderExperience: int   = Field(..., ge=0)
    marketingBudget:   float = Field(..., ge=0)
    competitionLevel:  CompetitionLevel
    targetMarketSize:  MarketSize


class ScoreBreakdown(BaseModel):
    investmentScore:  float
    teamScore:        float
    experienceScore:  float
    marketingScore:   float
    marketScore:      float
    competitionScore: float


class PredictionResult(BaseModel):
    successScore:    float
    riskLevel:       str
    growthPotential: str
    recommendations: List[str]
    breakdown:       ScoreBreakdown


class HealthStatus(BaseModel):
    status: str


# ── Feature engineering helpers ───────────────────────────────────────────────
def _investment_score(investment: float, business_type: str) -> float:
    """Sub-score 0–100 for investment adequacy vs sector threshold."""
    thresholds = {
        "Technology":     50_000,
        "E-commerce":     20_000,
        "Healthcare":    100_000,
        "Education":      30_000,
        "Finance":        75_000,
        "Food & Beverage": 40_000,
        "Other":          30_000,
    }
    threshold = thresholds.get(business_type, 30_000)
    if investment >= threshold * 3: return 95.0
    if investment >= threshold * 2: return 80.0
    if investment >= threshold:     return 65.0
    if investment >= threshold / 2: return 45.0
    return 25.0


def _team_score(team_size: int) -> float:
    if team_size >= 20: return 95.0
    if team_size >= 10: return 80.0
    if team_size >= 5:  return 65.0
    if team_size >= 3:  return 50.0
    if team_size == 2:  return 35.0
    return 20.0


def _experience_score(years: int) -> float:
    if years >= 15: return 95.0
    if years >= 10: return 85.0
    if years >= 7:  return 75.0
    if years >= 5:  return 65.0
    if years >= 3:  return 50.0
    if years >= 1:  return 35.0
    return 20.0


def _marketing_score(marketing_budget: float, initial_investment: float) -> float:
    if initial_investment == 0:
        return 40.0
    ratio = marketing_budget / initial_investment
    if ratio >= 0.30: return 90.0
    if ratio >= 0.20: return 75.0
    if ratio >= 0.10: return 60.0
    if ratio >= 0.05: return 45.0
    return 25.0


def _market_score(market_size: str) -> float:
    return {"Large": 90.0, "Medium": 65.0, "Small": 40.0}.get(market_size, 50.0)


def _competition_score(competition_level: str) -> float:
    return {"Low": 90.0, "Medium": 60.0, "High": 30.0}.get(competition_level, 50.0)


def _competition_enc(level: str) -> float:
    return {"Low": 0.0, "Medium": 1.0, "High": 2.0}.get(level, 1.0)


def _market_enc(size: str) -> float:
    return {"Small": 0.0, "Medium": 1.0, "Large": 2.0}.get(size, 1.0)


# ── Recommendation engine ──────────────────────────────────────────────────────
def _generate_recommendations(inp: BusinessInput, bd: ScoreBreakdown) -> List[str]:
    recs: List[str] = []

    if bd.marketingScore < 50:
        recs.append(
            "Increase your marketing budget to at least 15–20% of initial investment "
            "to boost brand visibility and customer acquisition."
        )
    if bd.teamScore < 50:
        recs.append(
            "Expand your team with specialised talent in product, sales, and operations "
            "to accelerate execution."
        )
    if bd.experienceScore < 50:
        recs.append(
            "Consider bringing on experienced advisors or co-founders to complement "
            "your domain knowledge and industry credibility."
        )
    if bd.competitionScore < 50:
        recs.append(
            "Develop a differentiated value proposition and niche-targeting strategy "
            "to reduce competitive pressure."
        )
    if bd.marketScore < 50:
        recs.append(
            "Explore adjacent markets or pivot to a larger target audience to unlock "
            "greater growth potential."
        )
    if bd.investmentScore < 50:
        recs.append(
            "Seek additional funding through angel investors, grants, or accelerator "
            "programmes to extend your runway."
        )
    if inp.businessType == BusinessType.technology:
        recs.append(
            "Focus on rapid prototyping and an MVP launch to validate product-market "
            "fit before scaling infrastructure."
        )
    if inp.businessType in (BusinessType.healthcare, BusinessType.finance):
        recs.append(
            "Prioritise regulatory compliance and data security from day one — "
            "trust is your most valuable asset in this sector."
        )
    if inp.competitionLevel == CompetitionLevel.high:
        recs.append(
            "Identify and double down on a defensible niche where you can dominate "
            "before expanding to the broader market."
        )
    if inp.targetMarketSize == MarketSize.small:
        recs.append(
            "Build deep customer loyalty and referral programmes now — your market "
            "ceiling requires maximum retention to scale revenue."
        )
    if inp.founderExperience < 3 and inp.teamSize < 3:
        recs.append(
            "Invest in founder coaching and mentorship to accelerate learning and "
            "reduce early-stage missteps."
        )
    if not recs:
        recs.append(
            "Your business fundamentals are strong — focus on consistent execution "
            "and data-driven iteration."
        )
        recs.append(
            "Consider geographic expansion once your core market is well-penetrated "
            "and unit economics are proven."
        )

    return recs[:6]


# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/api/healthz", response_model=HealthStatus, tags=["health"])
async def health_check():
    """Liveness probe — returns immediately."""
    return HealthStatus(status="ok")


@app.post("/api/predict", response_model=PredictionResult, tags=["prediction"])
async def predict_business(body: BusinessInput):
    """
    Run the Random Forest model on the submitted business parameters.

    Returns:
    - successScore   : ML-derived probability × 100 (0–100)
    - riskLevel      : Low / Medium / High
    - growthPotential: Low / Medium / High
    - breakdown      : individual factor scores (0–100)
    - recommendations: up to 6 actionable directives
    """
    if rf_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # 1. Calculate individual feature scores (used for breakdown + display)
    inv_s  = _investment_score(body.initialInvestment, body.businessType.value)
    t_s    = _team_score(body.teamSize)
    e_s    = _experience_score(body.founderExperience)
    mk_s   = _marketing_score(body.marketingBudget, body.initialInvestment)
    m_s    = _market_score(body.targetMarketSize.value)
    c_s    = _competition_score(body.competitionLevel.value)

    breakdown = ScoreBreakdown(
        investmentScore  = round(inv_s,  1),
        teamScore        = round(t_s,    1),
        experienceScore  = round(e_s,    1),
        marketingScore   = round(mk_s,   1),
        marketScore      = round(m_s,    1),
        competitionScore = round(c_s,    1),
    )

    # 2. Build the feature vector the Random Forest was trained on
    #    [investment_amount, team_size, founder_experience, marketing_budget,
    #     competition_level (0/1/2), market_size (0/1/2)]
    features = np.array([[
        body.initialInvestment,
        float(body.teamSize),
        float(body.founderExperience),
        body.marketingBudget,
        _competition_enc(body.competitionLevel.value),
        _market_enc(body.targetMarketSize.value),
    ]])

    # 3. Get probability from Random Forest
    proba        = rf_model.predict_proba(features)[0]           # [p_fail, p_success]
    success_prob = float(proba[1])                                # probability of success

    # 4. Blend ML probability with rule-based weighted score for a stable output
    #    This prevents edge cases where the model is overly confident on sparse inputs.
    rule_score = (
        inv_s  * 0.20 +
        e_s    * 0.20 +
        t_s    * 0.15 +
        mk_s   * 0.15 +
        m_s    * 0.15 +
        c_s    * 0.15
    )
    blended       = (success_prob * 100 * 0.60) + (rule_score * 0.40)
    success_score = max(0, min(100, round(blended)))

    # 5. Derive categorical outputs
    risk_level = (
        "Low"    if success_score >= 70 else
        "Medium" if success_score >= 45 else
        "High"
    )
    growth_index  = success_score * 0.50 + m_s * 0.30 + mk_s * 0.20
    growth_potential = (
        "High"   if growth_index >= 70 else
        "Medium" if growth_index >= 45 else
        "Low"
    )

    recommendations = _generate_recommendations(body, breakdown)

    logger.info(
        "Prediction for '%s': score=%d risk=%s growth=%s  (ML=%.2f rule=%.1f)",
        body.businessName, success_score, risk_level, growth_potential,
        success_prob, rule_score,
    )

    return PredictionResult(
        successScore    = float(success_score),
        riskLevel       = risk_level,
        growthPotential = growth_potential,
        recommendations = recommendations,
        breakdown       = breakdown,
    )


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
