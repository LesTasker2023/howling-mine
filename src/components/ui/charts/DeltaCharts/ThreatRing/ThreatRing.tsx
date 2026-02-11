"use client";

import { useMemo } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { Panel } from "@/components/ui/Panel";
import { computeThreat } from "@/lib/mob-hints";
import {
  segPath,
  buildTicks,
  SEG_COUNT,
  GAP_DEG,
  SEG_DEG,
  R_OUTER,
  R_INNER,
  R_TICK,
  DIM_FILL,
} from "../hud-primitives";
import styles from "../DeltaCharts.module.css";

/* ── Types ── */

export interface ThreatRingProps {
  hp: number | null;
  damage: number | null;
  regen: number | null;
  /** Size in px — default 160 */
  size?: number;
  /** Render without Panel wrapper — for embedding inside a parent Panel */
  bare?: boolean;
}

/* ── Component ── */

export function ThreatRing({
  hp,
  damage,
  regen,
  size = 160,
  bare = false,
}: ThreatRingProps) {
  const threat = useMemo(
    () => computeThreat(hp, damage, regen),
    [hp, damage, regen],
  );

  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * R_OUTER;
  const rInner = size * R_INNER;
  const ringR = size * R_TICK;
  const litCount = Math.round(threat.score * SEG_COUNT);
  const ticks = buildTicks(cx, cy, ringR);
  const color = threat.color;
  const filterId = `threatGlow-${Math.round(threat.score * 100)}`;

  const inner = (
    <div className={styles.dialCompact}>
      <div className={styles.gaugeWrap} style={{ width: size, height: size }}>
        <svg
          className={styles.tickRing}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`Threat: ${threat.tier} ${Math.round(threat.score * 100)}%`}
        >
          <defs>
            <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur
                stdDeviation="3"
                in="SourceGraphic"
                result="blur"
              />
              <feFlood floodColor={color} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
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
                fill={lit ? color : DIM_FILL}
                fillOpacity={lit ? 0.9 : 1}
                filter={lit ? `url(#${filterId})` : undefined}
              />
            );
          })}
        </svg>

        {/* Center readout: label only */}
        <Tooltip content={threat.description} placement="top">
          <div className={styles.gaugeCenter}>
            <span
              className={styles.gaugeLabel}
              style={{ fontSize: size * 0.09 }}
            >
              Threat Level
            </span>
          </div>
        </Tooltip>
      </div>
      {/* Tier value below ring */}
      <span
        className={styles.dialLabelValue}
        style={{
          color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginTop: 4,
        }}
      >
        {threat.tier}
      </span>
    </div>
  );

  if (bare) return inner;

  return (
    <Panel size="flush" noAnimation>
      {inner}
    </Panel>
  );
}
