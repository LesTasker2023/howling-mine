/**
 * Shared Framer Motion animation presets.
 *
 * Keeps every animated component consistent: same ease, same stagger cadence,
 * same spring feel. Import what you need — no runtime cost for unused presets.
 */
import type { Variants, Transition } from "framer-motion";

// ── Timing ──

/** Default transition — snappy spring, no bounce */
export const SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

/** Soft ease for fades and slides */
export const EASE: Transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1], // matches --ease-out token
};

// ── Container (staggers children) ──

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// ── Fade-up (cards, grid items) ──

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: EASE,
  },
};

// ── Fade-in (panels, sections) ──

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// ── Scale-up (buttons, badges on hover) ──

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: SPRING,
  },
};

// ── Slide-in from left (breadcrumbs, filter chips) ──

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: EASE,
  },
};
