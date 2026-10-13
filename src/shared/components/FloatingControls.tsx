import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FORMATION_LIST,
  PEN_COLORS,
  useTacticalStore,
} from "../store/useTacticalStore";
import type { TeamSide, Tool } from "../store/useTacticalStore";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type Panel = "tools" | "formations" | "menu" | null;

const TOOL_ICONS: Record<Tool, IconName> = {
  line: "pencil",
  circle: "circle-outline",
  rect: "rectangle-outline",
  zone: "vector-polygon",
};

const TOOLS: { tool: Tool; label: string }[] = [
  { tool: "line", label: "Linha" },
  { tool: "circle", label: "Círculo" },
  { tool: "rect", label: "Retângulo" },
  { tool: "zone", label: "Zona livre" },
];

const SWATCHES = [
  { color: PEN_COLORS.red, bg: "bg-red-500", label: "Vermelho" },
  { color: PEN_COLORS.yellow, bg: "bg-yellow-400", label: "Amarelo" },
  { color: PEN_COLORS.white, bg: "bg-white", label: "Branco" },
];

/* ------------------------------ Blocos de UI ------------------------------ */

/** Botão circular flutuante (semitransparente para não "esconder" o campo) */
function RoundButton({
  icon,
  onPress,
  active,
  disabled,
  badgeColor,
  label,
}: {
  icon: IconName;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  badgeColor?: string;
  label: string;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      className={`w-12 h-12 rounded-full items-center justify-center border active:opacity-70 ${
        active
          ? "bg-emerald-500 border-emerald-300"
          : "bg-slate-900/85 border-slate-600"
      } ${disabled ? "opacity-40" : ""}`}
    >
      <MaterialCommunityIcons name={icon} size={24} color="#fff" />
      {badgeColor && (
        <View
          className="absolute top-0 right-0 w-4 h-4 rounded-full border border-white"
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </Pressable>
  );
}

/** Cartão do popover, com fade ao abrir/fechar */
function Popover({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  return (
    <Animated.View
      entering={FadeIn.duration(120)}
      exiting={FadeOut.duration(90)}
      style={[styles.popover, { width: Math.min(300, width - 16) }]}
    >
      {children}
    </Animated.View>
  );
}

function ToolChip({
  icon,
  label,
  active,
  onPress,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 82 }}
      className={`items-center py-2 rounded-xl active:opacity-70 ${
        active ? "bg-emerald-500" : "bg-slate-700"
      }`}
    >
      <MaterialCommunityIcons name={icon} size={22} color="#fff" />
      <Text className="text-white text-xs font-semibold mt-1">{label}</Text>
    </Pressable>
  );
}

function TextChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-2 rounded-lg active:opacity-70 ${active ? "bg-emerald-500" : "bg-slate-700"}`}
    >
      <Text className="text-white text-sm font-semibold">{label}</Text>
    </Pressable>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
  disabled,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center gap-3 px-3 py-3 rounded-xl active:opacity-70 ${
        danger ? "bg-red-600" : "bg-slate-700"
      } ${disabled ? "opacity-40" : ""}`}
    >
      <MaterialCommunityIcons name={icon} size={20} color="#fff" />
      <Text className="text-white text-sm font-semibold">{label}</Text>
    </Pressable>
  );
}

function FormationRow({ team, label }: { team: TeamSide; label: string }) {
  const current = useTacticalStore((s) => s.formations[team]);
  const setFormation = useTacticalStore((s) => s.setFormation);
  const dot = team === "home" ? "bg-blue-600" : "bg-red-600";
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <View className={`w-3 h-3 rounded-full ${dot}`} />
        <Text className="text-slate-300 text-sm font-medium">{label}</Text>
      </View>
      <View className="flex-row gap-2">
        {FORMATION_LIST.map((f) => (
          <TextChip
            key={f}
            label={f}
            active={current === f}
            onPress={() => setFormation(team, f)}
          />
        ))}
      </View>
    </View>
  );
}

