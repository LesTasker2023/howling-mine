import styles from "./Badge.module.css";

export type BadgeVariant =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export interface BadgeProps {
  /** Badge label content */
  children: React.ReactNode;
  /** Color variant (default: "default") */
  variant?: BadgeVariant;
  /** Show status dot indicator (default: false) */
  dot?: boolean;
  /** Apply glow effect (default: false) */
  glow?: boolean;
  /** Optional className */
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  dot = false,
  glow = false,
  className = "",
}: BadgeProps) {
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    glow && styles["badge--glow"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {dot && <span className={styles.badge__dot} />}
      {children}
    </span>
  );
}
