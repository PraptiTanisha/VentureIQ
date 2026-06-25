import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

const CARD = { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" };
const MUTED = "hsl(0 0% 45%)";

const opportunityData = [
  { industry: "Tech", score: 82 },
  { industry: "Health", score: 76 },
  { industry: "Finance", score: 70 },
  { industry: "Education", score: 67 },
  { industry: "Ecom", score: 64 },
  { industry: "Food", score: 55 },
  { industry: "Other", score: 50 },
];

const trendData = [
  { m: "Jan", v: 58 }, { m: "Feb", v: 61 }, { m: "Mar", v: 59 },
  { m: "Apr", v: 64 }, { m: "May", v: 67 }, { m: "Jun", v: 63 },
  { m: "Jul", v: 70 }, { m: "Aug", v: 74 }, { m: "Sep", v: 72 },
  { m: "Oct", v: 76 }, { m: "Nov", v: 79 }, { m: "Dec", v: 81 },
];

const table = [
  { industry: "Technology", avg: 78, risk: "Low", growth: "High", rec: true },
  { industry: "Healthcare", avg: 71, risk: "Low", growth: "High", rec: true },
  { industry: "Finance", avg: 65, risk: "Medium", growth: "Medium", rec: true },
  { industry: "Education", avg: 74, risk: "Low", growth: "Medium", rec: false },
  { industry: "Food & Bev", avg: 58, risk: "High", growth: "Low", rec: false },
];

const tooltipStyle = {
  contentStyle: {
    background: "hsl(0 0% 10%)",
    border: "1px solid hsl(0 0% 18%)",
    borderRadius: "6px",
    color: "hsl(0 0% 98%)",
    fontSize: "11px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
  },
  cursor: { fill: "hsl(0 0% 12%)" },
};

function Tag({ label, type }: { label: string; type: "good" | "warn" | "bad" | "neutral" }) {
  const colors: Record<string, string> = {
    good: "#22c55e", warn: "#f59e0b", bad: "#ef4444", neutral: MUTED,
  };
  const c = colors[type];
  return (
    <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold" style={{ color: c, background: `${c}18` }}>
      {label}
    </span>
  );
}

export default function Reports() {
  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Industry Reports</p>
          <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Benchmarks & intelligence — Q2 2026</p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-md" style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)", color: MUTED }}>
          Sample data
        </span>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-lg p-5" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium mb-1" style={{ color: MUTED }}>Market Opportunity</p>
          <p className="text-[11px] mb-4" style={{ color: "hsl(0 0% 35%)" }}>Score by sector</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opportunityData} barSize={20} layout="vertical" margin={{ top: 0, right: 8, left: 16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 12%)" horizontal={false} />
                <XAxis type="number" domain={[40, 90]} tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="industry" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="score" fill="hsl(0 0% 65%)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg p-5" style={CARD}>
          <p className="text-[11px] uppercase tracking-wider font-medium mb-1" style={{ color: MUTED }}>Success Rate Trend</p>
          <p className="text-[11px] mb-4" style={{ color: "hsl(0 0% 35%)" }}>12-month rolling average</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 12%)" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 90]} tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="v" stroke="hsl(0 0% 75%)" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: "hsl(0 0% 75%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={CARD}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}>
          <p className="text-[12px] font-semibold text-foreground">Industry Comparison</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(0 0% 12%)", background: "hsl(0 0% 6%)" }}>
                {["Industry", "Avg Score", "Risk", "Growth", "Recommended"].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr
                  key={row.industry}
                  data-testid={`row-report-${row.industry.toLowerCase().replace(/\s+/g, "-")}`}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid hsl(0 0% 10%)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 9%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td className="px-5 py-3 text-[12px] font-medium text-foreground">{row.industry}</td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground tabular-nums">{row.avg}</td>
                  <td className="px-5 py-3">
                    <Tag label={row.risk} type={row.risk === "Low" ? "good" : row.risk === "Medium" ? "warn" : "bad"} />
                  </td>
                  <td className="px-5 py-3">
                    <Tag label={row.growth} type={row.growth === "High" ? "good" : row.growth === "Medium" ? "warn" : "bad"} />
                  </td>
                  <td className="px-5 py-3 text-[12px] font-medium" style={{ color: row.rec ? "#22c55e" : MUTED }}>
                    {row.rec ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
