import styles from "./SegmentedBar.module.css";

export type BarVariant =
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";
export type BarSize = "sm" | "md" | "lg";

export interface SegmentedBarProps {
  /** Label text shown above the bar */
  label?: string;
  /** Fill percentage (0–100) */
  value: number;
  /** Number of segments to render (default: 10) */
  segments?: number;
  /** Color variant (default: "primary") */
  variant?: BarVariant;
  /** Bar size (default: "md") */
  size?: BarSize;
  /** Show percentage value text (default: true) */
  showValue?: boolean;
  /** Optional className */
  className?: string;
}

export function SegmentedBar({
  label,
  value,
  segments = 10,
  variant = "primary",
  size = "md",
  showValue = true,
  className = "",
}: SegmentedBarProps) {
  const filledCount = Math.round((value / 100) * segments);

  const classes = [
    styles.bar,
    variant !== "primary" && styles[`bar--${variant}`],
    size !== "md" && styles[`bar--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {(label || showValue) && (
        <div className={styles.bar__label}>
          {label && <span className={styles["bar__label-text"]}>{label}</span>}
          {showValue && (
            <span className={styles["bar__label-value"]}>
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div className={styles.bar__track}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`${styles.bar__segment} ${
              i < filledCount ? styles["bar__segment--filled"] : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
