/**
 * HUD Primitives — shared SVG geometry helpers for DeltaCharts.
 *
 * Every DeltaChart component uses the same visual vocabulary:
 * - Segmented ring arcs with gaps
 * - Outer tick-mark ring (major + minor)
 * - Glow filter defs
 * - Polar coordinate helpers
 *
 * Centralised here so the aesthetic stays perfectly consistent.
 */

/* ── Polar helpers ── */

export function polarXY(
  cx: number,
  cy: number,
  r: number,
  deg: number,
): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Math.round((cx + r * Math.cos(rad)) * 1e4) / 1e4,
    y: Math.round((cy + r * Math.sin(rad)) * 1e4) / 1e4,
  };
}

/* ── Segmented ring arc path ── */

export function segPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  sweep: number,
): string {
  const s1 = polarXY(cx, cy, rOuter, startDeg);
  const e1 = polarXY(cx, cy, rOuter, startDeg + sweep);
  const s2 = polarXY(cx, cy, rInner, startDeg + sweep);
  const e2 = polarXY(cx, cy, rInner, startDeg);
  const large = sweep > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

/* ── Standard ring constants ── */

export const SEG_COUNT = 60;
export const GAP_DEG = 1.5;
export const SEG_DEG = 360 / SEG_COUNT - GAP_DEG;

/** Radius fractions (of `size`) */
export const R_OUTER = 0.46;
export const R_INNER = 0.38;
export const R_TICK = 0.48;

/* ── Tick-mark generator ── */

export interface Tick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major: boolean;
}

export function buildTicks(
  cx: number,
  cy: number,
  ringR: number,
  count = 72,
  majorEvery = 6,
): Tick[] {
  return Array.from({ length: count }, (_, i) => {
    const deg = (i / count) * 360;
    const rad = ((deg - 90) * Math.PI) / 180;
    const oR = ringR + 4;
    const iR = i % majorEvery === 0 ? oR - 7 : oR - 3;
    return {
      x1: cx + iR * Math.cos(rad),
      y1: cy + iR * Math.sin(rad),
      x2: cx + oR * Math.cos(rad),
      y2: cy + oR * Math.sin(rad),
      major: i % majorEvery === 0,
    };
  });
}

/* ── Dim segment fill ── */

export const DIM_FILL = "rgba(234, 179, 8, 0.06)";
