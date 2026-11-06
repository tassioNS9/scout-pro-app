import { FC } from "react";
import { ItemTeamCardView } from "./ItemTeamCard.view";
import { Time } from "@/shared/db/schema";
import { useItemTeamCardViewModel } from "./useItemTeamCard.viewModel";

interface ItemTeamCardProps {
  team: Time;
}

export const ItemTeamCard: FC<ItemTeamCardProps> = (props) => {
  const viewModel = useItemTeamCardViewModel(props);

  return <ItemTeamCardView {...viewModel} />;
};
