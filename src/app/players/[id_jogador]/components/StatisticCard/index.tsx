import { Text, View } from "react-native";

const StatisticCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <View className="items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
      <Text className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
        {label}
      </Text>
      <Text className="text-sm font-semibold text-white md:text-base">
        {value}
      </Text>
    </View>
  );
};

export default StatisticCard;
