import React, { memo, useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Line,
  Path,
  Rect,
  Skia,
} from "@shopify/react-native-skia";
import type { SkPath } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { STROKE_WIDTH, useTacticalStore } from "../store/useTacticalStore";
import type { Tool } from "../store/useTacticalStore";

interface Props {
  width: number;
  height: number;
}

/* -------------------------------------------------------------------------- */
/*  CAMADA 1 — Campo vetorial (renderizado uma única vez por tamanho)         */
/* -------------------------------------------------------------------------- */
const LINE_COLOR = "rgba(255,255,255,0.92)";

const PitchField = memo(function PitchField({ width, height }: Props) {
  const s = width / 74; // px por metro
  const pad = 3 * s;
  const X = (m: number) => pad + m * s;
  const Y = (m: number) => pad + m * s;
  const lw = Math.max(1.5, s * 0.28);

  const lines = useMemo(() => {
    const builder = Skia.PathBuilder.Make();
    const R = (x: number, y: number, w: number, h: number) =>
      Skia.XYWHRect(X(x), Y(y), w * s, h * s);

    builder.addRect(R(0, 0, 68, 105)); // linhas laterais e de fundo
    builder.addRect(R(13.84, 0, 40.32, 16.5)); // grande área (topo)
    builder.addRect(R(13.84, 88.5, 40.32, 16.5)); // grande área (base)
    builder.addRect(R(24.84, 0, 18.32, 5.5)); // pequena área (topo)
    builder.addRect(R(24.84, 99.5, 18.32, 5.5)); // pequena área (base)

    // Meias-luas da grande área (raio 9,15 m a partir da marca do pênalti)
    const r = 9.15 * s;
    builder.addArc(
      Skia.XYWHRect(X(34) - r, Y(11) - r, 2 * r, 2 * r),
      36.87,
      106.26,
    );
    builder.addArc(
      Skia.XYWHRect(X(34) - r, Y(94) - r, 2 * r, 2 * r),
      216.87,
      106.26,
    );

    // Escanteios (raio 1 m)
    const c = s;
    const corner = (mx: number, my: number, start: number) =>
      builder.addArc(
        Skia.XYWHRect(X(mx) - c, Y(my) - c, 2 * c, 2 * c),
        start,
        90,
      );
    corner(0, 0, 0);
    corner(68, 0, 90);
    corner(68, 105, 180);
    corner(0, 105, 270);

    return builder.build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  const stripes = useMemo(() => {
    const n = 12;
    const h = height / n;
    return Array.from({ length: n }, (_, i) => ({
      y: i * h,
      h: h + 0.5,
      dark: i % 2 === 0,
    }));
  }, [height]);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {stripes.map((st, i) => (
        <Rect
          key={i}
          x={0}
          y={st.y}
          width={width}
          height={st.h}
          color={st.dark ? "#14532D" : "#166534"}
        />
      ))}

      <Path path={lines} style="stroke" strokeWidth={lw} color={LINE_COLOR} />

      {/* Linha do meio-campo */}
      <Line
        p1={{ x: X(0), y: Y(52.5) }}
        p2={{ x: X(68), y: Y(52.5) }}
        strokeWidth={lw}
        color={LINE_COLOR}
      />
      {/* Círculo central + ponto central */}
      <Circle
        cx={X(34)}
        cy={Y(52.5)}
        r={9.15 * s}
        style="stroke"
        strokeWidth={lw}
        color={LINE_COLOR}
      />
      <Circle
        cx={X(34)}
        cy={Y(52.5)}
        r={Math.max(2, 0.4 * s)}
        color={LINE_COLOR}
      />
      {/* Marcas de pênalti */}
      <Circle
        cx={X(34)}
        cy={Y(11)}
        r={Math.max(2, 0.4 * s)}
        color={LINE_COLOR}
      />
      <Circle
        cx={X(34)}
        cy={Y(94)}
        r={Math.max(2, 0.4 * s)}
        color={LINE_COLOR}
      />
    </Canvas>
  );
});

/* -------------------------------------------------------------------------- */
/*  CAMADA 2 — Canvas de riscos + gesto da caneta (linha, círculo, retângulo, */
/*  zona livre)                                                               */
/* -------------------------------------------------------------------------- */
const FILL_OPACITY = 0.28;

function TacticalPitch({ width, height }: Props) {
  const mode = useTacticalStore((s) => s.mode);
  const tool = useTacticalStore((s) => s.tool);
  const penColor = useTacticalStore((s) => s.penColor);
  const arrowMode = useTacticalStore((s) => s.arrowMode);
  const fillShapes = useTacticalStore((s) => s.fillShapes);
  const paths = useTacticalStore((s) => s.paths);
  const addPath = useTacticalStore((s) => s.addPath);

  // Traço em andamento: tudo na UI thread, zero re-render do React
  const livePath = useSharedValue(Skia.PathBuilder.Make());
  const liveColor = useSharedValue(penColor);
  const liveFill = useSharedValue(0); // opacidade do preenchimento da prévia
  const toolSV = useSharedValue<Tool>(tool);
  const arrowOn = useSharedValue(arrowMode);
  const fillOn = useSharedValue(fillShapes);
  const drawing = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);
  const anchorX = useSharedValue(0);
  const anchorY = useSharedValue(0);
  const angle = useSharedValue(0);
  const angleSet = useSharedValue(false);

  // Deriva o SkPath imutável a partir do PathBuilder para renderização em tempo real
  const livePathDerived = useDerivedValue(() => livePath.value.build());

  useEffect(() => {
    liveColor.value = penColor;
  }, [penColor, liveColor]);
  useEffect(() => {
    toolSV.value = tool;
  }, [tool, toolSV]);
  useEffect(() => {
    arrowOn.value = arrowMode;
  }, [arrowMode, arrowOn]);
  useEffect(() => {
    fillOn.value = fillShapes;
  }, [fillShapes, fillOn]);

  // Persiste o desenho finalizado na store (JS thread, uma vez por gesto)
  const commitShape = useCallback(
    (
      t: Tool,
      svg: string,
      sx: number,
      sy: number,
      ex: number,
      ey: number,
      withArrow: boolean,
      ang: number,
    ) => {
      const st = useTacticalStore.getState();
      let path: SkPath | null = null;
      let filled = false;

      if (t === "circle") {
        const r = Math.hypot(ex - sx, ey - sy);
        if (r < 4) return; // simples toque: ignora
        path = Skia.Path.Circle(sx, sy, r);
        filled = st.fillShapes;
      } else if (t === "rect") {
        const w = Math.abs(ex - sx);
        const h = Math.abs(ey - sy);
        if (w < 4 && h < 4) return;
        path = Skia.Path.Rect(
          Skia.XYWHRect(Math.min(sx, ex), Math.min(sy, ey), w, h),
        );
        filled = st.fillShapes;
      } else {
        const base = Skia.Path.MakeFromSVGString(svg);
        if (!base) return;
        if (t === "zone") {
          base.close(); // fecha o contorno automaticamente
          filled = true;
        } else if (withArrow) {
          const builder = Skia.PathBuilder.MakeFromPath(base);
          const L = 16;
          const spread = 0.45; // ~26°
          builder.moveTo(ex, ey);
          builder.lineTo(
            ex + L * Math.cos(ang + Math.PI - spread),
            ey + L * Math.sin(ang + Math.PI - spread),
          );
          builder.moveTo(ex, ey);
          builder.lineTo(
            ex + L * Math.cos(ang + Math.PI + spread),
            ey + L * Math.sin(ang + Math.PI + spread),
          );
          path = builder.build();
        } else {
          path = base;
        }
      }
      if (!path) return;
      addPath({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        path,
        color: st.penColor,
        strokeWidth: STROKE_WIDTH,
        kind: t,
        filled,
      });
    },
    [addPath],
  );

  const drawGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(mode === "pen")
        .maxPointers(1)
        .minDistance(0)
        .onBegin((e) => {
          const t = toolSV.value;
          drawing.value = true;
          angleSet.value = false;
          startX.value = e.x;
          startY.value = e.y;
          lastX.value = e.x;
          lastY.value = e.y;
          anchorX.value = e.x;
          anchorY.value = e.y;
          liveFill.value =
            t === "zone" || (t !== "line" && fillOn.value) ? FILL_OPACITY : 0;

          if (t === "line" || t === "zone") {
            livePath.modify((p) => {
              "worklet";
              p.moveTo(e.x, e.y);
              p.lineTo(e.x + 0.01, e.y); // ponto visível em um simples toque
              return p;
            });
          }
        })
        .onUpdate((e) => {
          const t = toolSV.value;
          const sx = startX.value;
          const sy = startY.value;

          if (t === "circle") {
            const r = Math.hypot(e.x - sx, e.y - sy);
            livePath.modify((p) => {
              "worklet";
              p.reset();
              p.addCircle(sx, sy, r); // centro = ponto inicial, raio = arrasto
              return p;
            });
            lastX.value = e.x;
            lastY.value = e.y;
            return;
          }

          if (t === "rect") {
            const ex = e.x;
            const ey = e.y;
            livePath.modify((p) => {
              "worklet";
              p.reset();
              p.addRect({
                x: Math.min(sx, ex),
                y: Math.min(sy, ey),
                width: Math.abs(ex - sx),
                height: Math.abs(ey - sy),
              });
              return p;
            });
            lastX.value = ex;
            lastY.value = ey;
            return;
          }

          // 'line' e 'zone': traço à mão livre suavizado
          const dx = e.x - lastX.value;
          const dy = e.y - lastY.value;
          if (dx * dx + dy * dy < 4) return; // ignora ruído < 2px

          const lx = lastX.value;
          const ly = lastY.value;
          const mx = (lx + e.x) / 2;
          const my = (ly + e.y) / 2;
          livePath.modify((p) => {
            "worklet";
            p.quadTo(lx, ly, mx, my);
            return p;
          });
          lastX.value = e.x;
          lastY.value = e.y;

          // Direção estável da seta: vetor entre âncoras distantes ≥ 12px
          const ax = e.x - anchorX.value;
          const ay = e.y - anchorY.value;
          if (ax * ax + ay * ay >= 144) {
            angle.value = Math.atan2(ay, ax);
            angleSet.value = true;
            anchorX.value = e.x;
            anchorY.value = e.y;
          }
        })
        .onFinalize(() => {
          if (!drawing.value) return;
          drawing.value = false;

          const t = toolSV.value;
          const svg =
            t === "line" || t === "zone"
              ? livePath.value.build().toSVGString()
              : "";
          livePath.modify((p) => {
            "worklet";
            p.reset();
            return p;
          });
          liveFill.value = 0;

          runOnJS(commitShape)(
            t,
            svg,
            startX.value,
            startY.value,
            lastX.value,
            lastY.value,
            t === "line" && arrowOn.value && angleSet.value,
            angle.value,
          );
        }),
    [
      mode,
      commitShape,
      livePath,
      liveFill,
      toolSV,
      arrowOn,
      fillOn,
      drawing,
      angleSet,
      startX,
      startY,
      lastX,
      lastY,
      anchorX,
      anchorY,
      angle,
    ],
  );

  return (
    <View style={{ width, height }}>
      <PitchField width={width} height={height} />

      <GestureDetector gesture={drawGesture}>
        <View style={StyleSheet.absoluteFill} collapsable={false}>
          <Canvas style={StyleSheet.absoluteFill}>
            {paths.map((p) => (
              <Group key={p.id}>
                {p.filled && (
                  <Path
                    path={p.path}
                    style="fill"
                    color={p.color}
                    opacity={FILL_OPACITY}
                  />
                )}
                <Path
                  path={p.path}
                  style="stroke"
                  color={p.color}
                  strokeWidth={p.strokeWidth}
                  strokeCap="round"
                  strokeJoin="round"
                />
              </Group>
            ))}

            {/* Prévia em tempo real (preenchimento + contorno) */}
            <Path
              path={livePathDerived}
              style="fill"
              color={liveColor}
              opacity={liveFill}
            />
            <Path
              path={livePathDerived}
              style="stroke"
              color={liveColor}
              strokeWidth={STROKE_WIDTH}
              strokeCap="round"
              strokeJoin="round"
            />
          </Canvas>
        </View>
      </GestureDetector>
    </View>
  );
}

export default memo(TacticalPitch);
