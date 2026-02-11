import { compactNumber } from "@/lib/format";
import styles from "./StatBlock.module.css";

export type StatSize = "sm" | "md" | "lg";
export type TrendDirection = "up" | "down" | "neutral";

export interface StatBlockProps {
  /** Stat label text */
  label: string;
  /** Stat value — number or formatted string */
  value: string | number;
  /** Optional trend indicator with direction arrow */
  trend?: { value: string; direction: TrendDirection };
  /** Subtitle text below the value */
  sub?: string;
  /** Display size (default: "md") */
  size?: StatSize;
  /** Use accent color for value (default: false) */
  accent?: boolean;
  /** Optional className */
  className?: string;
}

export function StatBlock({
  label,
  value,
  trend,
  sub,
  size = "md",
  accent = false,
  className = "",
}: StatBlockProps) {
  const classes = [
    styles.stat,
    size !== "md" && styles[`stat--${size}`],
    accent && styles["stat--accent"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <span className={styles.stat__label}>{label}</span>
      <span className={styles.stat__value}>
        {typeof value === "number" ? compactNumber(value) : value}
        {trend && (
          <span
            className={`${styles.stat__trend} ${styles[`stat__trend--${trend.direction}`]}`}
          >
            {trend.direction === "up"
              ? "↑"
              : trend.direction === "down"
                ? "↓"
                : "→"}
            {trend.value}
          </span>
        )}
      </span>
      {sub && <span className={styles.stat__sub}>{sub}</span>}
    </div>
  );
}
