import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePredictBusiness } from "@workspace/api-client-react";
import { BusinessInputBusinessType, BusinessInputCompetitionLevel, BusinessInputTargetMarketSize, PredictionResult } from "@workspace/api-client-react";
import { predictionFormSchema, PredictionFormValues } from "@/lib/schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, ChevronRight, Info, LineChart, Loader2, Target, TrendingUp, Zap } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from "recharts";

export default function PredictPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      businessName: "",
      initialInvestment: 50000,
      teamSize: 2,
      founderExperience: 5,
      marketingBudget: 5000,
    }
  });

  const predictMutation = usePredictBusiness();

  const onSubmit = (data: PredictionFormValues) => {
    predictMutation.mutate({ data }, {
      onSuccess: (res) => {
        setResult(res);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border bg-card/50 py-6 px-8 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-display tracking-tight">VentureIQ</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            Terminal Interface
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">Venture Parameters</h1>
          <p className="text-muted-foreground text-lg">Input your business metrics for multi-dimensional AI analysis.</p>
        </div>

        <Card className="border-border shadow-xl mb-16 bg-card/40 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Primary Inputs
            </CardTitle>
            <CardDescription>All fields required for accurate modeling.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Entity Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" className="h-12 bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Sector</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50">
                              <SelectValue placeholder="Select a sector" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(BusinessInputBusinessType).map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="initialInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Capital Allocation (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 font-mono bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Headcount</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 font-mono bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="founderExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Founder Experience (Years)</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 font-mono bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Monthly Marketing (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 font-mono bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="competitionLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Market Saturation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50">
                              <SelectValue placeholder="Select competition level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(BusinessInputCompetitionLevel).map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetMarketSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">TAM (Total Addressable Market)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50">
                              <SelectValue placeholder="Select market size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(BusinessInputTargetMarketSize).map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto h-14 px-10 text-base font-semibold shadow-lg shadow-primary/20"
                    disabled={predictMutation.isPending}
                  >
                    {predictMutation.isPending ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Processing Simulation...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-3 h-5 w-5" />
                        Execute Analysis
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Dashboard */}
        {result && (
          <div ref={resultsRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-muted-foreground">Analysis Output</h2>
              <div className="ml-auto text-xs font-mono text-muted-foreground">
                ID: {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Score Card */}
              <Card className="lg:col-span-1 border-primary/20 bg-card overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">Overall Viability Index</div>
                  
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* SVG Radial Gauge */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-muted/30 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className={`stroke-current ${result.successScore >= 70 ? 'text-primary' : result.successScore >= 40 ? 'text-yellow-500' : 'text-destructive'} transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * result.successScore) / 100}
                      ></circle>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-6xl font-black font-display tracking-tighter">{result.successScore}</span>
                      <span className="text-xs font-medium text-muted-foreground mt-1">/ 100</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium flex items-center gap-2">
                    {result.successScore >= 70 ? (
                      <><CheckCircle2 className="h-4 w-4 text-green-500" /> Strong Prospect</>
                    ) : result.successScore >= 40 ? (
                      <><AlertTriangle className="h-4 w-4 text-yellow-500" /> Moderate Risk</>
                    ) : (
                      <><AlertTriangle className="h-4 w-4 text-destructive" /> High Risk</>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Metrics */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground uppercase">Factor 1</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Risk Level</div>
                      <div className="text-3xl font-bold font-display">{result.riskLevel}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground uppercase">Factor 2</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Growth Potential</div>
                      <div className="text-3xl font-bold font-display">{result.growthPotential}</div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Radar Chart for Breakdown */}
                <Card className="sm:col-span-2 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Factor Breakdown Matrix</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] w-full pt-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Investment', A: result.breakdown.investmentScore, fullMark: 100 },
                        { subject: 'Team', A: result.breakdown.teamScore, fullMark: 100 },
                        { subject: 'Experience', A: result.breakdown.experienceScore, fullMark: 100 },
                        { subject: 'Marketing', A: result.breakdown.marketingScore, fullMark: 100 },
                        { subject: 'Market', A: result.breakdown.marketScore, fullMark: 100 },
                        { subject: 'Competition', A: result.breakdown.competitionScore, fullMark: 100 },
                      ]}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                          itemStyle={{ color: 'hsl(var(--primary))' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-12">
              <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Strategic Directives
              </h3>
              <div className="grid gap-4">
                {result.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="flex gap-4 p-5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${(index + 1) * 150}ms`, animationFillMode: "both" }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-6 w-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold font-mono">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
