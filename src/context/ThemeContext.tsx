"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ── Preset hue values ── */
export const PRESETS: Record<string, number> = {
  gold: 48,
  cyan: 187,
  rose: 350,
  emerald: 155,
  violet: 270,
  blue: 220,
};

export interface ThemeConfig {
  mode: "dark" | "light";
  hue: number; // 0-360
  preset: string | null; // preset name or null for custom
  bgLightness: number; // 0-100  — how bright backgrounds are (default 0 dark / 95 light)
  bgTint: number; // 0-100  — how much accent hue bleeds into backgrounds
  mutedLightness: number; // 0-100 — brightness of muted/secondary text (default 33)
}

export interface ThemeColors {
  primary: string; // e.g. "#b8a206"
  primaryRgb: string; // e.g. "184, 162, 6"
  accent: string; // e.g. "#c8960a"
  accentRgb: string; // e.g. "200, 150, 10"
}

interface ThemeContextValue {
  config: ThemeConfig;
  colors: ThemeColors;
  setMode: (mode: "dark" | "light") => void;
  setHue: (hue: number) => void;
  setPreset: (name: string) => void;
  setBgLightness: (v: number) => void;
  setBgTint: (v: number) => void;
  setMutedLightness: (v: number) => void;
}

const DEFAULT_CONFIG: ThemeConfig = {
  mode: "dark",
  hue: 48,
  preset: "gold",
  bgLightness: 4,
  bgTint: 0,
  mutedLightness: 33,
};

const STORAGE_KEY = "hm-theme-v2";
const CSS_CACHE_KEY = "hm-theme-css";

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function computeColors(config: ThemeConfig): ThemeColors {
  const { mode, hue } = config;
  const [pr, pg, pb] = hslToRgb(hue, 90, mode === "dark" ? 45 : 42);
  return {
    primary: rgbToHex(pr, pg, pb),
    primaryRgb: `${pr}, ${pg}, ${pb}`,
    accent: rgbToHex(pr, pg, pb),
    accentRgb: `${pr}, ${pg}, ${pb}`,
  };
}

const DEFAULT_COLORS = computeColors(DEFAULT_CONFIG);

const ThemeContext = createContext<ThemeContextValue>({
  config: DEFAULT_CONFIG,
  colors: DEFAULT_COLORS,
  setMode: () => {},
  setHue: () => {},
  setPreset: () => {},
  setBgLightness: () => {},
  setBgTint: () => {},
  setMutedLightness: () => {},
});

/* ── HSL → RGB conversion ── */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) =>
    lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

