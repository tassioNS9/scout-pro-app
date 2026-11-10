import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InsertEvento, Jogador, Partida } from "@/shared/db/schema";
import { createEvento } from "@/shared/repositories/events.repository";
import {
  getAllMatches,
  getMatchById,
  updateMatch,
} from "@/shared/repositories/matches.repository";
import { getPlayersByTime } from "@/shared/repositories/players.repository";

type TipoEvento = InsertEvento["tipoEvento"];
type PartidaResumo = Awaited<ReturnType<typeof getAllMatches>>[number];
type PartidaDetalhe = NonNullable<Awaited<ReturnType<typeof getMatchById>>>;

const EVENTO_LABELS = {
  Assistencia: "Assistência",
  Desarme: "Desarme",
  FaltaCometida: "Falta Cometida",
  FaltaSofrida: "Falta Sofrida",
  Gol: "Gol",
  GolContra: "Gol Contra",
  cartaoAmarelo: "Cartão Amarelo",
  cartaoVermelho: "Cartão Vermelho",
  CometerPenalti: "Cometer Pênalti",
  SofrerPenalti: "Sofrer Pênalti",
} satisfies Record<TipoEvento, string>;

const EVENTOS_CONFIG = Object.entries(EVENTO_LABELS) as Array<
  [TipoEvento, string]
>;

function calcularResultado(
  placarTime: number,
  placarAdversario: number,
): Partida["resultado"] {
  if (placarTime > placarAdversario) return "Vitoria";
  if (placarTime < placarAdversario) return "Derrota";
  return "Empate";
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? (param[0] ?? "") : (param ?? "");
}

