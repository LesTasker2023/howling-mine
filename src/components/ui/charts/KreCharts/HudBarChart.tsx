"use client";

import {
  BarChart,
  Bar,
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

export interface BarSeries {
  dataKey: string;
  label: string;
  color?: string;
}

export interface HudBarChartProps {
  /** Array of data objects — each must have a `name` key plus values per series. */
  data: Record<string, string | number>[];
  /** One or more bar series to render. */
  series: BarSeries[];
  /** Optional chart title shown above. */
  title?: string;
  /** Height in px — default 280 */
  height?: number;
}

/* ── Glow filter for each bar ── */
function GlowDefs({ series }: { series: BarSeries[] }) {
  return (
    <defs>
      {series.map((s, i) => {
        const c = s.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
        return (
          <filter
            key={s.dataKey}
            id={`barGlow-${s.dataKey}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="4" in="SourceGraphic" result="blur" />
            <feFlood floodColor={c} floodOpacity="0.35" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        );
      })}
    </defs>
  );
}

/* ── Component ── */

export function HudBarChart({
  data,
  series,
  title,
  height = 280,
}: HudBarChartProps) {
  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} barCategoryGap="25%" barGap={4}>
            <GlowDefs series={series} />
            <CartesianGrid {...HUD_GRID} vertical={false} />
            <XAxis dataKey="name" {...HUD_AXIS} />
            <YAxis {...HUD_AXIS} width={40} />
            <Tooltip {...HUD_TOOLTIP_STYLE} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#94a3b8",
              }}
            />
            {series.map((s, i) => {
              const c = s.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
              return (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.label}
                  fill={c}
                  fillOpacity={0.85}
                  radius={[4, 4, 0, 0]}
                  filter={`url(#barGlow-${s.dataKey})`}
                  animationDuration={800}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
