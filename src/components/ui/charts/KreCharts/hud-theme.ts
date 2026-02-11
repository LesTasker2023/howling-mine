/**
 * HUD Chart Theme — shared palette, glow defs, and helpers for sci-fi charts.
 *
 * Every chart component in this folder wraps Recharts with a consistent
 * dark-panel, neon-glow aesthetic inspired by tactical HUD UI kits.
 */

/* ── Neon palette — ordered for visual separation ── */
export const HUD_PALETTE = [
  "#22d3ee", // cyan
  "#f472b6", // pink / magenta
  "#3b82f6", // primary blue
  "#a78bfa", // violet
  "#34d399", // emerald
  "#facc15", // gold
  "#fb923c", // amber
  "#e2e8f0", // silver
] as const;

/* ── Semantic pairs (bar chart duos) ── */
export const HUD_DUO = {
  a: "#22d3ee",
  b: "#f472b6",
} as const;

/* ── Background / surface colours matching tokens.css ── */
export const HUD_BG = {
  base: "#060a13",
  surface: "#0a1020",
  panel: "rgba(10, 16, 32, 0.85)",
  elevated: "#0f1a2e",
  grid: "rgba(59, 130, 246, 0.06)",
  gridStrong: "rgba(59, 130, 246, 0.12)",
} as const;

/* ── Text ── */
export const HUD_TEXT = {
  primary: "#e2e8f0",
  secondary: "#94a3b8",
  muted: "#475569",
} as const;

/* ── Shared axis / grid style applied to Recharts props ── */
export const HUD_AXIS = {
  tick: {
    fill: "#94a3b8",
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
  },
  axisLine: { stroke: "rgba(59, 130, 246, 0.15)" },
  tickLine: false as const,
};

export const HUD_GRID = {
  stroke: "rgba(59, 130, 246, 0.08)",
  strokeDasharray: "3 3",
};

export const HUD_TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(10, 16, 32, 0.95)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    borderRadius: 4,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "#e2e8f0",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)",
  },
  cursor: { fill: "rgba(59, 130, 246, 0.06)" },
  itemStyle: { color: "#e2e8f0" },
  labelStyle: {
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
};

/** Build an SVG filter for a neon glow used in <defs>. */
export function glowFilterId(color: string): string {
  return `glow-${color.replace("#", "")}`;
}
