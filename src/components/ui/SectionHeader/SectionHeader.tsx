import styles from "./SectionHeader.module.css";

export type HeaderSize = "sm" | "md" | "lg";

export interface SectionHeaderProps {
  /** Header text displayed inside brackets */
  title: string;
  /** Text size (default: "md") */
  size?: HeaderSize;
  /** Use accent color (default: false) */
  accent?: boolean;
  /** Optional className */
  className?: string;
}

export function SectionHeader({
  title,
  size = "md",
  accent = false,
  className = "",
}: SectionHeaderProps) {
  const classes = [
    styles.header,
    size !== "md" && styles[`header--${size}`],
    accent && styles["header--accent"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <span className={styles.label}>{title}</span>
    </div>
  );
}
