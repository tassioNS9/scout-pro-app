import type { ReactNode } from "react";
import { Text, View } from "react-native";

type AggregateStatCardProps = {
  label: string;
  value: ReactNode;
};

export default function AggregateStatCard({
  label,
  value,
}: AggregateStatCardProps) {
  return (
    <View className="rounded-xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
      <Text className="mb-1 text-xs text-zinc-400 sm:text-sm">{label}</Text>
      <Text className="text-xl font-bold text-white sm:text-2xl">{value}</Text>
    </View>
  );
}
