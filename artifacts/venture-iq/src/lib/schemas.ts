import { z } from "zod";
import { BusinessInputBusinessType, BusinessInputCompetitionLevel, BusinessInputTargetMarketSize } from "@workspace/api-client-react";

export const predictionFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum([
    BusinessInputBusinessType.Technology,
    BusinessInputBusinessType['E-commerce'],
    BusinessInputBusinessType.Healthcare,
    BusinessInputBusinessType.Education,
    BusinessInputBusinessType.Finance,
    BusinessInputBusinessType['Food_&_Beverage'],
    BusinessInputBusinessType.Other
  ]),
  initialInvestment: z.coerce.number().min(0, "Must be greater than or equal to 0"),
  teamSize: z.coerce.number().min(1, "Must be at least 1"),
  founderExperience: z.coerce.number().min(0, "Must be greater than or equal to 0"),
  marketingBudget: z.coerce.number().min(0, "Must be greater than or equal to 0"),
  competitionLevel: z.enum([
    BusinessInputCompetitionLevel.Low,
    BusinessInputCompetitionLevel.Medium,
    BusinessInputCompetitionLevel.High
  ]),
  targetMarketSize: z.enum([
    BusinessInputTargetMarketSize.Small,
    BusinessInputTargetMarketSize.Medium,
    BusinessInputTargetMarketSize.Large
  ])
});

export type PredictionFormValues = z.infer<typeof predictionFormSchema>;
