import { z } from "zod";

export const createTimeSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  categoria: z.enum(["Sub-17", "Sub-20", "Profissional"]),
  cidade: z
    .string()
    .min(2, "Cidade muito curta")
    .max(100, "Cidade muito longa"),
  estado: z.string().length(2, "Use a sigla do estado (ex: SP)"),

  escudoUri: z
    .string()
    .optional()
    .refine(
      (uri) => {
        if (!uri) return true;
        const lower = uri.toLowerCase();
        return (
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".png") ||
          lower.endsWith(".webp")
        );
      },
      {
        message: "Formato inválido. Use JPEG, PNG ou WEBP",
      },
    ),
});

export type CreateTimeFormValues = z.infer<typeof createTimeSchema>;
