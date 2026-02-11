/**
 * HUD Chart Theme — shared palette, glow defs, and helpers for sci-fi charts.
 *
 * Every chart component in this folder wraps Recharts with a consistent
 * dark-panel, neon-glow aesthetic inspired by tactical HUD UI kits.
 */

/* ── Neon palette — ordered for visual separation ── */
export const HUD_PALETTE = [
  "#eab308", // gold
  "#f472b6", // pink / magenta
  "#f59e0b", // amber
  "#a78bfa", // violet
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#fb923c", // orange
  "#e2e8f0", // silver
] as const;

/* ── Semantic pairs (bar chart duos) ── */
export const HUD_DUO = {
  a: "#eab308",
  b: "#f472b6",
} as const;

/* ── Background / surface colours matching tokens.css ── */
export const HUD_BG = {
  base: "#0a0a08",
  surface: "#12120c",
  panel: "rgba(18, 18, 12, 0.85)",
  elevated: "#1a1a10",
  grid: "rgba(234, 179, 8, 0.06)",
  gridStrong: "rgba(234, 179, 8, 0.12)",
} as const;

/* ── Text ── */
export const HUD_TEXT = {
  primary: "#e2e8f0",
  secondary: "#a8a29e",
  muted: "#57534e",
} as const;

/* ── Shared axis / grid style applied to Recharts props ── */
export const HUD_AXIS = {
  tick: {
    fill: "#a8a29e",
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
  },
  axisLine: { stroke: "rgba(234, 179, 8, 0.15)" },
  tickLine: false as const,
};

export const HUD_GRID = {
  stroke: "rgba(234, 179, 8, 0.08)",
  strokeDasharray: "3 3",
};

export const HUD_TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(18, 18, 12, 0.95)",
    border: "1px solid rgba(234, 179, 8, 0.25)",
    borderRadius: 4,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "#e2e8f0",
    boxShadow: "0 0 20px rgba(234, 179, 8, 0.15)",
  },
  cursor: { fill: "rgba(234, 179, 8, 0.06)" },
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
