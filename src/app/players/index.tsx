import { PlayersView } from "@/viewModels/Players/Players.view";
import { usePlayersViewModel } from "@/viewModels/Players/usePlayers.viewModel";

const Players = () => {
  const viewModel = usePlayersViewModel();

  return <PlayersView {...viewModel} />;
};

export default Players;
