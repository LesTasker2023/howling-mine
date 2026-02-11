"use client";

import { useMemo, useState } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { Panel } from "@/components/ui/Panel";
import { DAMAGE_TYPE_INFO, DAMAGE_RANK_COLORS } from "@/lib/mob-hints";
import type { MobDefense } from "@/types/mobs";
import {
  polarXY,
  segPath,
  buildTicks,
  SEG_COUNT,
  GAP_DEG,
  SEG_DEG,
  R_TICK,
  DIM_FILL,
} from "../hud-primitives";
import styles from "../DeltaCharts.module.css";

/* ── Types ── */

interface DamageDonutProps {
  damage: MobDefense;
  /** Size in px — default 180 */
  size?: number;
}

interface ActiveType {
  key: string;
  pct: number;
  info: (typeof DAMAGE_TYPE_INFO)[string];
  color: string;
}

/* ── Ring layout constants (as fractions of size) ── */

const OUTER_START = 0.46; // outermost ring outer edge
const MIN_INNER = 0.12; // minimum inner radius — reserve center for text
const CENTER_SLOTS = 3; // blank ring-widths kept clear in the center

/* ── Component ── */

export function DamageDonut({ damage, size = 180 }: DamageDonutProps) {
  const rec = damage as unknown as Record<string, number | null>;
  const [hovered, setHovered] = useState<string | null>(null);

  const active = useMemo<ActiveType[]>(() => {
    const list: {
      key: string;
      pct: number;
      info: (typeof DAMAGE_TYPE_INFO)[string];
    }[] = [];
    for (const [key, info] of Object.entries(DAMAGE_TYPE_INFO)) {
      const v = rec[key] ?? 0;
      if (v > 0) list.push({ key, pct: v, info });
    }
    list.sort((a, b) => b.pct - a.pct);
    return list.map((t, i) => ({
      ...t,
      color: DAMAGE_RANK_COLORS[Math.min(i, DAMAGE_RANK_COLORS.length - 1)],
    }));
  }, [rec]);

  if (!active.length) return null;

  const cx = size / 2;
  const cy = size / 2;
  const ringR = size * R_TICK;
  const ticks = buildTicks(cx, cy, ringR);

  /* Each damage type gets its own concentric segmented ring.
     Ring sizes scale dynamically so the center stays clear. */
  const totalSlots = active.length + CENTER_SLOTS;
  const radialBudget = OUTER_START - MIN_INNER;
  const step = radialBudget / totalSlots;
  const ringWidth = step * 0.7;

  const rings = active.map((t, i) => {
    const rOuter = size * (OUTER_START - i * step);
    const rInner = rOuter - size * ringWidth;
    const litCount = Math.round((t.pct / 100) * SEG_COUNT);
    return { ...t, rOuter, rInner, litCount };
  });

  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        <div className={styles.chartTitle}>Damage Types</div>

        <div className={styles.chartBody}>
          {/* Ring chart */}
          <div
            className={styles.gaugeWrap}
            style={{ width: size, height: size, flexShrink: 0 }}
          >
            <svg
              className={styles.tickRing}
              viewBox={`0 0 ${size} ${size}`}
              aria-label="Damage type distribution"
            >
              <defs>
                {rings.map((ring) => (
                  <filter
                    key={ring.key}
                    id={`dmgGlow-${ring.key}`}
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
                          ? `url(#dmgGlow-${ring.key})`
                          : undefined
                      }
                    />
                  );
                }),
              )}
            </svg>

            {/* Center: top type readout */}
            {active[0] && (
              <div className={styles.gaugeCenter}>
                <span
                  className={styles.gaugeValue}
                  style={{ color: active[0].color, fontSize: "1.3rem" }}
                >
                  {Math.round(active[0].pct)}%
                </span>
                <span className={styles.gaugeLabel}>
                  {active[0].info.label}
                </span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            {active.map((t) => (
              <Tooltip
                key={t.key}
                content={`${t.info.fullName}: ${Math.round(t.pct)}% — ${t.info.armorTip}`}
                placement="right"
              >
                <div
                  className={`${styles.legendRow} ${hovered === t.key ? styles.legendRowActive : ""}`}
                  onMouseEnter={() => setHovered(t.key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    className={styles.legendDot}
                    style={{ backgroundColor: t.color }}
                  />
                  <span className={styles.legendName}>{t.info.fullName}</span>
                  <span className={styles.legendPct} style={{ color: t.color }}>
                    {Math.round(t.pct)}%
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
