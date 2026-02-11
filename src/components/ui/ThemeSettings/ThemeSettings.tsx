"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme, PRESETS } from "@/context/ThemeContext";
import styles from "./ThemeSettings.module.css";

const PRESET_INFO: { name: string; label: string; swatch: string }[] = [
  { name: "gold", label: "Gold", swatch: "#eab308" },
  { name: "cyan", label: "Cyan", swatch: "#06b6d4" },
  { name: "rose", label: "Rose", swatch: "#f43f5e" },
  { name: "emerald", label: "Emerald", swatch: "#10b981" },
  { name: "violet", label: "Violet", swatch: "#8b5cf6" },
  { name: "blue", label: "Blue", swatch: "#3b82f6" },
];

export function ThemeSettings() {
  const { config, setMode, setHue, setPreset, setBgLightness, setBgTint } =
    useTheme();

  return (
    <div className={styles.container}>
      {/* ── Mode toggle ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Appearance</h3>
        <div className={styles.modeToggle}>
          <button
            className={styles.modeBtn}
            data-active={config.mode === "dark"}
            onClick={() => setMode("dark")}
          >
            <Moon size={16} />
            <span>Dark</span>
          </button>
          <button
            className={styles.modeBtn}
            data-active={config.mode === "light"}
            onClick={() => setMode("light")}
          >
            <Sun size={16} />
            <span>Light</span>
          </button>
        </div>
      </section>

      {/* ── Palette presets ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Accent Color</h3>
        <div className={styles.presets}>
          {PRESET_INFO.map((p) => (
            <button
              key={p.name}
              className={styles.swatch}
              data-active={config.preset === p.name}
              style={{ "--swatch-color": p.swatch } as React.CSSProperties}
              onClick={() => setPreset(p.name)}
              title={p.label}
            >
              <span className={styles.swatchDot} />
              <span className={styles.swatchLabel}>{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Custom hue slider ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Custom Hue
          {config.preset === null && (
            <span className={styles.customBadge}>active</span>
          )}
        </h3>
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={0}
            max={360}
            value={config.hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className={styles.hueSlider}
          />
          <span className={styles.hueValue}>{config.hue}°</span>
        </div>
        <div
          className={styles.preview}
          style={
            {
              "--preview-color": `hsl(${config.hue}, 90%, 45%)`,
            } as React.CSSProperties
          }
        >
          <span className={styles.previewSwatch} />
          <span className={styles.previewLabel}>
            hsl({config.hue}, 90%, 45%)
          </span>
        </div>
      </section>

      {/* ── Background controls ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Backgrounds</h3>

        <label className={styles.sliderLabel}>
          <span>Brightness</span>
          <span className={styles.sliderVal}>{config.bgLightness}%</span>
        </label>
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={0}
            max={100}
            value={config.bgLightness}
            onChange={(e) => setBgLightness(Number(e.target.value))}
            className={styles.bgSlider}
          />
        </div>

        <label className={styles.sliderLabel}>
          <span>Color Tint</span>
          <span className={styles.sliderVal}>{config.bgTint}%</span>
        </label>
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={0}
            max={100}
            value={config.bgTint}
            onChange={(e) => setBgTint(Number(e.target.value))}
            className={styles.bgSlider}
          />
        </div>

        <div className={styles.bgPreview}>
          <div
            className={styles.bgPreviewChip}
            style={{ background: "var(--bg-base)" }}
          >
            <span>Base</span>
          </div>
          <div
            className={styles.bgPreviewChip}
            style={{ background: "var(--bg-surface)" }}
          >
            <span>Surface</span>
          </div>
          <div
            className={styles.bgPreviewChip}
            style={{ background: "var(--bg-panel)" }}
          >
            <span>Panel</span>
          </div>
          <div
            className={styles.bgPreviewChip}
            style={{ background: "var(--bg-elevated)" }}
          >
            <span>Elevated</span>
          </div>
        </div>
      </section>
    </div>
  );
}
