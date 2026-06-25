"""
VentureIQ AI - ML Model Training Script
========================================
Generates a synthetic business dataset and trains a Random Forest Classifier
to predict startup success probability.

Dataset: 2000 synthetic business records
Model:   Random Forest Classifier (scikit-learn)
Output:  model.pkl  (loaded by main.py at startup)

Run this once to (re)train:
    python artifacts/api-server/train_model.py
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ── Reproducibility ─────────────────────────────────────────────────────────
SEED = 42
np.random.seed(SEED)

N = 2000  # number of training samples

# ── 1. Generate synthetic features ──────────────────────────────────────────
# investment_amount  : USD 5 000 – 2 000 000 (log-normal so small deals are common)
investment = np.random.lognormal(mean=10.5, sigma=1.2, size=N).clip(5_000, 2_000_000)

# team_size          : 1 – 50 (Poisson-ish, most are small)
team_size = np.random.poisson(lam=6, size=N).clip(1, 50).astype(float)

# founder_experience : 0 – 25 years
founder_exp = np.random.gamma(shape=2.5, scale=3.0, size=N).clip(0, 25)

# marketing_budget   : 2 – 30 % of investment
marketing_ratio = np.random.beta(a=2, b=6, size=N)          # skewed toward lower %
marketing_budget = investment * marketing_ratio

# competition_level  : 0=Low  1=Medium  2=High  (roughly equal thirds)
competition = np.random.choice([0, 1, 2], size=N, p=[0.30, 0.40, 0.30])

# market_size        : 0=Small  1=Medium  2=Large
market_size = np.random.choice([0, 1, 2], size=N, p=[0.25, 0.45, 0.30])

# ── 2. Build a deterministic success signal ──────────────────────────────────
# We create a latent "quality" score 0–100 from the features, then threshold
# it + add noise to produce a binary label.

def investment_score(inv):
    """Maps raw investment to a quality signal 0–100."""
    s = np.where(inv >= 300_000, 95,
        np.where(inv >= 150_000, 80,
        np.where(inv >= 50_000,  65,
        np.where(inv >= 20_000,  45, 25))))
    return s.astype(float)

def team_score(ts):
    return np.where(ts >= 20, 95,
           np.where(ts >= 10, 80,
           np.where(ts >= 5,  65,
           np.where(ts >= 3,  50,
           np.where(ts == 2,  35, 20))))).astype(float)

def exp_score(exp):
    return np.where(exp >= 15, 95,
           np.where(exp >= 10, 85,
           np.where(exp >= 7,  75,
           np.where(exp >= 5,  65,
           np.where(exp >= 3,  50,
           np.where(exp >= 1,  35, 20)))))).astype(float)

def marketing_score(ratio):
    return np.where(ratio >= 0.30, 90,
           np.where(ratio >= 0.20, 75,
           np.where(ratio >= 0.10, 60,
           np.where(ratio >= 0.05, 45, 25)))).astype(float)

def market_score(ms):
    return np.where(ms == 2, 90, np.where(ms == 1, 65, 40)).astype(float)

def competition_score(cl):
    return np.where(cl == 0, 90, np.where(cl == 1, 60, 30)).astype(float)

i_s  = investment_score(investment)
t_s  = team_score(team_size)
e_s  = exp_score(founder_exp)
mk_s = marketing_score(marketing_ratio)
m_s  = market_score(market_size)
c_s  = competition_score(competition)

# Weighted latent quality (mirrors production scoring weights)
quality = (
    i_s  * 0.20 +
    e_s  * 0.20 +
    t_s  * 0.15 +
    mk_s * 0.15 +
    m_s  * 0.15 +
    c_s  * 0.15
)

# Binary label: success if quality ≥ 55 (adds noise to make it realistic)
noise = np.random.normal(0, 8, size=N)
success = ((quality + noise) >= 55).astype(int)

print(f"Dataset balance — success: {success.mean():.1%}  failure: {1 - success.mean():.1%}")

# ── 3. Assemble DataFrame ────────────────────────────────────────────────────
df = pd.DataFrame({
    "investment_amount":   investment,
    "team_size":           team_size,
    "founder_experience":  founder_exp,
    "marketing_budget":    marketing_budget,
    "competition_level":   competition.astype(float),   # 0/1/2
    "market_size":         market_size.astype(float),   # 0/1/2
    "success":             success,
})

# ── 4. Train / test split ────────────────────────────────────────────────────
FEATURES = ["investment_amount", "team_size", "founder_experience",
            "marketing_budget",  "competition_level", "market_size"]

X = df[FEATURES]
y = df["success"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=SEED, stratify=y
)

# ── 5. Train Random Forest ───────────────────────────────────────────────────
model = RandomForestClassifier(
    n_estimators=200,      # 200 trees for stable probability estimates
    max_depth=8,           # prevent overfitting on synthetic data
    min_samples_split=10,
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=SEED,
    n_jobs=-1,             # use all CPU cores
)

model.fit(X_train, y_train)

# ── 6. Evaluate ──────────────────────────────────────────────────────────────
y_pred = model.predict(X_test)
acc    = accuracy_score(y_test, y_pred)

print(f"\nTest accuracy : {acc:.3f}")
print("\nClassification report:")
print(classification_report(y_test, y_pred, target_names=["Failure", "Success"]))

print("Feature importances:")
for feat, imp in sorted(zip(FEATURES, model.feature_importances_), key=lambda x: -x[1]):
    print(f"  {feat:25s} {imp:.3f}")

# ── 7. Save model ────────────────────────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump(model, out_path)
print(f"\nModel saved → {out_path}")
