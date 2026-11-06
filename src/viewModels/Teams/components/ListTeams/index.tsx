import { FlatList, View } from "react-native";
import { Time } from "@/shared/db/schema";

import { ItemTeamCard } from "../ItemTeamCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderTeam } from "@/viewModels/Teams/components/HeaderTeam";
import { EmptyList } from "@/viewModels/Teams/components/EmptyList";

type Props = {
  teams: Time[];
  /** Chamado após deletar/editar para recarregar a lista */
  refreshing?: boolean;
  onRefresh?: () => void;
};

export const ListTeams = ({ teams, refreshing, onRefresh }: Props) => {
  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={teams}
        keyExtractor={(time) => time.id}
        contentContainerClassName="p-4 pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<HeaderTeam times={teams} />}
        ListEmptyComponent={<EmptyList />}
        ItemSeparatorComponent={() => <View className="h-4" />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => <ItemTeamCard team={item} />}
      />
    </SafeAreaView>
  );
};
