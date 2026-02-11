"use client";

import { Tooltip } from "@/components/ui/Tooltip";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { compactNumber } from "@/lib/format";
import {
  levelHint,
  hpHint,
  dmgHint,
  regenHint,
  apmHint,
  logScale,
  STAT_RANGES,
} from "@/lib/mob-hints";
import {
  segPath,
  buildTicks,
  SEG_COUNT,
  GAP_DEG,
  SEG_DEG,
  R_OUTER,
  R_INNER,
  R_TICK,
  DIM_FILL,
} from "../hud-primitives";
import styles from "../DeltaCharts.module.css";

/* ── Interfaces ── */

export interface CombatStatsProps {
  level: number | null;
  hp: number | null;
  damage: number | null;
  regen: number | null;
  apm: number | null;
  hasAoE?: boolean;
  isTameable?: boolean;
  tamingLevel?: number | null;
}

/* ── Mini segmented gauge (per stat card) ── */

const CARD_GAUGE_SIZE = 64;
const GCX = CARD_GAUGE_SIZE / 2;
const GCY = CARD_GAUGE_SIZE / 2;
const G_R_OUTER = CARD_GAUGE_SIZE * R_OUTER;
const G_R_INNER = CARD_GAUGE_SIZE * R_INNER;
const G_RING_R = CARD_GAUGE_SIZE * R_TICK;

/** Color ramp: green → amber → red */
function gaugeColor(fill: number): string {
  if (fill < 0.33) return "#22c55e";
  if (fill < 0.66) return "#eab308";
  return "#ef4444";
}

function StatGauge({
  fill,
  color,
  id,
}: {
  fill: number;
  color: string;
  id: string;
}) {
  const litCount = Math.round(fill * SEG_COUNT);
  const ticks = buildTicks(GCX, GCY, G_RING_R, 72, 6);
  const filterId = `csGlow-${id}`;

  return (
    <svg
      viewBox={`0 0 ${CARD_GAUGE_SIZE} ${CARD_GAUGE_SIZE}`}
      width={CARD_GAUGE_SIZE}
      height={CARD_GAUGE_SIZE}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" in="SourceGraphic" result="blur" />
          <feFlood floodColor={color} floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx={GCX}
        cy={GCY}
        r={G_RING_R + 1}
        fill="none"
        stroke="rgba(148,163,184,0.1)"
        strokeWidth={0.5}
      />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.major ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.1)"}
          strokeWidth={t.major ? 0.8 : 0.4}
        />
      ))}

      {/* Segments */}
      {Array.from({ length: SEG_COUNT }, (_, i) => {
        const startDeg = i * (SEG_DEG + GAP_DEG);
        const lit = i < litCount;
        return (
          <path
            key={i}
            d={segPath(GCX, GCY, G_R_OUTER, G_R_INNER, startDeg, SEG_DEG)}
            fill={lit ? color : DIM_FILL}
            fillOpacity={lit ? 0.9 : 1}
            filter={lit ? `url(#${filterId})` : undefined}
          />
        );
      })}
    </svg>
  );
}

/* ── Stat Card ── */

interface StatCardProps {
  label: string;
  value: string | number;
  hint: string;
  tooltip: string;
  fill: number;
  color: string;
  id: string;
}

function StatCard({
  label,
  value,
  hint,
  tooltip,
  fill,
  color,
  id,
}: StatCardProps) {
  return (
    <Tooltip content={tooltip} placement="top">
      <div className={styles.statCard} style={{ cursor: "help" }}>
        <StatGauge fill={fill} color={color} id={id} />
        <span className={styles.statCardValue} style={{ color }}>
          {value}
        </span>
        <span className={styles.statCardLabel}>{label}</span>
        <span className={styles.statCardHint}>{hint}</span>
      </div>
    </Tooltip>
  );
}

/* ── Compute fill + color for each stat ── */

function statProps(
  stat: keyof typeof STAT_RANGES,
  value: number,
): { fill: number; color: string } {
  const fill = logScale(
    value,
    STAT_RANGES[stat].floor,
    STAT_RANGES[stat].ceiling,
  );
  return { fill, color: gaugeColor(fill) };
}

/* ── Component ── */

export function CombatStats({
  level,
  hp,
  damage,
  regen,
  apm,
  hasAoE,
  isTameable,
  tamingLevel,
}: CombatStatsProps) {
  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            alignSelf: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <span className={styles.chartTitle} style={{ marginBottom: 0 }}>
            Combat Profile
          </span>
          <Tooltip
            content="Key combat stats at this maturity. Hover each stat for details."
            placement="top"
          >
            <span className={styles.helpIcon}>?</span>
          </Tooltip>
          {hasAoE && (
            <Tooltip
              content="Area of Effect — attacks damage all nearby players."
              placement="top"
            >
              <div>
                <Badge variant="warning" dot>
                  AoE
                </Badge>
              </div>
            </Tooltip>
          )}
          {isTameable && (
            <Tooltip
              content={`Tameable${tamingLevel ? ` (requires Taming level ${tamingLevel})` : ""}`}
              placement="top"
            >
              <div>
                <Badge variant="accent" dot>
                  Tameable{tamingLevel ? ` L${tamingLevel}` : ""}
                </Badge>
              </div>
            </Tooltip>
          )}
        </div>

        <div className={styles.statGrid}>
          {level != null &&
            (() => {
              const { fill, color } = statProps("level", level);
              return (
                <StatCard
                  id="level"
                  label="Level"
                  value={level}
                  hint={levelHint(level)}
                  tooltip="The creature's level — higher = tougher."
                  fill={fill}
                  color={color}
                />
              );
            })()}

          {hp != null &&
            (() => {
              const { fill, color } = statProps("hp", hp);
              return (
                <StatCard
                  id="hp"
                  label="HP"
                  value={compactNumber(hp)}
                  hint={hpHint(hp)}
                  tooltip="Health Points — total damage to defeat it."
                  fill={fill}
                  color={color}
                />
              );
            })()}

          {damage != null &&
            (() => {
              const { fill, color } = statProps("damage", damage);
              return (
                <StatCard
                  id="dmg"
                  label="Dmg / Hit"
                  value={compactNumber(damage)}
                  hint={dmgHint(damage)}
                  tooltip="Damage per hit — health lost per attack."
                  fill={fill}
                  color={color}
                />
              );
            })()}

          {regen != null &&
            regen > 0 &&
            (() => {
              const { fill, color } = statProps("regen", regen);
              return (
                <StatCard
                  id="regen"
                  label="Regen"
                  value={regen.toFixed(1)}
                  hint={regenHint(regen)}
                  tooltip="Health regen — heals itself over time."
                  fill={fill}
                  color={color}
                />
              );
            })()}

          {apm != null &&
            (() => {
              const { fill, color } = statProps("apm", apm);
              return (
                <StatCard
                  id="apm"
                  label="Atk / Min"
                  value={apm}
                  hint={apmHint(apm)}
                  tooltip="Attacks per minute."
                  fill={fill}
                  color={color}
                />
              );
            })()}
        </div>
      </div>
    </Panel>
  );
}
