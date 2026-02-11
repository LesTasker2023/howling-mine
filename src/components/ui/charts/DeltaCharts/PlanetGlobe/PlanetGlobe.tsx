"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import {
  MapPin,
  Copy,
  Check,
  Navigation,
  Shield,
  Swords,
  Skull,
  Bug,
  Users,
  Star,
  ChevronDown,
} from "lucide-react";

import { getPlanetImage } from "@/lib/planet-images";
import type { SpawnLocation, Maturity } from "@/types/mobs";
import styles from "./PlanetGlobe.module.css";

/* ── Deterministic pseudo-random from string ── */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Compute pin positions from real game coordinates.
 * Normalises all spawn coords into the visible face of the globe
 * (inner ~60% radius circle, centred at 50,50).
 * Falls back to deterministic hash placement when coords are missing.
 */
function computePinPositions(spawns: SpawnLocation[]) {
  const withCoords = spawns
    .map((s, i) => ({ s, i }))
    .filter(
      ({ s }) =>
        s.coordinates && s.coordinates.x != null && s.coordinates.y != null,
    );

  // Bounding box of all spawns that have coordinates
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const { s } of withCoords) {
    const c = s.coordinates!;
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Map each spawn → { x%, y% } on the globe
  const R = 28; // radius of placement circle (% of globe)
  const CX = 50,
    CY = 50;

  return spawns.map((s, i) => {
    if (s.coordinates && s.coordinates.x != null && s.coordinates.y != null) {
      // Normalise 0-1 within bounding box
      const nx = (s.coordinates.x - minX) / rangeX;
      const ny = (s.coordinates.y - minY) / rangeY;

      // Map into a circle: shift to -1..1, then scale by R
      // If only 1 spawn, centre it
      const px = withCoords.length === 1 ? CX : CX + (nx * 2 - 1) * R;
      // Invert Y: game latitude increases upward, screen Y increases downward
      const py = withCoords.length === 1 ? CY : CY - (ny * 2 - 1) * R;

      return {
        x: Math.max(18, Math.min(82, px)),
        y: Math.max(18, Math.min(82, py)),
      };
    }
    // Fallback: deterministic hash-based placement
    const seed = hash(s.id + s.locationName + i);
    const angle = (i * 137.508 * Math.PI) / 180 + (seed % 100) * 0.01;
    const r = 15 + (((seed % 40) + i * 7) % 35);
    return {
      x: Math.max(18, Math.min(82, 50 + r * Math.cos(angle))),
      y: Math.max(18, Math.min(82, 50 + r * Math.sin(angle))),
    };
  });
}

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Parse a shared-area location name and extract maturity names for our species.
 */
