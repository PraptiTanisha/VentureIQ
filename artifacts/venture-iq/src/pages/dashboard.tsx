import { TrendingUp, Activity, AlertTriangle, Zap, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const kpi = [
  { label: "Avg Success Score", value: "74", sub: "+12% this month", trend: "up" as const, icon: TrendingUp },
  { label: "Active Analyses", value: "3", sub: "2 pending", trend: null, icon: Activity },
  { label: "Risk Alerts", value: "1", sub: "High competition", trend: "down" as const, icon: AlertTriangle },
  { label: "Growth Potential", value: "High", sub: "2 of 3 ventures", trend: "up" as const, icon: Zap },
];

const industryData = [
  { sector: "Tech", score: 78 },
  { sector: "Finance", score: 65 },
  { sector: "Health", score: 71 },
  { sector: "Ecom", score: 69 },
  { sector: "Edu", score: 74 },
  { sector: "Food", score: 58 },
];

const recent = [
  { name: "Acme Tech Corp", score: 82, time: "2h ago", trend: "up" as const },
  { name: "GreenLeaf Foods", score: 54, time: "1d ago", trend: "down" as const },
  { name: "MedCore Health", score: 71, time: "3d ago", trend: "up" as const },
  { name: "EduFirst Platform", score: 63, time: "5d ago", trend: null },
];

const CARD = { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" };
const MUTED = "hsl(0 0% 45%)";

function ScoreChip({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums"
      style={{ color, background: `${color}18` }}
    >
      {score}
    </span>
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
  cursor: { fill: "hsl(0 0% 14%)" },
};

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpi.map(({ label, value, sub, trend, icon: Icon }) => (
          <div
            key={label}
            data-testid={`card-kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-lg p-4 flex flex-col gap-3"
            style={CARD}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: MUTED }}>
                {label}
              </span>
              <Icon className="h-3.5 w-3.5" style={{ color: MUTED }} />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-foreground leading-none">
              {value}
            </span>
            <span
              className="text-[11px] flex items-center gap-1"
              style={{
                color: trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : MUTED,
              }}
            >
              {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
              {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
              {trend === null && <Minus className="h-3 w-3" />}
              {sub}
            </span>
          </div>
        ))}
      </div>

      {/* Chart + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 rounded-lg p-5" style={CARD}>
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-foreground">Industry Benchmark</p>
            <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Avg success score by sector</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} barSize={24} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
                <XAxis dataKey="sector" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 90]} tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="score" fill="hsl(0 0% 70%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg p-5" style={CARD}>
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-foreground">Recent Predictions</p>
            <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Latest venture analyses</p>
          </div>
          <div className="space-y-0">
            {recent.map((item) => (
              <div
                key={item.name}
                data-testid={`row-activity-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-foreground truncate leading-none">{item.name}</p>
                  <p className="text-[11px] mt-1 leading-none" style={{ color: MUTED }}>{item.time}</p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <ScoreChip score={item.score} />
                  {item.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                  {item.trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                  {item.trend === null && <Minus className="h-3 w-3" style={{ color: MUTED }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg p-5 flex items-center justify-between" style={CARD}>
        <div>
          <p className="text-[13px] font-semibold text-foreground">Run a new analysis</p>
          <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Input your venture's metrics to generate a success prediction</p>
        </div>
        <Link href="/analysis">
          <button
            data-testid="button-start-analysis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: "hsl(0 0% 98%)", color: "hsl(0 0% 4%)" }}
          >
            Start Analysis
          </button>
        </Link>
      </div>
    </div>
  );
}
