import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { partidasTable } from "../../shared/db/schema";
import { useEffect } from "react";

export default function Partidas() {
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: { partidas: partidasTable } });

  async function fetchPartidas() {
    try {
      const partidas = await db.select().from(partidasTable).all();
      console.log(partidas);
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
    }
  }

  useEffect(() => {
    fetchPartidas();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View>
        <Text>Partidas</Text>
      </View>
    </SafeAreaView>
  );
}
