import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";

import AddTimeForm from "../AddTeamForm";
const AddTimeButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <AntDesign name="plus" size={24} color="black" />
          <Text> Novo Time</Text>
        </Button>
      </DialogTrigger>

      <AddTimeForm onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddTimeButton;
