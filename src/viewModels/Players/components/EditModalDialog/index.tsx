import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import { Toast } from "toastify-react-native";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppInput } from "@/shared/components/AppInput";
import { AppSelect } from "@/shared/components/AppSelect";
import { Jogador } from "@/shared/db/schema";
import { updatePlayer } from "@/shared/repositories/players.repository";

const jogadorSchema = z.object({
  numero: z.number().min(1).max(99),
  nome: z.string().min(3).max(60),
  idade: z.number().min(10).max(50),
  posicao: z.enum([
    "Goleiro",
    "Zagueiro",
    "Lateral",
    "Volante",
    "Meia",
    "Atacante",
  ]),
});

type JogadorFormData = z.infer<typeof jogadorSchema>;

interface EditModalDialogProps {
  jogador?: Jogador | null;
  showForm: boolean;
  isEditing?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const positionOptions = [
  "Goleiro",
  "Zagueiro",
  "Lateral",
  "Volante",
  "Meia",
  "Atacante",
].map((value) => ({ label: value, value }));

const EditModalDialog = ({
  jogador,
  showForm,
  isEditing = false,
  onClose,
  onSuccess,
}: EditModalDialogProps) => {
  const form = useForm<JogadorFormData>({
    resolver: zodResolver(jogadorSchema),
    defaultValues: {
      numero: jogador?.numero ?? 0,
      nome: jogador?.nome ?? "",
      idade: jogador?.idade ?? 0,
      posicao: jogador?.posicao ?? "Goleiro",
    },
  });

  useEffect(() => {
    if (jogador) {
      form.reset({
        numero: jogador.numero,
        nome: jogador.nome,
        idade: jogador.idade,
        posicao: jogador.posicao,
      });
    }
  }, [form, jogador]);

  const handleSubmit = async (data: JogadorFormData) => {
    if (!jogador) return;
    try {
      await updatePlayer({ id: jogador.id, ...data });
      Toast.success("Jogador atualizado com sucesso");
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
      Toast.error("Erro ao atualizar jogador");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={showForm} onOpenChange={(open) => !open && handleClose()}>
      {jogador && (
        <DialogContent className="w-[92%] rounded-2xl border border-scout-border bg-scout-card p-6">
          <DialogHeader>
            <DialogTitle className="text-scout-text">
              {isEditing ? "Editar jogador" : "Novo jogador"}
            </DialogTitle>
          </DialogHeader>

          <AppSelect
            control={form.control}
            name="posicao"
            label="Posição"
            options={positionOptions}
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
          <AppInput
            control={form.control}
            name="idade"
            label="Idade"
            placeholder="Ex: 17"
            keyboardType="number-pad"
            onChangeText={(value) => form.setValue("idade", Number(value))}
          />

          <DialogFooter className="mt-4 flex-row gap-3">
            <Button
              variant="outline"
              onPress={handleClose}
              disabled={form.formState.isSubmitting}
              className="flex-1 border-scout-border bg-scout-card-header"
            >
              <Text className="text-sm text-scout-muted">Cancelar</Text>
            </Button>
            <Button
              onPress={form.handleSubmit(handleSubmit)}
              disabled={form.formState.isSubmitting}
              className="flex-1 bg-scout-green"
            >
              <Text className="text-sm font-semibold text-black">
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default EditModalDialog;