/* ── Apply theme to <html> via CSS custom properties ── */
function applyTheme(config: ThemeConfig) {
  const root = document.documentElement;
  const { mode, hue, bgLightness, bgTint, mutedLightness } = config;

  // Primary & accent from hue (accent = primary for consistency)
  const [pr, pg, pb] = hslToRgb(hue, 90, mode === "dark" ? 45 : 42);
  const [ar, ag, ab] = [pr, pg, pb];

  root.dataset.theme = mode;
  root.style.colorScheme = mode;

  // ── Core colors ──
  root.style.setProperty("--color-primary", `rgb(${pr}, ${pg}, ${pb})`);
  root.style.setProperty("--color-primary-rgb", `${pr}, ${pg}, ${pb}`);
  root.style.setProperty("--color-accent", `rgb(${ar}, ${ag}, ${ab})`);
  root.style.setProperty("--color-accent-rgb", `${ar}, ${ag}, ${ab}`);
  root.style.setProperty("--text-accent", `rgb(${pr}, ${pg}, ${pb})`);

  // ── Compute backgrounds from bgLightness + bgTint ──
  const sat = bgTint; // 0 = neutral, 100 = fully tinted
  if (mode === "light") {
    // Light mode: bgLightness 0-100 maps to L 85-100
    const baseL = 85 + (bgLightness / 100) * 15;
    const [b0r, b0g, b0b] = hslToRgb(hue, sat, Math.min(baseL, 100));
    const [b1r, b1g, b1b] = hslToRgb(hue, sat, Math.min(baseL - 4, 100));
    const [b2r, b2g, b2b] = hslToRgb(hue, sat, Math.min(baseL + 3, 100));

    root.style.setProperty("--bg-base", rgbToHex(b0r, b0g, b0b));
    root.style.setProperty("--bg-base-rgb", `${b0r}, ${b0g}, ${b0b}`);
    root.style.setProperty("--bg-surface", rgbToHex(b1r, b1g, b1b));
    root.style.setProperty("--bg-panel", `rgba(${b2r}, ${b2g}, ${b2b}, 0.92)`);
    root.style.setProperty("--bg-elevated", rgbToHex(b2r, b2g, b2b));
    root.style.setProperty("--bg-hover", `rgba(255, 255, 255, 0.06)`);
    root.style.setProperty("--bg-active", `rgba(255, 255, 255, 0.10)`);

    // ── Light text ──
    root.style.setProperty("--text-primary", "#1a1a1a");
    root.style.setProperty("--text-secondary", "#525252");
    {
      const mL = 56 + ((100 - mutedLightness) / 100) * 24; // inverted: higher slider = darker muted in light mode (56-80%)
      const [mr, mg, mb] = hslToRgb(hue, 0, mL);
      root.style.setProperty("--text-muted", `rgb(${mr}, ${mg}, ${mb})`);
    }
    root.style.setProperty("--text-bright", "#0a0a0a");
    root.style.setProperty("--text-on-accent", "#ffffff");
  } else {
    // Dark mode: bgLightness 0-100 maps to L 2-18
    const baseL = 2 + (bgLightness / 100) * 16;
    const [b0r, b0g, b0b] = hslToRgb(hue, sat, baseL);
    const [b1r, b1g, b1b] = hslToRgb(hue, sat, baseL + 3);
    const [b2r, b2g, b2b] = hslToRgb(hue, sat, baseL + 6);

    root.style.setProperty("--bg-base", rgbToHex(b0r, b0g, b0b));
    root.style.setProperty("--bg-base-rgb", `${b0r}, ${b0g}, ${b0b}`);
    root.style.setProperty("--bg-surface", rgbToHex(b1r, b1g, b1b));
    root.style.setProperty("--bg-panel", `rgba(${b1r}, ${b1g}, ${b1b}, 0.85)`);
    root.style.setProperty("--bg-elevated", rgbToHex(b2r, b2g, b2b));
    root.style.setProperty("--bg-hover", `rgba(255, 255, 255, 0.06)`);
    root.style.setProperty("--bg-active", `rgba(255, 255, 255, 0.08)`);

    // ── Dark text ──
    root.style.setProperty("--text-primary", "#e2e8f0");
    root.style.setProperty("--text-secondary", "#a1a1a1");
    {
      const mL = 28 + (mutedLightness / 100) * 50; // 28-78% lightness (40% brighter than before)
      const [mr, mg, mb] = hslToRgb(hue, 0, mL);
      root.style.setProperty("--text-muted", `rgb(${mr}, ${mg}, ${mb})`);
    }
    root.style.setProperty("--text-bright", "#fafaf9");
    root.style.setProperty("--text-on-accent", "#0a0a0a");
  }

  // ── Borders ──
  const bNeutral = mode === "light" ? [0.1, 0.18] : [0.08, 0.14];
  const bAccent = mode === "light" ? [0.4, 0.45] : [0.35, 0.4];
  root.style.setProperty(
    "--border-subtle",
    `rgba(255, 255, 255, ${bNeutral[0]})`,
  );
  root.style.setProperty(
    "--border-default",
    `rgba(255, 255, 255, ${bNeutral[1]})`,
  );
  root.style.setProperty(
    "--border-strong",
    `rgba(255, 255, 255, ${mode === "light" ? 0.2 : 0.25})`,
  );
  root.style.setProperty(
    "--border-accent",
    `rgba(${ar}, ${ag}, ${ab}, ${bAccent[1]})`,
  );

  // ── Glows ──
  const gMul = mode === "light" ? 0.5 : 1;
  root.style.setProperty(
    "--glow-sm",
    `0 0 8px rgba(${pr}, ${pg}, ${pb}, ${0.2 * gMul})`,
  );
  root.style.setProperty(
    "--glow-md",
    `0 0 16px rgba(${pr}, ${pg}, ${pb}, ${0.25 * gMul})`,
  );
  root.style.setProperty(
    "--glow-lg",
    `0 0 32px rgba(${pr}, ${pg}, ${pb}, ${0.2 * gMul})`,
  );
  root.style.setProperty(
    "--glow-accent",
    `0 0 16px rgba(${ar}, ${ag}, ${ab}, ${0.3 * gMul})`,
  );
  root.style.setProperty(
    "--shadow-dropdown",
    mode === "light"
      ? "0 8px 24px rgba(0,0,0,0.12)"
      : "0 8px 24px rgba(0,0,0,0.4)",
  );

  // Cache all computed CSS vars for the blocking script
  const cssVars: Record<string, string> = {};
  for (let i = 0; i < root.style.length; i++) {
    const prop = root.style[i];
    if (prop.startsWith("--")) {
      cssVars[prop] = root.style.getPropertyValue(prop);
    }
  }
  cssVars["data-theme"] = mode;
  try {
    localStorage.setItem(CSS_CACHE_KEY, JSON.stringify(cssVars));
  } catch {
    /* ignore */
  }
}

/* ── Provider ── */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_COLORS);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Apply theme whenever config changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    applyTheme(config);
    setColors(computeColors(config));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config, hydrated]);

  const setMode = useCallback((mode: "dark" | "light") => {
    setConfig((prev) => ({ ...prev, mode }));
  }, []);

  const setHue = useCallback((hue: number) => {
    setConfig((prev) => ({ ...prev, hue, preset: null }));
  }, []);

  const setPreset = useCallback((name: string) => {
    const hue = PRESETS[name];
    if (hue !== undefined) {
      setConfig((prev) => ({ ...prev, hue, preset: name }));
    }
  }, []);

  const setBgLightness = useCallback((bgLightness: number) => {
    setConfig((prev) => ({ ...prev, bgLightness }));
  }, []);

  const setBgTint = useCallback((bgTint: number) => {
    setConfig((prev) => ({ ...prev, bgTint }));
  }, []);

  const setMutedLightness = useCallback((mutedLightness: number) => {
    setConfig((prev) => ({ ...prev, mutedLightness }));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        config,
        colors,
        setMode,
        setHue,
        setPreset,
        setBgLightness,
        setBgTint,
        setMutedLightness,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Convenience hook — returns live primary/accent hex & rgb strings. */
export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}
