import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { Toast } from "toastify-react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Jogador } from "@/shared/db/schema";
import { deletePlayer } from "@/shared/repositories/players.repository";

import EditModalDialog from "../EditModalDialog";

const positionStyles: Record<string, string> = {
  Goleiro: "border-scout-goleiro-border bg-scout-goleiro-bg",
  Zagueiro: "border-scout-zagueiro-border bg-scout-zagueiro-bg",
  Lateral: "border-scout-lateral-border bg-scout-lateral-bg",
  Meia: "border-scout-meia-border bg-scout-meia-bg",
  Atacante: "border-scout-atacante-border bg-scout-atacante-bg",
  Volante: "border-scout-volante-border bg-scout-volante-bg",
};

interface TablePlayersProps {
  players: Jogador[];
  searchQuery: string;
  onChanged?: () => void;
}

const TablePlayers = ({
  players,
  searchQuery,
  onChanged,
}: TablePlayersProps) => {
  const [editingPlayer, setEditingPlayer] = useState<Jogador | null>(null);
  const filteredPlayers = useMemo(
    () =>
      [...players]
        .filter(
          (player) =>
            player.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.posicao.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => a.numero - b.numero),
    [players, searchQuery],
  );

  const handleDelete = (player: Jogador) => {
    Alert.alert(
      "Excluir jogador",
      `Tem certeza que deseja excluir ${player.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlayer(player.id);
              Toast.success("Jogador apagado com sucesso");
              onChanged?.();
            } catch (error) {
              console.error("Erro ao apagar jogador:", error);
              Toast.error("Erro ao apagar jogador");
            }
          },
        },
      ],
    );
  };

  if (filteredPlayers.length === 0) {
    return (
      <View className="items-center py-16">
        <MaterialCommunityIcons
          name="account-group-outline"
          size={40}
          color="#4b5780"
        />
        <Text className="mt-3 text-scout-muted">Nenhum jogador encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={filteredPlayers}
        keyExtractor={(player) => player.id}
        scrollEnabled={false}
        contentContainerClassName="gap-3"
        renderItem={({ item: player }) => (
          <View className="gap-3 rounded-xl border border-scout-border bg-scout-card p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-full border border-scout-green-border bg-scout-green-dim">
                <Text className="text-sm text-scout-green">
                  {player.numero}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base text-scout-text">{player.nome}</Text>
                <Text className="text-xs text-scout-muted">
                  {player.idade ? `${player.idade} anos` : "N/I"}
                </Text>
              </View>
              <View
                className={`rounded-full border px-2 py-1 ${
                  positionStyles[player.posicao] ??
                  "border-scout-border bg-scout-card"
                }`}
              >
                <Text className="text-xs text-scout-text">
                  {player.posicao}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <Button
                variant="ghost"
                onPress={() => router.push(`/players/${player.id}`)}
                className="flex-1 border border-scout-green-border bg-scout-green-dim"
              >
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={14}
                  color="#00e676"
                />
                <Text className="text-xs text-scout-green">Registros</Text>
              </Button>
              <Button
                variant="ghost"
                onPress={() => setEditingPlayer(player)}
                className="border border-scout-sub17-border bg-scout-sub17-bg px-3"
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={15}
                  color="#e5e7eb"
                />
              </Button>
              <Button
                variant="ghost"
                onPress={() => handleDelete(player)}
                className="border border-scout-profissional-border bg-scout-profissional-bg px-3"
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={15}
                  color="#e5e7eb"
                />
              </Button>
            </View>
          </View>
        )}
      />
      <EditModalDialog
        jogador={editingPlayer}
        showForm={!!editingPlayer}
        isEditing
        onClose={() => setEditingPlayer(null)}
        onSuccess={() => {
          setEditingPlayer(null);
          onChanged?.();
        }}
      />
    </>
  );
};

export default TablePlayers;
