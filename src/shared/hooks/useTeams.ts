import { useState, useCallback, useEffect } from "react";
import { Time } from "@/shared/db/schema";
import {
  getTimesByUser,
  createTeam,
} from "@/shared/repositories/teams.repository";
// import { getUserId } from "@/services/storage"; // Função do MMKV que guarda o ID
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export function useTeams() {
  const [teams, setTeams] = useState<Time[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = "local-guest-user"; // Retorna "local-guest-user" ou o UUID do Supabase

  const getTeams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTimesByUser(userId);
      console.log("response", response);
      setTeams(response);
    } catch (error) {
      console.error("Erro ao carregar times:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getTeams();
  }, [userId]);

  //   const handleSubmit = async (
  //     nome: string,
  //     categoria: "Sub-17" | "Sub-20" | "Profissional",
  //     cidade: string,
  //     estado: string,
  //   ) => {
  //     const agora = new Date().toISOString();

  //     await createTeam({
  //       id: uuidv4(),
  //       userId: userId, // Associa ao usuário atual (free ou logado)
  //       nome,
  //       categoria,
  //       cidade,
  //       estado,
  //       createdAt: agora,
  //       updatedAt: agora,
  //     });

  //     await getTeams(); // Atualiza a lista localmente
  //   };

  return {
    teams,
    loading,
    reload: getTeams,
  };
}
