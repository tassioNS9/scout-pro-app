import { useRouter } from "expo-router";
import { ChevronLeft, Shield } from "lucide-react-native";
import { ComponentProps } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ScoutGradient } from "@/shared/components/ScoutGradient";
import AddTimeButton from "@/viewModels/Teams/components/AddTeamButton";
import FilterComponent from "@/viewModels/Teams/components/Filter";
import { scoutColors } from "@/styles/colors";
import { Loading } from "@/shared/components/Loading";
import { ItemTeamCard } from "./components/ItemTeamCard";
import { EmptyList } from "./components/EmptyList";

type TeamsViewProps = {
  teams: ComponentProps<typeof ItemTeamCard>["team"][];
  filteredTeams: ComponentProps<typeof ItemTeamCard>["team"][];
  loading: boolean;
  refreshing: boolean;
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  refreshTeams: () => void;
};

export function TeamsView({
  teams,
  filteredTeams,
  loading,
  refreshing,
  search,
  setSearch,
  category,
  setCategory,
  refreshTeams,
}: TeamsViewProps) {
  const router = useRouter();

  const header = (
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
        totalTimes={teams.length}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />
    </View>
  );

  return (
    <ScoutGradient
      colors={[scoutColors.bg, scoutColors.bg_alt]}
      className="flex-1"
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={filteredTeams}
            keyExtractor={(time) => time.id}
            contentContainerClassName="p-4 pb-10"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={header}
            ListEmptyComponent={<EmptyList />}
            ItemSeparatorComponent={() => <View className="h-4" />}
            refreshing={refreshing}
            onRefresh={refreshTeams}
            renderItem={({ item }) => <ItemTeamCard team={item} />}
          />
        )}
      </SafeAreaView>
    </ScoutGradient>
  );
}
