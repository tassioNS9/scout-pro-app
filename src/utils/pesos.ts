// lib/notas/pesos.ts
import { tipoEventoEnum } from "@/db/schema";

export const PESOS_EVENTOS: Record<
  (typeof tipoEventoEnum.enumValues)[number],
  number
> = {
  Assistencia: 1.2,
  Desarme: 0.4,
  FaltaCometida: -0.2,
  FaltaSofrida: 0.2,
  Gol: 1.0,
  GolContra: -2.0,
  cartaoAmarelo: -0.5,
  cartaoVermelho: -1.5,
  CometerPenalti: -1.0,
  SofrerPenalti: 0.8,
};

export const NOTA_BASE = 6.0;
export const NOTA_MINIMA = 0;
export const NOTA_MAXIMA = 10;
