"use client";

import { Panel } from "@/components/ui/Panel";
import type { MobDefense } from "@/types/mobs";
import styles from "../DeltaCharts.module.css";

/* ── Axis config ── */

const AXES = [
  { key: "Cut", label: "CUT" },
  { key: "Stab", label: "STB" },
  { key: "Impact", label: "IMP" },
  { key: "Burn", label: "BRN" },
  { key: "Cold", label: "CLD" },
  { key: "Electric", label: "ELC" },
  { key: "Acid", label: "ACD" },
  { key: "Shrapnel", label: "SHR" },
  { key: "Penetration", label: "PEN" },
] as const;

const N = AXES.length;
const SIZE = 180;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 58;
const LABEL_R = R + 20;

/* ── Geometry helpers ── */

function toXY(cx: number, cy: number, r: number, i: number): [number, number] {
  const angle = (2 * Math.PI * i) / N - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function ring(r: number): string {
  return AXES.map((_, i) => toXY(CX, CY, r, i).join(",")).join(" ");
}

/* Tick marks around the radar perimeter */
function radarTicks(cx: number, cy: number, r: number) {
  const TICK_COUNT = 54; // 6 per axis
  return Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (2 * Math.PI * i) / TICK_COUNT - Math.PI / 2;
    const oR = r + 6;
    const iR = i % 6 === 0 ? oR - 7 : oR - 3;
    return {
      x1: cx + iR * Math.cos(angle),
      y1: cy + iR * Math.sin(angle),
      x2: cx + oR * Math.cos(angle),
      y2: cy + oR * Math.sin(angle),
      major: i % 6 === 0,
    };
  });
}

/* ── Component ── */

interface DamageRadarProps {
  damage: MobDefense;
}

export function DamageRadar({ damage }: DamageRadarProps) {
  const rec = damage as unknown as Record<string, number | null>;
  const vals = AXES.map(({ key }) => rec[key] ?? 0);
  const hasData = vals.some((v) => v > 0);

  if (!hasData) return null;

  const maxVal = Math.max(...vals);
  const scale = (v: number) => (maxVal > 0 ? v / maxVal : 0);

  const dataPoly = vals
    .map((v, i) => toXY(CX, CY, R * scale(v), i).join(","))
    .join(" ");

  const ticks = radarTicks(CX, CY, R);

  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        <div className={styles.chartTitle}>Damage Radar</div>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ width: "100%", maxWidth: SIZE }}
        >
          <defs>
            <filter id="radarGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur
                stdDeviation="3"
                in="SourceGraphic"
                result="blur"
              />
              <feFlood floodColor="#22d3ee" floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 7}
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

          {/* Grid rings at 25 / 50 / 75 / 100 % */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon
              key={f}
              points={ring(R * f)}
              className={styles.radarGrid}
            />
          ))}

          {/* Axis lines */}
          {AXES.map((_, i) => {
            const [x, y] = toXY(CX, CY, R, i);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                className={styles.radarAxis}
              />
            );
          })}

          {/* Filled data shape */}
          <polygon points={dataPoly} className={styles.radarFill} />
          <polygon
            points={dataPoly}
            className={styles.radarStroke}
            filter="url(#radarGlow)"
          />

          {/* Dots on active vertices */}
          {vals.map((v, i) =>
            v > 0 ? (
              <circle
                key={i}
                cx={toXY(CX, CY, R * scale(v), i)[0]}
                cy={toXY(CX, CY, R * scale(v), i)[1]}
                r={2.5}
                className={styles.radarDot}
              />
            ) : null,
          )}

          {/* Labels */}
          {AXES.map((a, i) => {
            const [x, y] = toXY(CX, CY, LABEL_R, i);
            const v = vals[i];
            return (
              <text
                key={a.key}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={v > 0 ? styles.radarLabelActive : styles.radarLabel}
              >
                {a.label}
                {v > 0 && (
                  <tspan className={styles.radarPct}>
                    {` ${Math.round(v)}%`}
                  </tspan>
                )}
              </text>
            );
          })}
        </svg>
      </div>
    </Panel>
  );
}
