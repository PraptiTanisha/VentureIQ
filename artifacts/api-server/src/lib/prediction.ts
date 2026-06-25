import type { BusinessInput, PredictionResult, ScoreBreakdown } from "@workspace/api-zod";

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, val));
}

function calcInvestmentScore(investment: number, businessType: string): number {
  const thresholds: Record<string, number> = {
    Technology: 50000,
    "E-commerce": 20000,
    Healthcare: 100000,
    Education: 30000,
    Finance: 75000,
    "Food & Beverage": 40000,
    Other: 30000,
  };
  const threshold = thresholds[businessType] ?? 30000;
  if (investment >= threshold * 3) return 95;
  if (investment >= threshold * 2) return 80;
  if (investment >= threshold) return 65;
  if (investment >= threshold * 0.5) return 45;
  return 25;
}

function calcTeamScore(teamSize: number): number {
  if (teamSize >= 20) return 95;
  if (teamSize >= 10) return 80;
  if (teamSize >= 5) return 65;
  if (teamSize >= 3) return 50;
  if (teamSize === 2) return 35;
  return 20;
}

function calcExperienceScore(years: number): number {
  if (years >= 15) return 95;
  if (years >= 10) return 85;
  if (years >= 7) return 75;
  if (years >= 5) return 65;
  if (years >= 3) return 50;
  if (years >= 1) return 35;
  return 20;
}

function calcMarketingScore(marketingBudget: number, initialInvestment: number): number {
  if (initialInvestment === 0) return 40;
  const ratio = marketingBudget / initialInvestment;
  if (ratio >= 0.3) return 90;
  if (ratio >= 0.2) return 75;
  if (ratio >= 0.1) return 60;
  if (ratio >= 0.05) return 45;
  return 25;
}

function calcMarketScore(targetMarketSize: string): number {
  switch (targetMarketSize) {
    case "Large": return 90;
    case "Medium": return 65;
    case "Small": return 40;
    default: return 50;
  }
}

function calcCompetitionScore(competitionLevel: string): number {
  switch (competitionLevel) {
    case "Low": return 90;
    case "Medium": return 60;
    case "High": return 30;
    default: return 50;
  }
}

function deriveRiskLevel(score: number): "Low" | "Medium" | "High" {
  if (score >= 70) return "Low";
  if (score >= 45) return "Medium";
  return "High";
}

function deriveGrowthPotential(
  score: number,
  marketScore: number,
  marketingScore: number,
): "Low" | "Medium" | "High" {
  const growthIndex = (score * 0.5 + marketScore * 0.3 + marketingScore * 0.2);
  if (growthIndex >= 70) return "High";
  if (growthIndex >= 45) return "Medium";
  return "Low";
}

function generateRecommendations(
  input: BusinessInput,
  breakdown: ScoreBreakdown,
): string[] {
  const recs: string[] = [];

  if (breakdown.marketingScore < 50) {
    recs.push("Increase your marketing budget to at least 15–20% of initial investment to boost brand visibility and customer acquisition.");
  }

  if (breakdown.teamScore < 50) {
    recs.push("Expand your team with specialized talent in product, sales, and operations to accelerate execution.");
  }

  if (breakdown.experienceScore < 50) {
    recs.push("Consider bringing on experienced advisors or co-founders to complement your domain knowledge and industry credibility.");
  }

  if (breakdown.competitionScore < 50) {
    recs.push("Develop a differentiated value proposition and niche-targeting strategy to reduce competitive pressure.");
  }

  if (breakdown.marketScore < 50) {
    recs.push("Explore adjacent markets or pivot to a larger target audience to unlock greater growth potential.");
  }

  if (breakdown.investmentScore < 50) {
    recs.push("Seek additional funding through angel investors, grants, or accelerator programs to extend your runway.");
  }

  if (input.businessType === "Technology") {
    recs.push("Focus on rapid prototyping and an MVP launch to validate your product-market fit before scaling infrastructure.");
  }

  if (input.businessType === "Healthcare" || input.businessType === "Finance") {
    recs.push("Prioritize regulatory compliance and data security from day one — trust is your most valuable asset in this sector.");
  }

  if (input.competitionLevel === "High") {
    recs.push("Identify and double down on a defensible niche where you can dominate before expanding to the broader market.");
  }

  if (input.targetMarketSize === "Small") {
    recs.push("Build deep customer loyalty and referral programs now — your market ceiling requires maximum retention to scale revenue.");
  }

  if (input.founderExperience < 3 && input.teamSize < 3) {
    recs.push("Invest in founder coaching and mentorship to accelerate learning and reduce early-stage missteps.");
  }

  if (recs.length === 0) {
    recs.push("Your business fundamentals are strong — focus on consistent execution and data-driven iteration.");
    recs.push("Consider geographic expansion once your core market is well-penetrated and unit economics are proven.");
  }

  return recs.slice(0, 6);
}

export function computePrediction(input: BusinessInput): PredictionResult {
  const investmentScore = clamp(calcInvestmentScore(input.initialInvestment, input.businessType));
  const teamScore = clamp(calcTeamScore(input.teamSize));
  const experienceScore = clamp(calcExperienceScore(input.founderExperience));
  const marketingScore = clamp(calcMarketingScore(input.marketingBudget, input.initialInvestment));
  const marketScore = clamp(calcMarketScore(input.targetMarketSize));
  const competitionScore = clamp(calcCompetitionScore(input.competitionLevel));

  const breakdown: ScoreBreakdown = {
    investmentScore,
    teamScore,
    experienceScore,
    marketingScore,
    marketScore,
    competitionScore,
  };

  const weights = {
    investmentScore: 0.20,
    experienceScore: 0.20,
    teamScore: 0.15,
    marketingScore: 0.15,
    marketScore: 0.15,
    competitionScore: 0.15,
  };

  const successScore = clamp(Math.round(
    investmentScore * weights.investmentScore +
    experienceScore * weights.experienceScore +
    teamScore * weights.teamScore +
    marketingScore * weights.marketingScore +
    marketScore * weights.marketScore +
    competitionScore * weights.competitionScore
  ));

  const riskLevel = deriveRiskLevel(successScore);
  const growthPotential = deriveGrowthPotential(successScore, marketScore, marketingScore);
  const recommendations = generateRecommendations(input, breakdown);

  return {
    successScore,
    riskLevel,
    growthPotential,
    recommendations,
    breakdown,
  };
}
