import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

import { Button } from "@/components/ui/button";
import type { Partida } from "../../useMatchs.viewModel";

interface PartidasProps {
  matchs: Partida[];
  handleDeleteMatch: (matchId: string) => void;
}

type Status = "planejada" | "em_andamento" | "finalizada";

const statusClasses: Record<Status, string> = {
  planejada:
    "border-scout-sub17-border bg-scout-sub17-bg text-scout-sub17-text",
  em_andamento: "border-scout-green-border bg-scout-green-dim text-scout-green",
  finalizada: "border-scout-border bg-scout-card-header text-scout-muted",
};

const filterLabels: ("Todas" | Status)[] = [
  "Todas",
  "planejada",
  "em_andamento",
  "finalizada",
];

const MatchsList = ({ matchs, handleDeleteMatch }: PartidasProps) => {
  const [matches, setMatches] = useState<Partida[]>(matchs);
  const [filter, setFilter] = useState<"Todas" | Status>("Todas");

  const filtered =
    filter === "Todas" ? matches : matches.filter((m) => m.status === filter);
  const sortedMatches = [...filtered].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );
  const stats = [
    { label: "Total", value: matches.length },
    {
      label: "Planejadas",
      value: matches.filter((m) => m.status === "planejada").length,
    },
    {
      label: "Finalizadas",
      value: matches.filter((m) => m.status === "finalizada").length,
    },
  ];

  return (
    <View>
      {/* Filter tabs + summary */}
      <View className="mb-6 gap-3">
        {/* Filter pills */}
        <FlatList
          data={filterLabels}
          horizontal
          keyExtractor={(item) => item}
          contentContainerClassName="gap-2"
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: f }) => {
            const active = filter === f;
            const statusClass =
              f !== "Todas"
                ? statusClasses[f as Status]
                : "border-scout-border bg-scout-card-header text-scout-muted";

            return (
              <Button
                onPress={() => setFilter(f)}
                className={`rounded-full border px-3 py-1.5 ${
                  active
                    ? statusClass
                    : "border-scout-border bg-scout-card-header text-scout-muted"
                }`}
              >
                <Text className="text-sm text-scout-muted">
                  {f}
                  {f !== "Todas" &&
                    ` (${matches.filter((m) => m.status === f).length})`}
                </Text>
              </Button>
            );
          }}
        />

        {/* Counts */}
        <FlatList
          data={stats}
          horizontal
          keyExtractor={(item) => item.label}
          scrollEnabled={false}
          className="self-start overflow-hidden rounded-lg border border-scout-border"
          renderItem={({ item: stat, index }) => (
            <View
              className={`bg-scout-card px-4 py-2 ${index > 0 ? "border-l border-scout-border" : ""}`}
            >
              <Text className="text-center text-base text-scout-green">
                {stat.value}
              </Text>
              <Text className="text-center text-xs text-scout-dim">
                {stat.label}
              </Text>
            </View>
          )}
        />
      </View>
      {/* Cards grid */}
      <FlatList
        data={sortedMatches}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="items-center py-20">
            <MaterialCommunityIcons
              name="sword-cross"
              size={44}
              color="#4b5780"
            />
            <Text className="mt-3 text-scout-muted">
              Nenhuma partida encontrada
            </Text>
          </View>
        }
        renderItem={({ item: match }) => {
          const statusClass = statusClasses[match.status ?? "planejada"];
          return (
            <View
              key={match.id}
              className="gap-4 rounded-xl border border-scout-border bg-scout-card p-4"
            >
              {/* Card header */}
              <View className="flex-row items-center justify-between">
                <Text
                  className={`rounded-full border px-2 py-0.5 text-xs ${statusClass}`}
                >
                  {match.status}
                </Text>
              </View>

              {/* Scoreboard */}
              <View className="flex-row items-center justify-between gap-2 rounded-xl border border-scout-border bg-scout-card-header p-4">
                <View className="flex-1 items-center">
                  <Text className="mb-2 text-center text-xs leading-tight text-scout-muted">
                    {match.nomeTime}
                  </Text>
                  <Text className="text-3xl leading-none text-scout-green">
                    {match.placarTime}
                  </Text>
                </View>
                <Text className="text-lg text-scout-dim">×</Text>
                <View className="flex-1 items-center">
                  <Text className="mb-2 text-center text-xs leading-tight text-scout-muted">
                    {match.nomeTimeAdversario}
                  </Text>
                  <Text className="text-3xl leading-none text-scout-green">
                    {match.placarTimeAdversario}
                  </Text>
                </View>
              </View>

              {/* Match info */}
              <View className="gap-1.5">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="calendar"
                    size={13}
                    color="#4b5780"
                  />
                  <Text className="text-xs text-scout-muted">
                    {new Date(match.data).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="trophy-outline"
                    size={13}
                    color="#4b5780"
                  />
                  <Text className="text-xs text-scout-muted">
                    {match.campeonato}
                  </Text>
                </View>
                <View className="flex-row gap-4">
                  <Text className="text-xs text-scout-muted">
                    <Text className="text-scout-dim">Categoria: </Text>
                    {match.categoria}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row gap-2 border-t border-scout-border pt-1">
                <Button className="flex-1 rounded-lg border border-scout-green-border bg-scout-green-dim px-3 py-2">
                  <MaterialCommunityIcons
                    name="view-dashboard-outline"
                    size={13}
                    color="#00e676"
                  />
                  <Text className="text-xs text-scout-green">Dashboard</Text>
                </Button>
                <Button className="rounded-lg border border-scout-sub17-border bg-scout-sub17-bg px-3 py-2">
                  <Text className="text-xs text-scout-sub17-text">Editar</Text>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={13}
                    color="#60a5fa"
                  />
                </Button>
                <Button
                  onPress={() => {
                    handleDeleteMatch(match.id);
                    Toast.success("Partida excluída com sucesso");
                  }}
                  className="rounded-lg border border-scout-profissional-border bg-scout-profissional-bg px-3 py-2"
                >
                  <Text className="text-xs text-scout-profissional-text">
                    Excluir
                  </Text>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={13}
                    color="#f87171"
                  />
                </Button>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MatchsList;
