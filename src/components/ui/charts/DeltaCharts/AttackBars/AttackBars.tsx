"use client";

import { useMemo } from "react";
import { Panel } from "@/components/ui/Panel";
import { Tooltip } from "@/components/ui/Tooltip";
import { Badge } from "@/components/ui/Badge";
import { DAMAGE_TYPE_INFO, DAMAGE_RANK_COLORS } from "@/lib/mob-hints";
import type { MobAttack } from "@/types/mobs";
import styles from "../DeltaCharts.module.css";

/* ── helpers ── */

interface DmgType {
  key: string;
  value: number;
  label: string;
  fullName: string;
  color: string;
}

interface AttackGroup {
  atk: MobAttack;
  types: DmgType[];
  total: number;
}

/* ── Component ── */

interface AttackBarsProps {
  attacks: MobAttack[];
  /** Render without Panel wrapper */
  bare?: boolean;
}

export function AttackBars({ attacks, bare = false }: AttackBarsProps) {
  const maxDmg = Math.max(...attacks.map((a) => a.TotalDamage), 1);

  /* Per-attack: extract non-zero damage types, sorted + colored */
  const groups = useMemo<AttackGroup[]>(
    () =>
      attacks.map((atk) => {
        const rec = atk.Damage as unknown as Record<string, number | null>;
        const types: DmgType[] = [];
        for (const [key, info] of Object.entries(DAMAGE_TYPE_INFO)) {
          const v = rec[key] ?? 0;
          if (v > 0)
            types.push({
              key,
              value: v,
              label: info.label,
              fullName: info.fullName,
              color: "",
            });
        }
        types.sort((a, b) => b.value - a.value);
        types.forEach((t, i) => {
          t.color =
            DAMAGE_RANK_COLORS[Math.min(i, DAMAGE_RANK_COLORS.length - 1)];
        });
        const total = types.reduce((s, t) => s + t.value, 0);
        return { atk, types, total };
      }),
    [attacks],
  );

  /* Total damage across all attacks */
  const grandTotal = groups.reduce((s, g) => s + g.atk.TotalDamage, 0);

  if (!attacks.length) return null;

  /* Accent colors: first attack blue, second cyan, rest cycle */
  const ACCENT = ["#3b82f6", "#22d3ee", "#a78bfa", "#f59e0b"];

  const inner = (
    <div className={styles.chartInner}>
      <div className={styles.chartTitle}>Attack Comparison</div>

      {/* Summary */}
      <div className={styles.chartSummary}>
        <span className={styles.chartSummaryVal}>{grandTotal}</span>
        <span className={styles.chartSummaryUnit}>total dmg</span>
        <span className={styles.chartSummarySep}>•</span>
        <span>
          {attacks.length} attack{attacks.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Attack groups */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          width: "100%",
        }}
      >
        {groups.map((g, gi) => {
          const accent = ACCENT[gi % ACCENT.length];
          return (
            <div
              key={g.atk.Name}
              className={styles.attackGroup}
              style={{ borderColor: accent }}
            >
              {/* Header: name + badges + total */}
              <div className={styles.attackHeader}>
                <span className={styles.attackName}>{g.atk.Name}</span>
                {g.atk.IsAoE && (
                  <Badge variant="warning" dot>
                    AoE
                  </Badge>
                )}
                <span className={styles.attackTotalVal}>
                  {g.atk.TotalDamage}
                </span>
                <span className={styles.attackTotalUnit}>dmg</span>
              </div>

              {/* Thick stacked damage bar */}
              <Tooltip
                content={g.types
                  .map(
                    (t) =>
                      `${t.fullName}: ${t.value} (${Math.round((t.value / g.total) * 100)}%)`,
                  )
                  .join(" · ")}
                placement="top"
              >
                <div className={styles.attackStackedBar}>
                  {g.types.map((t) => (
                    <div
                      key={t.key}
                      className={styles.attackStackedSeg}
                      style={{
                        flex: t.value,
                        backgroundColor: t.color,
                        boxShadow: `0 0 6px ${t.color}40`,
                      }}
                    />
                  ))}
                </div>
              </Tooltip>

              {/* Per-type breakdown bars */}
              <div className={styles.hBarRows}>
                {g.types.map((t, ti) => (
                  <Tooltip
                    key={t.key}
                    content={`${DAMAGE_TYPE_INFO[t.key].fullName}: ${t.value} (${Math.round((t.value / g.total) * 100)}%)`}
                    placement="right"
                  >
                    <div className={styles.hBarRowRanked}>
                      <div
                        className={styles.hBarRank}
                        style={{ borderColor: t.color, color: t.color }}
                      >
                        {ti + 1}
                      </div>
                      <span className={styles.hBarLabel}>{t.label}</span>
                      <div className={styles.hBarTrack}>
                        <div
                          className={styles.hBarFill}
                          style={{
                            width: `${(t.value / g.total) * 100}%`,
                            backgroundColor: t.color,
                            boxShadow: `0 0 8px ${t.color}50`,
                          }}
                        />
                      </div>
                      <div
                        className={styles.hBarValue}
                        style={{ color: t.color }}
                      >
                        {t.value}
                        <span className={styles.hBarPct}>
                          {Math.round((t.value / g.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          );
        })}
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
