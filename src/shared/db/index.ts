import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema"; // O arquivo do seu schema que adaptamos antes
import { openDatabaseSync } from "expo-sqlite";
export const DATABASE_NAME = "scout_futebol.db";
// Abre o mesmo nome de banco que você definiu no RootLayout
const expoDb = openDatabaseSync(DATABASE_NAME);

// Exporta a instância do Drizzle tipada com o seu schema
export const db = drizzle(expoDb, { schema });
