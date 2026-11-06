import { TeamsView } from "@/viewModels/Teams/Teams.view";
import { useTeamsViewModel } from "@/viewModels/Teams/useTeams.viewModel";

export default function TeamsScreen() {
  const viewModel = useTeamsViewModel();

  return <TeamsView {...viewModel} />;
}
