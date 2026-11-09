import MatchsView from "@/viewModels/Matchs/Matchs.view";
import { useMatchsViewModel } from "@/viewModels/Matchs/useMatchs.viewModel";

export default function MatchsScreen() {
  const viewModel = useMatchsViewModel();

  return <MatchsView {...viewModel} />;
}
