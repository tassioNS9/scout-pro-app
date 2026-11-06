import { useCallback, useEffect, useMemo, useState } from "react";

import { Jogador, Time } from "@/shared/db/schema";
import { getJogadoresByTime } from "@/shared/repositories/players.repository";
import { getTimesByUser } from "@/shared/repositories/teams.repository";

const USER_ID = "local-guest-user";

export const usePlayersViewModel = () => {
  const [loading, setLoading] = useState(true);
  const [times, setTimes] = useState<Time[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [timeIdSelecionado, setTimeIdSelecionado] = useState<string>();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const loadedTimes = await getTimesByUser(USER_ID);
      setTimes(loadedTimes);

      const selectedId = timeIdSelecionado ?? loadedTimes[0]?.id;
      setTimeIdSelecionado(selectedId);
      setJogadores(selectedId ? await getJogadoresByTime(selectedId) : []);
    } catch (error) {
      console.error("Erro ao carregar jogadores:", error);
    } finally {
      setLoading(false);
    }
  }, [timeIdSelecionado]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(
    () => [
      { label: "Jogadores", value: jogadores.length },
      { label: "Gols", value: 0 },
      { label: "Média", value: "—" },
    ],
    [jogadores.length],
  );

  const handleTeamChange = (teamId: string) => {
    setTimeIdSelecionado(teamId);
  };

  return {
    jogadores,
    loading,
    times,
    timeIdSelecionado,
    stats,
    loadData,
    handleTeamChange,
  };
};
