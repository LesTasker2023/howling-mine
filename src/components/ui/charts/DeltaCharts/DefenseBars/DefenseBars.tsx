"use client";

import { useMemo } from "react";
import { Panel } from "@/components/ui/Panel";
import { Tooltip } from "@/components/ui/Tooltip";
import { DAMAGE_TYPE_INFO, DAMAGE_RANK_COLORS } from "@/lib/mob-hints";
import type { MobDefense } from "@/types/mobs";
import styles from "../DeltaCharts.module.css";

/* ── Component ── */

interface DefenseBarsProps {
  defense: MobDefense;
  /** Render without Panel wrapper */
  bare?: boolean;
}

interface ActiveDef {
  key: string;
  value: number;
  info: (typeof DAMAGE_TYPE_INFO)[string];
  color: string;
}

export function DefenseBars({ defense, bare = false }: DefenseBarsProps) {
  const rec = defense as unknown as Record<string, number | null>;

  const active = useMemo<ActiveDef[]>(() => {
    const list: {
      key: string;
      value: number;
      info: (typeof DAMAGE_TYPE_INFO)[string];
    }[] = [];
    for (const [key, info] of Object.entries(DAMAGE_TYPE_INFO)) {
      const v = rec[key] ?? 0;
      if (v > 0) list.push({ key, value: v, info });
    }
    list.sort((a, b) => b.value - a.value);
    return list.map((t, i) => ({
      ...t,
      color: DAMAGE_RANK_COLORS[Math.min(i, DAMAGE_RANK_COLORS.length - 1)],
    }));
  }, [rec]);

  if (!active.length) return null;

  const maxVal = Math.max(...active.map((a) => a.value));
  const totalDef = active.reduce((s, a) => s + a.value, 0);

  const inner = (
    <div className={styles.chartInner}>
      <div className={styles.chartTitle}>Defense Profile</div>

      {/* Summary */}
      <div className={styles.chartSummary}>
        <span className={styles.chartSummaryVal}>{totalDef}</span>
        <span className={styles.chartSummaryUnit}>total</span>
        <span className={styles.chartSummarySep}>•</span>
        <span>{active.length} types</span>
      </div>

      <div className={styles.hBarRows}>
        {active.map((t, i) => (
          <Tooltip
            key={t.key}
            content={`${t.info.fullName} defense: ${t.value} — ${t.info.armorTip}`}
            placement="right"
          >
            <div className={styles.hBarRowRanked}>
              <div
                className={styles.hBarRank}
                style={{ borderColor: t.color, color: t.color }}
              >
                {i + 1}
              </div>
              <span className={styles.hBarLabel}>{t.info.label}</span>
              <div className={styles.hBarTrack}>
                <div
                  className={styles.hBarFill}
                  style={{
                    width: `${(t.value / maxVal) * 100}%`,
                    backgroundColor: t.color,
                    boxShadow: `0 0 8px ${t.color}50`,
                  }}
                />
              </div>
              <div className={styles.hBarValue} style={{ color: t.color }}>
                {t.value}
                <span className={styles.hBarPct}>
                  {Math.round((t.value / totalDef) * 100)}%
                </span>
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
