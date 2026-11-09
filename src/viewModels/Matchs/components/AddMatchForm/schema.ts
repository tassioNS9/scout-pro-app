import { z } from "zod";

export const createMatchSchema = z.object({
  idTime: z.string().min(1, "Selecione um time"),
  nomeTimeAdversario: z
    .string()
    .trim()
    .min(1, "O time adversário é obrigatório"),
  data: z.string().min(1, "A data é obrigatória"),
  campeonato: z.string().trim().min(1, "O campeonato é obrigatório"),
  categoria: z.enum(["Sub-17", "Sub-20", "Profissional"]),
});

export type CreateMatchFormData = z.infer<typeof createMatchSchema>;
