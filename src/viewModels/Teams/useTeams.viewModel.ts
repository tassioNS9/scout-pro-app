import { useCallback, useEffect, useMemo, useState } from "react";
import { getTimesByUser } from "@/shared/repositories/teams.repository";

import { Time } from "@/shared/db/schema";

export const useTeamsViewModel = () => {
  const [teams, setTeams] = useState<Time[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const filteredTeams = useMemo(() => {
    const term = search.toLowerCase();
    return teams.filter((t) => {
      const matchSearch =
        t.nome.toLowerCase().includes(term) ||
        !!t.cidade?.toLowerCase().includes(term);
      const matchCat = category === "Todas" || t.categoria === category;
      return matchSearch && matchCat;
    });
  }, [teams, search, category]);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTeams = await getTimesByUser("local-guest-user");
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTeams = useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedTeams = await getTimesByUser("local-guest-user");
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Erro ao atualizar times:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    filteredTeams,
    loading,
    refreshing,
    search,
    setSearch,
    category,
    setCategory,
    fetchTeams,
    refreshTeams,
  };
};
