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
import {
  HUD_PALETTE,
  HUD_AXIS,
  HUD_GRID,
  HUD_TOOLTIP_STYLE,
} from "./hud-theme";
import { Panel } from "@/components/ui/Panel";
import styles from "./charts.module.css";

/* ── Types ── */

export interface LineSeries {
  dataKey: string;
  label: string;
  color?: string;
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
  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <defs>
              {series.map((s, i) => {
                const c = s.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
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
            <CartesianGrid {...HUD_GRID} vertical={false} />
            <XAxis dataKey="name" {...HUD_AXIS} />
            <YAxis {...HUD_AXIS} width={40} />
            <Tooltip {...HUD_TOOLTIP_STYLE} />
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
              const c = s.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
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
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
