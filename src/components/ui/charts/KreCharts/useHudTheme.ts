"use client";

import { useMemo } from "react";
import { useThemeColors } from "@/context/ThemeContext";

/**
 * Returns a live version of the HUD chart theme that updates when the user
 * changes the accent colour or switches light/dark mode.
 *
 * Drop-in replacement for the static hud-theme.ts exports.
 */
export function useHudTheme() {
  const { primary, primaryRgb, accent, accentRgb } = useThemeColors();

  return useMemo(() => {
    const PALETTE = [
      primary,
      "#f472b6",
      accent,
      "#a78bfa",
      "#34d399",
      "#22d3ee",
      "#fb923c",
      "#e2e8f0",
    ];

    const DUO = { a: primary, b: "#f472b6" };

    const AXIS = {
      tick: {
        fill: "#a1a1a1",
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
      },
      axisLine: { stroke: `rgba(${primaryRgb}, 0.15)` },
      tickLine: false as const,
    };

    const GRID = {
      stroke: `rgba(${primaryRgb}, 0.08)`,
      strokeDasharray: "3 3",
    };

    const TOOLTIP_STYLE = {
      contentStyle: {
        background: "rgba(18, 18, 18, 0.95)",
        border: `1px solid rgba(${primaryRgb}, 0.25)`,
        borderRadius: 4,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: "#e2e8f0",
        boxShadow: `0 0 20px rgba(${primaryRgb}, 0.15)`,
      },
      cursor: { fill: `rgba(${primaryRgb}, 0.06)` },
      itemStyle: { color: "#e2e8f0" },
      labelStyle: {
        color: "#94a3b8",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
      },
    };

    const DIM_FILL = `rgba(${primaryRgb}, 0.06)`;
    const POLAR_GRID_STROKE = `rgba(${primaryRgb}, 0.12)`;

    return {
      PALETTE,
      DUO,
      AXIS,
      GRID,
      TOOLTIP_STYLE,
      DIM_FILL,
      POLAR_GRID_STROKE,
    };
  }, [primary, primaryRgb, accent, accentRgb]);
}
