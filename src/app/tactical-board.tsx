import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import TacticalPitch from "../shared/components/TacticalPitch";
import PlayerPiece from "../shared/components/PlayerPiece";
import FloatingControls from "../shared/components/FloatingControls";
import {
  PITCH_ASPECT,
  useTacticalStore,
} from "../shared/store/useTacticalStore";

export default function TacticalBoardScreen() {
  const [area, setArea] = useState({ w: 0, h: 0 });

  const mode = useTacticalStore((s) => s.mode);
  // IDs nunca mudam => a tela não re-renderiza durante/depois do arraste
  const playerIds = useTacticalStore(
    useShallow((s) => s.players.map((p) => p.id)),
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea({ w: width, h: height });
  };

  // Campo ocupa o MÁXIMO possível da tela (sem header, sem margens),
  // mantendo a proporção oficial.
  let pitchW = 0;
  let pitchH = 0;
  if (area.w > 0 && area.h > 0) {
    if (area.w / area.h > PITCH_ASPECT) {
      pitchH = Math.floor(area.h);
      pitchW = Math.floor(pitchH * PITCH_ASPECT);
    } else {
      pitchW = Math.floor(area.w);
      pitchH = Math.floor(pitchW / PITCH_ASPECT);
    }
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView
        style={styles.root}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.root} onLayout={onLayout}>
          {/* Prancheta centralizada, de borda a borda */}
          <View style={styles.center} pointerEvents="box-none">
            {pitchW > 0 && (
              <View style={{ width: pitchW, height: pitchH }}>
                {/* Camadas 1 + 2: campo (Skia) e riscos (Skia) */}
                <TacticalPitch width={pitchW} height={pitchH} />

                {/* Camada 3: jogadores. No modo caneta, os toques passam direto para o desenho */}
                <View
                  pointerEvents={mode === "move" ? "box-none" : "none"}
                  style={StyleSheet.absoluteFill}
                >
                  {playerIds.map((id) => (
                    <PlayerPiece
                      key={id}
                      playerId={id}
                      pitchWidth={pitchW}
                      pitchHeight={pitchH}
                      enabled={mode === "move"}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Controles flutuantes nos cantos (popovers) */}
          <FloatingControls />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020617" },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    // Campo + peças ficam na camada base; os controles flutuantes ficam acima
    zIndex: 0,
    elevation: 0,
  },
});
