import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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
import { timesTable } from "@/shared/db/schema";
import { createTeam } from "@/shared/repositories/teams.repository";
import { scoutColors } from "@/styles/colors";
import { useRef } from "react";

import { CreateTimeFormValues, createTimeSchema } from "./schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TriggerRef } from "@rn-primitives/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

interface AddTimeFormProps {
  time?: typeof timesTable.$inferSelect;
  /** Chamado após salvar com sucesso (ex.: recarregar a lista) */
  onSuccess?: () => void;
  /** Chamado ao cancelar ou depois de salvar (ex.: fechar o Dialog) */
  onClose?: () => void;
}

// O value precisa ser igual ao texto usado na lista/filtro ("Sub-17", "Profissional"),
// senão o default do form e as cores das categorias não batem.
const categorias = [
  { label: "Sub-15", value: "Sub-15" },
  { label: "Sub-17", value: "Sub-17" },
  { label: "Profissional", value: "Profissional" },
];

export default function AddTimeForm({
  time,
  onSuccess,
  onClose,
}: AddTimeFormProps) {
  const { height } = useWindowDimensions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const ref = useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateTimeFormValues>({
    defaultValues: {
      nome: time?.nome ?? "",
      categoria: time?.categoria ?? "Sub-17",
      cidade: time?.cidade ?? "",
      estado: time?.estado ?? "",
    },
    resolver: zodResolver(createTimeSchema),
  });

  const resetForm = () => {
    reset();
    setPhotoUri(null);
  };

  async function onSubmit(values: CreateTimeFormValues) {
    const userId = "local-guest-user"; // "local-guest-user" ou o UUID do Supabase
    const isPremium = true; // Verificar no MMKV se o usuário é assinante

    const response = await createTeam({
      userId,
      isPremium,
      nome: values.nome,
      categoria: values.categoria,
      cidade: values.cidade,
      estado: values.estado,
      escudoUri: photoUri ?? undefined,
    });

    if (!response.sucesso) {
      if (response.erro === "LIMITE_EXCEDIDO") {
        Alert.alert("Limite do Plano Gratuito Atingido 👑", response.mensagem, [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Quero ser Premium",
            onPress: () => {
              // TODO: redirecionar para a tela de upgrade
              console.log("Redirecionar para a tela de upgrade para Premium");
            },
          },
        ]);
        return;
      }

      Toast.error("Não foi possível cadastrar o time. Tente novamente.");
      return;
    }

    Toast.success("Time cadastrado com sucesso");
    resetForm();
    onSuccess?.();
  }

  const handleCancel = () => {
    resetForm();
    onSuccess?.();
    setPhotoUri(null);
  };

  return (
    <DialogContent className=" max-w-sm rounded-2xl border border-scout-border bg-scout-card p-8">
      <DialogHeader>
        <DialogTitle className="text-scout-text">Criar novo time</DialogTitle>
        <DialogDescription className="text-sm text-scout-muted">
          Preencha os campos abaixo para criar um novo time.
        </DialogDescription>
      </DialogHeader>

      <ScrollView
        style={{ maxHeight: height * 0.55 }}
        className="mt-6"
        contentContainerClassName="gap-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Escudo */}
        <View className="items-center gap-3">
          <Text className="self-start text-sm text-scout-muted">
            Escudo do time (opcional)
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Selecionar escudo do time"
            onPress={() => setPhotoModalOpen(true)}
            className="h-[120px] w-[120px] items-center justify-center rounded-xl border border-dashed border-scout-border bg-scout-card-header"
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                className="h-full w-full rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <Upload size={32} color={scoutColors.dim} />
            )}
          </TouchableOpacity>

          <AppModal
            open={photoModalOpen}
            onOpenChange={setPhotoModalOpen}
            onPhotoSelected={setPhotoUri}
            onRemovePhoto={() => setPhotoUri(null)}
            hasPhoto={!!photoUri}
          />
        </View>

        {/* Campos */}
        <AppInput
          control={control}
          name="nome"
          label="Nome"
          placeholder="Ex: Esporte Clube A"
        />
        <AppSelect
          control={control}
          name="categoria"
          label="Categoria"
          placeholder="Selecione"
          options={categorias}
        />

        <AppInput
          control={control}
          name="cidade"
          label="Cidade"
          placeholder="Ex: Salvador"
        />
        <AppInput
          control={control}
          name="estado"
          label="Estado"
          placeholder="Ex: BA"
        />
      </ScrollView>

      <DialogFooter className="mt-6 flex-row gap-3">
        <Button
          variant="outline"
          onPress={handleCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-lg border border-scout-border bg-scout-card-header py-2"
        >
          <Text className="text-sm text-scout-muted">Cancelar</Text>
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-scout-green py-2"
        >
          <Text className="text-sm font-semibold text-black">
            {isSubmitting ? "Criando..." : "Criar time"}
          </Text>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
