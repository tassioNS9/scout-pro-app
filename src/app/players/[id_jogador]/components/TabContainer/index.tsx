import { useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import AggregateStatCard from "../AggregateStatCard";
import GeralTab from "../GeralTab";
import HistoricTab from "../HistoricTab";

export type resultadoEnum = "Vitoria" | "Derrota" | "Empate" | "Sem_Resultado";

export type casaOuForaEnum = "casa" | "fora";

export type ContadoresEvento = {
  gols: number;
  golsContra: number;
  assistencias: number;
  desarmes: number;
  faltasCometidas: number;
  faltasSofridas: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  penaltisCometidos: number;
  penaltisSofridos: number;
  mediaNota?: number;
};

export type TotaisJogador = ContadoresEvento & {
  totalPartidas: number;
};

export type PartidaComEventosJogador = {
  gols: number;
  golsContra: number;
  assistencias: number;
  desarmes: number;
  faltasCometidas: number;
  faltasSofridas: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  penaltisCometidos: number;
  penaltisSofridos: number;
  idPartida: string;
  data: string;
  adversario: string;
  placarTime: number;
  placarAdversario: number;
  resultado: "Vitoria" | "Derrota" | "Empate" | "Sem_Resultado" | null;
  casaOuFora: "casa" | "fora";
};

interface PlayerInfo {
  perfil: {
    nome: string;
    idade: number;
    numero: number;
    posicao:
      | "Goleiro"
      | "Zagueiro"
      | "Lateral"
      | "Volante"
      | "Meia"
      | "Atacante";
  };
  eventos: {
    gols: number;
    golsContra: number;
    assistencias: number;
    desarmes: number;
    faltasCometidas: number;
    faltasSofridas: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    penaltisCometidos: number;
    penaltisSofridos: number;
  };
  totalPartidas: number;
  nota: number | null;
}

export default function TabContainer({
  playerInfo,
  matchs,
}: {
  playerInfo: PlayerInfo;
  matchs: PartidaComEventosJogador[];
}) {
  const [activeTab, setActiveTab] = useState<
    "geral" | "estatisticas" | "historico"
  >("geral");

  const hasMatches = playerInfo.totalPartidas > 0;
  const displayRating = hasMatches ? playerInfo.nota : "—";
  const aggregateStats = playerInfo.eventos;
  const aggregateItems = [
    { label: "Assistências", value: aggregateStats.assistencias },
    { label: "Desarmes", value: aggregateStats.desarmes },
    { label: "Faltas cometidas", value: aggregateStats.faltasCometidas },
    { label: "Faltas sofridas", value: aggregateStats.faltasSofridas },
    { label: "Pênaltis cometidos", value: aggregateStats.penaltisCometidos },
    { label: "Pênaltis sofridos", value: aggregateStats.penaltisSofridos },
  ];
  return (
    <View>
      <View className="mt-5 flex-row justify-between border-b border-scout-border px-1">
        <Button
          variant="ghost"
          onPress={() => setActiveTab("geral")}
          className={`min-w-24 flex-1 rounded-none border-b-2 pb-3 ${
            activeTab === "geral" ? "border-scout-green" : "border-transparent"
          }`}
        >
          <Text
            className={
              activeTab === "geral" ? "text-scout-green" : "text-zinc-500"
            }
          >
            GERAL
          </Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => setActiveTab("estatisticas")}
          className={`min-w-24 flex-1 rounded-none border-b-2 pb-3 ${
            activeTab === "estatisticas"
              ? "border-scout-green"
              : "border-transparent"
          }`}
        >
          <Text
            className={
              activeTab === "estatisticas"
                ? "text-scout-green"
                : "text-zinc-500"
            }
          >
            ESTATÍSTICAS
          </Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => setActiveTab("historico")}
          className={`min-w-24 flex-1 rounded-none border-b-2 pb-3 ${
            activeTab === "historico"
              ? "border-scout-green"
              : "border-transparent"
          }`}
        >
          <Text
            className={
              activeTab === "historico" ? "text-scout-green" : "text-zinc-500"
            }
          >
            HISTÓRICO
          </Text>
        </Button>
      </View>

      {/* Content */}
      <ScrollView className="max-h-[560px] px-1 pt-4">
        {activeTab === "geral" && (
          <GeralTab
            geralHistoric={playerInfo}
            displayRating={displayRating}
            hasMatches={hasMatches}
          />
        )}

        {activeTab === "estatisticas" && (
          <View className="gap-4">
            <Text className="mb-1 text-xs font-semibold tracking-wider text-zinc-400">
              ESTATÍSTICAS TOTAIS
            </Text>
            <FlatList
              data={aggregateItems}
              keyExtractor={(item) => item.label}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperClassName="gap-3"
              contentContainerClassName="gap-3"
              renderItem={({ item }) => (
                <View className="flex-1">
                  <AggregateStatCard label={item.label} value={item.value} />
                </View>
              )}
            />
          </View>
        )}

        {activeTab === "historico" && <HistoricTab matchs={matchs} />}
      </ScrollView>
    </View>
  );
}
