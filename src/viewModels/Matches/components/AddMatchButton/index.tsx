import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { Time } from "@/shared/db/schema";

import CreatePartidaForm from "../AddMatchForm";

interface AddMatchButtonProps {
  times: Time[];
}

const AddMatchButton = ({ times }: AddMatchButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-full bg-scout-green">
          <AntDesign name="plus" size={20} color="black" />
          <Text className="text-black">Nova Partida</Text>
        </Button>
      </DialogTrigger>
      <CreatePartidaForm times={times} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddMatchButton;
