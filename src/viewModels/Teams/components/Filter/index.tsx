import { Users } from "lucide-react-native";
import { FlatList, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { scoutColors } from "@/styles/colors";

type CategoryStyle = { container: string; text: string };

const DEFAULT_STYLE: CategoryStyle = {
  container: "border-scout-green-border bg-scout-green-dim",
  text: "text-scout-green",
};

const categoryStyles: Record<string, CategoryStyle> = {
  "Sub-17": DEFAULT_STYLE,
  "Sub-20": {
    container: "border-scout-sub20-border bg-scout-sub20-bg",
    text: "text-scout-sub20-text",
  },
  Profissional: {
    container: "border-scout-profissional-border bg-scout-profissional-bg",
    text: "text-scout-profissional-text",
  },
};

const INACTIVE_STYLE: CategoryStyle = {
  container: "border-scout-border bg-scout-card-header",
  text: "text-scout-muted",
};

const ALL_CATEGORIES = ["Todas", "Sub-17", "Sub-20", "Profissional"];

type Props = {
  totalTimes: number;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
};

function SummaryCell({
  label,
  value,
  bordered,
}: {
  label: string;
  value: number;
  bordered?: boolean;
}) {
  return (
    <View
      className={`items-center bg-scout-card px-4 py-2 ${
        bordered ? "border-l border-scout-border" : ""
      }`}
    >
      <Text className="text-base text-scout-green">{value}</Text>
      <Text className="text-xs text-scout-dim">{label}</Text>
    </View>
  );
}

const FilterComponent = ({
  totalTimes,
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: Props) => {
  return (
    <View className="mb-6 gap-3">
      {/* Search */}
      <View className="relative">
        <View
          pointerEvents="none"
          className="absolute left-3 top-0 bottom-0 z-10 justify-center"
        >
          <Users size={14} color={scoutColors.dim} />
        </View>
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Buscar por nome ou cidade..."
          placeholderTextColor={scoutColors.dim}
          autoCorrect={false}
          className="w-full rounded-lg border border-scout-border bg-scout-card py-2 pl-9 pr-4 text-sm text-scout-text focus:border-scout-green"
        />
      </View>

      {/* Category filter pills */}
      <FlatList
        horizontal
        data={ALL_CATEGORIES}
        keyExtractor={(item) => item}
        extraData={category}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View className="w-2" />}
        renderItem={({ item: cat }) => {
          const active = category === cat;
          const style = active
            ? (categoryStyles[cat] ?? DEFAULT_STYLE)
            : INACTIVE_STYLE;

          return (
            <Button
              variant="ghost"
              onPress={() => onCategoryChange(cat)}
              className={`h-auto rounded-full border px-3 py-1.5 ${style.container}`}
            >
              <Text className={`text-xs ${style.text}`}>{cat}</Text>
            </Button>
          );
        }}
      />

      {/* Summary */}
      <View className="flex-row self-start overflow-hidden rounded-lg border border-scout-border">
        <SummaryCell label="Times" value={totalTimes} />
        <SummaryCell label="Jogadores" value={totalTimes * 23} bordered />
      </View>
    </View>
  );
};

export default FilterComponent;
