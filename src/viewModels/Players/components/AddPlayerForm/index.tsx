import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { AppModal } from "@/shared/components/AppModal";
import { AppSelect } from "@/shared/components/AppSelect";
import { Time } from "@/shared/db/schema";
import { createPlayer } from "@/shared/repositories/players.repository";

import { CreatePlayerFormValues, createPlayerSchema } from "./schema";

export const POSICAOJOGADOR = {
  GOLEIRO: "Goleiro",
  ZAGUEIRO: "Zagueiro",
  LATERAL: "Lateral",
  VOLANTE: "Volante",
  MEIA: "Meia",
  ATACANTE: "Atacante",
} as const;

export const posicaoJogadorOptions = Object.values(POSICAOJOGADOR).map(
  (value) => ({ value, label: value }),
);

interface CreateJogadorFormProps {
  times: Time[];
  onSuccess: () => void;
}

const defaultValues: CreatePlayerFormValues = {
  idTime: "",
  numero: 0,
  nome: "",
  idade: 0,
  posicao: "Goleiro",
  fotoUri: undefined,
};

export const AddPlayerForm = ({ times, onSuccess }: CreateJogadorFormProps) => {
  const { height } = useWindowDimensions();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const form = useForm<CreatePlayerFormValues>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      ...defaultValues,
      idTime: times[0]?.id ?? "",
    },
  });

  const teamOptions = times.map((time) => ({
    label: time.nome,
    value: time.id,
  }));

  const resetForm = () => {
    form.reset({
      ...defaultValues,
      idTime: times[0]?.id ?? "",
    });
    setPhotoUri(null);
  };

  const handleCreatePlayer = async (data: CreatePlayerFormValues) => {
    try {
      const result = await createPlayer({
        idTime: data.idTime,
        nome: data.nome,
        numero: data.numero,
        idade: data.idade,
        posicao: data.posicao,
        fotoUri: data.fotoUri,
      });

      if (!result.sucesso) {
        Toast.error("Não foi possível criar o jogador.");
        return;
      }

      Toast.success("Jogador criado com sucesso!");
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar jogador:", error);
      Toast.error("Erro ao criar o jogador.");
    }
  };

  const handleClose = () => {
    resetForm();
    onSuccess();
  };

  return (
    <DialogContent className="w-[92%] rounded-2xl border border-scout-border bg-scout-card p-6">
      <DialogHeader>
        <DialogTitle className="text-scout-text">Novo jogador</DialogTitle>
        <DialogDescription className="text-sm text-scout-muted">
          Preencha os campos abaixo para criar um novo jogador.
        </DialogDescription>
      </DialogHeader>

      <ScrollView
        className="mt-2"
        style={{ maxHeight: height * 0.65 }}
        contentContainerClassName="gap-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3">
          <Text className="self-start text-sm text-scout-muted">
            Foto do jogador (opcional)
          </Text>
          <Button
            variant="outline"
            onPress={() => setPhotoModalOpen(true)}
            className="w-full border border-dashed border-scout-border bg-scout-card-header"
          >
            <Text className="text-sm text-scout-muted">
              {photoUri ? "Alterar foto" : "Selecionar foto"}
            </Text>
          </Button>
          <AppModal
            open={photoModalOpen}
            onOpenChange={setPhotoModalOpen}
            onPhotoSelected={(uri) => {
              setPhotoUri(uri);
              form.setValue("fotoUri", uri, { shouldValidate: true });
            }}
            onRemovePhoto={() => {
              setPhotoUri(null);
              form.setValue("fotoUri", undefined, { shouldValidate: true });
            }}
            hasPhoto={!!photoUri}
          />
        </View>

        <AppSelect
          control={form.control}
          name="idTime"
          label="Time"
          placeholder={
            times.length === 0 ? "Nenhum time cadastrado" : "Selecione um time"
          }
          options={teamOptions}
        />
        <AppInput
          control={form.control}
          name="numero"
          label="Número da camisa"
          placeholder="Ex: 10"
          keyboardType="number-pad"
          onChangeText={(value) => form.setValue("numero", Number(value))}
        />
        <AppInput
          control={form.control}
          name="nome"
          label="Nome"
          placeholder="Ex: João Silva"
          autoCapitalize="words"
        />
        <AppSelect
          control={form.control}
          name="posicao"
          label="Posição"
          placeholder="Selecione uma posição"
          options={posicaoJogadorOptions}
        />
        <AppInput
          control={form.control}
          name="idade"
          label="Idade"
          placeholder="Ex: 17"
          keyboardType="number-pad"
          onChangeText={(value) => form.setValue("idade", Number(value))}
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
          onPress={form.handleSubmit(handleCreatePlayer)}
          disabled={form.formState.isSubmitting || times.length === 0}
          className="flex-1 bg-scout-green"
        >
          <Text className="text-sm font-semibold text-black">
            {form.formState.isSubmitting ? "Criando..." : "Criar jogador"}
          </Text>
        </Button>
      </DialogFooter>

      {times.length === 0 && (
        <Text className="text-xs text-red-400">
          Cadastre um time antes de criar um jogador.
        </Text>
      )}
    </DialogContent>
  );
};
