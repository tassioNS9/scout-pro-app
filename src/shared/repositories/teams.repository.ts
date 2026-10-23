import { db } from "@/shared/db";
import { Time, timesTable } from "@/shared/db/schema";
import { eq, count, isNull, and } from "drizzle-orm";
import { supabase } from "@/lib/supabase-client";
import { v4 as uuidv4 } from "uuid";

const LIMITE_FREE_TIMES = 1; // Limite para usuários gratuitos

interface CreateTeamDTO {
  userId: string;
  isPremium: boolean;
  nome: string;
  categoria: "Sub-17" | "Sub-20" | "Profissional";
  cidade: string;
  estado: string;
  escudoUri?: string; // Caminho local da imagem no celular (ex: file:///...)
}

// Busca os times pertencentes ao usuário (convidado ou logado)
export async function getTimesByUser(userId: string) {
  return await db
    .select()
    .from(timesTable)
    .where(
      and(eq(timesTable.userId, userId), isNull(timesTable.deletedAt)), // Ignora registros deletados
    );
}

// Função para contar quantos times ativos o usuário tem
export async function getCountTimesByUser(userId: string): Promise<number> {
  const [resultado] = await db
    .select({ valor: count() })
    .from(timesTable)
    .where(and(eq(timesTable.userId, userId), isNull(timesTable.deletedAt)));
  return resultado?.valor ?? 0;
}

// Conta o total de times criados pelo usuário atual
export async function countTimesByUser(userId: string) {
  const [{ value }] = await db
    .select({ value: count() })
    .from(timesTable)
    .where(and(eq(timesTable.userId, userId), isNull(timesTable.deletedAt)));
  return value;
}

export async function deleteTeam(team: Time) {
  // 1. Banco primeiro (fonte da verdade)
  await db.delete(timesTable).where(eq(timesTable.id, team.id));

  if (team.escudoPath) {
    // 2. Storage depois: se falhar, só sobra um arquivo órfão
    await supabase.storage.from("escudos-times").remove([team.escudoPath]);
  }
}

export async function createTeam(dados: CreateTeamDTO) {
  try {
    if (!dados.isPremium) {
      const totalTimes = await getCountTimesByUser(dados.userId);
      if (totalTimes >= LIMITE_FREE_TIMES) {
        return {
          sucesso: false,
          erro: "LIMITE_EXCEDIDO",
          mensagem:
            "Usuários do plano gratuito podem cadastrar apenas 1 time. Faça upgrade para o Premium para cadastrar times ilimitados!",
        };
      }
    }

    const timeId = uuidv4();
    const currentDate = new Date().toISOString();

    // 1. Salva primeiro no SQLite local (Garante funcionamento Offline-First)
    await db.insert(timesTable).values({
      id: timeId,
      userId: dados.userId,
      nome: dados.nome,
      categoria: dados.categoria,
      cidade: dados.cidade,
      estado: dados.estado,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    let escudoUrlFinal: string | null = null;
    let escudoPathFinal: string | null = null;

    // 2. Se o usuário selecionou uma imagem e houver conexão, faz o upload para o Supabase Storage
    if (dados.escudoUri) {
      try {
        // Extrai a extensão do arquivo (ex: jpg, png)
        const fileExtension = dados.escudoUri.split(".").pop() || "jpg";
        const path = `times/${timeId}/escudo.${fileExtension}`;

        // No React Native, precisamos converter o URI local em FormData/Blob para enviar ao fetch do Supabase
        const response = await fetch(dados.escudoUri);
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

          escudoUrlFinal = publicUrlData.publicUrl;
          escudoPathFinal = path;

          // Atualiza o registro localmente com as informações do escudo
          await db
            .update(timesTable)
            .set({
              escudoUrl: escudoUrlFinal,
              escudoPath: escudoPathFinal,
              updatedAt: currentDate,
            })
            .where(eq(timesTable.id, timeId));
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

    return { sucesso: true, timeId };
  } catch (error: any) {
    console.error("Erro crítico ao criar time:", error);
    return { sucesso: false, erro: error.message };
  }
}
