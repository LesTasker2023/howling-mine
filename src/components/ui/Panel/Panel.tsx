"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import styles from "./Panel.module.css";

export type PanelVariant =
  | "default"
  | "interactive"
  | "accent"
  | "danger"
  | "ghost";
export type PanelSize = "sm" | "md" | "lg" | "flush";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant (default: "default") */
  variant?: PanelVariant;
  /** Padding size (default: "md") */
  size?: PanelSize;
  /** HTML element to render (default: "div") */
  as?: "div" | "section" | "article" | "aside";
  /** Disable entrance animation (default: false) */
  noAnimation?: boolean;
  /** Panel content */
  children: React.ReactNode;
}

const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
};

/**
 * HUD corner brackets, accent tabs & hash marks.
 *
 * Renders an SVG overlay that stretches with the panel (no viewBox).
 * Coordinates use px from edges + calc(100% - …) for far sides.
 *
 *   TL — notched diagonal bracket + filled wedge
 *   TR — L-bracket + hash marks
 *   BL — L-bracket + accent tab
 *   BR — notched diagonal bracket + filled wedge
 *
 * Plus edge accent bars and mid-edge tick marks.
 */
function CornerBrackets({ uid }: { uid: string }) {
  /*
   * The SVG is inset: -8px in CSS, so coordinate 8,8 = panel's 0,0 corner.
   * O = SVG origin offset (matches the CSS -8px inset).
   * All decorations are FIXED distance from their respective corners
   * so they look identical regardless of panel size.
   */
  const O = 8; // SVG offset to panel edge
  const P = 5; // protrusion px outside panel edge
  const A = 32; // bracket arm length
  const N = 12; // notch diagonal offset (matches --notch-size)
  const W = 7; // filled wedge thickness

  const tl = O - P; // TL/BR protrusion origin

  const glowUrl = `url(#${uid}-glow)`;
  const hatchUrl = `url(#${uid}-hatch)`;

  return (
    <svg className={styles.cornerSvg} aria-hidden>
      <defs>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" in="SourceGraphic" result="blur" />
          <feFlood
            floodColor="rgb(6, 182, 212)"
            floodOpacity="0.5"
            result="color"
          />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Diagonal hatch pattern for fills */}
        <pattern
          id={`${uid}-hatch`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="var(--corner-accent, rgba(6,182,212,0.35))"
            strokeWidth="2"
          />
        </pattern>
      </defs>

      {/* ─────── Top-Left: PROTRUDING notched diagonal + wedge ─────── */}
      <polyline
        className={styles.cornerLine}
        points={`${tl},${tl + A} ${tl},${tl + N} ${tl + N},${tl} ${tl + A},${tl}`}
        style={{ filter: glowUrl }}
      />
      <polygon
        className={styles.cornerFill}
        points={`${tl},${tl + N + W} ${tl},${tl + N} ${tl + N},${tl} ${tl + N + W},${tl}`}
        style={{ filter: glowUrl }}
      />
      {/* Indicator dot below TL bracket */}
      <circle
        className={styles.indicatorDot}
        cx={tl + 3}
        cy={tl + A + 10}
        r="2"
      />

      {/* ─────── Top-Right: L-bracket ─────── */}
      <line
        className={styles.cornerLine}
        x1={`calc(100% - ${O}px)`}
        y1={O + A}
        x2={`calc(100% - ${O}px)`}
        y2={O}
        style={{ filter: glowUrl }}
      />
      <line
        className={styles.cornerLine}
        x1={`calc(100% - ${O}px)`}
        y1={O}
        x2={`calc(100% - ${O + A}px)`}
        y2={O}
        style={{ filter: glowUrl }}
      />

      {/* ─────── Top edge: chevron accent bar ─────── */}
      <polygon
        className={styles.accentBar}
        points={`
          calc(100% - ${O + A + 50}px),${O - 1}
          calc(100% - ${O + A + 55}px),${O + 3}
          calc(100% - ${O + A + 85}px),${O + 3}
          calc(100% - ${O + A + 80}px),${O - 1}
        `}
        style={{ filter: glowUrl }}
      />
      {/* Small separator dash */}
      <line
        className={styles.accentBar}
        x1={`calc(100% - ${O + A + 44}px)`}
        y1={O}
        x2={`calc(100% - ${O + A + 36}px)`}
        y2={O}
        style={{
          strokeWidth: 2,
          fill: "none",
          stroke: "var(--corner-accent, rgba(6,182,212,0.4))",
        }}
      />

      {/* ─────── Bottom-Left: L-bracket + decorations ─────── */}
      <line
        className={styles.cornerLine}
        x1={O}
        y1={`calc(100% - ${O + A}px)`}
        x2={O}
        y2={`calc(100% - ${O}px)`}
        style={{ filter: glowUrl }}
      />
      <line
        className={styles.cornerLine}
        x1={O}
        y1={`calc(100% - ${O}px)`}
        x2={O + A}
        y2={`calc(100% - ${O}px)`}
        style={{ filter: glowUrl }}
      />
      {/* Cross mark at BL vertex */}
      <line
        className={styles.crossMark}
        x1={O}
        y1={`calc(100% - ${O + 3}px)`}
        x2={O}
        y2={`calc(100% - ${O - 3}px)`}
      />
      <line
        className={styles.crossMark}
        x1={O - 3}
        y1={`calc(100% - ${O}px)`}
        x2={O + 3}
        y2={`calc(100% - ${O}px)`}
      />

      {/* Bottom edge: hatched accent block (angular) */}
      <polygon
        className={styles.hatchBlock}
        points={`
          ${O + A + 6},calc(100% - ${O + 5}px)
          ${O + A + 6},calc(100% - ${O - 1}px)
          ${O + A + 30},calc(100% - ${O - 1}px)
          ${O + A + 30},calc(100% - ${O + 5}px)
        `}
        style={{ fill: hatchUrl }}
      />
      {/* Solid chevron accent next to hatch block */}
      <polygon
        className={styles.accentTab}
        points={`
          ${O + A + 34},calc(100% - ${O + 5}px)
          ${O + A + 34},calc(100% - ${O - 1}px)
          ${O + A + 54},calc(100% - ${O - 1}px)
          ${O + A + 50},calc(100% - ${O + 5}px)
        `}
        style={{ filter: glowUrl }}
      />
      {/* Indicator dots near BL */}
      <circle
        className={styles.indicatorDot}
        cx={O + A + 60}
        cy={`calc(100% - ${O}px)`}
        r="1.5"
      />
      <circle
        className={styles.indicatorDot}
        cx={O + A + 66}
        cy={`calc(100% - ${O}px)`}
        r="1.5"
      />
      <circle
        className={styles.indicatorDotBright}
        cx={O + A + 72}
        cy={`calc(100% - ${O}px)`}
        r="1.5"
      />

      {/* ─────── Bottom-Right: small filled wedge ─────── */}
      <rect
        className={styles.cornerFill}
        x={`calc(100% - ${tl + N + W}px)`}
        y={`calc(100% - ${tl + N + W}px)`}
        width={N + W}
        height={N + W}
        style={{
          filter: glowUrl,
          clipPath: `polygon(100% 0%, 100% ${N}px, ${N}px 100%, 0% 100%)`,
        }}
      />
    </svg>
  );
}

export function Panel({
  variant = "default",
  size = "md",
  as = "div",
  noAnimation = false,
  className = "",
  children,
  ...props
}: PanelProps) {
  const uid = useId();

  const classes = [
    styles.panel,
    variant !== "default" && styles[`panel--${variant}`],
    size !== "md" && styles[`panel--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = motionTags[as];

  return (
    <Tag
      className={classes}
      {...(noAnimation
        ? {}
        : {
            variants: fadeIn,
            initial: "hidden",
            whileInView: "show",
            viewport: { once: true, margin: "-40px" },
          })}
      {...(props as Record<string, unknown>)}
    >
      <div className={styles.panelBg} />
      <div className={styles.cornerTab} />
      <CornerBrackets uid={uid} />
      <div className={styles.content}>{children}</div>
    </Tag>
  );
}
