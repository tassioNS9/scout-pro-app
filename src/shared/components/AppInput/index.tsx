import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { useRef, useState } from "react";
import { clsx } from "clsx";
import { ErrorMessage } from "../ErrorMessage";

interface AppInputParams<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export const AppInput = <T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: AppInputParams<T>) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const checkFocus = () => {
    if (inputRef.current) {
      setIsFocused(inputRef.current.isFocused());
    }
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <View className="w-full mt-4">
            {label && (
              <Text className={clsx("mb-2 mt-3 text-base text-scout-muted")}>
                {label}
              </Text>
            )}

            <TouchableOpacity className="flex-row items-center justify-between border-b border-gray-600 px-3 py-2 h-16">
              <TextInput
                value={value}
                onChangeText={onChange}
                {...rest}
                placeholderTextColor={colors.gray["300"]}
                className="flex-1 text-base  text-white"
                onFocus={checkFocus}
                onEndEditing={checkFocus}
                ref={inputRef}
              />
            </TouchableOpacity>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
          </View>
        );
      }}
    />
  );
};
