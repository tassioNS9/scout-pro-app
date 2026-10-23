import { ActivityIndicator, Text, View } from "react-native";
import { scoutColors } from "@/styles/colors";

export const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator color={scoutColors["green"]} size="large" />
      <Text className="mt-4 text-base text-scout-green">Carregando...</Text>
    </View>
  );
};
