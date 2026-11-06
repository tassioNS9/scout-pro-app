import { v4 as uuidv4 } from "uuid";
import { db } from "@/shared/db";
import { InsertPartida, partidasTable } from "@/shared/db/schema";

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
