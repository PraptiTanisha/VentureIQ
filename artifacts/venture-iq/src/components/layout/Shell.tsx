import { useLocation, Link } from "wouter";
import { LayoutDashboard, FlaskConical, BrainCircuit, BarChart3, Settings, Search } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Business Analysis", icon: FlaskConical, href: "/analysis" },
  { label: "Predictions", icon: BrainCircuit, href: "/predictions" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/analysis": "Business Analysis",
  "/predictions": "Predictions",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const title = pageTitles[location] ?? "VentureIQ AI";

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside
        style={{ background: "hsl(0 0% 6%)", borderRight: "1px solid hsl(0 0% 12%)" }}
        className="w-[220px] shrink-0 flex flex-col"
      >
        {/* Wordmark */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center"
              style={{ background: "hsl(0 0% 98%)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 10L7 4L12 10" stroke="hsl(0 0% 4%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">VentureIQ</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <div
                  data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors"
                  style={{
                    color: active ? "hsl(0 0% 98%)" : "hsl(0 0% 55%)",
                    background: active ? "hsl(0 0% 12%)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 9%)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </div>
              </Link>
            );
          })}

          <div className="pt-3 mt-3" style={{ borderTop: "1px solid hsl(0 0% 12%)" }}>
            <Link href="/settings">
              <div
                data-testid="nav-settings"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors"
                style={{ color: "hsl(0 0% 55%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 9%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Settings className="h-3.5 w-3.5 shrink-0" />
                Settings
              </div>
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="px-3 py-3" style={{ borderTop: "1px solid hsl(0 0% 12%)" }}>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: "hsl(0 0% 20%)", color: "hsl(0 0% 80%)" }}
            >
              VA
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-foreground truncate leading-none">Analyst</p>
              <p className="text-[11px] mt-0.5 truncate leading-none" style={{ color: "hsl(0 0% 45%)" }}>Pro plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="h-[52px] shrink-0 flex items-center px-6 gap-4"
          style={{ borderBottom: "1px solid hsl(0 0% 12%)", background: "hsl(0 0% 4%)" }}
        >
          <h1 className="text-[13px] font-semibold text-foreground w-36 shrink-0">{title}</h1>

          {/* Search */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3" style={{ color: "hsl(0 0% 40%)" }} />
              <input
                type="search"
                placeholder="Search ventures..."
                data-testid="input-search"
                className="w-full pl-7 pr-3 py-1.5 text-[12px] rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                style={{
                  background: "hsl(0 0% 9%)",
                  border: "1px solid hsl(0 0% 14%)",
                  color: "hsl(0 0% 98%)",
                }}
              />
            </div>
          </div>

          <div className="ml-auto" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "hsl(0 0% 4%)" }}>
          <div className="max-w-5xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
