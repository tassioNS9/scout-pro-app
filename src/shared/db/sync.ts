import { db } from "./index";
import {
  timesTable,
  jogadoresTable,
  partidasTable,
  eventosTable,
} from "./schema";
import { supabase } from "@/lib/supabase-client"; // Seu cliente Supabase configurado
import { eq } from "drizzle-orm";

export async function sincronizarDadosComNuvem(userId: string) {
  try {
    console.log("Iniciando sincronização com o Supabase...");

    // ==========================================
    // 1. UPLOAD (Enviar dados locais para a Nuvem)
    // ==========================================

    // 1.1 Times Locais
    const timesLocais = await db
      .select()
      .from(timesTable)
      .where(eq(timesTable.userId, userId));
    if (timesLocais.length > 0) {
      const { error } = await supabase.from("times").upsert(timesLocais);
      if (error) throw new Error(`Erro ao subir times: ${error.message}`);
    }

    // 1.2 Jogadores Locais (Buscamos do banco local)
    const jogadoresLocais = await db.select().from(jogadoresTable);
    if (jogadoresLocais.length > 0) {
      const { error } = await supabase
        .from("jogadores")
        .upsert(jogadoresLocais);
      if (error) throw new Error(`Erro ao subir jogadores: ${error.message}`);
    }

    // 1.3 Partidas Locais
    const partidasLocais = await db.select().from(partidasTable);
    if (partidasLocais.length > 0) {
      const { error } = await supabase.from("partidas").upsert(partidasLocais);
      if (error) throw new Error(`Erro ao subir partidas: ${error.message}`);
    }

    // 1.4 Eventos Locais
    const eventosLocais = await db.select().from(eventosTable);
    if (eventosLocais.length > 0) {
      const { error } = await supabase.from("eventos").upsert(eventosLocais);
      if (error) throw new Error(`Erro ao subir eventos: ${error.message}`);
    }

    // ==========================================
    // 2. DOWNLOAD (Baixar dados da Nuvem para o SQLite)
    // ==========================================

    // 2.1 Baixar Times da Nuvem
    const { data: timesNuvem, error: errTimesNuvem } = await supabase
      .from("times")
      .select("*")
      .eq("userId", userId);

    if (errTimesNuvem) throw errTimesNuvem;

    if (timesNuvem) {
      for (const time of timesNuvem) {
        // Insere ou atualiza localmente usando upsert do Drizzle
        await db
          .insert(timesTable)
          .values(time)
          .onConflictDoUpdate({
            target: timesTable.id,
            set: {
              nome: time.nome,
              categoria: time.categoria,
              cidade: time.cidade,
              estado: time.estado,
              updatedAt: time.updatedAt,
              deletedAt: time.deletedAt,
            },
          });
      }
    }

    // 2.2 Baixar Jogadores da Nuvem
    // (Pegamos todos os jogadores cujos times pertencem ao usuário)
    const timeIds = timesNuvem?.map((t) => t.id) || [];
    if (timeIds.length > 0) {
      const { data: jogadoresNuvem } = await supabase
        .from("jogadores")
        .select("*")
        .in("idTime", timeIds);

      if (jogadoresNuvem) {
        for (const jogador of jogadoresNuvem) {
          await db
            .insert(jogadoresTable)
            .values(jogador)
            .onConflictDoUpdate({
              target: jogadoresTable.id,
              set: {
                nome: jogador.nome,
                numero: jogador.numero,
                posicao: jogador.posicao,
                idade: jogador.idade,
                updatedAt: jogador.updatedAt,
                deletedAt: jogador.deletedAt,
              },
            });
        }
      }

      // 2.3 Baixar Partidas da Nuvem
      const { data: partidasNuvem } = await supabase
        .from("partidas")
        .select("*")
        .in("idTime", timeIds);

      if (partidasNuvem) {
        for (const partida of partidasNuvem) {
          await db
            .insert(partidasTable)
            .values(partida)
            .onConflictDoUpdate({
              target: partidasTable.id,
              set: {
                placarTime: partida.placarTime,
                placarTimeAdversario: partida.placarTimeAdversario,
                status: partida.status,
                resultado: partida.resultado,
                updatedAt: partida.updatedAt,
                deletedAt: partida.deletedAt,
              },
            });
        }
      }
    }

    console.log("Sincronização concluída com sucesso!");
    return { success: true };
  } catch (error: any) {
    console.error("Falha na sincronização:", error.message);
    return { success: false, error: error.message };
  }
}
