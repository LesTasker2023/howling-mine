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

export interface DamageProfileProps {
  damage: MobDefense;
  /** Size of the donut ring in px — default 160 */
  size?: number;
  /** Render without Panel wrapper — for embedding inside a parent Panel */
  bare?: boolean;
  /** When true, skip the donut ring and show only stacked bar + legend */
  compact?: boolean;
}

interface ActiveType {
  key: string;
  pct: number;
  info: (typeof DAMAGE_TYPE_INFO)[string];
  color: string;
}

/* ── Ring layout constants (fractions of size) ── */

const OUTER_START = 0.46;
const MIN_INNER = 0.12;
const CENTER_SLOTS = 3;

/* ── Component ── */

export function DamageProfile({
  damage,
  size = 160,
  bare = false,
  compact = false,
}: DamageProfileProps) {
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

  /* Concentric ring layout */
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

  const inner = (
    <div className={styles.chartInner}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          alignSelf: "flex-start",
        }}
      >
        <span className={styles.chartTitle} style={{ marginBottom: 0 }}>
          Damage Types
        </span>
        <Tooltip
          content="Match your armor protection to the largest damage types to reduce incoming damage."
          placement="top"
        >
          <span className={styles.helpIcon}>?</span>
        </Tooltip>
      </div>

      <div className={styles.chartBody}>
        {/* ── Concentric ring donut ── */}
        {!compact && (
          <div
            className={styles.gaugeWrap}
            style={{ width: size, height: size, flexShrink: 0 }}
          >
            <svg
              className={styles.tickRing}
              viewBox={`0 0 ${size} ${size}`}
              aria-label="Damage type distribution"
            >
              {/* Outer ring + ticks */}
              <circle
                cx={cx}
                cy={cy}
                r={ringR + 1}
                fill="none"
                stroke="rgba(148,163,184,0.1)"
                strokeWidth={1}
              />
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
                      style={
                        lit && isHovered
                          ? {
                              filter: `drop-shadow(0 0 3px ${ring.color})`,
                            }
                          : undefined
                      }
                    />
                  );
                }),
              )}
            </svg>

            {/* Center readout: top type */}
            {active[0] && (
              <div className={styles.gaugeCenter}>
                <span
                  className={styles.gaugeValue}
                  style={{ color: active[0].color, fontSize: "1.2rem" }}
                >
                  {Math.round(active[0].pct)}%
                </span>
                <span className={styles.gaugeLabel}>
                  {active[0].info.label}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Right side: stacked bar + legend rows ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {/* Stacked bar */}
          <div className={styles.stackedBar}>
            {active.map((t) => (
              <div
                key={t.key}
                className={styles.stackedSeg}
                style={{
                  flex: t.pct,
                  backgroundColor: t.color,
                  opacity: !hovered || hovered === t.key ? 1 : 0.3,
                  transition: "opacity 0.15s ease",
                }}
              />
            ))}
          </div>

          {/* Legend with bar tracks */}
          <div className={styles.legend}>
            {active.map((t) => (
              <Tooltip
                key={t.key}
                content={
                  <span>
                    <strong>{t.info.fullName}</strong>
                    <br />
                    {t.info.description}
                    <br />
                    <em>{t.info.armorTip}</em>
                  </span>
                }
                placement="right"
              >
                <div
                  className={`${styles.legendRow} ${hovered === t.key ? styles.legendRowActive : ""}`}
                  style={{ cursor: "help" }}
                  onMouseEnter={() => setHovered(t.key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    className={styles.legendDot}
                    style={{ backgroundColor: t.color }}
                  />
                  <span className={styles.legendName}>{t.info.label}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${t.pct}%`,
                        backgroundColor: t.color,
                      }}
                    />
                  </div>
                  <span className={styles.legendPct} style={{ color: t.color }}>
                    {Math.round(t.pct)}%
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (bare) return inner;

  return (
    <Panel size="flush" noAnimation>
      {inner}
    </Panel>
  );
}
