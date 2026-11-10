import { db } from "@/shared/db";
import {
  estatisticasTable,
  type InsertJogador,
  jogadoresTable,
  eventosTable,
  partidasTable,
} from "../db/schema";
import { eq, sql, count } from "drizzle-orm";
import { supabase } from "@/lib/supabase-client";
import { v4 as uuidv4 } from "uuid";

const LIMITE_FREE_PLAYERS = 23; // Limite para usuários gratuitos

interface CreatePlayerDTO {
  idTime: string;
  nome: string;
  numero: number;
  posicao: "Goleiro" | "Zagueiro" | "Lateral" | "Volante" | "Meia" | "Atacante";
  idade: number;
  fotoUri?: string; // Caminho local da imagem no celular (ex: file:///...)
}

export async function createPlayer(dados: CreatePlayerDTO) {
  try {
    const playerId = uuidv4();
    const currentDate = new Date().toISOString();

    // 1. Salva primeiro no SQLite local (Garante funcionamento Offline-First)
    await db.insert(jogadoresTable).values({
      id: playerId,
      idTime: dados.idTime,
      numero: dados.numero,
      nome: dados.nome,
      idade: dados.idade,
      posicao: dados.posicao,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    let fotoUrlFinal: string | null = null;
    let fotoPathFinal: string | null = null;

    // 2. Se o usuário selecionou uma imagem e houver conexão, faz o upload para o Supabase Storage
    if (dados.fotoUri) {
      try {
        // Extrai a extensão do arquivo (ex: jpg, png)
        const fileExtension = dados.fotoUri.split(".").pop() || "jpg";
        const path = `jogadores/${playerId}/foto.${fileExtension}`;

        // No React Native, precisamos converter o URI local em FormData/Blob para enviar ao fetch do Supabase
        const response = await fetch(dados.fotoUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from("escudos-times")
          .upload(path, blob, {
            upsert: true,
            contentType: `image/${fileExtension}`,
          });

        if (!uploadError) {
          // Pega a URL pública gerada pelo Storage
          const { data: publicUrlData } = supabase.storage
            .from("escudos-times")
            .getPublicUrl(path);

          fotoUrlFinal = publicUrlData.publicUrl;
          fotoPathFinal = path;

          // Atualiza o registro localmente com as informações do escudo
          await db
            .update(jogadoresTable)
            .set({
              fotoUrl: fotoUrlFinal,
              fotoPath: fotoPathFinal,
              updatedAt: currentDate,
            })
            .where(eq(jogadoresTable.id, playerId));
        } else {
          console.warn(
            "Aviso: Time criado, mas falha no upload do escudo:",
            uploadError.message,
          );
        }
      } catch (storageError) {
        console.warn(
          "Aviso: Erro de rede ao tentar enviar o escudo:",
          storageError,
        );
      }
    }

    return { sucesso: true, playerId };
  } catch (error: any) {
    console.error("Erro crítico ao criar time:", error);
    return { sucesso: false, erro: error.message };
  }
}

export const deletePlayer = async (id: string) => {
  await db.delete(jogadoresTable).where(eq(jogadoresTable.id, id));
};

type UpdateJogadorInput = {
  id: string;
  nome?: InsertJogador["nome"];
  numero?: InsertJogador["numero"];
  posicao?: InsertJogador["posicao"];
  idade?: InsertJogador["idade"];
};

export const updatePlayer = async (data: UpdateJogadorInput) => {
  await db
    .update(jogadoresTable)
    .set({ ...data, updatedAt: new Date().toDateString() })
    .where(eq(jogadoresTable.id, data?.id))
    .returning();
};

export async function getJogadoresByTime(idTime: string) {
  return await db.query.jogadoresTable.findMany({
    where: eq(jogadoresTable.idTime, idTime),
    orderBy: jogadoresTable.nome,
  });
}

function contadoresPorTipoEvento() {
  return {
    gols: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Gol')`.mapWith(
      Number,
    ),
    golsContra:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'GolContra')`.mapWith(
        Number,
      ),
    assistencias:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Assistencia')`.mapWith(
        Number,
      ),
    desarmes:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Desarme')`.mapWith(
        Number,
      ),
    faltasCometidas:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'FaltaCometida')`.mapWith(
        Number,
      ),
    faltasSofridas:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'FaltaSofrida')`.mapWith(
        Number,
      ),
    cartoesAmarelos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'cartaoAmarelo')`.mapWith(
        Number,
      ),
    cartoesVermelhos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'cartaoVermelho')`.mapWith(
        Number,
      ),
    penaltisCometidos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'CometerPenalti')`.mapWith(
        Number,
      ),
    penaltisSofridos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'SofrerPenalti')`.mapWith(
        Number,
      ),
  };
}

export async function getPlayersByTime(idTime: string) {
  return await db.query.jogadoresTable.findMany({
    where: eq(jogadoresTable.idTime, idTime),
    orderBy: jogadoresTable.nome,
  });
}

export async function getHistoricoTotalJogador(idJogador: string) {
  // 1. Total de eventos do jogador somando TODAS as partidas

  // Gera um `count(*) filter (where tipoEvento = 'X')` para cada tipo do enum
  const [perfil] = await db
    .select({
      nome: jogadoresTable.nome,
      idade: jogadoresTable.idade,
      numero: jogadoresTable.numero,
      posicao: jogadoresTable.posicao,
      fotoUrl: jogadoresTable.fotoUrl,
    })
    .from(jogadoresTable)
    .where(eq(jogadoresTable.id, idJogador))
    .limit(1);

  const [eventos] = await db
    .select(contadoresPorTipoEvento())
    .from(eventosTable)
    .where(eq(eventosTable.idJogador, idJogador));

  const [nota] = await db
    .select({ nota: estatisticasTable.nota })
    .from(estatisticasTable)
    .where(eq(estatisticasTable.idJogador, idJogador));

  const [{ totalPartidas }] = await db
    .select({ totalPartidas: count() })
    .from(estatisticasTable)
    .where(eq(estatisticasTable.idJogador, idJogador));

  return {
    perfil,
    eventos,
    totalPartidas,
    nota: nota?.nota ?? null,
  };
}

export async function getHistoricoPartidasPorJogador(idJogador: string) {
  const partidas = await db
    .select({
      idPartida: partidasTable.id,
      data: partidasTable.data,
      adversario: partidasTable.nomeTimeAdversario,
      placarTime: partidasTable.placarTime,
      placarAdversario: partidasTable.placarTimeAdversario,
      resultado: partidasTable.resultado,
      casaOuFora: partidasTable.casaOuFora,
      ...contadoresPorTipoEvento(),
    })
    .from(eventosTable)
    .innerJoin(partidasTable, eq(eventosTable.idPartida, partidasTable.id))
    .where(eq(eventosTable.idJogador, idJogador))
    .groupBy(
      partidasTable.id,
      partidasTable.data,
      partidasTable.nomeTimeAdversario,
      partidasTable.placarTime,
      partidasTable.placarTimeAdversario,
      partidasTable.resultado,
      partidasTable.casaOuFora,
    )
    .orderBy(partidasTable.data);

  return partidas;
  // [{ idPartida: 1, placarTime: 2, resultado: "Vitoria", gols: 1, desarmes: 1, cartoesAmarelos: 1, ... }, ...]
}
