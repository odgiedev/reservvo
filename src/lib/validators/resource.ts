import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z.string().optional(),
  slotDurationMin: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .int("Duração deve ser um número inteiro"),
});

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato deve ser HH:mm"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato deve ser HH:mm"),
});

export const availabilitySchema = z.array(availabilityRuleSchema);

export type ResourceSchema = z.infer<typeof resourceSchema>;
export type AvailabilityRuleSchema = z.infer<typeof availabilityRuleSchema>;
