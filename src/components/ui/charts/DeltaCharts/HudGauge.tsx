"use client";

import { useThemeColors } from "@/context/ThemeContext";
import { Panel } from "@/components/ui/Panel";
import styles from "./DeltaCharts.module.css";

/* ── Types ── */

export interface HudGaugeProps {
  /** 0–100 value */
  value: number;
  /** Colour of the filled segments — default HUD_PALETTE[0] */
  color?: string;
  /** Label shown underneath the value */
  label?: string;
  /** Size in px — default 160 */
  size?: number;
  /** Title above the gauge */
  title?: string;
}

/* ── Helpers ── */

const SEG_COUNT = 60; // total segments around the ring
const GAP_DEG = 1.5; // gap between segments in degrees
const SEG_DEG = 360 / SEG_COUNT - GAP_DEG;
const TRACK_R_OUTER = 0.46; // as fraction of size
const TRACK_R_INNER = 0.38;
const RING_R = 0.48; // outer tick ring radius

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Math.round((cx + r * Math.cos(rad)) * 1e4) / 1e4,
    y: Math.round((cy + r * Math.sin(rad)) * 1e4) / 1e4,
  };
}

function segPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  sweep: number,
) {
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

/* ── Component ── */

export function HudGauge({
  value,
  color: colorProp,
  label,
  size = 160,
  title,
}: HudGaugeProps) {
  const { accent } = useThemeColors();
  const color = colorProp ?? accent;
  const clamped = Math.max(0, Math.min(100, value));
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * TRACK_R_OUTER;
  const rInner = size * TRACK_R_INNER;
  const ringR = size * RING_R;

  // How many segments are lit
  const litCount = Math.round((clamped / 100) * SEG_COUNT);

  // Outer thin ring tick marks
  const TICK_COUNT = 72;
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const deg = (i / TICK_COUNT) * 360;
    const rad = ((deg - 90) * Math.PI) / 180;
    const oR = ringR + 4;
    const iR = i % 6 === 0 ? oR - 7 : oR - 3;
    return {
      x1: Math.round((cx + iR * Math.cos(rad)) * 1e4) / 1e4,
      y1: Math.round((cy + iR * Math.sin(rad)) * 1e4) / 1e4,
      x2: Math.round((cx + oR * Math.cos(rad)) * 1e4) / 1e4,
      y2: Math.round((cy + oR * Math.sin(rad)) * 1e4) / 1e4,
      major: i % 6 === 0,
    };
  });

  const filterId = `segGlow-${(label ?? "g").replace(/\s/g, "")}`;

  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <div className={styles.gaugeWrap} style={{ width: size, height: size }}>
          <svg
            className={styles.tickRing}
            viewBox={`0 0 ${size} ${size}`}
            aria-label={`${clamped}% ${label ?? ""}`}
          >
            <defs>
              <filter
                id={filterId}
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur
                  stdDeviation="3"
                  in="SourceGraphic"
                  result="blur"
                />
                <feFlood floodColor={color} floodOpacity="0.6" result="color" />
                <feComposite
                  in="color"
                  in2="blur"
                  operator="in"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer subtle ring */}
            <circle
              cx={cx}
              cy={cy}
              r={ringR + 1}
              fill="none"
              stroke="rgba(148,163,184,0.1)"
              strokeWidth={1}
            />

            {/* Tick marks */}
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={
                  t.major ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.12)"
                }
                strokeWidth={t.major ? 1.5 : 0.75}
              />
            ))}

            {/* Segments */}
            {Array.from({ length: SEG_COUNT }, (_, i) => {
              const startDeg = i * (SEG_DEG + GAP_DEG);
              const lit = i < litCount;
              return (
                <path
                  key={i}
                  d={segPath(cx, cy, rOuter, rInner, startDeg, SEG_DEG)}
                  fill={lit ? color : "rgba(var(--color-primary-rgb), 0.06)"}
                  fillOpacity={lit ? 0.9 : 1}
                  filter={lit ? `url(#${filterId})` : undefined}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className={styles.gaugeCenter}>
            <span className={styles.gaugeValue} style={{ color }}>
              {clamped}%
            </span>
            {label && <span className={styles.gaugeLabel}>{label}</span>}
          </div>
        </div>
      </div>
    </Panel>
  );
}
