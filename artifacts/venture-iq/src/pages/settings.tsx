import { useState } from "react";
import { User, Bell, Monitor, Info, Check } from "lucide-react";

const CARD = { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" };
const MUTED = "hsl(0 0% 45%)";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden" style={CARD}>
      <div className="px-5 py-3" style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}>
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{sub}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
      style={{ background: on ? "hsl(0 0% 80%)" : "hsl(0 0% 20%)" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full transition-transform"
        style={{
          background: on ? "hsl(0 0% 10%)" : "hsl(0 0% 60%)",
          transform: on ? "translateX(18px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-8 px-3 text-[12px] rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-56"
      style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
    />
  );
}

type Theme = "dark" | "light" | "system";

export default function Settings() {
  const [name, setName] = useState("Analyst");
  const [email, setEmail] = useState("analyst@ventureiq.app");
  const [theme, setTheme] = useState<Theme>("dark");
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    analysisComplete: true,
    weeklyReport: true,
    riskAlerts: true,
    productUpdates: false,
  });

  const toggle = (key: keyof typeof notifs) =>
    setNotifs((n) => ({ ...n, [key]: !n[key] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Profile */}
      <Section title="Profile Settings">
        <Row label="Display Name" sub="Used in reports and exports">
          <TextInput value={name} onChange={setName} placeholder="Your name" />
        </Row>
        <div style={{ borderTop: "1px solid hsl(0 0% 12%)" }} className="pt-4">
          <Row label="Email Address" sub="Login and notification email">
            <TextInput value={email} onChange={setEmail} placeholder="you@example.com" />
          </Row>
        </div>
        <div style={{ borderTop: "1px solid hsl(0 0% 12%)" }} className="pt-4">
          <Row label="Plan" sub="Your current subscription tier">
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold"
              style={{ background: "hsl(0 0% 14%)", color: "hsl(0 0% 80%)" }}
            >
              Pro
            </span>
          </Row>
        </div>
      </Section>

      {/* Theme */}
      <Section title="Theme Preference">
        <p className="text-[12px]" style={{ color: MUTED }}>Choose your interface color scheme</p>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {(["dark", "light", "system"] as Theme[]).map((t) => {
            const active = theme === t;
            const label = t === "dark" ? "Dark" : t === "light" ? "Light" : "System";
            const hint = t === "dark" ? "#0A0A0A bg" : t === "light" ? "#FFFFFF bg" : "Auto-detect";
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-md text-left transition-colors"
                style={{
                  background: active ? "hsl(0 0% 14%)" : "hsl(0 0% 9%)",
                  border: `1px solid ${active ? "hsl(0 0% 28%)" : "hsl(0 0% 14%)"}`,
                }}
              >
                <div
                  className="h-8 w-full rounded-sm"
                  style={{
                    background: t === "dark" ? "#111" : t === "light" ? "#F8F9FB" : "linear-gradient(135deg, #111 50%, #F8F9FB 50%)",
                    border: "1px solid hsl(0 0% 20%)",
                  }}
                />
                <span className="text-[11px] font-medium text-foreground">{label}</span>
                <span className="text-[10px]" style={{ color: MUTED }}>{hint}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification Settings">
        {[
          { key: "analysisComplete" as const, label: "Analysis Complete", sub: "Alert when a prediction finishes" },
          { key: "weeklyReport" as const, label: "Weekly Report", sub: "Summary email every Monday" },
          { key: "riskAlerts" as const, label: "Risk Alerts", sub: "High-risk venture flags in real time" },
          { key: "productUpdates" as const, label: "Product Updates", sub: "New features and changelog" },
        ].map(({ key, label, sub }, i, arr) => (
          <div key={key}>
            <Row label={label} sub={sub}>
              <Toggle on={notifs[key]} onToggle={() => toggle(key)} />
            </Row>
            {i < arr.length - 1 && <div style={{ borderTop: "1px solid hsl(0 0% 12%)" }} className="pt-4 mt-4" />}
          </div>
        ))}
      </Section>

      {/* App Info */}
      <Section title="Application Information">
        {[
          { label: "Version", value: "1.0.0" },
          { label: "Environment", value: "Production" },
          { label: "Model", value: "VentureIQ Scoring v1" },
          { label: "Data Region", value: "US East" },
        ].map(({ label, value }) => (
          <Row key={label} label={label}>
            <span className="text-[12px] font-mono" style={{ color: MUTED }}>{value}</span>
          </Row>
        ))}
      </Section>

      {/* Save */}
      <div className="flex justify-end pt-1 pb-4">
        <button
          onClick={save}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "hsl(0 0% 98%)", color: "hsl(0 0% 4%)" }}
        >
          {saved ? <><Check className="h-3 w-3" /> Saved</> : "Save changes"}
        </button>
      </div>
    </div>
  );
}
