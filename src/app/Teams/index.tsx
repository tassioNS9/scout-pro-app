import { useRouter } from "expo-router";
import { ChevronLeft, Shield } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ScoutGradient } from "@/shared/components/ScoutGradient";
import AddTimeButton from "@/viewModels/Teams/components/AddTimeButton";
import FilterComponent from "@/viewModels/Teams/components/Filter";
import ListTimes from "@/viewModels/Teams/components/ListTimes";
// import { listTimes } from "@/services/times";
import { scoutColors } from "@/styles/colors";
import { EmptyList } from "@/viewModels/Teams/components/EmptyList";
import { useTeams } from "@/shared/hooks/useTeams";
import { Loading } from "@/shared/components/Loading";

export default function TimesScreen() {
  const router = useRouter();
  const { teams, loading } = useTeams();
  console.log("teams", teams);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return teams.filter((t) => {
      const matchSearch =
        t.nome.toLowerCase().includes(term) ||
        !!t.cidade?.toLowerCase().includes(term);
      const matchCat = category === "Todas" || t.categoria === category;
      return matchSearch && matchCat;
    });
  }, [teams, search, category]);

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
          <ListTimes
            times={filtered}
            refreshing={refreshing}
            ListHeaderComponent={header}
            ListEmptyComponent={<EmptyList />}
          />
        )}
      </SafeAreaView>
    </ScoutGradient>
  );
}
