// lib/notas/calcularNota.ts
import { eventosTable } from "@/shared/db/schema";

import { NOTA_BASE, NOTA_MAXIMA, NOTA_MINIMA, PESOS_EVENTOS } from "./pesos";

type Evento = typeof eventosTable.$inferSelect;

export function calcularNotaAPartirDeEventos(eventos: Evento[]): number {
  const notaBruta = eventos.reduce(
    (nota, evento) => nota + PESOS_EVENTOS[evento.tipoEvento],
    NOTA_BASE,
  );

  // Clamp: nota nunca sai do intervalo [0, 10]
  const notaClampada = Math.min(NOTA_MAXIMA, Math.max(NOTA_MINIMA, notaBruta));

  // Arredonda pra 1 casa decimal, mas mantém como number
  return Math.round(notaClampada * 10) / 10;
}
