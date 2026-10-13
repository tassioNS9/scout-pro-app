import { create } from 'zustand';
import type { SkPath } from '@shopify/react-native-skia';

export type Team = 'home' | 'away' | 'ball';
export type Mode = 'move' | 'pen';
export type Tool = 'line' | 'circle' | 'rect' | 'zone';
export type Formation = '4-3-3' | '4-4-2' | '3-5-2';
export type TeamSide = 'home' | 'away';

export interface Player {
  id: string;
  /** Posição normalizada (0..1) relativa à largura total do campo */
  x: number;
  /** Posição normalizada (0..1) relativa à altura total do campo */
  y: number;
  team: Team;
  number: number;
}

export interface DrawnPath {
  id: string;
  path: SkPath;
  color: string;
  strokeWidth: number;
  kind: Tool;
  /** Se true, além do contorno, o desenho recebe preenchimento translúcido */
  filled: boolean;
}

/** Campo FIFA 68x105 m + 3 m de margem em cada lado => 74x111 m */
export const PITCH_ASPECT = 74 / 111;
const MARGIN_X = 3 / 74;
const MARGIN_Y = 3 / 111;
export const STROKE_WIDTH = 4;

export const PEN_COLORS = {
  red: '#EF4444',
  yellow: '#FACC15',
  white: '#FFFFFF',
} as const;

// Converte coordenada da "área de jogo" (0..1) para coordenada do canvas total (0..1)
const toCanvasX = (nx: number) => MARGIN_X + nx * (1 - 2 * MARGIN_X);
const toCanvasY = (ny: number) => MARGIN_Y + ny * (1 - 2 * MARGIN_Y);

/* -------------------------------------------------------------------------- */
/*  Formações                                                                 */
/*  Cada slot: [número da camisa, x, y] na área de jogo (0..1).               */
/*  O time da casa ataca para cima (gol no fundo da tela).                    */
/*  O visitante é o mesmo desenho rotacionado 180°.                           */
/*  Os números 1..11 são únicos por formação => ids estáveis (home-1..11).    */
/* -------------------------------------------------------------------------- */
type Slot = [number, number, number];

export const FORMATIONS: Record<Formation, Slot[]> = {
  '4-3-3': [
    [1, 0.5, 0.94],
    [3, 0.14, 0.8], [4, 0.38, 0.8], [5, 0.62, 0.8], [2, 0.86, 0.8],
    [8, 0.27, 0.68], [6, 0.5, 0.68], [10, 0.73, 0.68],
    [11, 0.2, 0.57], [9, 0.5, 0.57], [7, 0.8, 0.57],
  ],
  '4-4-2': [
    [1, 0.5, 0.94],
    [3, 0.14, 0.8], [4, 0.38, 0.8], [5, 0.62, 0.8], [2, 0.86, 0.8],
    [11, 0.14, 0.67], [6, 0.38, 0.67], [8, 0.62, 0.67], [7, 0.86, 0.67],
    [9, 0.35, 0.56], [10, 0.65, 0.56],
  ],
  '3-5-2': [
    [1, 0.5, 0.94],
    [3, 0.22, 0.8], [4, 0.5, 0.8], [5, 0.78, 0.8],
    [6, 0.1, 0.66], [8, 0.3, 0.69], [10, 0.5, 0.7], [7, 0.7, 0.69], [2, 0.9, 0.66],
    [9, 0.35, 0.56], [11, 0.65, 0.56],
  ],
};

export const FORMATION_LIST = Object.keys(FORMATIONS) as Formation[];

/** Monta os 11 jogadores de UM time na formação escolhida */
export function buildTeam(team: TeamSide, formation: Formation): Player[] {
  const flip = team === 'away';
  return FORMATIONS[formation].map(([number, nx, ny]) => ({
    id: `${team}-${number}`,
    team,
    number,
    x: toCanvasX(flip ? 1 - nx : nx),
    y: toCanvasY(flip ? 1 - ny : ny),
  }));
}

/** Monta os dois times (cada um com sua formação) + bola por último (fica por cima) */
export function buildPlayers(home: Formation, away: Formation): Player[] {
  return [
    ...buildTeam('home', home),
    ...buildTeam('away', away),
    { id: 'ball', team: 'ball', number: 0, x: 0.5, y: 0.5 },
  ];
}

interface TacticalState {
  players: Player[];
  paths: DrawnPath[];
  mode: Mode;
  tool: Tool;
  /** Formação independente para cada time */
  formations: Record<TeamSide, Formation>;
  penColor: string;
  arrowMode: boolean;
  fillShapes: boolean;

  setMode: (mode: Mode) => void;
  setTool: (tool: Tool) => void;
  setPenColor: (color: string) => void;
  toggleArrowMode: () => void;
  toggleFillShapes: () => void;

  addPath: (path: DrawnPath) => void;
  undoPath: () => void;
  clearPaths: () => void;
  updatePlayerPosition: (id: string, x: number, y: number) => void;
  /** Troca a formação de UM time: reposiciona só os 11 dele; o outro time e a bola não mudam */
  setFormation: (team: TeamSide, formation: Formation) => void;
  /** Volta todos (inclusive a bola) para as formações atuais de cada time */
  resetPlayers: () => void;
}

export const useTacticalStore = create<TacticalState>()((set) => ({
  players: buildPlayers('4-3-3', '4-3-3'),
  paths: [],
  mode: 'move',
  tool: 'line',
  formations: { home: '4-3-3', away: '4-3-3' },
  penColor: PEN_COLORS.red,
  arrowMode: true,
  fillShapes: false,

  setMode: (mode) => set({ mode }),
  setTool: (tool) => set({ tool }),
  setPenColor: (penColor) => set({ penColor }),
  toggleArrowMode: () => set((s) => ({ arrowMode: !s.arrowMode })),
  toggleFillShapes: () => set((s) => ({ fillShapes: !s.fillShapes })),

  addPath: (path) => set((s) => ({ paths: [...s.paths, path] })),
  undoPath: () => set((s) => ({ paths: s.paths.slice(0, -1) })),
  clearPaths: () => set({ paths: [] }),

  updatePlayerPosition: (id, x, y) =>
    set((s) => ({
      players: s.players.map((p) => (p.id === id ? { ...p, x, y } : p)),
    })),

  setFormation: (team, formation) =>
    set((s) => {
      const next = new Map(buildTeam(team, formation).map((p) => [p.id, p]));
      return {
        formations: { ...s.formations, [team]: formation },
        players: s.players.map((p) => next.get(p.id) ?? p),
      };
    }),

  resetPlayers: () =>
    set((s) => ({ players: buildPlayers(s.formations.home, s.formations.away) })),
}));
