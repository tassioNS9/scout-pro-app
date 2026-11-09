import { useCallback, useEffect, useState } from "react";
import { Toast } from "toastify-react-native";

import { Time } from "@/shared/db/schema";
import {
  deleteMatch,
  getAllMatches,
} from "@/shared/repositories/matches.repository";
import { getTimesByUser } from "@/shared/repositories/teams.repository";
import { Alert } from "react-native";

const USER_ID = "local-guest-user";

export type Partida = Awaited<ReturnType<typeof getAllMatches>>[number];

export const useMatchsViewModel = () => {
  const [matchs, setMatchs] = useState<Partida[]>([]);
  const [times, setTimes] = useState<Time[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatchs = useCallback(async () => {
    try {
      setLoading(true);
      const [loadedMatchs, loadedTimes] = await Promise.all([
        getAllMatches(),
        getTimesByUser(USER_ID),
      ]);
      console.log("Loaded Matchs:", loadedMatchs);

      setMatchs(loadedMatchs);
      setTimes(loadedTimes);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
      Toast.error("Não foi possível carregar as partidas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatchs();
  }, [loadMatchs]);

  async function handleDeleteMatch(matchId: string) {
    try {
      Alert.alert(
        "Excluir Partida",
        "Tem certeza que deseja excluir esta partida?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              await deleteMatch(matchId);
              loadMatchs();
              Toast.success("Partida excluída com sucesso");
            },
          },
        ],
      );
    } catch (error) {
      console.error("Erro ao excluir partida:", error);
      Toast.error("Não foi possível excluir a partida.");
    }
  }

  return {
    matchs,
    times,
    loading,
    handleDeleteMatch,
  };
};
