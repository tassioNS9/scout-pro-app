import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";

import StatisticCard from "../StatisticCard";
import { SafeAreaView } from "react-native-safe-area-context";

interface PlayerInfo {
  perfil: {
    nome: string;
    idade: number;
    numero: number;
    posicao:
      | "Goleiro"
      | "Zagueiro"
      | "Lateral"
      | "Volante"
      | "Meia"
      | "Atacante";
  };
  eventos: {
    gols: number;
    golsContra: number;
    assistencias: number;
    desarmes: number;
    faltasCometidas: number;
    faltasSofridas: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    penaltisCometidos: number;
    penaltisSofridos: number;
  };
  totalPartidas: number;
  nota: number | null;
}

const GeralTab = ({
  geralHistoric,
  displayRating,
  hasMatches,
}: {
  geralHistoric: PlayerInfo;
  displayRating: string | number | null;
  hasMatches: boolean;
}) => {
  const renderStars = (rating: number) => {
    const normalizedRating = Math.min(Math.max((rating / 10) * 5, 0), 5);
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    const emptyStars = Math.max(5 - fullStars - (hasHalfStar ? 1 : 0), 0);
    const stars = [
      ...Array.from({ length: fullStars }, () => "star" as const),
      ...(hasHalfStar ? (["star-half-full"] as const) : []),
      ...Array.from({ length: emptyStars }, () => "star-outline" as const),
    ];

    return (
      <FlatList
        data={stars}
        horizontal
        scrollEnabled={false}
        keyExtractor={(_, index) => `star-${index}`}
        contentContainerClassName="items-center gap-0.5"
        renderItem={({ item }) => (
          <MaterialCommunityIcons
            name={item}
            size={12}
            color={item === "star-outline" ? "#a1a1aa" : "#facc15"}
          />
        )}
      />
    );
  };
  return (
    <View className="bg-transparent px-0">
      {/* Mobile Quick Stats */}
      <Text className="mb-2 text-xs font-semibold tracking-wider text-zinc-400">
        HISTÓRICO DE PARTIDAS
      </Text>
      <View className="mb-4 flex-row flex-wrap gap-3">
        <View className="w-[48%] flex-col items-center justify-center rounded-2xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
          <Text className="mb-2 text-xs text-zinc-400">Nota Média</Text>
          <Text className="text-primary text-5xl font-bold">
            {displayRating}
          </Text>
          {/* {hasMatches && <View className="mt-2">{renderStars(8.3)}</View>} */}
        </View>

        <View className="w-[48%] justify-center gap-2 rounded-2xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-zinc-400">Gols</Text>
            <Text className="font-semibold text-white">
              {geralHistoric.eventos.gols}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-zinc-400">Assistências</Text>
            <Text className="font-semibold text-white">
              {geralHistoric.eventos.assistencias}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-zinc-400">Total Partidas</Text>
            <Text className="font-semibold text-white">
              {geralHistoric.totalPartidas}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row  gap-3">
        <View className="w-[48%] flex-col items-center justify-between rounded-xl border border-scout-border bg-zinc-800 p-3 sm:flex-row sm:p-4">
          <Text className="mb-2 text-sm text-zinc-400 sm:mb-0 sm:text-base">
            Cartões
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-row items-center gap-1">
              <View className="h-4 w-3 rounded-sm bg-yellow-400 sm:h-5 sm:w-4" />
              <Text className="text-sm font-semibold text-white sm:text-base">
                {geralHistoric.eventos.cartoesAmarelos}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="bg-destructive h-4 w-3 rounded-sm sm:h-5 sm:w-4" />
              <Text className="text-sm font-semibold text-white sm:text-base">
                {geralHistoric.eventos.cartoesVermelhos}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GeralTab;
