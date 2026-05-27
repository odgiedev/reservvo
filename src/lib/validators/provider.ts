import { z } from "zod";

export const providerSchema = z.object({
  businessName: z
    .string()
    .min(2, "Nome do negócio deve ter no mínimo 2 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter no mínimo 3 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s()+\-]+$/.test(val),
      "Telefone aceita apenas números, espaços, parênteses, hífens e +"
    )
    .refine(
      (val) => !val || (val.match(/\d/g)?.length ?? 0) >= 6,
      "Telefone deve ter no mínimo 6 dígitos"
    )
    .refine(
      (val) => !val || (val.match(/\d/g)?.length ?? 0) <= 20,
      "Telefone deve ter no máximo 20 dígitos"
    ),
});

export type ProviderSchema = z.infer<typeof providerSchema>;
