import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";

import type { PartidaComEventosJogador } from "../TabContainer";
import { MatchStatRow } from "../MatchStatRow";

interface matchHistoricProps {
  matchs: PartidaComEventosJogador[];
}

const HistoricTab = ({ matchs }: matchHistoricProps) => {
  return (
    <View className="gap-3">
      <Text className="mb-2 text-xs font-semibold tracking-wider text-zinc-400">
        HISTÓRICO DE PARTIDAS
      </Text>
      <FlatList
        data={matchs}
        keyExtractor={(match) => String(match.idPartida)}
        scrollEnabled={false}
        contentContainerClassName="gap-3"
        ListEmptyComponent={
          <Text className="text-muted-foreground text-sm">
            Nenhuma partida registrada para este jogador.
          </Text>
        }
        renderItem={({ item: match }) => (
          <View className="gap-3 rounded-xl border border-scout-border bg-zinc-800 p-4">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="max-w-[58%] text-base font-bold text-white">
                  {match.adversario}
                </Text>
                <Text className="text-xs text-zinc-400">
                  {new Date(match.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-right text-base font-bold text-white">
                  {match.placarTime} x {match.placarAdversario}{" "}
                  {match.resultado === "Vitoria" ? (
                    <Text className="text-green-500">V</Text>
                  ) : match.resultado === "Derrota" ? (
                    <Text className="text-red-500">D</Text>
                  ) : (
                    <Text className="text-yellow-500">Empate</Text>
                  )}
                </Text>
                <View className="mt-1 flex-row items-center justify-end gap-1">
                  <Text className="text-primary text-sm font-bold">{8}</Text>
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color="#facc15"
                  />
                </View>
              </View>
            </View>

            <FlatList
              data={[
                { label: "Gols", value: match.gols },
                { label: "Assistências", value: match.assistencias },
                { label: "Faltas Cometidas", value: match.faltasCometidas },
                { label: "Faltas Sofridas", value: match.faltasSofridas },
                { label: "Desarmes", value: match.desarmes },
                { label: "Penaltis", value: match.penaltisSofridos },
              ]}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperClassName="gap-2"
              contentContainerClassName="gap-2"
              renderItem={({ item }) => (
                <View className="flex-1">
                  <MatchStatRow
                    key={`${match.idPartida}-${item.label}`}
                    label={item.label}
                    value={item.value}
                  />
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

export default HistoricTab;
