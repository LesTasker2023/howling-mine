"use client";

import { useMemo } from "react";
import { Panel } from "@/components/ui/Panel";
import { Tooltip } from "@/components/ui/Tooltip";
import { DAMAGE_TYPE_INFO, DAMAGE_RANK_COLORS } from "@/lib/mob-hints";
import {
  segPath,
  SEG_COUNT,
  GAP_DEG,
  SEG_DEG,
  R_OUTER,
  R_INNER,
  R_TICK,
  DIM_FILL,
  buildTicks,
} from "../hud-primitives";
import type { MobDefense } from "@/types/mobs";
import styles from "../DeltaCharts.module.css";

/* ── Types ── */

interface DamageBreakdownProps {
  damage: MobDefense;
}

interface ActiveType {
  key: string;
  pct: number;
  info: (typeof DAMAGE_TYPE_INFO)[string];
  color: string;
}

/* ── Mini segmented-arc gauge (like HudGauge, but tiny) ── */

const MINI_SIZE = 36;
const MINI_CX = MINI_SIZE / 2;
const MINI_CY = MINI_SIZE / 2;
const MINI_R_OUTER = MINI_SIZE * R_OUTER;
const MINI_R_INNER = MINI_SIZE * R_INNER;

function MiniRing({ pct, color }: { pct: number; color: string }) {
  const litCount = Math.round((pct / 100) * SEG_COUNT);
  return (
    <svg
      viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`}
      width={MINI_SIZE}
      height={MINI_SIZE}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <filter
          id={`mGlow-${color.replace("#", "")}`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="1.5" in="SourceGraphic" result="blur" />
          <feFlood floodColor={color} floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {Array.from({ length: SEG_COUNT }, (_, i) => {
        const startDeg = i * (SEG_DEG + GAP_DEG);
        const lit = i < litCount;
        return (
          <path
            key={i}
            d={segPath(
              MINI_CX,
              MINI_CY,
              MINI_R_OUTER,
              MINI_R_INNER,
              startDeg,
              SEG_DEG,
            )}
            fill={lit ? color : DIM_FILL}
            fillOpacity={lit ? 0.9 : 1}
            filter={lit ? `url(#mGlow-${color.replace("#", "")})` : undefined}
          />
        );
      })}
    </svg>
  );
}

/* ── Component ── */

export function DamageBreakdown({ damage }: DamageBreakdownProps) {
  const rec = damage as unknown as Record<string, number | null>;

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

  const total = active.reduce((s, t) => s + t.pct, 0);
  const SIZE = 120;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rOuter = SIZE * R_OUTER;
  const rInner = SIZE * R_INNER;
  const ringR = SIZE * R_TICK;
  const ticks = buildTicks(cx, cy, ringR);

  /* Master ring — each damage type occupies a proportional arc slice */
  type Slice = { startSeg: number; count: number; color: string; key: string };
  const slices: Slice[] = [];
  let cursor = 0;
  for (const t of active) {
    const count = Math.max(1, Math.round((t.pct / total) * SEG_COUNT));
    slices.push({ startSeg: cursor, count, color: t.color, key: t.key });
    cursor += count;
  }
  // Clamp total to SEG_COUNT
  if (cursor > SEG_COUNT) {
    const last = slices[slices.length - 1];
    last.count -= cursor - SEG_COUNT;
  }

  return (
    <Panel size="flush" noAnimation>
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
            content="Match your armor protection to the largest types to reduce incoming damage."
            placement="top"
          >
            <span className={styles.helpIcon}>?</span>
          </Tooltip>
        </div>

        {/* Segmented ring breakdown */}
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ width: "100%", maxWidth: SIZE }}
        >
          <defs>
            <filter id="bdGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur
                stdDeviation="2"
                in="SourceGraphic"
                result="blur"
              />
              <feFlood floodColor="#3b82f6" floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

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

          {/* Segments — coloured by damage type */}
          {Array.from({ length: SEG_COUNT }, (_, i) => {
            const startDeg = i * (SEG_DEG + GAP_DEG);
            const slice = slices.find(
              (s) => i >= s.startSeg && i < s.startSeg + s.count,
            );
            return (
              <path
                key={i}
                d={segPath(cx, cy, rOuter, rInner, startDeg, SEG_DEG)}
                fill={slice ? slice.color : DIM_FILL}
                fillOpacity={slice ? 0.85 : 1}
                filter={slice ? "url(#bdGlow)" : undefined}
              />
            );
          })}
        </svg>

        {/* Stacked bar (thin) */}
        <div className={styles.stackedBar}>
          {active.map((t) => (
            <div
              key={t.key}
              className={styles.stackedSeg}
              style={{
                flex: t.pct,
                backgroundColor: t.color,
              }}
            />
          ))}
        </div>

        {/* Legend rows with mini ring + bar */}
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
              <div className={styles.legendRow} style={{ cursor: "help" }}>
                <MiniRing pct={t.pct} color={t.color} />
                <span className={styles.legendName}>{t.info.label}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                  />
                </div>
                <span className={styles.legendPct}>{Math.round(t.pct)}%</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </Panel>
  );
}
