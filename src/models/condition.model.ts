import { z } from "zod";

const conditionVisitSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  label: z.enum(["K1M", "K1A", "K2", "K3", "K4", "K5", "K6"]),
  keteranganLabel: z.string().nullable(),
  tanggalKunjungan: z.date(),
  trimester: z.enum(["TRIMESTER_1", "TRIMESTER_2", "TRIMESTER_3"]),
  usiaKehamilanMinggu: z.number(),
  faskes: z.string(),
  pemeriksa: z.string(),
  kesanKlinis: z.string().nullable(),
});

export const conditionsResponseSchema = z.object({
  pregnancyProgress: z.number().min(0).max(100),
  hpht: z.date().nullable(),
  hplTaksiran: z.date().nullable(),
  visits: z.array(conditionVisitSchema),
});

export type ConditionsResponse = z.infer<typeof conditionsResponseSchema>;