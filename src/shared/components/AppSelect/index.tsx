import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, View } from "react-native";
import { clsx } from "clsx";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage } from "../ErrorMessage";

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
}

export const AppSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione",
  options,
}: AppSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // converte a string do form para o objeto que o Select espera
        const selected = options.find((opt) => opt.value === value);

        return (
          <View className=" mt-4">
            {label && (
              <Text
                className={clsx(
                  "mb-2 mt-3 text-base text-scout-muted",
                  isOpen ? "text-accent-brand" : "text-gray-600",
                )}
              >
                {label}
              </Text>
            )}

            <Select
              value={selected}
              // converte o objeto selecionado de volta para string
              onValueChange={(option) => onChange(option?.value)}
              onOpenChange={setIsOpen}
            >
              <SelectTrigger className="h-12 py-2 text-white  bg-scout-card border-b rounded-sm  border-gray-600 px-3">
                <SelectValue
                  className=" text-white"
                  placeholder={placeholder}
                />
              </SelectTrigger>

              <SelectContent className="border-gray-600 bg-scout-card ">
                {options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {error && <ErrorMessage>{error.message}</ErrorMessage>}
          </View>
        );
      }}
    />
  );
};
