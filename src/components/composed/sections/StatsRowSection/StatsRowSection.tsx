"use client";

import { motion } from "framer-motion";
import { StatBlock, SectionHeader } from "@/components/ui";
import type { TrendDirection } from "@/components/ui";
import { fadeIn, staggerContainer, fadeUp } from "@/lib/motion";
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
    <motion.section
      className={styles.section}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {heading && <SectionHeader title={heading} />}
      <motion.div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
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
            <motion.div key={i} variants={fadeUp}>
              <StatBlock
                label={stat.label}
                value={stat.value}
                trend={trend}
                sub={stat.subtitle}
                accent={accent}
                size="lg"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
