import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm/relations";

// Times table (Usando ID em texto/UUID para evitar conflitos no Sync)
export const timesTable = sqliteTable("times", {
  id: text("id").primaryKey(), // UUID gerado no client-side
  userId: text("userId").notNull(), // ID do usuário logado na nuvem (ou UUID local se grátis)
  nome: text("nome").notNull(),
  categoria: text("categoria", {
    enum: ["Sub-17", "Sub-20", "Profissional"],
  }).notNull(),
  cidade: text("cidade").notNull(),
  estado: text("estado").notNull(),
  escudoUrl: text("escudoUrl"),
  escudoPath: text("escudoPath"),
  updatedAt: text("updatedAt").notNull(), // Crucial para saber qual dado é mais recente no sync
  createdAt: text("createdAt").notNull(),
  deletedAt: text("deletedAt"), // Soft delete: se preenchido, o registro foi apagado e deve ser deletado na nuvem
});

export type Time = typeof timesTable.$inferSelect;
export type InsertTime = typeof timesTable.$inferInsert;

// Jogadores table
export const jogadoresTable = sqliteTable("jogadores", {
  id: text("id").primaryKey(), // UUID
  nome: text("nome").notNull(),
  numero: integer("numero").notNull(),
  posicao: text("posicao", {
    enum: ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Atacante"],
  }).notNull(),
  idade: integer("idade").notNull(),
  idTime: text("idTime")
    .notNull()
    .references(() => timesTable.id, { onDelete: "cascade" }),
  fotoUrl: text("fotoUrl"),
  fotoPath: text("fotoPath"),
  updatedAt: text("updatedAt").notNull(),
  createdAt: text("createdAt").notNull(),
  deletedAt: text("deletedAt"),
});

export type Jogador = typeof jogadoresTable.$inferSelect;
export type InsertJogador = typeof jogadoresTable.$inferInsert;

// Partidas table
export const partidasTable = sqliteTable("partidas", {
  id: text("id").primaryKey(), // UUID
  idTime: text("idTime")
    .notNull()
    .references(() => timesTable.id, { onDelete: "cascade" }),
  nomeTimeAdversario: text("nomeTimeAdversario").notNull(),
  data: text("data").notNull(),
  campeonato: text("campeonato"),
  categoria: text("categoria", {
    enum: ["Sub-17", "Sub-20", "Profissional"],
  }).notNull(),
  casaOuFora: text("casaOuFora", { enum: ["casa", "fora"] })
    .default("casa")
    .notNull(),
  placarTime: integer("placarTime").default(0).notNull(),
  placarTimeAdversario: integer("placarTimeAdversario").default(0).notNull(),
  status: text("status", {
    enum: ["planejada", "em_andamento", "finalizada"],
  }).default("planejada"),
  resultado: text("resultado", {
    enum: ["Vitoria", "Derrota", "Empate", "Sem_Resultado"],
  }).default("Sem_Resultado"),
  updatedAt: text("updatedAt").notNull(),
  createdAt: text("createdAt").notNull(),
  deletedAt: text("deletedAt"),
});

export type Partida = typeof partidasTable.$inferSelect;
export type InsertPartida = typeof partidasTable.$inferInsert;

// Eventos table
export const eventosTable = sqliteTable("eventos", {
  id: text("id").primaryKey(), // UUID
  idPartida: text("idPartida")
    .notNull()
    .references(() => partidasTable.id, { onDelete: "cascade" }),
  idJogador: text("idJogador")
    .notNull()
    .references(() => jogadoresTable.id, { onDelete: "cascade" }),
  tipoEvento: text("tipoEvento", {
    enum: [
      "Assistencia",
      "Desarme",
      "FaltaCometida",
      "FaltaSofrida",
      "Gol",
      "GolContra",
      "cartaoAmarelo",
      "cartaoVermelho",
      "CometerPenalti",
      "SofrerPenalti",
    ],
  }).notNull(),
  minuto: integer("minuto").notNull(),
  tempo: text("tempo", { enum: ["1T", "2T"] }).notNull(),
  detalhes: text("detalhes"),
  createdAt: text("createdAt").notNull(),
  deletedAt: text("deletedAt"),
});

export type Evento = typeof eventosTable.$inferSelect;
export type InsertEvento = typeof eventosTable.$inferInsert;

// Estatisticas table
export const estatisticasTable = sqliteTable(
  "estatisticas",
  {
    id: text("id").primaryKey(), // UUID
    idJogador: text("idJogador")
      .notNull()
      .references(() => jogadoresTable.id, { onDelete: "cascade" }),
    idPartida: text("idPartida")
      .notNull()
      .references(() => partidasTable.id, { onDelete: "cascade" }),
    nota: real("nota").default(6.0).notNull(),
    updatedAt: text("updatedAt").notNull(),
    createdAt: text("createdAt").notNull(),
    deletedAt: text("deletedAt"),
  },
  (table) => [
    unique("jogador_partida_unique").on(table.idJogador, table.idPartida),
  ],
);

export type Estatistica = typeof estatisticasTable.$inferSelect;
export type InsertEstatistica = typeof estatisticasTable.$inferInsert;

// Relatorios table
export const relatoriosTable = sqliteTable("relatorios", {
  id: text("id").primaryKey(), // UUID
  idPartida: text("idPartida")
    .notNull()
    .references(() => partidasTable.id, { onDelete: "cascade" }),
  melhorJogador: text("melhorJogador").references(() => jogadoresTable.id, {
    onDelete: "set null",
  }),
  analiseAoVivo: text("analiseAoVivo"),
  sugestoesAoVivo: text("sugestoesAoVivo"),
  pdfUrl: text("pdfUrl"),
  updatedAt: text("updatedAt").notNull(),
  createdAt: text("createdAt").notNull(),
  deletedAt: text("deletedAt"),
});

export type Relatorio = typeof relatoriosTable.$inferSelect;
export type InsertRelatorio = typeof relatoriosTable.$inferInsert;

// ==========================================
// RELACIONAMENTOS (Mantidos)
// ==========================================
export const timesTableRelations = relations(timesTable, ({ many }) => ({
  jogadores: many(jogadoresTable),
  partidas: many(partidasTable),
}));

export const jogadoresTableRelations = relations(
  jogadoresTable,
  ({ one, many }) => ({
    time: one(timesTable, {
      fields: [jogadoresTable.idTime],
      references: [timesTable.id],
    }),
    eventos: many(eventosTable),
    estatisticas: many(estatisticasTable),
  }),
);

export const partidasTableRelations = relations(
  partidasTable,
  ({ one, many }) => ({
    time: one(timesTable, {
      fields: [partidasTable.idTime],
      references: [timesTable.id],
    }),
    estatisticas: many(estatisticasTable),
    eventos: many(eventosTable),
  }),
);

export const eventosTableRelations = relations(eventosTable, ({ one }) => ({
  partida: one(partidasTable, {
    fields: [eventosTable.idPartida],
    references: [partidasTable.id],
  }),
  jogador: one(jogadoresTable, {
    fields: [eventosTable.idJogador],
    references: [jogadoresTable.id],
  }),
}));

export const estatisticasTableRelations = relations(
  estatisticasTable,
  ({ one }) => ({
    jogador: one(jogadoresTable, {
      fields: [estatisticasTable.idJogador],
      references: [jogadoresTable.id],
    }),
    partida: one(partidasTable, {
      fields: [estatisticasTable.idPartida],
      references: [partidasTable.id],
    }),
  }),
);