export default function ScoutView() {
  const { partida: partidaParam } = useLocalSearchParams<{
    partida?: string | string[];
  }>();
  const [idPartida, setIdPartida] = useState(getParamValue(partidaParam));
  const [idJogador, setIdJogador] = useState("");
  const [tempo, setTempo] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tempoAtual, setTempoAtual] = useState<"1T" | "2T">("1T");
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [partidaFinalizadaManual, setPartidaFinalizadaManual] = useState(false);
  const [partidas, setPartidas] = useState<PartidaResumo[]>([]);
  const [partida, setPartida] = useState<PartidaDetalhe | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [isUpdatingPartida, setIsUpdatingPartida] = useState(false);
  const [eventoPendente, setEventoPendente] = useState(false);

  const isPartidaFinalizada =
    partidaFinalizadaManual || partida?.status === "finalizada";
  const acoesBloqueadas =
    isPartidaFinalizada || isUpdatingPartida || eventoPendente;

  useEffect(() => {
    let isMounted = true;
    getAllMatches()
      .then((partidasData) => {
        if (isMounted) setPartidas(partidasData);
      })
      .catch(() => {
        if (isMounted) Toast.error("Erro ao carregar a lista de partidas");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setTempo(0);
    setIsRunning(false);
    setTempoAtual("1T");
    setPartidaFinalizadaManual(false);
    setIdJogador("");
  }, [idPartida]);

  useEffect(() => {
    let isMounted = true;
    if (!idPartida) {
      setPartida(null);
      return;
    }

    getMatchById(idPartida)
      .then((data) => {
        if (isMounted) setPartida(data ?? null);
      })
      .catch(() => {
        if (isMounted) Toast.error("Erro ao carregar dados da partida");
      });
    return () => {
      isMounted = false;
    };
  }, [idPartida]);

  useEffect(() => {
    let isMounted = true;
    if (!partida?.idTime) {
      setJogadores([]);
      return;
    }

    getPlayersByTime(partida.idTime)
      .then((data) => {
        if (isMounted) setJogadores(data);
      })
      .catch(() => {
        if (isMounted) Toast.error("Erro ao carregar jogadores do time");
      });
    return () => {
      isMounted = false;
    };
  }, [partida?.id, partida?.idTime]);

  useEffect(() => {
    setPlacarA(partida?.placarTime ?? 0);
    setPlacarB(partida?.placarTimeAdversario ?? 0);
  }, [partida]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTempo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const atualizarPlacarPorGol = async (tipoEvento: "Gol" | "GolContra") => {
    if (!partida) return;

    const jogador = jogadores.find((item) => item.id === idJogador);
    if (!jogador) return;

    const marcaParaTimeA =
      tipoEvento === "Gol"
        ? jogador.idTime === partida.idTime
        : jogador.idTime !== partida.idTime;
    const novoPlacarA = marcaParaTimeA ? placarA + 1 : placarA;
    const novoPlacarB = marcaParaTimeA ? placarB : placarB + 1;

    setPlacarA(novoPlacarA);
    setPlacarB(novoPlacarB);

    try {
      await updateMatch(partida.id, {
        placarTime: novoPlacarA,
        placarTimeAdversario: novoPlacarB,
      });
    } catch (error) {
      console.error(error);
      setPlacarA(placarA);
      setPlacarB(placarB);
      Toast.error("Evento salvo, mas houve erro ao atualizar o placar");
    }
  };

  const registrarEvento = async (tipoEvento: TipoEvento) => {
    if (isPartidaFinalizada) {
      Toast.error("A partida já foi finalizada");
      return;
    }
    if (!idPartida || !idJogador) {
      Toast.error("Selecione a partida e o jogador");
      return;
    }
    if (eventoPendente) return;

    setEventoPendente(true);
    try {
      await createEvento({
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        idPartida,
        idJogador,
        tipoEvento,
        minuto: Math.floor(tempo / 60),
        tempo: tempoAtual,
      });
      Toast.success(`${EVENTO_LABELS[tipoEvento]} registrado`);
      if (tipoEvento === "Gol" || tipoEvento === "GolContra") {
        await atualizarPlacarPorGol(tipoEvento);
      }
    } catch (error) {
      console.error(error);
      Toast.error("Erro ao registrar evento");
    } finally {
      setEventoPendente(false);
    }
  };

  const handleToggleTimer = async () => {
    const novoEstado = !isRunning;
    setIsRunning(novoEstado);
    if (novoEstado && partida?.status === "planejada") {
      try {
        await updateMatch(partida.id, { status: "em_andamento" });
        setPartida((prev) =>
          prev ? { ...prev, status: "em_andamento" } : prev,
        );
      } catch (error) {
        console.error(error);
        Toast.error("Erro ao atualizar status da partida");
      }
    }
  };

  const handleFinalizarPartida = () => {
    if (isPartidaFinalizada) {
      Toast.error("A partida já foi finalizada");
      return;
    }
    if (!partida) {
      Toast.error("Selecione a partida");
      return;
    }

    Alert.alert(
      "Finalizar partida",
      "Tem certeza que deseja finalizar a partida? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          style: "destructive",
          onPress: async () => {
            try {
              setIsUpdatingPartida(true);
              await updateMatch(partida.id, {
                placarTime: placarA,
                placarTimeAdversario: placarB,
                status: "finalizada",
                resultado: calcularResultado(placarA, placarB),
              });
              setIsRunning(false);
              setPartidaFinalizadaManual(true);
              Toast.success("Partida finalizada com sucesso");
            } catch (error) {
              console.error(error);
              Toast.error("Erro ao finalizar partida");
            } finally {
              setIsUpdatingPartida(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row gap-3">
          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-sm font-semibold text-slate-300">
              Partida
            </Text>
            <Select
              value={partidas.find((item) => item.id === idPartida)}
              onValueChange={(option) => setIdPartida(option?.value ?? "")}
              disabled={eventoPendente || isUpdatingPartida}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800">
                <SelectValue
                  className="text-white"
                  placeholder="Selecione uma partida"
                />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                {partidas.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    label={`${item.nomeTime} vs ${item.nomeTimeAdversario} - ${new Date(item.data).toLocaleDateString("pt-BR")}`}
                  >
                    {`${item.nomeTime} vs ${item.nomeTimeAdversario} - ${new Date(item.data).toLocaleDateString("pt-BR")}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>

          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-sm font-semibold text-slate-300">
              Jogador
            </Text>
            <Select
              value={jogadores.find((item) => item.id === idJogador)}
              onValueChange={(option) => setIdJogador(option?.value ?? "")}
              disabled={eventoPendente || isUpdatingPartida || !idPartida}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800">
                <SelectValue
                  className="text-white"
                  placeholder="Selecione um jogador"
                />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                {jogadores.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    label={`#${item.numero} - ${item.nome}`}
                  >
                    {`#${item.numero} - ${item.nome}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>
        </View>

        <Card className="border-slate-700 bg-slate-800 px-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 items-center">
              <Text className="mb-2 text-sm text-slate-400">
                {partida?.nomeTime ?? "Time A"}
              </Text>
              <Text className="text-6xl font-bold text-blue-400">
                {placarA}
              </Text>
            </View>

            <View className="items-center">
              <Text className="mb-3 font-mono text-3xl font-bold text-green-500">
                {formatTime(tempo)}
              </Text>
              <View className="mb-3 flex-row gap-2">
                {(["1T", "2T"] as const).map((periodo) => (
                  <Button
                    key={periodo}
                    size="sm"
                    variant={tempoAtual === periodo ? "default" : "outline"}
                    onPress={() => setTempoAtual(periodo)}
                    className={
                      tempoAtual === periodo ? "bg-green-600" : "bg-slate-700"
                    }
                    disabled={isPartidaFinalizada}
                  >
                    <Text className="text-white">{periodo}</Text>
                  </Button>
                ))}
              </View>
              <View className="flex-row gap-2">
                <Button
                  size="sm"
                  onPress={handleToggleTimer}
                  className={isRunning ? "bg-red-600" : "bg-green-600"}
                  disabled={isPartidaFinalizada}
                  accessibilityLabel={
                    isRunning ? "Pausar cronômetro" : "Iniciar cronômetro"
                  }
                >
                  <MaterialCommunityIcons
                    color="#ffffff"
                    name={isRunning ? "pause" : "play"}
                    size={20}
                  />
                </Button>
                <Button
                  size="sm"
                  onPress={() => setTempo(0)}
                  className="bg-slate-600"
                  disabled={isPartidaFinalizada}
                  accessibilityLabel="Zerar cronômetro"
                >
                  <MaterialCommunityIcons
                    color="#ffffff"
                    name="restart"
                    size={20}
                  />
                </Button>
              </View>
            </View>

            <View className="flex-1 items-center">
              <Text className="mb-2 text-center text-sm text-slate-400">
                {partida?.nomeTimeAdversario ?? "Time B"}
              </Text>
              <Text className="text-6xl font-bold text-yellow-400">
                {placarB}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="border-slate-700 bg-slate-800 px-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">
              Registrar Eventos
            </Text>
            {eventoPendente && (
              <Text className="text-xs text-slate-400">Salvando...</Text>
            )}
          </View>
          <FlatList
            data={EVENTOS_CONFIG}
            keyExtractor={([value]) => value}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperClassName="gap-3"
            contentContainerClassName="gap-3"
            renderItem={({ item: [value, label] }) => (
              <Button
                onPress={() => registrarEvento(value)}
                className="min-h-12 flex-1 bg-slate-700"
                disabled={acoesBloqueadas || !idJogador || !idPartida}
              >
                <Text className="text-center text-xs text-white">{label}</Text>
              </Button>
            )}
          />
        </Card>

        <View className="flex-row gap-3 pb-6">
          <Button
            className="flex-1 bg-slate-700"
            onPress={handleToggleTimer}
            disabled={isPartidaFinalizada}
          >
            <Text className="text-white">
              {isRunning ? "Pausar Partida" : "Retomar Partida"}
            </Text>
          </Button>
          <Button
            className="flex-1 bg-green-600"
            onPress={handleFinalizarPartida}
            disabled={
              isPartidaFinalizada || isUpdatingPartida || eventoPendente
            }
          >
            <Text className="text-white">Finalizar Partida</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
