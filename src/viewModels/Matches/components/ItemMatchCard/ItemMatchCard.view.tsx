import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FC } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { scoutColors } from "@/styles/colors";
import { MatchItem } from "./useItemMatchCard.viewModel";

interface ItemMatchCardViewProps {
  match: MatchItem;
  formattedDate: string;
  status: {
    label: string;
    className: string;
    textClassName: string;
  };
}

export const ItemMatchCardView: FC<ItemMatchCardViewProps> = ({
  match,
  formattedDate,
  status,
}) => {
  return (
    <View className="gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900">
          Partida #{match.id}
        </Text>
        <View className={`rounded-full border px-2 py-1 ${status.className}`}>
          <Text className={`text-xs font-medium ${status.textClassName}`}>
            {status.label}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between rounded-lg bg-slate-50 p-3">
        <View className="flex-1 items-center">
          <Text className="text-sm font-semibold text-slate-900">
            {match.time}
          </Text>
          <Text className="text-2xl font-bold text-emerald-600">
            {match.placarTime ?? 0}
          </Text>
        </View>
        <Text className="px-2 text-lg font-bold text-slate-400">×</Text>
        <View className="flex-1 items-center">
          <Text className="text-sm font-semibold text-slate-900">
            {match.nomeTimeAdversario}
          </Text>
          <Text className="text-2xl font-bold text-blue-600">
            {match.placarTimeAdversario ?? 0}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={scoutColors.dim}
          />
          <Text className="flex-1 text-sm text-slate-600">{formattedDate}</Text>
        </View>
        {match.campeonato && (
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="trophy-outline"
              size={16}
              color={scoutColors.dim}
            />
            <Text className="flex-1 text-sm text-slate-600">
              {match.campeonato}
            </Text>
          </View>
        )}
        <Text className="text-sm text-slate-600">
          <Text className="font-semibold">Categoria:</Text> {match.categoria}
        </Text>
      </View>

      <Button
        size="sm"
        variant="outline"
        onPress={() => router.push(`/dashboard?match=${match.id}`)}
        accessibilityLabel={`Abrir dashboard da partida ${match.id}`}
      >
        <Text>Dashboard</Text>
      </Button>
    </View>
  );
};
