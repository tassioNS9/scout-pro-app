import { Time } from "@/shared/db/schema";
import { Alert } from "react-native";
import { deleteTeam } from "@/shared/repositories/teams.repository";
import { Toast } from "toastify-react-native";

interface UseItemTeamCardViewModelParams {
  team: Time;
}

export const useItemTeamCardViewModel = ({
  team,
}: UseItemTeamCardViewModelParams) => {
  const handleDelete = (team: Time) => {
    Alert.alert("Deletar time", "Tem certeza que deseja deletar este time?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            deleteTeam(team);
            Toast.success("Time deletado com sucesso");
          } catch (error) {
            Toast.error("Falha ao deletar time");
          }
        },
      },
    ]);
  };

  return { team, handleDelete };
};
