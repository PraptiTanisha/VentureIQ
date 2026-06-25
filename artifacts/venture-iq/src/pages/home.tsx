import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Briefcase, ChevronRight, Activity, Cpu, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between py-6 px-8 md:px-12 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-display tracking-tight">VentureIQ AI</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#methodology" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Methodology</a>
        </nav>
        <Link href="/predict" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Run Prediction
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          
          <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Proprietary AI Modeling Engine v2.4
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tighter mb-6 text-foreground drop-shadow-sm">
              Quantify your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">venture's potential.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop guessing. VentureIQ AI analyzes market conditions, competition, and core metrics to predict business success with clinical precision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/predict" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 py-2 w-full sm:w-auto shadow-lg shadow-primary/20">
                Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#methodology" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 py-2 w-full sm:w-auto">
                View Methodology
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-card/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
              <div className="text-center px-4">
                <div className="text-4xl font-bold font-display text-foreground mb-2">94%</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Prediction Accuracy</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-bold font-display text-foreground mb-2">12M+</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data Points Analyzed</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-bold font-display text-foreground mb-2">$4B+</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Capital Guided</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-bold font-display text-foreground mb-2">50k+</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ventures Scored</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Enterprise-grade Analysis</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">The same intelligence engine used by top-tier venture capital firms, now available for founders.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border p-8 rounded-xl hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Deep Risk Profiling</h3>
                <p className="text-muted-foreground">Identify critical vulnerabilities in your operational structure, market approach, and capitalization strategy before they become terminal.</p>
              </div>
              
              <div className="bg-card border border-border p-8 rounded-xl hover:border-primary/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Cpu className="h-32 w-32" />
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 relative z-10">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display relative z-10">Predictive Scoring</h3>
                <p className="text-muted-foreground relative z-10">Our proprietary neural network weighs 6 critical dimensions to generate a definitive 0-100 success probability index.</p>
              </div>
              
              <div className="bg-card border border-border p-8 rounded-xl hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Actionable Intelligence</h3>
                <p className="text-muted-foreground">Don't just get a score. Receive concrete, prioritized strategic directives to improve your venture's fundamentals and reduce risk.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-card border-t border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">Ready to see where you stand?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Input your key metrics. Run the simulation. Get the unvarnished truth.
            </p>
            <Link href="/predict" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 py-2 shadow-lg shadow-primary/20">
              Initialize Prediction Engine
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-4 w-4" />
            <span className="font-bold font-display">VentureIQ AI</span>
          </div>
          <p>© {new Date().getFullYear()} VentureIQ AI. All rights reserved. For informational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
