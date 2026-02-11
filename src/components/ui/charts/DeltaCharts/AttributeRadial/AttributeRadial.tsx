"use client";

import { useMemo, useState } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { ATTRIBUTE_INFO } from "@/lib/mob-hints";
import type { MobAttributes } from "@/types/mobs";
import {
  segPath,
  buildTicks,
  SEG_COUNT,
  GAP_DEG,
  SEG_DEG,
  R_TICK,
  DIM_FILL,
} from "../hud-primitives";
import styles from "../DeltaCharts.module.css";

/* ── Attribute colors — match AttributeBars palette ── */

const ATTR_COLORS: Record<string, string> = {
  Strength: "#ef4444",
  Stamina: "#22d3ee",
  Agility: "#34d399",
  Intelligence: "#a78bfa",
  Psyche: "#f472b6",
};

/* Ring layout */
const OUTER_START = 0.46;
const MIN_INNER = 0.12;
const CENTER_SLOTS = 1;

/* ── Component ── */

interface AttributeRadialProps {
  attributes: MobAttributes;
  /** Size in px — default 180 */
  size?: number;
}

interface AttrEntry {
  key: string;
  value: number;
  info: (typeof ATTRIBUTE_INFO)[string];
  color: string;
}

export function AttributeRadial({
  attributes,
  size = 180,
}: AttributeRadialProps) {
  const rec = attributes as unknown as Record<string, number | null>;
  const [hovered, setHovered] = useState<string | null>(null);

  const active = useMemo<AttrEntry[]>(() => {
    const list: {
      key: string;
      value: number;
      info: (typeof ATTRIBUTE_INFO)[string];
      color: string;
    }[] = [];
    for (const [key, info] of Object.entries(ATTRIBUTE_INFO)) {
      const v = rec[key] ?? 0;
      if (v > 0)
        list.push({
          key,
          value: v,
          info,
          color: ATTR_COLORS[key] ?? "#94a3b8",
        });
    }
    /* Highest value → outermost ring, decreasing inward */
    list.sort((a, b) => b.value - a.value);
    return list;
  }, [rec]);

  if (!active.length) return null;

  const maxVal = Math.max(...active.map((a) => a.value));
  const totalAttr = active.reduce((s, a) => s + a.value, 0);

  const cx = size / 2;
  const cy = size / 2;
  const ringR = size * R_TICK;
  const ticks = buildTicks(cx, cy, ringR);

  /* Each attribute gets a concentric ring. Fill proportional to value/max. */
  const totalSlots = active.length + CENTER_SLOTS;
  const radialBudget = OUTER_START - MIN_INNER;
  const step = radialBudget / totalSlots;
  const ringWidth = step * 0.7;

  const rings = active.map((a, i) => {
    const rOuter = size * (OUTER_START - i * step);
    const rInner = rOuter - size * ringWidth;
    const litCount = Math.round((a.value / maxVal) * SEG_COUNT);
    return { ...a, rOuter, rInner, litCount };
  });

  const inner = (
    <div className={styles.chartInner}>
      <div className={styles.chartTitle}>Attributes</div>

      <div className={styles.chartSummary}>
        <span className={styles.chartSummaryVal}>{totalAttr}</span>
        <span className={styles.chartSummaryUnit}>total</span>
        <span className={styles.chartSummarySep}>•</span>
        <span>{active.length} attributes</span>
      </div>

      <div className={styles.chartBody}>
        {/* Ring chart */}
        <div
          className={styles.gaugeWrap}
          style={{ width: size, height: size, flexShrink: 0 }}
        >
          <svg
            className={styles.tickRing}
            viewBox={`0 0 ${size} ${size}`}
            aria-label="Attribute breakdown"
          >
            <defs>
              {rings.map((ring) => (
                <filter
                  key={ring.key}
                  id={`attrGlow-${ring.key}`}
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feGaussianBlur
                    stdDeviation="2"
                    in="SourceGraphic"
                    result="blur"
                  />
                  <feFlood
                    floodColor={ring.color}
                    floodOpacity="0.5"
                    result="color"
                  />
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
              ))}
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

            {/* Concentric segmented rings */}
            {rings.map((ring) =>
              Array.from({ length: SEG_COUNT }, (_, i) => {
                const startDeg = i * (SEG_DEG + GAP_DEG);
                const lit = i < ring.litCount;
                const isHovered = hovered === ring.key;
                return (
                  <path
                    key={`${ring.key}-${i}`}
                    d={segPath(
                      cx,
                      cy,
                      ring.rOuter,
                      ring.rInner,
                      startDeg,
                      SEG_DEG,
                    )}
                    fill={lit ? ring.color : DIM_FILL}
                    fillOpacity={lit ? (isHovered ? 1 : 0.85) : 1}
                    filter={
                      lit && isHovered
                        ? `url(#attrGlow-${ring.key})`
                        : undefined
                    }
                  />
                );
              }),
            )}
          </svg>

          {/* Center: dominant attribute */}
          {active.length > 0 && (
            <div className={styles.gaugeCenter}>
              <span
                className={styles.gaugeValue}
                style={{ color: "var(--text-secondary)", fontSize: "1.3rem" }}
              >
                {totalAttr}
              </span>
              <span className={styles.gaugeLabel}>Total</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {active.map((a) => (
            <Tooltip
              key={a.key}
              content={`${a.info.fullName}: ${a.value} — ${a.info.description}`}
              placement="right"
            >
              <div
                className={`${styles.legendRow} ${hovered === a.key ? styles.legendRowActive : ""}`}
                onMouseEnter={() => setHovered(a.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: a.color }}
                />
                <span className={styles.legendName}>{a.info.fullName}</span>
                <span className={styles.legendPct} style={{ color: a.color }}>
                  {a.value}
                </span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );

  return inner;
}
