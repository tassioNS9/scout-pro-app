import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Toast } from "toastify-react-native";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppInput } from "@/shared/components/AppInput";
import { AppSelect } from "@/shared/components/AppSelect";
import { Time } from "@/shared/db/schema";
import { createMatch } from "@/shared/repositories/matches.repository";
import { CreateMatchFormData, createMatchSchema } from "./schema";

interface CreateMatchFormProps {
  times: Time[];
  onSuccess: () => void;
}

const categoryOptions = [
  { label: "Sub-17", value: "Sub-17" },
  { label: "Sub-20", value: "Sub-20" },
  { label: "Profissional", value: "Profissional" },
];

export default function AddMatchForm({
  times,
  onSuccess,
}: CreateMatchFormProps) {
  const { height } = useWindowDimensions();
  const form = useForm<CreateMatchFormData>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      idTime: times[0]?.id ?? "",
      nomeTimeAdversario: "",
      data: "",
      campeonato: "",
      categoria: "Sub-17",
    },
  });

  const teamOptions = times.map((time) => ({
    label: time.nome,
    value: time.id,
  }));

  const handleCreateMatch = async (data: CreateMatchFormData) => {
    try {
      await createMatch({
        idTime: data.idTime,
        nomeTimeAdversario: data.nomeTimeAdversario,
        data: new Date(data.data).toISOString(),
        campeonato: data.campeonato,
        categoria: data.categoria,
        status: "planejada",
        casaOuFora: "casa",
        placarTime: 0,
        placarTimeAdversario: 0,
        resultado: "Sem_Resultado",
        deletedAt: null,
      });
      Toast.success("Partida criada com sucesso");
      form.reset({
        idTime: times[0]?.id ?? "",
        nomeTimeAdversario: "",
        data: "",
        campeonato: "",
        categoria: "Sub-17",
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar partida:", error);
      Toast.error("Falha ao criar partida");
    }
  };

  const handleClose = () => {
    form.reset();
    onSuccess();
  };

  return (
    <DialogContent className="w-[92%] rounded-2xl border border-scout-border bg-scout-card p-6">
      <DialogHeader>
        <DialogTitle className="text-scout-text">
          Criar nova partida
        </DialogTitle>
        <DialogDescription className="text-sm text-scout-muted">
          Preencha os campos abaixo para criar uma nova partida.
        </DialogDescription>
      </DialogHeader>

      <ScrollView
        className="mt-2"
        style={{ maxHeight: height * 0.6 }}
        contentContainerClassName="gap-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppSelect
          control={form.control}
          name="idTime"
          label="Selecione o seu time"
          placeholder="Selecione um time"
          options={teamOptions}
        />
        <AppInput
          control={form.control}
          name="nomeTimeAdversario"
          label="Time adversário"
          placeholder="Ex: Esporte Clube A"
          autoCapitalize="words"
        />
        <AppInput
          control={form.control}
          name="data"
          label="Data e hora"
          placeholder="Ex: 03/11/2026 15:00"
        />
        <AppInput
          control={form.control}
          name="campeonato"
          label="Campeonato"
          placeholder="Ex: Campeonato Estadual"
          autoCapitalize="words"
        />
        <AppSelect
          control={form.control}
          name="categoria"
          label="Categoria"
          options={categoryOptions}
        />
      </ScrollView>

      <DialogFooter className="mt-4 flex-row gap-3">
        <Button
          variant="outline"
          onPress={handleClose}
          disabled={form.formState.isSubmitting}
          className="flex-1 border border-scout-border bg-scout-card-header"
        >
          <Text className="text-sm text-scout-muted">Cancelar</Text>
        </Button>
        <Button
          onPress={form.handleSubmit(handleCreateMatch)}
          disabled={form.formState.isSubmitting || times.length === 0}
          className="flex-1 bg-scout-green"
        >
          <Text className="text-sm font-semibold text-black">
            {form.formState.isSubmitting ? "Criando..." : "Criar partida"}
          </Text>
        </Button>
      </DialogFooter>

      {times.length === 0 && (
        <View>
          <Text className="text-xs text-red-400">
            Cadastre um time antes de criar uma partida.
          </Text>
        </View>
      )}
    </DialogContent>
  );
}
