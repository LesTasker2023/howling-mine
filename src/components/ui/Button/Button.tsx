"use client";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style (default: "primary") */
  variant?: ButtonVariant;
  /** Button size (default: "md") */
  size?: ButtonSize;
  /** Stretch to full container width (default: false) */
  fullWidth?: boolean;
  /** Square icon-only button (default: false) */
  iconOnly?: boolean;
  /** Button content */
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconOnly = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    size !== "md" && styles[`btn--${size}`],
    fullWidth && styles["btn--full"],
    iconOnly && styles["btn--icon"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
