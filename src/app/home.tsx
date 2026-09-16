import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-purple-base">Tela Home</Text>
      <TouchableOpacity>
        <Text>Registro</Text>
      </TouchableOpacity>
    </View>
  );
}
