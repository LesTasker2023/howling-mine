import styles from "./Skeleton.module.css";

export type SkeletonVariant = "text" | "block" | "circle" | "stat" | "card";

export interface SkeletonProps {
  /** Shape variant (default: "text") */
  variant?: SkeletonVariant;
  /** Custom width (CSS value) */
  width?: string;
  /** Custom height (CSS value) */
  height?: string;
  /** Number of text lines for multi-line variant (default: 1) */
  lines?: number;
  /** Optional className */
  className?: string;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
}: SkeletonProps) {
  const classes = [styles.skeleton, styles[`skeleton--${variant}`], className]
    .filter(Boolean)
    .join(" ");

  if (variant === "card") {
    return (
      <div className={classes} style={{ width, height }}>
        <div className={styles.cardHeader} />
        <div className={styles.cardBody}>
          <div className={styles.cardLine} />
          <div className={styles.cardLine} style={{ width: "60%" }} />
          <div className={styles.cardLine} style={{ width: "80%" }} />
        </div>
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div className={classes} style={{ width }}>
        <div className={styles.statLabel} />
        <div className={styles.statValue} />
      </div>
    );
  }

  if (lines > 1) {
    return (
      <div className={styles.lines} style={{ width }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={classes}
            style={{
              width: i === lines - 1 ? "60%" : "100%",
              height,
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={classes} style={{ width, height }} />;
}
