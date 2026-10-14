import type { Config } from "drizzle-kit";

export default {
  schema: "./src/shared/db/schema.ts", // Caminho onde você salvou o seu schema
  out: "./drizzle", // Pasta onde as migrações serão geradas
  dialect: "sqlite",
  driver: "expo", // Fundamental para indicar que roda no Expo SQLite
} satisfies Config;
