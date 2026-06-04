import { z } from "zod";

export const reservationSchema = z.object({
  resourceId: z.string().min(1, "Recurso é obrigatório"),
  clientName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  clientEmail: z.string().email("E-mail inválido"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato deve ser HH:mm"),
  notes: z.string().max(500, "Observações: máximo 500 caracteres").optional(),
});

export type ReservationSchema = z.infer<typeof reservationSchema>;
