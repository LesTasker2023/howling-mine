"use client";

import { useMemo, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { compactNumber } from "@/lib/format";
import type { Maturity } from "@/types/mobs";
import styles from "../DeltaCharts.module.css";

/* ── Stat series config ── */

const SERIES = [
  {
    key: "Level",
    label: "LVL",
    color: "#3b82f6",
    extract: (m: Maturity) => m.Properties.Level,
  },
  {
    key: "Health",
    label: "HP",
    color: "#22d3ee",
    extract: (m: Maturity) => m.Properties.Health,
  },
  {
    key: "Damage",
    label: "DMG",
    color: "#f97316",
    extract: (m: Maturity) => {
      const atks = m.Attacks ?? [];
      return atks.length > 0
        ? Math.max(...atks.map((a) => a.TotalDamage))
        : null;
    },
  },
  {
    key: "Regen",
    label: "RGN",
    color: "#a78bfa",
    extract: (m: Maturity) => m.Properties.RegenerationAmount,
  },
  {
    key: "APM",
    label: "APM",
    color: "#34d399",
    extract: (m: Maturity) => m.Properties.AttacksPerMinute,
  },
] as const;

/* ── Chart constants ── */

const MARGIN = { top: 20, right: 30, bottom: 50, left: 70 };
const WIDTH = 900;
const HEIGHT = 227;
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

/* ── Component ── */

interface MaturityLineProps {
  maturities: Maturity[];
  bare?: boolean;
}

export function MaturityLine({ maturities, bare = false }: MaturityLineProps) {
  const sorted = useMemo(
    () =>
      [...maturities].sort(
        (a, b) => (a.Properties.Level ?? 0) - (b.Properties.Level ?? 0),
      ),
    [maturities],
  );

  /* Determine which series have data */
  const available = useMemo(
    () =>
      SERIES.filter((s) =>
        sorted.some((m) => {
          const v = s.extract(m);
          return v != null && v > 0;
        }),
      ),
    [sorted],
  );

  const [active, setActive] = useState<Set<string>>(
    () => new Set(available.slice(0, 2).map((s) => s.key)),
  );

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const toggle = (key: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (sorted.length < 2 || available.length === 0) return null;

  const n = sorted.length;
  const xStep = PLOT_W / Math.max(n - 1, 1);

  /* Per-series: extract values, compute min/max, build paths */
  const activeSeries = available.filter((s) => active.has(s.key));

  const seriesData = activeSeries.map((s) => {
    const vals = sorted.map((m) => s.extract(m) ?? 0);
    const maxV = Math.max(...vals, 1);
    const points = vals.map((v, i) => ({
      x: MARGIN.left + i * xStep,
      y: MARGIN.top + PLOT_H - (v / maxV) * PLOT_H,
      raw: v,
    }));
    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${MARGIN.top + PLOT_H}` +
      ` L ${points[0].x} ${MARGIN.top + PLOT_H} Z`;
    return { ...s, vals, maxV, points, linePath, areaPath };
  });

  /* Y-axis grid lines (4 lines) */
  const yLines = [0.25, 0.5, 0.75, 1].map((f) => MARGIN.top + PLOT_H * (1 - f));

  const inner = (
    <div className={styles.chartInner}>
      <div className={styles.chartTitle}>Maturity Progression</div>

      {/* Stat toggles */}
      <div className={styles.lineToggles}>
        {available.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`${styles.lineToggle} ${active.has(s.key) ? styles.lineToggleActive : ""}`}
            style={
              active.has(s.key)
                ? { color: s.color, borderColor: s.color }
                : undefined
            }
            onClick={() => toggle(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step cards — quick compare */}

      {/* Chart */}
      <div className={styles.lineChartWrap}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%" }}>
          <defs>
            {seriesData.map((s) => (
              <filter
                key={s.key}
                id={`lg-${s.key}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur
                  stdDeviation="2"
                  in="SourceGraphic"
                  result="blur"
                />
                <feFlood
                  floodColor={s.color}
                  floodOpacity="0.4"
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

          {/* Y grid */}
          {yLines.map((y) => (
            <line
              key={y}
              x1={MARGIN.left}
              y1={y}
              x2={MARGIN.left + PLOT_W}
              y2={y}
              className={styles.lineGrid}
            />
          ))}

          {/* X grid (vertical at each maturity) */}
          {sorted.map((_, i) => {
            const x = MARGIN.left + i * xStep;
            return (
              <line
                key={i}
                x1={x}
                y1={MARGIN.top}
                x2={x}
                y2={MARGIN.top + PLOT_H}
                className={styles.lineGrid}
              />
            );
          })}

          {/* Axis baseline */}
          <line
            x1={MARGIN.left}
            y1={MARGIN.top + PLOT_H}
            x2={MARGIN.left + PLOT_W}
            y2={MARGIN.top + PLOT_H}
            stroke="rgba(148,163,184,0.2)"
            strokeWidth={1}
          />

          {/* Series */}
          {seriesData.map((s) => (
            <g key={s.key}>
              <path d={s.areaPath} fill={s.color} className={styles.lineArea} />
              <path
                d={s.linePath}
                stroke={s.color}
                className={styles.linePath}
                filter={`url(#lg-${s.key})`}
              />
              {s.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={s.color}
                  className={styles.lineDot}
                  filter={`url(#lg-${s.key})`}
                >
                  <title>{`${sorted[i].Name}: ${compactNumber(p.raw)}`}</title>
                </circle>
              ))}
            </g>
          ))}

          {/* Invisible hover columns per maturity */}
          {sorted.map((_, i) => {
            const x = MARGIN.left + i * xStep;
            const halfW = xStep / 2;
            return (
              <rect
                key={`hover-${i}`}
                x={i === 0 ? MARGIN.left - 10 : x - halfW}
                y={0}
                width={i === 0 || i === n - 1 ? halfW + 10 : xStep}
                height={HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "crosshair" }}
              />
            );
          })}

          {/* Hover highlight line */}
          {hoveredIdx != null && (
            <line
              x1={MARGIN.left + hoveredIdx * xStep}
              y1={MARGIN.top}
              x2={MARGIN.left + hoveredIdx * xStep}
              y2={MARGIN.top + PLOT_H}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              strokeDasharray="3,3"
              pointerEvents="none"
            />
          )}

          {/* X labels (maturity names) */}
          {sorted.map((m, i) => {
            const x = MARGIN.left + i * xStep;
            /* Abbreviate long names */
            const abbr = m.Name.length > 5 ? m.Name.slice(0, 4) : m.Name;
            return (
              <text
                key={m.Id}
                x={x}
                y={HEIGHT - 4}
                textAnchor="middle"
                className={styles.lineXLabel}
                style={
                  hoveredIdx === i ? { fill: "var(--text-bright)" } : undefined
                }
              >
                {abbr}
              </text>
            );
          })}

          {/* Y labels */}
          {seriesData.length > 0 &&
            [0, 0.5, 1].map((f) => {
              const primary = seriesData[0];
              const v = Math.round(primary.maxV * f);
              return (
                <text
                  key={f}
                  x={MARGIN.left - 4}
                  y={MARGIN.top + PLOT_H * (1 - f) + 3}
                  textAnchor="end"
                  className={styles.lineYLabel}
                >
                  {compactNumber(v)}
                </text>
              );
            })}
        </svg>

        {/* Floating card for hovered maturity */}
        {hoveredIdx != null &&
          (() => {
            const m = sorted[hoveredIdx];
            const lvl = m.Properties.Level;
            const hp = m.Properties.Health;
            const dmg =
              m.Attacks?.length > 0
                ? Math.max(...m.Attacks.map((a) => a.TotalDamage))
                : null;
            const rgn = m.Properties.RegenerationAmount;
            /* Position card as % of chart width */
            const pct = ((MARGIN.left + hoveredIdx * xStep) / WIDTH) * 100;
            return (
              <div className={styles.matStepFloat} style={{ left: `${pct}%` }}>
                <div className={styles.matStepCard}>
                  <span className={styles.matStepName}>{m.Name}</span>
                  {lvl != null && (
                    <span className={styles.matStepStat}>
                      <span className={styles.matStepLabel}>LVL</span>
                      <span style={{ color: "#3b82f6" }}>{lvl}</span>
                    </span>
                  )}
                  {hp != null && (
                    <span className={styles.matStepStat}>
                      <span className={styles.matStepLabel}>HP</span>
                      <span style={{ color: "#22d3ee" }}>
                        {compactNumber(hp)}
                      </span>
                    </span>
                  )}
                  {dmg != null && (
                    <span className={styles.matStepStat}>
                      <span className={styles.matStepLabel}>DMG</span>
                      <span style={{ color: "#f97316" }}>
                        {compactNumber(dmg)}
                      </span>
                    </span>
                  )}
                  {rgn != null && rgn > 0 && (
                    <span className={styles.matStepStat}>
                      <span className={styles.matStepLabel}>RGN</span>
                      <span style={{ color: "#a78bfa" }}>{rgn.toFixed(1)}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
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
