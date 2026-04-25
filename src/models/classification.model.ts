import { z } from "zod";

export const classificationApiRequestSchema = z.object({
  Age: z.number().int().min(10).max(80),
  SystolicBP: z.number().int(),
  DiastolicBP: z.number().int(),
  BS: z.number(),
  BodyTemp: z.number(),
  HeartRate: z.number().int(),
});
export type ClassificationApiRequest = z.infer<
  typeof classificationApiRequestSchema
>;

export const classificationApiResponseSchema = z.object({
  risk_level: z.enum(["low risk", "mid risk", "high risk"]),
  probabilities: z.object({
    "low risk": z.number(),
    "mid risk": z.number(),
    "high risk": z.number(),
  }),
});
export type ClassificationApiResponse = z.infer<
  typeof classificationApiResponseSchema
>;

export const classificationResponseSchema = z.object({
  visitId: z.string().nullable(),
  riskLevel: z.enum(["low risk", "mid risk", "high risk"]),
  explanation: z.string(),
  probabilities: z.object({
    "low risk": z.number(),
    "mid risk": z.number(),
    "high risk": z.number(),
  }),
  cached: z.boolean(),
  hasVisit: z.boolean(),
  evaluatedAt: z.string(),
});
export type ClassificationResponse = z.infer<
  typeof classificationResponseSchema
>;
