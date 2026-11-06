import { z } from "zod";

export const createPlayerSchema = z.object({
  idTime: z.string(),
  nome: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  numero: z
    .number()
    .min(1, "Número muito curto")
    .max(99, "Número muito longo")
    .refine((v) => Number(v) >= 1 && Number(v) <= 99, {
      message: "Número deve estar entre 1 e 99",
    }),
  idade: z
    .number()
    .int()
    .min(1, "Idade é obrigatória")
    .refine((v) => v >= 10 && v <= 50, {
      message: "Idade deve estar entre 10 e 50 anos",
    }),
  posicao: z.enum([
    "Goleiro",
    "Zagueiro",
    "Lateral",
    "Volante",
    "Meia",
    "Atacante",
  ]),
  fotoUri: z
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

export type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>;
