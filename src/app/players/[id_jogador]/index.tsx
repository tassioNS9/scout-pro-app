import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

import {
  getHistoricoPartidasPorJogador,
  getHistoricoTotalJogador,
} from "@/shared/repositories/players.repository";

import TabContainer from "./components/TabContainer";
import { ScoutGradient } from "@/shared/components/ScoutGradient";
import { scoutColors } from "@/styles/colors";
import { BackButton } from "@/shared/components/BackButton";

const FALLBACK_PLAYER_IMAGE = require("@/assets/player_default.png");

const JogadorDetails = () => {
  const { id_jogador: routePlayerId } = useLocalSearchParams<{
    id_jogador?: string;
  }>();

  const [historicoJogador, setHistoricoJogador] = useState<Awaited<
    ReturnType<typeof getHistoricoTotalJogador>
  > | null>(null);
  const [historicoPartidas, setHistoricoPartidas] = useState<
    Awaited<ReturnType<typeof getHistoricoPartidasPorJogador>>
  >([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!routePlayerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [playerHistory, matchHistory] = await Promise.all([
        getHistoricoTotalJogador(routePlayerId),
        getHistoricoPartidasPorJogador(routePlayerId),
      ]);

      setHistoricoJogador(playerHistory);
      setHistoricoPartidas(matchHistory);
    } catch (error) {
      console.error("Erro ao carregar histórico do jogador:", error);
      Toast.error("Não foi possível carregar os dados do jogador.");
    } finally {
      setLoading(false);
    }
  }, [routePlayerId]);

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-scout-bg">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!historicoJogador?.perfil) {
    return (
      <View className="flex-1 items-center justify-center bg-scout-bg p-6">
        <Text className="text-center text-base text-scout-text">
          Jogador não encontrado.
        </Text>
      </View>
    );
  }

  const hasMatches = historicoJogador.totalPartidas > 0;
  const displayRating =
    hasMatches && historicoJogador.nota !== null ? historicoJogador.nota : "—";

  return (
    <ScoutGradient
      colors={[scoutColors.bg, scoutColors.bg_alt]}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-scout-bg mt-12"
        contentContainerClassName="flex-grow items-center p-3"
      >
        <View className="w-full max-w-3xl overflow-hidden rounded-3xl border border-scout-border bg-scout-card shadow-lg">
          <View className="absolute top-4 left-4 z-10">
            <BackButton />
          </View>

          {/* Header */}
          <View className="relative p-4 pb-2 sm:p-6">
            {/* Player Info - Desktop Layout */}
            <View className="items-center gap-5 sm:gap-8">
              <View className="items-center">
                <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-scout-border bg-scout-card-header sm:h-28 sm:w-28">
                  <Image
                    source={
                      historicoJogador.perfil.fotoUrl
                        ? { uri: historicoJogador.perfil.fotoUrl }
                        : FALLBACK_PLAYER_IMAGE
                    }
                    accessibilityLabel={`Foto de ${historicoJogador.perfil.nome}`}
                    className="h-full w-full"
                  />
                </View>
              </View>
              {/* Player Name and Info */}
              <View className="w-full items-center">
                <Text className="mt-1 text-center text-2xl font-bold text-white sm:text-3xl">
                  {historicoJogador.perfil.nome}
                </Text>
                <View className="mt-2 items-center gap-1">
                  <Text className="text-primary font-semibold">
                    {historicoJogador.perfil.posicao}
                  </Text>
                  <Text className="text-xs text-emerald-400">
                    {historicoJogador.perfil.idade
                      ? `Idade: ${historicoJogador.perfil.idade} anos`
                      : "Idade: —"}{" "}
                    | Número: {historicoJogador.perfil.numero}
                  </Text>
                </View>

                {/* Desktop Quick Stats */}
                <View className="mt-5 w-full flex-row flex-wrap justify-center gap-3">
                  <View className="w-[48%] rounded-xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
                    <Text className="text-sm text-zinc-400">Nota Média</Text>
                    <Text className="text-primary mt-1 text-3xl font-bold">
                      {displayRating}
                    </Text>
                  </View>
                  <View className="w-[48%] rounded-xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
                    <Text className="text-sm text-zinc-400">Gols</Text>
                    <Text className="mt-1 text-3xl font-bold text-white">
                      {historicoJogador.eventos.gols}
                    </Text>
                  </View>
                  <View className="w-[48%] rounded-xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
                    <Text className="text-sm text-zinc-400">Assistências</Text>
                    <Text className="mt-1 text-3xl font-bold text-white">
                      {historicoJogador.eventos.assistencias}
                    </Text>
                  </View>
                  <View className="w-[48%] rounded-xl border border-scout-border bg-zinc-800 p-3 sm:p-4">
                    <Text className="text-sm text-zinc-400">Jogos</Text>
                    <Text className="mt-1 text-3xl font-bold text-white">
                      {historicoJogador.totalPartidas}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Tabs */}
            <TabContainer
              matchs={historicoPartidas}
              playerInfo={historicoJogador}
            />
          </View>
        </View>
      </ScrollView>
    </ScoutGradient>
  );
};

export default JogadorDetails;
