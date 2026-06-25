import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { usePredictBusiness, BusinessInputBusinessType, BusinessInputCompetitionLevel, BusinessInputTargetMarketSize } from "@workspace/api-client-react";
import { predictionFormSchema, PredictionFormValues } from "@/lib/schemas";
import { usePrediction } from "@/context/PredictionContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const CARD = { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" };
const MUTED = "hsl(0 0% 45%)";

const factors = [
  { label: "Initial Investment", desc: "Capital vs. sector threshold" },
  { label: "Team Size", desc: "Headcount & org depth" },
  { label: "Founder Experience", desc: "Years of domain expertise" },
  { label: "Marketing Budget", desc: "Spend as % of total capital" },
  { label: "Market Size", desc: "Total addressable market" },
  { label: "Competition Level", desc: "Market saturation index" },
];

export default function Analysis() {
  const [, setLocation] = useLocation();
  const { setResult } = usePrediction();
  const mutation = usePredictBusiness();

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      businessName: "",
      initialInvestment: 50000,
      teamSize: 3,
      founderExperience: 5,
      marketingBudget: 5000,
    },
  });

  const onSubmit = (data: PredictionFormValues) => {
    mutation.mutate({ data }, {
      onSuccess: (res) => {
        setResult(res);
        setLocation("/predictions");
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
      {/* Form */}
      <div className="lg:col-span-2 rounded-lg overflow-hidden" style={CARD}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}>
          <p className="text-[13px] font-semibold text-foreground">Venture Parameters</p>
          <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>All fields are required for accurate scoring</p>
        </div>

        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="businessName" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Entity Name</FormLabel>
                    <FormControl>
                      <Input data-testid="input-business-name" placeholder="e.g. Acme Corp" className="h-9 text-sm bg-background/60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="businessType" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Sector</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-business-type" className="h-9 text-sm bg-background/60">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BusinessInputBusinessType).map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="initialInvestment" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Initial Investment (USD)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-investment" type="number" className="h-9 text-sm font-mono bg-background/60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="teamSize" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Team Size</FormLabel>
                    <FormControl>
                      <Input data-testid="input-team-size" type="number" className="h-9 text-sm font-mono bg-background/60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="founderExperience" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Founder Experience (yrs)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-experience" type="number" className="h-9 text-sm font-mono bg-background/60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="marketingBudget" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Marketing Budget (USD/mo)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-marketing" type="number" className="h-9 text-sm font-mono bg-background/60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="competitionLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Competition Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-competition" className="h-9 text-sm bg-background/60">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BusinessInputCompetitionLevel).map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="targetMarketSize" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>Target Market Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-market-size" className="h-9 text-sm bg-background/60">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BusinessInputTargetMarketSize).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  data-testid="button-run-analysis"
                  disabled={mutation.isPending}
                  className="w-full h-9 text-[13px] font-semibold"
                >
                  {mutation.isPending ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Running analysis...</>
                  ) : (
                    "Run AI Analysis"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="rounded-lg overflow-hidden" style={CARD}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid hsl(0 0% 12%)" }}>
            <p className="text-[12px] font-semibold text-foreground">Scoring Model</p>
          </div>
          <div className="px-4 py-3 space-y-3">
            {factors.map(({ label, desc }) => (
              <div key={label}>
                <p className="text-[12px] font-medium text-foreground leading-none">{label}</p>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: MUTED }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg px-4 py-3 text-[11px] leading-relaxed" style={{ ...CARD, color: MUTED }}>
          Results are indicative. Use alongside professional due diligence.
        </div>
      </div>
    </div>
  );
}
