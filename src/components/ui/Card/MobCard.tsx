"use client";

import { Crosshair } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "@/components/ui/Badge/Badge";
import {
  computeThreat,
  DAMAGE_TYPE_INFO,
  ARCHETYPE_DEFS,
} from "@/lib/mob-hints";
import { compactNumber } from "@/lib/format";
import type { MobSummary } from "@/types/mobs";
import styles from "./MobCard.module.css";

export interface MobCardProps {
  /** Mob data to display */
  mob: MobSummary;
  /** Click handler — typically navigates to the detail page */
  onClick?: () => void;
  /** Optional className for the outer Card */
  className?: string;
}

/** Format a min–max range string. */
function rangeStr(min: number | null, max: number | null): string {
  if (min == null) return "—";
  if (max != null && max !== min)
    return `${compactNumber(min)}–${compactNumber(max)}`;
  return compactNumber(min);
}

/**
 * Mob browse card — lightweight layout with CSS-only threat indicator.
 * Uses computeThreat (HP 40% + Damage 45% + Regen 15%) for accurate scoring.
 */
export function MobCard({ mob, onClick, className }: MobCardProps) {
  const threat = computeThreat(mob.minHp, mob.minDamage, mob.minRegen);

  return (
    <Card
      variant="interactive"
      bgIcon={Crosshair}
      onClick={onClick}
      className={className}
    >
      <div className={styles.cardBody}>
        <div className={styles.infoCol}>
          <div className={styles.nameRow}>
            <span className={styles.mobName}>{mob.name}</span>
            <span
              className={styles.threatDot}
              style={{ background: threat.color }}
              title={threat.description}
            />
          </div>

          <div className={styles.statRow}>
            <span className={styles.statItem}>
              <span className={styles.statLabel}>LV</span>
              <span className={styles.statValue}>
                {rangeStr(mob.minLevel, mob.maxLevel)}
              </span>
            </span>
            <span className={styles.statDivider} />
            <span className={styles.statItem}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>
                {rangeStr(mob.minHp, mob.maxHp)}
              </span>
            </span>
            {mob.minDamage != null && (
              <>
                <span className={styles.statDivider} />
                <span className={styles.statItem}>
                  <span className={styles.statLabel}>DMG</span>
                  <span className={styles.statValue}>
                    {compactNumber(mob.minDamage)}
                  </span>
                </span>
              </>
            )}
          </div>

          {mob.damageTypes && (
            <div className={styles.dmgRow}>
              {Object.entries(mob.damageTypes)
                .sort((a, b) => b[1] - a[1])
                .map(([type, pct]) => {
                  const info = DAMAGE_TYPE_INFO[type];
                  return (
                    <span
                      key={type}
                      className={styles.dmgPill}
                      title={`${info?.fullName ?? type}: ${pct}%`}
                    >
                      {info?.label ?? type.slice(0, 3).toUpperCase()}
                    </span>
                  );
                })}
            </div>
          )}

          <div className={styles.badgeRow}>
            {mob.archetype &&
              (() => {
                const def =
                  ARCHETYPE_DEFS[mob.archetype as keyof typeof ARCHETYPE_DEFS];
                if (!def) return null;
                return (
                  <Badge
                    variant="default"
                    title={`${def.description}${mob.archetypeConfidence === "inferred" ? " (estimated)" : ""}`}
                  >
                    {def.tag}
                    {mob.archetypeConfidence === "inferred" ? "*" : ""}
                  </Badge>
                );
              })()}
            {mob.isSweatable && (
              <Badge variant="success" dot>
                Sweatable
              </Badge>
            )}
            {mob.lootCount > 10 && (
              <Badge variant="primary" dot>
                Codex
              </Badge>
            )}
            <Badge variant="default">{mob.mobType}</Badge>
            {mob.lootCount > 0 && (
              <Badge variant="default">
                {compactNumber(mob.lootCount)} loot
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
