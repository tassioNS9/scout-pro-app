import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield } from "lucide-react-native";
import AddTimeButton from "@/viewModels/Teams/components/AddTimeButton";
import FilterComponent from "@/viewModels/Teams/components/Filter";
import { scoutColors } from "@/styles/colors";
import { router } from "expo-router";
import { useState } from "react";
import { Time } from "@/shared/db/schema";

interface HeaderTeamProps {
  times: Time[];
}

export const HeaderTeam = ({ times }: HeaderTeamProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  return (
    <View>
      {/* Header */}
      <View className="mb-6 gap-4">
        <View className="flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <ChevronLeft size={22} color={scoutColors.text} />
          </Button>

          <View className="flex-1 flex-row items-center gap-2">
            <View className="shrink-0 rounded-lg border border-scout-green-border bg-scout-green-dim p-2">
              <Shield size={18} color={scoutColors.green} />
            </View>

            <View className="flex-1">
              <Text className="text-xl font-bold leading-tight text-scout-text">
                Gerenciamento de Times
              </Text>
              <Text className="text-xs text-scout-muted">
                Cadastre e organize seus times
              </Text>
            </View>
          </View>
        </View>

        <AddTimeButton />
      </View>

      {/* Filters */}
      <FilterComponent
        totalTimes={times.length}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />
    </View>
  );
};
