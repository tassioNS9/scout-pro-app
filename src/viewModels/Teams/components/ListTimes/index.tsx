import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, FlatListProps, View } from "react-native";
import { Time } from "@/shared/db/schema";

import { ItemTeamCard } from "../ItemTeamCard";
import { SafeAreaView } from "react-native-safe-area-context";

// Ajuste o caminho conforme a sua estrutura. React Native não renderiza SVG
// com <Image>, use um PNG/JPG aqui (ou react-native-svg se preferir SVG).

type Props = {
  times: Time[];
  /** Chamado após deletar/editar para recarregar a lista */
  onChanged?: () => void;
  ListHeaderComponent?: FlatListProps<Time>["ListHeaderComponent"];
  ListEmptyComponent?: FlatListProps<Time>["ListEmptyComponent"];
  refreshing?: boolean;
  onRefresh?: () => void;
};

const ListTimes = ({
  times,
  onChanged,
  ListHeaderComponent,
  ListEmptyComponent,
  refreshing,
  onRefresh,
}: Props) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={times}
        keyExtractor={(time) => String(time.id)}
        extraData={deletingId}
        contentContainerClassName="p-4 pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={() => <View className="h-4" />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => <ItemTeamCard time={item} />}
      />
    </SafeAreaView>
  );
};

export default ListTimes;
