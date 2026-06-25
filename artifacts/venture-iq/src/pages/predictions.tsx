import { Link } from "wouter";
import { usePrediction } from "@/context/PredictionContext";
import { BrainCircuit, FlaskConical } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const CARD = { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" };
const MUTED = "hsl(0 0% 45%)";

function ScoreRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="hsl(0 0% 14%)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight" style={{ color }}>{score}</span>
        <span className="text-[10px]" style={{ color: MUTED }}>/100</span>
      </div>
    </div>
  );
}

function LevelTag({ level }: { level: string }) {
  const map: Record<string, string> = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444" };
  const c = map[level] ?? "hsl(0 0% 55%)";
  return (
    <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ color: c, background: `${c}18` }}>
      {level}
    </span>
  );
}

function FactorRow({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span style={{ color: MUTED }}>{label}</span>
        <span className="font-semibold text-foreground tabular-nums">{score}</span>
      </div>
      <div className="h-1 w-full rounded-full" style={{ background: "hsl(0 0% 12%)" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "hsl(0 0% 10%)",
    border: "1px solid hsl(0 0% 18%)",
    borderRadius: "6px",
    color: "hsl(0 0% 98%)",
    fontSize: "11px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
  },
};

export default function Predictions() {
  const { result } = usePrediction();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4">
        <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "hsl(0 0% 10%)" }}>
          <BrainCircuit className="h-5 w-5" style={{ color: MUTED }} />
        </div>
        <div className="text-center">
          <p className="text-[13px] font-semibold text-foreground">No analysis yet</p>
          <p className="text-[12px] mt-1" style={{ color: MUTED }}>Run a business analysis to see results here</p>
        </div>
        <Link href="/analysis">
          <button
            data-testid="button-go-to-analysis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12px] font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "hsl(0 0% 98%)", color: "hsl(0 0% 4%)" }}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Business Analysis
          </button>
        </Link>
      </div>
    );
  }

  const { successScore, riskLevel, growthPotential, recommendations, breakdown } = result;
  const health = successScore >= 70 ? "Strong" : successScore >= 40 ? "Moderate" : "At Risk";

  const radarData = [
    { subject: "Investment", score: breakdown.investmentScore },
    { subject: "Team", score: breakdown.teamScore },
    { subject: "Experience", score: breakdown.experienceScore },
    { subject: "Marketing", score: breakdown.marketingScore },
    { subject: "Market", score: breakdown.marketScore },
    { subject: "Competition", score: breakdown.competitionScore },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Status */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px]"
        style={{ background: "hsl(142 60% 10%)", border: "1px solid hsl(142 60% 18%)", color: "#4ade80" }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Analysis complete
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg p-5 flex flex-col items-center gap-3" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: MUTED }}>Success Score</p>
          <ScoreRing score={successScore} />
          <p className="text-[12px] font-semibold" style={{ color: successScore >= 70 ? "#22c55e" : successScore >= 40 ? "#f59e0b" : "#ef4444" }}>
            {health}
          </p>
        </div>

        <div className="rounded-lg p-5 flex flex-col items-center justify-center gap-3" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: MUTED }}>Risk Level</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{riskLevel}</p>
          <LevelTag level={riskLevel} />
        </div>

        <div className="rounded-lg p-5 flex flex-col items-center justify-center gap-3" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: MUTED }}>Growth Potential</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{growthPotential}</p>
          <LevelTag level={growthPotential} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Radar */}
        <div className="rounded-lg p-5" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium mb-4" style={{ color: MUTED }}>Factor Radar</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                <PolarGrid stroke="hsl(0 0% 14%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: MUTED, fontSize: 11 }} />
                <Radar dataKey="score" stroke="hsl(0 0% 80%)" fill="hsl(0 0% 80%)" fillOpacity={0.15} />
                <Tooltip {...tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bars */}
        <div className="rounded-lg p-5" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium mb-4" style={{ color: MUTED }}>Score Breakdown</p>
          <div className="space-y-4 pt-1">
            <FactorRow label="Investment" score={breakdown.investmentScore} />
            <FactorRow label="Team" score={breakdown.teamScore} />
            <FactorRow label="Experience" score={breakdown.experienceScore} />
            <FactorRow label="Marketing" score={breakdown.marketingScore} />
            <FactorRow label="Market Size" score={breakdown.marketScore} />
            <FactorRow label="Competition" score={breakdown.competitionScore} />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-lg overflow-hidden" style={CARD}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}>
          <p className="text-[13px] font-semibold text-foreground">Strategic Recommendations</p>
          <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{recommendations.length} directives generated</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              data-testid={`card-recommendation-${i}`}
              className="flex gap-3 px-4 py-3 rounded-md"
              style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 14%)" }}
            >
              <span className="text-[11px] font-bold mt-0.5 shrink-0" style={{ color: MUTED }}>{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[12px] leading-relaxed" style={{ color: "hsl(0 0% 75%)" }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
