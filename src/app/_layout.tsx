import { Stack } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations"; // Caminho onde o drizzle-kit gerou as migrações
import { ThemeProvider } from "expo-router/react-navigation";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/theme";
import { seedDatabase } from "@/shared/db/seed";
import { DATABASE_NAME, expoDb } from "@/shared/db"; // Importa o nome do banco de dados do arquivo db/index.ts
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
// @ts-expect-error Global CSS is loaded for its side effects by Expo.
import "@/styles/global.css";

export default function RootLayout() {
  return (
    <Suspense
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      }
    >
      {/* O SQLiteProvider abre ou cria o banco localmente no celular */}
      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        <InitializesDatabase />
      </SQLiteProvider>
    </Suspense>
  );
}

// Componente separado para rodar as migrações com acesso seguro ao contexto do SQLite
function InitializesDatabase() {
  const sqliteDb = useSQLiteContext();
  const db = drizzle(sqliteDb);

  useDrizzleStudio(expoDb);
  // O useMigrations aplica os arquivos SQL gerados pelo drizzle-kit na primeira execução
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "red", textAlign: "center" }}>
          Erro ao inicializar o banco de dados: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" />
        <Text style={{ marginTop: 10 }}>Preparando o banco de dados...</Text>
      </View>
    );
  }
  seedDatabase();

  // Quando as migrações terminarem com sucesso, o app principal é renderizado
  return (
    <ThemeProvider value={NAV_THEME.light}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
