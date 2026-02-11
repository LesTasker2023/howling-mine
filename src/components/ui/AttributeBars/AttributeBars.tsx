"use client";

import { useMemo } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { Badge } from "@/components/ui/Badge";
import { ATTRIBUTE_INFO, mobArchetype } from "@/lib/mob-hints";
import type { MobAttributes } from "@/types/mobs";
import styles from "./AttributeBars.module.css";

/* ── Config ── */

const ATTRS = [
  "Strength",
  "Stamina",
  "Agility",
  "Intelligence",
  "Psyche",
] as const;

const N = ATTRS.length;
const CX = 100;
const CY = 100;
const R = 70;
const LABEL_R = R + 22;

/* ── Geometry ── */

function toXY(cx: number, cy: number, r: number, i: number): [number, number] {
  const angle = (2 * Math.PI * i) / N - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function ring(r: number): string {
  return ATTRS.map((_, i) => toXY(CX, CY, r, i).join(",")).join(" ");
}

/* ── Component ── */

interface AttributeBarsProps {
  attributes: MobAttributes;
  maturityName?: string;
}

export function AttributeBars({
  attributes,
  maturityName,
}: AttributeBarsProps) {
  const rec = attributes as unknown as Record<string, number | null>;
  const entries = ATTRS.map((key) => ({
    key,
    info: ATTRIBUTE_INFO[key],
    value: rec[key] ?? 0,
  }));

  const max = Math.max(...entries.map((e) => e.value), 1);
  const hasData = entries.some((e) => e.value > 0);

  if (!hasData) return null;

  const archetype = mobArchetype(rec);

  /* Scale relative to max for radar fill */
  const scale = (v: number) => (max > 0 ? v / max : 0);

  const dataPoly = entries
    .map((e, i) => toXY(CX, CY, R * scale(e.value), i).join(","))
    .join(" ");

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Attributes</span>
        {archetype && <Badge variant="accent">{archetype}</Badge>}
        <Tooltip
          content="Creature attributes describe its innate characteristics. The dominant attribute determines its combat archetype."
          placement="top"
        >
          <span className={styles.helpIcon}>?</span>
        </Tooltip>
      </div>
      {maturityName && <span className={styles.context}>{maturityName}</span>}

      <div className={styles.radarWrap}>
        <svg viewBox="0 0 200 200" className={styles.svg}>
          <defs>
            <radialGradient id="attr-glow" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor="var(--color-primary)"
                stopOpacity="0.25"
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary)"
                stopOpacity="0.02"
              />
            </radialGradient>
          </defs>

          {/* Grid rings at 25 / 50 / 75 / 100% */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon key={f} points={ring(R * f)} className={styles.ring} />
          ))}

          {/* Axis lines */}
          {ATTRS.map((_, i) => {
            const [x, y] = toXY(CX, CY, R, i);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                className={styles.axis}
              />
            );
          })}

          {/* Glow under data shape */}
          <polygon points={dataPoly} className={styles.glow} />

          {/* Filled data shape */}
          <polygon points={dataPoly} className={styles.fill} />
          <polygon points={dataPoly} className={styles.stroke} />

          {/* Dots on vertices */}
          {entries.map((e, i) =>
            e.value > 0 ? (
              <circle
                key={e.key}
                cx={toXY(CX, CY, R * scale(e.value), i)[0]}
                cy={toXY(CX, CY, R * scale(e.value), i)[1]}
                r={3}
                className={styles.dot}
              />
            ) : null,
          )}

          {/* Labels */}
          {entries.map((e, i) => {
            const [x, y] = toXY(CX, CY, LABEL_R, i);
            return (
              <text
                key={e.key}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={e.value > 0 ? styles.labelActive : styles.labelDim}
              >
                {e.info.label}
                {e.value > 0 && (
                  <tspan className={styles.labelValue}>{` ${e.value}`}</tspan>
                )}
              </text>
            );
          })}
        </svg>

        {/* Tooltip overlay areas — absolute-positioned over each axis endpoint */}
        <div className={styles.tooltipLayer}>
          {entries
            .filter((e) => e.value > 0)
            .map((e, i) => {
              const idx = ATTRS.indexOf(e.key as (typeof ATTRS)[number]);
              const [x, y] = toXY(CX, CY, LABEL_R, idx);
              return (
                <Tooltip
                  key={e.key}
                  content={
                    <span>
                      <strong>
                        {e.info.fullName}: {e.value}
                      </strong>
                      <br />
                      {e.info.description}
                    </span>
                  }
                  placement="top"
                >
                  <div
                    className={styles.hitArea}
                    style={{
                      left: `${(x / 200) * 100}%`,
                      top: `${(y / 200) * 100}%`,
                    }}
                  />
                </Tooltip>
              );
            })}
        </div>
      </div>
    </div>
  );
}
