"use client";

import { useMemo } from "react";
import { Panel } from "@/components/ui/Panel";
import { Tooltip } from "@/components/ui/Tooltip";
import { ATTRIBUTE_INFO } from "@/lib/mob-hints";
import type { MobAttributes } from "@/types/mobs";
import styles from "../DeltaCharts.module.css";

/* ── Attribute colors — distinct, cool-sci-fi palette ── */

const ATTR_COLORS: Record<string, string> = {
  Strength: "#ef4444",
  Stamina: "#22d3ee",
  Agility: "#34d399",
  Intelligence: "#a78bfa",
  Psyche: "#f472b6",
};

/* ── Component ── */

interface AttributeBarsProps {
  attributes: MobAttributes;
  /** Render without Panel wrapper */
  bare?: boolean;
}

export function AttributeBars({
  attributes,
  bare = false,
}: AttributeBarsProps) {
  const rec = attributes as unknown as Record<string, number | null>;

  const active = useMemo(() => {
    const list: {
      key: string;
      value: number;
      info: (typeof ATTRIBUTE_INFO)[string];
      color: string;
    }[] = [];
    for (const [key, info] of Object.entries(ATTRIBUTE_INFO)) {
      const v = rec[key] ?? 0;
      if (v > 0)
        list.push({
          key,
          value: v,
          info,
          color: ATTR_COLORS[key] ?? "#94a3b8",
        });
    }
    return list;
  }, [rec]);

  if (!active.length) return null;

  const maxVal = Math.max(...active.map((a) => a.value));
  const totalAttr = active.reduce((s, a) => s + a.value, 0);

  const inner = (
    <div className={styles.chartInner}>
      <div className={styles.chartTitle}>Attributes</div>

      {/* Summary */}
      <div className={styles.chartSummary}>
        <span className={styles.chartSummaryVal}>{totalAttr}</span>
        <span className={styles.chartSummaryUnit}>total</span>
        <span className={styles.chartSummarySep}>•</span>
        <span>{active.length} attributes</span>
      </div>

      <div className={styles.hBarRows}>
        {active.map((a) => (
          <Tooltip
            key={a.key}
            content={`${a.info.fullName}: ${a.value} — ${a.info.description}`}
            placement="right"
          >
            <div className={styles.hBarRowAttr}>
              <div
                className={styles.attrDot}
                style={{
                  backgroundColor: a.color,
                  boxShadow: `0 0 6px ${a.color}60`,
                }}
              />
              <span className={styles.hBarLabel}>{a.info.label}</span>
              <div className={styles.hBarTrack}>
                <div
                  className={styles.hBarFill}
                  style={{
                    width: `${(a.value / maxVal) * 100}%`,
                    backgroundColor: a.color,
                    boxShadow: `0 0 8px ${a.color}50`,
                  }}
                />
              </div>
              <div className={styles.hBarValue} style={{ color: a.color }}>
                {a.value}
              </div>
            </div>
          </Tooltip>
        ))}
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
