import { v4 as uuidv4 } from "uuid";
import { db } from "@/shared/db";
import { eq } from "drizzle-orm";
import { InsertPartida, partidasTable, timesTable } from "@/shared/db/schema";

export async function createMatch(
  partida: Omit<InsertPartida, "id" | "createdAt" | "updatedAt">,
) {
  const now = new Date().toISOString();
  const id = uuidv4();

  await db.insert(partidasTable).values({
    ...partida,
    id,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

const partidaSelectShape = {
  id: partidasTable.id,
  data: partidasTable.data,
  idTime: partidasTable.idTime,
  nomeTime: timesTable.nome,
  nomeTimeAdversario: partidasTable.nomeTimeAdversario,
  placarTime: partidasTable.placarTime,
  placarTimeAdversario: partidasTable.placarTimeAdversario,
  status: partidasTable.status,
  resultado: partidasTable.resultado,
  campeonato: partidasTable.campeonato,
  categoria: partidasTable.categoria,
} as const;

export async function getAllMatches() {
  const matches = await db
    .select(partidaSelectShape)
    .from(partidasTable)
    .innerJoin(timesTable, eq(partidasTable.idTime, timesTable.id))
    .where(eq(timesTable.userId, "local-guest-user"));
  return matches;
}

export async function deleteMatch(matchId: string) {
  await db.delete(partidasTable).where(eq(partidasTable.id, matchId));
}
