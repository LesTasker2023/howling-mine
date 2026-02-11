"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { HUD_PALETTE, HUD_TOOLTIP_STYLE } from "./hud-theme";
import { Panel } from "@/components/ui/Panel";
import styles from "./charts.module.css";

/* ── Types ── */

export interface PieSlice {
  name: string;
  value: number;
  color?: string;
}

export interface HudPieChartProps {
  data: PieSlice[];
  /** Optional chart title */
  title?: string;
  /** Outer radius — default 80 */
  outerRadius?: number;
  /** Inner radius — 0 for solid pie, >0 for donut */
  innerRadius?: number;
  /** Height — default 220 */
  height?: number;
  /** Show custom legend */
  showLegend?: boolean;
}

/* ── Custom label ── */
function renderLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#94a3b8"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ── Component ── */

export function HudPieChart({
  data,
  title,
  outerRadius = 80,
  innerRadius = 0,
  height = 220,
  showLegend = true,
}: HudPieChartProps) {
  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <div style={{ display: "flex", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <defs>
                {data.map((d, i) => {
                  const c = d.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
                  return (
                    <filter
                      key={d.name}
                      id={`pieGlow-${i}`}
                      x="-30%"
                      y="-30%"
                      width="160%"
                      height="160%"
                    >
                      <feGaussianBlur
                        stdDeviation="3"
                        in="SourceGraphic"
                        result="blur"
                      />
                      <feFlood
                        floodColor={c}
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
                  );
                })}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                label={renderLabel}
                labelLine={false}
                animationDuration={800}
              >
                {data.map((d, i) => {
                  const c = d.color ?? HUD_PALETTE[i % HUD_PALETTE.length];
                  return (
                    <Cell
                      key={d.name}
                      fill={c}
                      fillOpacity={0.85}
                      filter={`url(#pieGlow-${i})`}
                    />
                  );
                })}
              </Pie>
              <Tooltip {...HUD_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>

          {showLegend && (
            <div className={styles.pieLegend}>
              {data.map((d, i) => (
                <div key={d.name} className={styles.pieLegendItem}>
                  <span
                    className={styles.pieLegendDot}
                    style={{
                      backgroundColor:
                        d.color ?? HUD_PALETTE[i % HUD_PALETTE.length],
                    }}
                  />
                  {d.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
