import { FC } from "react";
import { ItemMatchCardView } from "./ItemMatchCard.view";

import { useItemMatchCardViewModel } from "@/viewModels/Matchs/components/ItemMatchCard/useItemMatchCard.viewModel";
import { MatchItem } from "./useItemMatchCard.viewModel";

export const ItemMatchCard: FC<{ match: MatchItem }> = (props) => {
  const viewModel = useItemMatchCardViewModel(props);

  return <ItemMatchCardView {...viewModel} />;
};
