import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onPress={() => router.back()}
      className="border-scout-border bg-scout-card text-scout-muted flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2"
    >
      <AntDesign name="arrow-left" color="#ffff" size={16} />
      <Text className="text-sm">Voltar</Text>
    </Button>
  );
};
