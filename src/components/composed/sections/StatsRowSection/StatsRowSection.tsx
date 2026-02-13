"use client";

import { StatBlock, SectionHeader } from "@/components/ui";
import type { TrendDirection } from "@/components/ui";
import styles from "./StatsRowSection.module.css";

interface StatItem {
  label: string;
  value: string;
  trendDirection?: "up" | "down" | "neutral" | "none";
  trendValue?: string;
  subtitle?: string;
}

interface StatsRowSectionProps {
  heading?: string;
  stats: StatItem[];
  accent?: boolean;
}

export function StatsRowSection({
  heading,
  stats,
  accent = false,
}: StatsRowSectionProps) {
  return (
    <section className={styles.section}>
      {heading && <SectionHeader title={heading} />}
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        }}
      >
        {stats.map((stat, i) => {
          const trend =
            stat.trendDirection && stat.trendDirection !== "none"
              ? {
                  value: stat.trendValue ?? "",
                  direction: stat.trendDirection as TrendDirection,
                }
              : undefined;

          return (
            <StatBlock
              key={i}
              label={stat.label}
              value={stat.value}
              trend={trend}
              sub={stat.subtitle}
              accent={accent}
              size="lg"
            />
          );
        })}
      </div>
    </section>
  );
}
