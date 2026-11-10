// lib/notas/recalcularNota.ts
import { and, eq } from "drizzle-orm";

import { db } from "@/shared/db/index";
import { estatisticasTable, eventosTable } from "@/shared/db/schema";

import { calcularNotaAPartirDeEventos } from "./calcularNota";

export async function recalcularNotaJogadorNaPartida(
  idJogador: string,
  idPartida: string,
) {
  const eventos = await db
    .select()
    .from(eventosTable)
    .where(
      and(
        eq(eventosTable.idJogador, idJogador),
        eq(eventosTable.idPartida, idPartida),
      ),
    );

  const nota = calcularNotaAPartirDeEventos(eventos);

  // Upsert: cria a estatística se não existir, ou atualiza se já existir
  const agora = new Date().toISOString();

  await db
    .insert(estatisticasTable)
    .values({
      id: `${idJogador}-${idPartida}`,
      idJogador,
      idPartida,
      nota,
      createdAt: agora,
      updatedAt: agora,
    })
    .onConflictDoUpdate({
      target: [estatisticasTable.idJogador, estatisticasTable.idPartida],
      set: { nota, updatedAt: agora },
    });

  return nota;
}
