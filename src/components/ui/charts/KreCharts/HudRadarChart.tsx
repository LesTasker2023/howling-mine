"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { HUD_PALETTE, HUD_TOOLTIP_STYLE } from "./hud-theme";
import { Panel } from "@/components/ui/Panel";
import styles from "./charts.module.css";

/* ── Types ── */

export interface RadarSeries {
  dataKey: string;
  label: string;
  color?: string;
}

export interface HudRadarChartProps {
  /** Array of data points — each needs a `subject` key plus numeric values per series. */
  data: Record<string, string | number>[];
  /** One or more radar overlays. */
  series: RadarSeries[];
  /** Optional title */
  title?: string;
  /** Height — default 300 */
  height?: number;
}

/* ── Component ── */

export function HudRadarChart({
  data,
  series,
  title,
  height = 300,
}: HudRadarChartProps) {
  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(59, 130, 246, 0.12)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
              }}
            />
            <PolarRadiusAxis angle={90} tick={false} axisLine={false} />
            {series.map((s, i) => {
              const c = s.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
              return (
                <Radar
                  key={s.dataKey}
                  name={s.label}
                  dataKey={s.dataKey}
                  stroke={c}
                  strokeWidth={2}
                  fill={c}
                  fillOpacity={0.15}
                  animationDuration={800}
                  dot={{ r: 3, fill: c, strokeWidth: 0 }}
                />
              );
            })}
            <Tooltip {...HUD_TOOLTIP_STYLE} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
