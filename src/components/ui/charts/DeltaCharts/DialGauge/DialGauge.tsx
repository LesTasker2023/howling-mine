"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useThemeColors } from "@/context/ThemeContext";
import { polarXY } from "../hud-primitives";
import styles from "../DeltaCharts.module.css";

/* ── Types ── */

export interface DialGaugeProps {
  /** Current value (0 – max) */
  value: number;
  /** Maximum value — default 100 */
  max?: number;
  /** Label shown below the value readout */
  label?: string;
  /** Size in px — default 180 */
  size?: number;
  /** Formatted display value (overrides default Math.round) */
  displayValue?: string;
  /** Hint text shown below the value */
  hint?: string;
  /** Animation duration in ms — default 900 */
  animMs?: number;
  /** Render without Panel wrapper — for embedding inside a parent Panel */
  bare?: boolean;
}

/* ── Constants ── */

const ARC_START = 270; // left edge (in polarXY deg: 270 = 9 o'clock)
const ARC_END = 450; // right edge (270 + 180 = 450 → 3 o'clock)
const ARC_SWEEP = ARC_END - ARC_START; // 180°

// Segmented arc
const SEG_COUNT = 40;
const GAP_DEG = 1.8;
const SEG_DEG = ARC_SWEEP / SEG_COUNT - GAP_DEG;

// Number of tick marks around the semi-circle
const TICK_COUNT = 48;
const TICK_MAJOR_EVERY = 6;

/* ── easeOutCubic for smooth deceleration ── */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Arc path for a single segment ── */

function semiArcSeg(
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

/* ── Tick marks for the half-circle ── */

interface Tick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major: boolean;
}

function buildDialTicks(cx: number, cy: number, tickR: number): Tick[] {
  return Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
    const deg = ARC_START + (i / TICK_COUNT) * ARC_SWEEP;
    const rad = ((deg - 90) * Math.PI) / 180;
    const oR = tickR + 4;
    const iR = i % TICK_MAJOR_EVERY === 0 ? oR - 6 : oR - 3;
    return {
      x1: Math.round((cx + iR * Math.cos(rad)) * 1e4) / 1e4,
      y1: Math.round((cy + iR * Math.sin(rad)) * 1e4) / 1e4,
      x2: Math.round((cx + oR * Math.cos(rad)) * 1e4) / 1e4,
      y2: Math.round((cy + oR * Math.sin(rad)) * 1e4) / 1e4,
      major: i % TICK_MAJOR_EVERY === 0,
    };
  });
}

/* ── Component ── */

export function DialGauge({
  value,
  max = 100,
  label,
  size = 180,
  displayValue,
  hint,
  animMs = 900,
  bare = false,
}: DialGaugeProps) {
  const { accent, accentRgb } = useThemeColors();

  /* ── Stable pct target ── */
  const targetPct = Math.max(0, Math.min(1, value / max));
  const effectivePct = value > 0 && targetPct < 0.05 ? 0.05 : targetPct;

  /* ── Refs for rAF-driven animation (no React re-renders) ── */
  const prevTarget = useRef(0);
  const rafRef = useRef<number>(0);
  const needleRef = useRef<SVGLineElement>(null);
  const pivotRef = useRef<SVGCircleElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const segsRef = useRef<(SVGPathElement | null)[]>([]);

  const cx = size / 2;
  const cy = size * 0.52;
  const rOuter = size * 0.44;
  const rInner = size * 0.36;
  const tickR = size * 0.46;
  const needleLen = rOuter - 6;

  const ticks = useMemo(() => buildDialTicks(cx, cy, tickR), [cx, cy, tickR]);
  const filterId = `dialGlow-${label?.replace(/\s/g, "") ?? "g"}`;
  const vbH = size * 0.62;
  const needleColor = accent;

  /* ── Helper: update DOM directly for a given pct ── */
  const applyPct = useCallback(
    (pct: number) => {
      const litCount = Math.round(pct * SEG_COUNT);

      // Update segments — simple fill swap, no per-element filters
      segsRef.current.forEach((el, i) => {
        if (!el) return;
        if (i < litCount) {
          el.setAttribute("fill", accent);
          el.setAttribute("fill-opacity", "0.85");
        } else {
          el.setAttribute("fill", `rgba(${accentRgb}, 0.06)`);
          el.setAttribute("fill-opacity", "1");
        }
      });

      // Update needle
      const deg = ARC_START + pct * ARC_SWEEP;
      const tip = polarXY(cx, cy, needleLen, deg);
      const tail = polarXY(cx, cy, size * 0.06, deg + 180);
      if (needleRef.current) {
        needleRef.current.setAttribute("x1", String(tail.x));
        needleRef.current.setAttribute("y1", String(tail.y));
        needleRef.current.setAttribute("x2", String(tip.x));
        needleRef.current.setAttribute("y2", String(tip.y));
      }

      // Update value readout
      if (valueRef.current) {
        valueRef.current.textContent =
          displayValue ?? String(Math.round(pct * max));
      }
    },
    [accent, accentRgb, cx, cy, needleLen, size, max, displayValue],
  );

  /* ── Animate via rAF, mutating DOM directly ── */
  useEffect(() => {
    const from = prevTarget.current;
    const to = effectivePct;
    prevTarget.current = to;

    const start = performance.now();
    const duration = animMs;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      applyPct(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [effectivePct, animMs, applyPct]);

  const pct = effectivePct;

  const inner = (
    <div className={styles.dialCompact}>
      {label && <span className={styles.dialLabelText}>{label}</span>}

      <div className={styles.gaugeWrap}>
        <svg
          className={styles.tickRing}
          viewBox={`0 0 ${size} ${vbH}`}
          aria-label={`${label ?? "Gauge"}: ${Math.round(pct * 100)}%`}
        >
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" in="SourceGraphic" result="b" />
              <feFlood
                floodColor={needleColor}
                floodOpacity="0.35"
                result="c"
              />
              <feComposite in="c" in2="b" operator="in" result="g" />
              <feMerge>
                <feMergeNode in="g" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Segmented arc */}
          {Array.from({ length: SEG_COUNT }, (_, i) => {
            const deg = ARC_START + i * (SEG_DEG + GAP_DEG);
            return (
              <path
                key={i}
                ref={(el) => {
                  segsRef.current[i] = el;
                }}
                d={semiArcSeg(cx, cy, rOuter, rInner, deg, SEG_DEG)}
                fill={`rgba(${accentRgb}, 0.06)`}
                fillOpacity={1}
              />
            );
          })}

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth={t.major ? 1.2 : 0.6}
            />
          ))}

          {/* Needle */}
          <line
            ref={needleRef}
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy}
            stroke={needleColor}
            strokeWidth={2}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
          />

          {/* Center pivot */}
          <circle cx={cx} cy={cy} r={4} fill={needleColor} opacity={0.9} />
          <circle cx={cx} cy={cy} r={2} fill="var(--surface-1)" />
        </svg>
      </div>

      <span
        ref={valueRef}
        className={styles.dialLabelValue}
        style={{ color: needleColor }}
      >
        {displayValue ?? "0"}
      </span>
    </div>
  );

  if (bare) return inner;

  return inner;
}
