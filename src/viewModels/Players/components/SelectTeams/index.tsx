import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { View } from "react-native";
import { Time } from "@/shared/db/schema";

interface SelectTeamsProps {
  teams: Time[];
  timeIdSelecionado?: string;
  onTeamChange?: (teamId: string) => void;
}

const SelectTeams = ({
  teams,
  timeIdSelecionado,
  onTeamChange,
}: SelectTeamsProps) => {
  const options = teams.map((team) => ({
    label: team.nome,
    value: team.id,
  }));

  function handleValueChange(teamId: string) {
    onTeamChange?.(teamId);
    router.push(teamId ? `/times/${teamId}` : "/times");
  }

  return (
    <View className="w-full">
      <Select
        value={options.find((option) => option.value === timeIdSelecionado)}
        onValueChange={(team) => team && handleValueChange(team.value)}
      >
        <SelectTrigger className="border-scout-border bg-scout-card">
          <MaterialCommunityIcons
            name="account-group-outline"
            size={16}
            color="#00e676"
          />
          <SelectValue
            placeholder={
              teams.length === 0
                ? "Nenhum time cadastrado"
                : "Selecione um time"
            }
          />
        </SelectTrigger>
        <SelectContent className="border-scout-border bg-scout-card">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </View>
  );
};

export default SelectTeams;