function extractMaturityNames(
  locationName: string,
  speciesName: string,
): string[] {
  const entries = locationName.split(/,\s*/);
  const speciesKey = normalizeName(speciesName);
  const match =
    entries.find((e) => normalizeName(e).startsWith(speciesKey)) ??
    entries.find((e) => normalizeName(e).includes(speciesKey));
  if (!match) return [];
  const dash = match.indexOf(" - ");
  if (dash === -1) return [];
  return match
    .slice(dash + 3)
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Build human-readable maturity range: "Young to Scout"
 */
function buildMaturityRange(locationName: string, speciesName: string): string {
  const names = extractMaturityNames(locationName, speciesName);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names[0]} to ${names[names.length - 1]}`;
}

/**
 * Get level range { lo, hi } for a spawn.
 */
function getLevelRange(
  spawn: SpawnLocation,
  speciesName: string,
  levelMap: Map<string, number>,
): { lo: number; hi: number } | null {
  const names = extractMaturityNames(spawn.locationName, speciesName);
  const levels = names
    .map((n) => levelMap.get(n.toLowerCase()))
    .filter((v): v is number => v != null);
  if (!levels.length) return null;
  return { lo: Math.min(...levels), hi: Math.max(...levels) };
}

/* ── Difficulty system: translate levels into beginner-friendly terms ── */

interface Difficulty {
  label: string;
  css: string;
  icon: typeof Shield;
  tip: string;
}

function getDifficulty(loLevel: number): Difficulty {
  if (loLevel <= 5)
    return {
      label: "Beginner",
      css: styles.diffBeginner,
      icon: Shield,
      tip: "Safe for new players — low damage, low HP",
    };
  if (loLevel <= 12)
    return {
      label: "Easy",
      css: styles.diffEasy,
      icon: Shield,
      tip: "Manageable with basic gear",
    };
  if (loLevel <= 25)
    return {
      label: "Moderate",
      css: styles.diffModerate,
      icon: Swords,
      tip: "Bring decent armor and healing",
    };
  if (loLevel <= 50)
    return {
      label: "Hard",
      css: styles.diffHard,
      icon: Swords,
      tip: "Experienced hunters with good gear",
    };
  return {
    label: "Dangerous",
    css: styles.diffDangerous,
    icon: Skull,
    tip: "Very high level — veterans only",
  };
}

/** Density in plain language */
function densityLabel(d: string | null): { text: string; css: string } | null {
  if (!d) return null;
  const key = d.toLowerCase();
  if (key === "low") return { text: "Few creatures", css: styles.densityLow };
  if (key === "medium")
    return { text: "Some creatures", css: styles.densityMedium };
  if (key === "high")
    return { text: "Lots of creatures", css: styles.densityHigh };
  if (key === "very high")
    return { text: "Packed with creatures", css: styles.densityVeryHigh };
  return null;
}

interface PlanetGlobeProps {
  planetName: string;
  spawns: SpawnLocation[];
  speciesName: string;
  maturities: Maturity[];
}

const DENSITY_ORDER: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  "very high": 3,
};

export function PlanetGlobe({
  planetName,
  spawns,
  speciesName,
  maturities,
}: PlanetGlobeProps) {
  const VISIBLE_COUNT = 5;
  const src = getPlanetImage(planetName);
  const globeRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  /* Map maturity name (lowercase) → level */
  const levelMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of maturities) {
      const lvl = m.Properties?.Level;
      if (lvl != null) map.set(m.Name.toLowerCase(), lvl);
    }
    return map;
  }, [maturities]);

  /* Map maturity name (lowercase) → HP */
  const hpMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of maturities) {
      const hp = m.Properties?.Health;
      if (hp != null) map.set(m.Name.toLowerCase(), hp);
    }
    return map;
  }, [maturities]);

  /* Pin positions */
  const pinPositions = useMemo(() => computePinPositions(spawns), [spawns]);

  /* Sort spawns: easiest first, densest as tie-break */
  const sorted = useMemo(() => {
    return spawns
      .map((spawn, idx) => {
        const range = getLevelRange(spawn, speciesName, levelMap);
        return { spawn, idx, lo: range?.lo ?? Infinity, hi: range?.hi ?? 0 };
      })
      .sort((a, b) => {
        if (a.lo !== b.lo) return a.lo - b.lo;
        const da = DENSITY_ORDER[(a.spawn.density ?? "").toLowerCase()] ?? -1;
        const db = DENSITY_ORDER[(b.spawn.density ?? "").toLowerCase()] ?? -1;
        return db - da;
      });
  }, [spawns, speciesName, levelMap]);

  /* Selection */
  const selected = selectedIdx != null ? sorted[selectedIdx] : null;

  const handleSelect = (sortedIdx: number) => {
    setSelectedIdx((prev) => (prev === sortedIdx ? null : sortedIdx));
  };

  const handlePinClick = (originalIdx: number) => {
    const sortedIdx = sorted.findIndex((s) => s.idx === originalIdx);
    if (sortedIdx >= 0) handleSelect(sortedIdx);
  };

  const handleCopyWP = (spawn: SpawnLocation, sortedIdx: number) => {
    if (
      !spawn.coordinates ||
      spawn.coordinates.x == null ||
      spawn.coordinates.y == null
    )
      return;
    const wp = `/wp [${planetName}, ${spawn.coordinates.x}, ${spawn.coordinates.y}, 0]`;
    navigator.clipboard.writeText(wp);
    setCopiedIdx(sortedIdx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className={styles.outer}>
      {/* ── Globe ── */}
      <div className={styles.wrap} ref={globeRef}>
        <div
          className={`${styles.globe} ${spawns.length === 0 ? styles.globeOffline : ""}`}
        >
          {src ? (
            <Image
              src={src}
              alt={planetName}
              fill
              sizes="400px"
              className={styles.planetImg}
              priority
            />
          ) : (
            <div className={styles.fallback} />
          )}
          <div className={styles.lighting} />
        </div>

        <div className={styles.pinLayer}>
          {spawns.map((spawn, originalIdx) => {
            const pos = pinPositions[originalIdx];
            const isSelected = selected != null && selected.idx === originalIdx;
            return (
              <div
                key={spawn.id}
                className={`${styles.pin} ${isSelected ? styles.pinSelected : ""}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => handlePinClick(originalIdx)}
              >
                <MapPin size={12} className={styles.pinIcon} />
                {isSelected && <span className={styles.pinRing} />}
              </div>
            );
          })}
        </div>

        {spawns.length === 0 && (
          <div className={styles.noSignal}>
            <div className={styles.scanLine} />
            <div className={styles.staticNoise} />
            <span className={styles.noSignalText}>[ NO SIGNAL ]</span>
          </div>
        )}

        <a
          href={`https://ripcraze.com/map/${planetName.toLowerCase()}/${speciesName
            .replace(/\s*\([^)]*\)/g, "")
            .trim()
            .toLowerCase()}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
          title="View detailed map on RipCraze"
        >
          R
        </a>

        <div className={styles.nameBadge}>
          <span className={styles.nameLabel}>{planetName}</span>
        </div>
      </div>

      {/* ── Spawn Cards ── */}
      {spawns.length > 0 && (
        <div className={styles.spawnSection}>
          <div className={styles.sectionHeader}>
            <MapPin size={13} className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>Where to Find Them</span>
            <span className={styles.sectionCount}>
              {spawns.length} {spawns.length === 1 ? "location" : "locations"}
            </span>
          </div>

          <div className={styles.cardList} ref={listRef}>
            {(showAll ? sorted : sorted.slice(0, VISIBLE_COUNT)).map(
              (s, sortedIdx) => {
                const isSelected = selectedIdx === sortedIdx;
                const isBest = sortedIdx === 0;
                const range = getLevelRange(s.spawn, speciesName, levelMap);
                const diff = range ? getDifficulty(range.lo) : null;
                const DiffIcon = diff?.icon ?? Shield;
                const matRange = buildMaturityRange(
                  s.spawn.locationName,
                  speciesName,
                );
                const matNames = extractMaturityNames(
                  s.spawn.locationName,
                  speciesName,
                );
                const density = densityLabel(s.spawn.density);
                const otherSpecies = s.spawn.otherSpecies.filter(
                  (sp) => sp !== speciesName,
                );
                const hasCoords =
                  s.spawn.coordinates &&
                  s.spawn.coordinates.x != null &&
                  s.spawn.coordinates.y != null;
                const isCopied = copiedIdx === sortedIdx;

                return (
                  <button
                    key={s.spawn.id}
                    className={`${styles.card} ${isSelected ? styles.cardActive : ""} ${diff?.css ?? ""}`}
                    onClick={() => handleSelect(sortedIdx)}
                    type="button"
                  >
                    {/* Difficulty stripe on left edge */}
                    <div className={styles.cardStripe} />

                    <div className={styles.cardBody}>
                      {/* Top row: difficulty badge + best-for-beginners */}
                      <div className={styles.cardTop}>
                        {diff && (
                          <span
                            className={`${styles.diffBadge} ${diff.css}`}
                            title={diff.tip}
                          >
                            <DiffIcon size={12} />
                            {diff.label}
                          </span>
                        )}
                        {isBest && diff && (
                          <span className={styles.bestBadge}>
                            <Star size={10} />
                            Best for Beginners
                          </span>
                        )}
                      </div>

                      {/* Main info */}
                      <div className={styles.cardMain}>
                        {matRange ? (
                          <span className={styles.cardMatRange}>
                            {matRange}
                          </span>
                        ) : (
                          <span className={styles.cardMatRange}>
                            {speciesName}
                          </span>
                        )}
                        {range && (
                          <span className={styles.cardLevels}>
                            Level {range.lo}
                            {range.hi !== range.lo ? `–${range.hi}` : ""}
                          </span>
                        )}
                      </div>

                      {/* Info pills */}
                      <div className={styles.cardPills}>
                        {density && (
                          <span className={`${styles.pill} ${density.css}`}>
                            <Users size={10} />
                            {density.text}
                          </span>
                        )}
                        {otherSpecies.length > 0 && (
                          <span className={styles.pill}>
                            <Bug size={10} />
                            {otherSpecies.length} other{" "}
                            {otherSpecies.length === 1 ? "species" : "species"}{" "}
                            nearby
                          </span>
                        )}
                      </div>

                      {/* Expanded details */}
                      {isSelected && (
                        <div className={styles.cardExpanded}>
                          {/* Maturities at this location */}
                          {matNames.length > 0 && (
                            <div className={styles.expandCell}>
                              <span className={styles.expandLabel}>
                                Creatures here:
                              </span>
                              <div className={styles.matList}>
                                {matNames.map((name) => {
                                  const lvl = levelMap.get(name.toLowerCase());
                                  const hp = hpMap.get(name.toLowerCase());
                                  return (
                                    <span key={name} className={styles.matTag}>
                                      {name}
                                      {lvl != null && (
                                        <span className={styles.matLvl}>
                                          {" "}
                                          Lv{lvl}
                                        </span>
                                      )}
                                      {hp != null && (
                                        <span className={styles.matHp}>
                                          {" "}
                                          · {hp} HP
                                        </span>
                                      )}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Other species detail */}
                          {otherSpecies.length > 0 && (
                            <div className={styles.expandCell}>
                              <span className={styles.expandLabel}>
                                Also at this location:
                              </span>
                              <div className={styles.matList}>
                                {otherSpecies.map((name) => (
                                  <span
                                    key={name}
                                    className={styles.speciesTag}
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom: TP + waypoint */}
                      <div className={styles.cardBottom}>
                        {s.spawn.nearestTp && (
                          <span className={styles.tpLabel}>
                            <Navigation size={11} />
                            Teleport to:{" "}
                            <strong>{s.spawn.nearestTp.name}</strong>
                          </span>
                        )}
                        {hasCoords && (
                          <span
                            className={`${styles.wpButton} ${isCopied ? styles.wpCopied : ""}`}
                            role="button"
                            tabIndex={-1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyWP(s.spawn, sortedIdx);
                            }}
                          >
                            {isCopied ? (
                              <>
                                <Check size={11} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={11} /> Copy Waypoint
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              },
            )}
          </div>

          {sorted.length > VISIBLE_COUNT && !showAll && (
            <button
              className={styles.showMoreBtn}
              onClick={() => setShowAll(true)}
              type="button"
            >
              <ChevronDown size={14} />
              Show {sorted.length - VISIBLE_COUNT} more locations
            </button>
          )}

          {showAll && sorted.length > VISIBLE_COUNT && (
            <button
              className={styles.showMoreBtn}
              onClick={() => setShowAll(false)}
              type="button"
            >
              <ChevronDown size={14} className={styles.chevronUp} />
              Show fewer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
