import { View, Text } from "react-native";

export const EmptyList = () => {
  return (
    <View className="items-center py-10">
      <Text className="text-sm text-scout-muted">Nenhum time registrado</Text>
    </View>
  );
};
