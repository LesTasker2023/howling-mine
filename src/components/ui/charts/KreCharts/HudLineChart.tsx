"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useHudTheme } from "./useHudTheme";
import styles from "./charts.module.css";

/* ── Types ── */

export interface LineSeries {
  dataKey: string;
  label: string;
  color?: string;
  /** Assign to a separate Y axis (e.g. "left" or "right"). When set, enables dual-axis mode. */
  yAxisId?: string;
}

export interface HudLineChartProps {
  /** Data array — each object should have a `name` key plus numeric values per series. */
  data: Record<string, string | number>[];
  /** One or more lines. */
  series: LineSeries[];
  /** Title */
  title?: string;
  /** Height — default 280 */
  height?: number;
}

/* ── Component ── */

export function HudLineChart({
  data,
  series,
  title,
  height = 280,
}: HudLineChartProps) {
  const { PALETTE, AXIS, GRID, TOOLTIP_STYLE } = useHudTheme();
  const dualAxis = series.some((s) => s.yAxisId);
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <defs>
              {series.map((s, i) => {
                const c = s.color ?? PALETTE[i % PALETTE.length];
                return (
                  <filter
                    key={s.dataKey}
                    id={`lineGlow-${s.dataKey}`}
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                  >
                    <feGaussianBlur
                      stdDeviation="3"
                      in="SourceGraphic"
                      result="blur"
                    />
                    <feFlood floodColor={c} floodOpacity="0.5" result="color" />
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
                );
              })}
            </defs>
            <CartesianGrid {...GRID} vertical={false} />
            <XAxis dataKey="name" {...AXIS} />

            {dualAxis ? (
              <>
                {Array.from(new Set(series.map((s) => s.yAxisId))).map(
                  (id, idx) => {
                    const s = series.find((s) => s.yAxisId === id);
                    const c = s?.color ?? PALETTE[idx % PALETTE.length];
                    return (
                      <YAxis
                        key={id}
                        yAxisId={id}
                        orientation={idx === 0 ? "left" : "right"}
                        {...AXIS}
                        width={40}
                        stroke={c}
                        tick={{ ...AXIS.tick, fill: c }}
                      />
                    );
                  },
                )}
              </>
            ) : (
              <YAxis {...AXIS} width={40} />
            )}

            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#94a3b8",
              }}
            />
            {series.map((s, i) => {
              const c = s.color ?? PALETTE[i % PALETTE.length];
              return (
                <Line
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.label}
                  stroke={c}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: c, strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: c,
                    stroke: "#0a1020",
                    strokeWidth: 2,
                  }}
                  filter={`url(#lineGlow-${s.dataKey})`}
                  animationDuration={800}
                  yAxisId={dualAxis ? s.yAxisId : undefined}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
