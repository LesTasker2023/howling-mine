"use client";

import type { LucideIcon } from "lucide-react";
import { Panel } from "../Panel/Panel";
import type { PanelVariant } from "../Panel/Panel";
import styles from "./Card.module.css";

export type CardVariant = "default" | "interactive" | "accent" | "compact";
export type CardSize = "sm" | "md" | "lg";

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Visual style (default: "default") */
  variant?: CardVariant;
  /** Padding size (default: "md") */
  size?: CardSize;
  /** Optional header image URL */
  image?: string;
  /** Alt text for image */
  imageAlt?: string;
  /** Image container height in px (default: 160) */
  imageHeight?: number;
  /** Lucide icon rendered as a subtle background watermark */
  bgIcon?: LucideIcon;
  /** Image URL rendered as a subtle background watermark (takes priority over bgIcon) */
  bgImage?: string;
  /** Click handler — renders card as a button when set */
  onClick?: () => void;
  /** Optional className */
  className?: string;
}

/* Map Card variant → Panel variant */
function panelVariant(v: CardVariant, clickable: boolean): PanelVariant {
  if (v === "accent") return "accent";
  if (v === "interactive" || clickable) return "interactive";
  return "default";
}

export function Card({
  children,
  variant = "default",
  size = "md",
  image,
  imageAlt = "",
  imageHeight = 160,
  bgIcon: BgIcon,
  bgImage,
  onClick,
  className = "",
}: CardProps) {
  const innerClasses = [
    styles.card,
    variant === "compact" && styles["card--compact"],
    size !== "md" && styles[`card--${size}`],
    onClick && styles["card--clickable"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = onClick ? "button" : "div";

  return (
    <Panel variant={panelVariant(variant, !!onClick)} size="flush" noAnimation>
      <Tag
        className={innerClasses}
        onClick={onClick}
        type={onClick ? "button" : undefined}
      >
        {bgImage ? (
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className={styles.bgImage}
          />
        ) : (
          BgIcon && <BgIcon className={styles.bgIcon} aria-hidden="true" />
        )}
        {image && (
          <div className={styles.imageWrap} style={{ height: imageHeight }}>
            <img src={image} alt={imageAlt} className={styles.image} />
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </Tag>
    </Panel>
  );
}
