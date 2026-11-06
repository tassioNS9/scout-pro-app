import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps, FC } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { BackButton } from "@/shared/components/BackButton";
import AddPlayerButton from "@/viewModels/Players/components/AddPlayerButton";
import SelectTeams from "@/viewModels/Players/components/SelectTeams";
import TablePlayers from "@/viewModels/Players/components/TablePlayers";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScoutGradient } from "@/shared/components/ScoutGradient";
import { scoutColors } from "@/styles/colors";

interface PlayersViewProps {
  loading: boolean;
  times: ComponentProps<typeof AddPlayerButton>["times"];
  jogadores: ComponentProps<typeof TablePlayers>["players"];
  timeIdSelecionado?: string;
  stats: { label: string; value: number | string }[];
  loadData: () => void;
  handleTeamChange: (teamId: string) => void;
}

export const PlayersView: FC<PlayersViewProps> = ({
  loading,
  times,
  jogadores,
  timeIdSelecionado,
  stats,
  loadData,
  handleTeamChange,
}) => {
  return (
    <ScoutGradient
      colors={[scoutColors.bg, scoutColors.bg_alt]}
      className="flex-1 px-2"
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View className="gap-5">
          <View className="flex-row items-center gap-3">
            <BackButton />
            <View className="flex-1 flex-row items-center gap-2">
              <View className="rounded-lg border border-scout-green-border bg-scout-green-dim p-2">
                <MaterialCommunityIcons
                  name="shield-half-full"
                  size={18}
                  color="#00e676"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold leading-tight text-scout-text">
                  Gerenciamento de jogadores
                </Text>
                <Text className="text-xs text-scout-muted">
                  Cadastre e organize seus jogadores
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2">
            <Button
              variant="outline"
              onPress={() => router.push("/partidas")}
              className="flex-1 border-scout-border bg-scout-card"
            >
              <MaterialCommunityIcons
                name="sword-cross"
                size={15}
                color="#e5e7eb"
              />
              <Text className="text-sm text-scout-muted">Partidas</Text>
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-scout-green-border bg-scout-green-dim"
            >
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={15}
                color="#00e676"
              />
              <Text className="text-sm text-scout-green">Registros</Text>
            </Button>
          </View>

          <AddPlayerButton times={times} />

          <View className="gap-3">
            <SelectTeams
              teams={times}
              timeIdSelecionado={timeIdSelecionado}
              onTeamChange={handleTeamChange}
            />
            <View className="flex-row overflow-hidden rounded-lg border border-scout-border">
              {stats.map((stat, index) => (
                <View
                  key={stat.label}
                  className={`flex-1 items-center bg-scout-card px-2 py-2 ${
                    index > 0 ? "border-l border-scout-border" : ""
                  }`}
                >
                  <Text className="text-base text-scout-green">
                    {stat.value}
                  </Text>
                  <Text className="text-[10px] text-scout-dim">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color="#00e676" />
              <Text className="mt-3 text-scout-muted">
                Carregando jogadores...
              </Text>
            </View>
          ) : (
            <TablePlayers
              players={jogadores}
              searchQuery=""
              onChanged={loadData}
            />
          )}
        </View>
      </SafeAreaView>
    </ScoutGradient>
  );
};
