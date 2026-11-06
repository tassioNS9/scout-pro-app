import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Time } from "@/shared/db/schema";

import { AddPlayerForm } from "../AddPlayerForm";

const AddPlayerButton = ({ times }: { times: Time[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-scout-green">
          <AntDesign name="plus" size={24} color="black" />
          <Text> Adicionar Jogador</Text>
        </Button>
      </DialogTrigger>
      <AddPlayerForm times={times} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddPlayerButton;
