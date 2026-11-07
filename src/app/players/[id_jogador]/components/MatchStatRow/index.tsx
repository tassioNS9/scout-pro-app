import type { ReactNode } from "react";
import { Text, View } from "react-native";

type MatchStatRowProps = {
  label: string;
  value: ReactNode;
};

export default function MatchStatRow({ label, value }: MatchStatRowProps) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-zinc-400">{label}</Text>
      <Text className="font-semibold text-white">{value}</Text>
    </View>
  );
}
