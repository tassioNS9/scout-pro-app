import { db } from "./index";
import {
  timesTable,
  jogadoresTable,
  partidasTable,
  eventosTable,
  estatisticasTable,
} from "./schema";
import { count } from "drizzle-orm";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export async function seedDatabase() {
  try {
    // 1. Verifica se já existem times cadastrados para evitar duplicar o seed
    const [{ value: totalTimes }] = await db
      .select({ value: count() })
      .from(timesTable);

    if (totalTimes > 0) {
      console.log("O banco de dados já possui dados. Seed ignorado.");
      return;
    }

    console.log("Iniciando o Seed do banco de dados...");

    // IDs fixos ou gerados para manter a integridade relacional no seed
    const timeId = uuidv4();
    const jogador1Id = uuidv4();
    const jogador2Id = uuidv4();
    const partidaId = uuidv4();
    const evento1Id = uuidv4();
    const estatistica1Id = uuidv4();
    const relatorioId = uuidv4();

    const agora = new Date().toISOString();

    // 2. Inserir Time de Exemplo
    await db.insert(timesTable).values({
      id: timeId,
      userId: "local-guest-user",
      nome: "Grêmio Esportivo Sub-20",
      categoria: "Sub-20",
      cidade: "Porto Alegre",
      estado: "RS",
      createdAt: agora,
      updatedAt: agora,
    });

    // 3. Inserir Jogadores de Exemplo
    await db.insert(jogadoresTable).values([
      {
        id: jogador1Id,
        nome: "Carlos Eduardo",
        numero: 10,
        posicao: "Meia",
        idade: 19,
        idTime: timeId,
        createdAt: agora,
        updatedAt: agora,
      },
      {
        id: jogador2Id,
        nome: "Matheus Silva",
        numero: 9,
        posicao: "Atacante",
        idade: 18,
        idTime: timeId,
        createdAt: agora,
        updatedAt: agora,
      },
    ]);

    // 4. Inserir Partida de Exemplo
    await db.insert(partidasTable).values({
      id: partidaId,
      idTime: timeId,
      nomeTimeAdversario: "Internacional Sub-20",
      data: agora,
      campeonato: "Campeonato Gaúcho Sub-20",
      categoria: "Sub-20",
      casaOuFora: "casa",
      placarTime: 2,
      placarTimeAdversario: 1,
      status: "finalizada",
      resultado: "Vitoria",
      createdAt: agora,
      updatedAt: agora,
    });

    // 5. Inserir Eventos da Partida (Ex: Gol e Assistência)
    await db.insert(eventosTable).values({
      id: evento1Id,
      idPartida: partidaId,
      idJogador: jogador2Id,
      tipoEvento: "Gol",
      minuto: 35,
      tempo: "1T",
      detalhes: "Chute forte de fora da área no ângulo",
      createdAt: agora,
    });

    // 6. Inserir Estatísticas do Jogador na Partida
    await db.insert(estatisticasTable).values({
      id: estatistica1Id,
      idJogador: jogador2Id,
      idPartida: partidaId,
      nota: 8.5,
      createdAt: agora,
      updatedAt: agora,
    });

    console.log("Seed executado com sucesso!");
  } catch (error) {
    console.error("Erro ao executar o seed do banco:", error);
  }
}
