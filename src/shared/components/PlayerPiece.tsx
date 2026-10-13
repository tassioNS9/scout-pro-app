import React, { memo, useCallback, useEffect, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTacticalStore } from "../store/useTacticalStore";

interface Props {
  playerId: string;
  pitchWidth: number;
  pitchHeight: number;
  /** Só permite arrastar no Modo Mover */
  enabled: boolean;
}

const TEAM_STYLE = {
  home: { bg: "#2563EB", border: "#BFDBFE", text: "#FFFFFF" },
  away: { bg: "#DC2626", border: "#FECACA", text: "#FFFFFF" },
  ball: { bg: "#FFFFFF", border: "#0F172A", text: "#0F172A" },
} as const;

function PlayerPieceBase({
  playerId,
  pitchWidth,
  pitchHeight,
  enabled,
}: Props) {
  // Selector estável: só re-renderiza esta peça quando ELA muda (ao soltar / resetar).
  const player = useTacticalStore((s) =>
    s.players.find((p) => p.id === playerId),
  )!;
  const updatePlayerPosition = useTacticalStore((s) => s.updatePlayerPosition);

  const isBall = player.team === "ball";
  const size = Math.max(
    isBall ? 20 : 30,
    Math.round(pitchWidth * (isBall ? 0.055 : 0.088)),
  );
  const colors = TEAM_STYLE[player.team];

  // Posição do CENTRO da peça em pixels — vive na UI thread
  const cx = useSharedValue(player.x * pitchWidth);
  const cy = useSharedValue(player.y * pitchHeight);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const active = useSharedValue(0);

  // Sincroniza com a store (reset de formação, rotação de tela, etc.)
  useEffect(() => {
    cx.value = withSpring(player.x * pitchWidth, {
      damping: 18,
      stiffness: 160,
    });
    cy.value = withSpring(player.y * pitchHeight, {
      damping: 18,
      stiffness: 160,
    });
  }, [player.x, player.y, pitchWidth, pitchHeight, cx, cy]);

  const commit = useCallback(
    (nx: number, ny: number) => updatePlayerPosition(playerId, nx, ny),
    [playerId, updatePlayerPosition],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .minDistance(0)
        .hitSlop(8)
        .onBegin(() => {
          cancelAnimation(cx);
          cancelAnimation(cy);
          startX.value = cx.value;
          startY.value = cy.value;
          active.value = withSpring(1);
        })
        .onUpdate((e) => {
          cx.value = Math.min(
            pitchWidth,
            Math.max(0, startX.value + e.translationX),
          );
          cy.value = Math.min(
            pitchHeight,
            Math.max(0, startY.value + e.translationY),
          );
        })
        .onEnd((_e, success) => {
          if (success)
            runOnJS(commit)(cx.value / pitchWidth, cy.value / pitchHeight);
        })
        .onFinalize(() => {
          active.value = withSpring(0);
        }),
    [enabled, pitchWidth, pitchHeight, commit, cx, cy, startX, startY, active],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: cx.value - size / 2 },
      { translateY: cy.value - size / 2 },
      { scale: 1 + 0.2 * active.value },
    ],
    zIndex: active.value > 0.01 ? 100 : 1,
    shadowOpacity: 0.25 + 0.3 * active.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.piece,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: isBall ? size * 0.7 : size * 0.45,
            fontWeight: "800",
            includeFontPadding: false,
          }}
        >
          {isBall ? "⚽" : player.number}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
});

export default memo(PlayerPieceBase);
