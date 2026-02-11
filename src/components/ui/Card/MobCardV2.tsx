"use client";

import type { MobSummary } from "@/types/mobs";
import styles from "./MobCardV2.module.css";

export interface MobCardV2Props {
  /** Mob data to display */
  mob: MobSummary;
  /** Click handler */
  onClick?: () => void;
  /** Optional className */
  className?: string;
}

/**
 * MobCardV2 — Sci-fi framed mob card with circular rank badge.
 * Currently frame-only; content will be added later.
 */
export function MobCardV2({ mob, onClick, className }: MobCardV2Props) {
  // Threat rank 1-9 derived from min level
  const rank = mob.minLevel
    ? Math.min(9, Math.max(1, Math.ceil((mob.minLevel / 25) * 9)))
    : 1;

  // Deterministic Pokémon ID from mob name (1-649 for good artwork coverage)
  const pokeId =
    (mob.speciesName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
      649) +
    1;
  const pokeImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;

  return (
    <div
      className={`${styles.card}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Circular rank badge — top left */}
      <div className={styles.rankBadge}>
        {/* Octagonal outer frame */}
        <div className={styles.octFrame} />
        {/* Inner glow rings */}
        <div className={styles.rankGlow} />
        <div className={styles.rankRingOuter} />
        <div className={styles.rankRingInner} />
        {/* Crosshair lines */}
        <div className={styles.crosshair} />
        <span className={styles.rankValue}>{rank}</span>
      </div>

      {/* Top header bar */}
      <div className={styles.topBar}>
        <span className={styles.mobName}>{mob.speciesName}</span>
      </div>

      {/* Corner tech accents */}
      <div className={styles.cornerTL} />
      <div className={styles.cornerBR} />
      <div className={styles.bevelBL} />

      {/* Chevron marks */}
      <div className={styles.chevrons}>
        <div className={styles.chevron} />
        <div className={styles.chevron} />
        <div className={styles.chevron} />
      </div>

      {/* Main viewport */}
      <div className={styles.viewport}>
        <img
          src={pokeImg}
          alt={mob.speciesName}
          className={styles.mobImage}
          draggable={false}
        />
      </div>

      {/* Scanline overlay */}
      <div className={styles.scanlines} />
    </div>
  );
}
