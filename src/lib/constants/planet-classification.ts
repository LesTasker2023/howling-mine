/**
 * Classification of known planet/area names in Entropia Universe.
 *
 * Used to:
 * - Group the mob funnel into Planets / Moons & Stations / Instances / Space
 * - Decide which entries appear as top-bar planet tabs (planets only)
 * - Show parent relationships on sub-area cards
 */

export type PlanetCategory = "planet" | "moon" | "instance" | "event" | "space";

export interface PlanetClassification {
  category: PlanetCategory;
  /** Parent planet name, if this is a moon/instance/event of a main planet. */
  parent?: string;
  /** Sort order within its category (lower = first). */
  order: number;
}

/**
 * Master classification map.
 * Keys must match `Mob.planetName` values exactly.
 * Unknown entries are treated as unclassified planets (category "planet", order 99).
 */
export const PLANET_CLASSIFICATIONS: Record<string, PlanetClassification> = {
  /* ── Planets ── */
  Calypso: { category: "planet", order: 1 },
  Arkadia: { category: "planet", order: 2 },
  Cyrene: { category: "planet", order: 3 },
  "Next Island": { category: "planet", order: 4 },
  Toulan: { category: "planet", order: 5 },
  ROCKtropia: { category: "planet", order: 6 },
  "Howling Mine": { category: "planet", order: 7 },

  /* ── Moons & Stations ── */
  "Arkadia Moon": { category: "moon", parent: "Arkadia", order: 10 },
  "Crystal Palace": { category: "moon", parent: "Calypso", order: 11 },
  "Asteroid F.O.M.A.": { category: "moon", parent: "Calypso", order: 12 },
  Monria: { category: "moon", parent: "Calypso", order: 13 },
  Setesh: { category: "moon", parent: "Calypso", order: 14 },
  ARIS: { category: "moon", parent: "Calypso", order: 15 },

  /* ── Instances & Sub-areas ── */
  "Arkadia Underground": {
    category: "instance",
    parent: "Arkadia",
    order: 20,
  },
  DSEC9: { category: "instance", parent: "Calypso", order: 21 },
  "Ancient Greece": { category: "instance", parent: "Next Island", order: 22 },
  "Secret Island": { category: "instance", parent: "Next Island", order: 23 },
  HELL: { category: "instance", parent: "ROCKtropia", order: 24 },

  /* ── Space ── */
  Space: { category: "space", order: 30 },
};

/**
 * Planet names that exist in the DB but should be hidden from the UI.
 * These won't appear in the funnel, tabs, or browse pages.
 */
export const HIDDEN_PLANETS = new Set(["Hunt The THING", "Entropia Universe"]);

/** Quick check: is this name a main planet? */
export function isPlanet(name: string): boolean {
  return getClassification(name).category === "planet";
}

/** Get classification for a planet name. Unknown entries default to "planet". */
export function getClassification(name: string): PlanetClassification {
  return PLANET_CLASSIFICATIONS[name] ?? { category: "planet", order: 99 };
}

/** Display labels for each category in the funnel. */
export const CATEGORY_LABELS: Record<PlanetCategory, string> = {
  planet: "Planets",
  moon: "Moons & Stations",
  instance: "Instances & Dungeons",
  event: "Events",
  space: "Space & Other",
};

/** Category display order for the funnel page. */
const CATEGORY_ORDER: PlanetCategory[] = [
  "planet",
  "moon",
  "instance",
  "event",
  "space",
];

/**
 * Group an array of planet stats by classification category.
 * Returns groups in display order, omitting empty categories.
 */
export function groupByCategory<T extends { planetName: string }>(
  items: T[],
): { category: PlanetCategory; label: string; items: T[] }[] {
  const grouped = new Map<PlanetCategory, T[]>();

  for (const item of items) {
    const cat = getClassification(item.planetName).category;
    const list = grouped.get(cat) ?? [];
    list.push(item);
    grouped.set(cat, list);
  }

  // Sort items within each category by order
  for (const [, list] of grouped) {
    list.sort(
      (a, b) =>
        getClassification(a.planetName).order -
        getClassification(b.planetName).order,
    );
  }

  return CATEGORY_ORDER.filter((cat) => grouped.has(cat)).map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: grouped.get(cat)!,
  }));
}
