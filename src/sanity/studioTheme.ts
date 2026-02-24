"use client";

/**
 * Custom Sanity Studio theme — matches The Howling Mine dark gold aesthetic.
 *
 * Uses @sanity/ui buildTheme with proper ColorHueKey tokens.
 * Gold (#eab308) ≈ yellow hue in @sanity/color.
 */
import { buildTheme } from "@sanity/ui/theme";

export const howlingMineTheme = buildTheme({
  /* ── Color tokens ── */
  /* Values are [light, dark] tuples using Sanity color tokens. */
  /* Both set to same dark value so the studio is always dark. */
  color: {
    base: {
      default: {
        _hue: "yellow",
        bg: ["gray/950", "gray/950"],
        fg: ["gray/200", "gray/200"],
        border: ["gray/800", "gray/800"],
        focusRing: ["yellow/500", "yellow/500"],
      },
      primary: {
        _hue: "yellow",
        bg: ["yellow/950", "yellow/950"],
        fg: ["yellow/400", "yellow/400"],
        border: ["yellow/800", "yellow/800"],
        focusRing: ["yellow/500", "yellow/500"],
      },
      positive: {
        _hue: "green",
        bg: ["gray/950", "gray/950"],
        fg: ["green/400", "green/400"],
        border: ["green/800", "green/800"],
        focusRing: ["green/500", "green/500"],
      },
      caution: {
        _hue: "orange",
        bg: ["gray/950", "gray/950"],
        fg: ["orange/400", "orange/400"],
        border: ["orange/800", "orange/800"],
        focusRing: ["orange/500", "orange/500"],
      },
      critical: {
        _hue: "red",
        bg: ["gray/950", "gray/950"],
        fg: ["red/400", "red/400"],
        border: ["red/800", "red/800"],
        focusRing: ["red/500", "red/500"],
      },
      transparent: {
        _hue: "yellow",
        bg: ["gray/950", "gray/950"],
        fg: ["gray/200", "gray/200"],
        border: ["gray/800", "gray/800"],
        focusRing: ["yellow/500", "yellow/500"],
      },
    },
  },

  /* ── Radii — sharper, more tactical ── */
  radius: [0, 2, 4, 6, 8, 12],
});
