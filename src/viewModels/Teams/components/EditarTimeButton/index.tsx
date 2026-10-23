import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Time } from "@/shared/db/schema";
import { Text } from "@/components/ui/text";
import { colors } from "@/styles/colors";

const EditarTimeButton = ({ time }: { time: Time }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex-1 bg-[#161e30] border-scout-border border border-b"
          size="sm"
        >
          <Feather name="edit-2" size={20} color={colors["dim"]} />
          <Text className="text-scout-dim"> Editar</Text>
        </Button>
      </DialogTrigger>
      {/* <EditTimeForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        time={time}
      /> */}
    </Dialog>
  );
};

export default EditarTimeButton;
