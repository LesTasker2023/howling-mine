"use client";

import { useId } from "react";
import styles from "./Toggle.module.css";

export type ToggleSize = "sm" | "md";

export interface ToggleProps {
  /** Whether the toggle is on */
  checked: boolean;
  /** Called when toggled */
  onChange: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Size variant (default: "md") */
  size?: ToggleSize;
  /** Disabled state (default: false) */
  disabled?: boolean;
  /** Optional className */
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  size = "md",
  disabled = false,
  className = "",
}: ToggleProps) {
  const id = useId();

  const classes = [
    styles.toggle,
    size === "sm" && styles["toggle--sm"],
    disabled && styles["toggle--disabled"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span
        className={`${styles.track} ${checked ? styles["track--on"] : ""}`}
        aria-hidden="true"
      >
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