/* ------------------------------ Overlay principal ------------------------- */
export default function FloatingControls() {
  const [panel, setPanel] = useState<Panel>(null);
  const toggle = (p: Exclude<Panel, null>) =>
    setPanel((cur) => (cur === p ? null : p));
  const close = () => setPanel(null);

  const mode = useTacticalStore((s) => s.mode);
  const tool = useTacticalStore((s) => s.tool);
  const penColor = useTacticalStore((s) => s.penColor);
  const arrowMode = useTacticalStore((s) => s.arrowMode);
  const fillShapes = useTacticalStore((s) => s.fillShapes);
  const homeF = useTacticalStore((s) => s.formations.home);
  const awayF = useTacticalStore((s) => s.formations.away);
  const pathCount = useTacticalStore((s) => s.paths.length);
  const setMode = useTacticalStore((s) => s.setMode);
  const setTool = useTacticalStore((s) => s.setTool);
  const setPenColor = useTacticalStore((s) => s.setPenColor);
  const toggleArrowMode = useTacticalStore((s) => s.toggleArrowMode);
  const toggleFillShapes = useTacticalStore((s) => s.toggleFillShapes);
  const undoPath = useTacticalStore((s) => s.undoPath);
  const clearPaths = useTacticalStore((s) => s.clearPaths);
  const resetPlayers = useTacticalStore((s) => s.resetPlayers);

  const isShapeTool = tool === "circle" || tool === "rect";
  const activeIcon: IconName =
    mode === "move" ? "cursor-move" : TOOL_ICONS[tool];

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, styles.overlay]}
    >
      {/* Toque fora do popover => fecha */}
      {panel !== null && (
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      )}

      {/* ───────── Topo esquerdo: Ferramentas ───────── */}
      <View
        pointerEvents="box-none"
        style={styles.layer}
        className="absolute top-0 left-2 items-start gap-2"
      >
        <RoundButton
          label="Ferramentas"
          icon={activeIcon}
          active={panel === "tools"}
          badgeColor={mode === "pen" ? penColor : undefined}
          onPress={() => toggle("tools")}
        />
        {panel === "tools" && (
          <Popover>
            <View className="flex-row flex-wrap gap-2">
              <ToolChip
                icon="cursor-move"
                label="Mover"
                active={mode === "move"}
                onPress={() => {
                  setMode("move");
                  close();
                }}
              />
              {TOOLS.map((t) => (
                <ToolChip
                  key={t.tool}
                  icon={TOOL_ICONS[t.tool]}
                  label={t.label}
                  active={mode === "pen" && tool === t.tool}
                  onPress={() => {
                    setTool(t.tool);
                    setMode("pen");
                    close();
                  }}
                />
              ))}
            </View>

            <View className="h-px bg-slate-700" />

            <View className="flex-row items-center flex-wrap gap-3">
              {SWATCHES.map((sw) => (
                <Pressable
                  key={sw.color}
                  accessibilityLabel={sw.label}
                  onPress={() => {
                    setPenColor(sw.color);
                    setMode("pen");
                    close();
                  }}
                  className={`w-9 h-9 rounded-full border-2 ${sw.bg} ${
                    penColor === sw.color
                      ? "border-emerald-400"
                      : "border-slate-600"
                  }`}
                />
              ))}
              {tool === "line" && (
                <TextChip
                  label="Seta"
                  active={arrowMode}
                  onPress={toggleArrowMode}
                />
              )}
              {isShapeTool && (
                <TextChip
                  label="Preencher"
                  active={fillShapes}
                  onPress={toggleFillShapes}
                />
              )}
            </View>
          </Popover>
        )}
      </View>

      {/* ───────── Topo direito: Formações ───────── */}
      <View
        pointerEvents="box-none"
        style={styles.layer}
        className="absolute top-0 right-2 items-end gap-2"
      >
        <Pressable
          accessibilityLabel="Formações"
          onPress={() => toggle("formations")}
          className={`flex-row items-center gap-2 px-4 h-12 rounded-full border active:opacity-70 ${
            panel === "formations"
              ? "bg-emerald-500 border-emerald-300"
              : "bg-slate-900/85 border-slate-600"
          }`}
        >
          <View className="w-3 h-3 rounded-full bg-blue-600" />
          <Text className="text-white text-sm font-bold">{homeF}</Text>
          <View className="w-3 h-3 rounded-full bg-red-600 ml-1" />
          <Text className="text-white text-sm font-bold">{awayF}</Text>
        </Pressable>
        {panel === "formations" && (
          <Popover>
            <FormationRow team="home" label="Casa" />
            <View className="h-px bg-slate-700" />
            <FormationRow team="away" label="Visitante" />
          </Popover>
        )}
      </View>

      {/* ───────── Base esquerda: Desfazer (ação rápida) ───────── */}
      <View
        pointerEvents="box-none"
        style={styles.layer}
        className="absolute bottom-1 left-3"
      >
        <RoundButton
          label="Desfazer"
          icon="undo"
          onPress={undoPath}
          disabled={pathCount === 0}
        />
      </View>

      {/* ───────── Base direita: Menu (popover abre para cima) ───────── */}
      <View
        pointerEvents="box-none"
        style={styles.layer}
        className="absolute bottom-1 right-3 items-end gap-2"
      >
        {panel === "menu" && (
          <Popover>
            <MenuItem
              icon="delete-outline"
              label="Limpar riscos"
              danger
              disabled={pathCount === 0}
              onPress={() => {
                clearPaths();
                close();
              }}
            />
            <MenuItem
              icon="restore"
              label="Resetar formações"
              onPress={() => {
                resetPlayers();
                close();
              }}
            />
          </Popover>
        )}
        <RoundButton
          label="Mais opções"
          icon="dots-horizontal"
          active={panel === "menu"}
          onPress={() => toggle("menu")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Overlay inteiro sempre acima do campo e das peças (que usam elevation: 6)
  overlay: { zIndex: 100, elevation: 100 },
  // Cada canto (botão + popover) acima do backdrop
  layer: { zIndex: 10, elevation: 30 },
  popover: {
    backgroundColor: "rgba(15,23,42,0.97)",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
    elevation: 40,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});
