import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ActivityIndicator, Text, View } from "react-native";

import { Card, CardContent } from "@/components/ui/card";
import { BackButton } from "@/shared/components/BackButton";
import CreatePartidaButton from "./components/AddMatchButton";
import MatchsList from "./components/MatchsList";
import { useMatchsViewModel } from "./useMatchs.viewModel";
import { ScoutGradient } from "@/shared/components/ScoutGradient";
import { scoutColors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";

type MatchsViewProps = ReturnType<typeof useMatchsViewModel>;

export default function MatchsView({
  matchs,
  times,
  loading,
  handleDeleteMatch,
}: MatchsViewProps) {
  return (
    <ScoutGradient
      colors={[scoutColors.bg, scoutColors.bg_alt]}
      className="flex-1 px-2"
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View className="flex-1 p-4">
          <View className="mb-6 flex-row items-center justify-between gap-4 flex-wrap">
            <View className="flex-row items-center gap-3">
              <BackButton />

              <View className="flex-row items-center gap-2">
                <View className="shrink-0 rounded-lg border border-scout-green-border bg-scout-green-dim p-2">
                  <MaterialCommunityIcons
                    name="sword-cross"
                    size={18}
                    color="#00e676"
                  />
                </View>

                <View className="shrink">
                  <Text className="text-lg leading-tight text-scout-text">
                    Partidas
                  </Text>
                  <Text className="text-xs text-scout-muted">
                    Crie e acompanhe suas partidas
                  </Text>
                </View>
              </View>
            </View>

            <CreatePartidaButton times={times} />
          </View>

          {loading ? (
            <View className="items-center py-20">
              <ActivityIndicator color="#00e676" />
              <Text className="mt-3 text-scout-muted">
                Carregando partidas...
              </Text>
            </View>
          ) : matchs.length > 0 ? (
            <View className="flex-1">
              <MatchsList
                matchs={matchs}
                handleDeleteMatch={handleDeleteMatch}
              />
            </View>
          ) : (
            <Card className="py-12">
              <CardContent>
                <Text className="mb-4 text-center text-scout-muted">
                  Nenhuma partida cadastrada
                </Text>
                <CreatePartidaButton times={times} />
              </CardContent>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScoutGradient>
  );
}
