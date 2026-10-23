import { View, Text, Image } from "react-native";
import { ChevronRight, MapPin, Tag, Trash2, Users } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { scoutColors } from "@/styles/colors";
import { Time } from "@/shared/db/schema";
import EditarTimeButton from "../EditarTimeButton";
import { router } from "expo-router";
import { Alert } from "react-native";
import { deleteTeam } from "@/shared/repositories/teams.repository";
import { Toast } from "toastify-react-native";

const FALLBACK_ESCUDO = require("@/assets/vitoria.png");

const categoryClasses: Record<string, string> = {
  "Sub-17": "border-scout-sub17-border bg-scout-sub17-bg",
  "Sub-20": "border-scout-green-border bg-scout-green-dim",
  Profissional: "border-scout-profissional-border bg-scout-profissional-bg",
};

const categoryTextClasses: Record<string, string> = {
  "Sub-17": "text-scout-sub17-text",
  "Sub-20": "text-scout-green",
  Profissional: "text-scout-profissional-text",
};

const DEFAULT_CATEGORY = "border-scout-border bg-scout-card-header";
const DEFAULT_CATEGORY_TEXT = "text-scout-text";

type ItemTeamCardProps = {
  time: Time;
};

export const ItemTeamCard = ({ time }: ItemTeamCardProps) => {
  const handleDelete = (team: Time) => {
    Alert.alert("Deletar time", "Tem certeza que deseja deletar este time?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            deleteTeam(team);
            Toast.success("Time deletado com sucesso");
          } catch (error) {
            Toast.error("Falha ao deletar time");
          }
        },
      },
    ]);
  };
  return (
    <View className="gap-4 rounded-xl border border-scout-border bg-scout-card p-6 ">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        <Image
          source={time.escudoUrl ? { uri: time.escudoUrl } : FALLBACK_ESCUDO}
          accessibilityLabel="Escudo do time"
          className="h-16 w-16 rounded-full"
        />
        <Text className="flex-1 text-lg font-bold leading-tight text-scout-text">
          {time.nome}
        </Text>
      </View>

      {/* Info */}
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Tag size={12} color={scoutColors.dim} />
          <Text className="text-xs text-scout-dim">Categoria:</Text>
          <View
            className={`rounded-full border px-2 py-0.5 ${
              categoryClasses[time.categoria] ?? DEFAULT_CATEGORY
            }`}
          >
            <Text
              className={`text-xs ${
                categoryTextClasses[time.categoria] ?? DEFAULT_CATEGORY_TEXT
              }`}
            >
              {time.categoria}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <MapPin size={12} color={scoutColors.dim} />
          <Text className="text-xs text-scout-dim">Cidade:</Text>
          <Text className="text-sm text-scout-green">
            {time.cidade}
            {time.estado ? `, ${time.estado}` : ""}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Users size={12} color={scoutColors.dim} />
          <Text className="text-xs text-scout-dim">Jogadores:</Text>
          <Text className="text-sm text-scout-text">23</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="gap-2 border-t border-scout-border pt-3">
        {/* Ver jogadores — primary action */}
        <Button
          onPress={() => router.push(`/times/${time.id}`)}
          className="w-full flex-row items-center justify-center gap-1.5 rounded-lg border border-scout-green-border bg-scout-green-dim px-3 py-2.5"
        >
          <Users size={13} color={scoutColors.green} />
          <Text className="text-xs text-scout-green">Ver Jogadores</Text>
          <View className="ml-auto">
            <ChevronRight size={12} color={scoutColors.green} />
          </View>
        </Button>

        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <EditarTimeButton time={time} />
          </View>
          <Button
            variant="destructive"
            size="sm"
            onPress={() => handleDelete(time)}
          >
            <Trash2 size={16} color="#ffffff" />
          </Button>
        </View>
      </View>
    </View>
  );
};
