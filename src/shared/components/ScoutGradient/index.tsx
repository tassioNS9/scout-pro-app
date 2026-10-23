// src/components/ScoutGradient.tsx
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
// permite usar className no LinearGradient
cssInterop(LinearGradient, { className: "style" });

type Props = React.ComponentProps<typeof LinearGradient>;

export function ScoutGradient({ children, ...props }: Props) {
  return (
    <LinearGradient
      {...props}

      // aproxima o 160deg do CSS (de cima para baixo, levemente para a direita)
      start={{ x: 0, y: 0 }}
      end={{ x: 0.36, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
