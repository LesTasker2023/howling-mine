"use client";

import { Globe, Moon, Warehouse, CalendarClock, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { SectionHeader } from "@/components/ui/SectionHeader/SectionHeader";
import { StatBlock } from "@/components/ui/StatBlock/StatBlock";
import { Badge } from "@/components/ui/Badge/Badge";
import { getPlanetImage } from "@/lib/planet-images";
import type { PlanetStats } from "@/types/mobs";
import type { PlanetCategory } from "@/lib/constants/planet-classification";
import styles from "./PlanetCard.module.css";

/** Map planet category → bg icon. */
const CATEGORY_ICONS: Record<PlanetCategory, LucideIcon> = {
  planet: Globe,
  moon: Moon,
  instance: Warehouse,
  event: CalendarClock,
  space: Rocket,
};

export interface PlanetCardProps {
  /** Planet data to display */
  planet: PlanetStats;
  /** Planet classification category — determines the bg icon */
  category?: PlanetCategory;
  /** Click handler — typically selects this planet in the funnel */
  onClick?: () => void;
  /** Show a "START HERE" badge (e.g. for Calypso) */
  highlight?: boolean;
  /** Subtitle shown below the name (e.g. parent planet for moons) */
  subtitle?: string;
  /** Optional className for the outer Card */
  className?: string;
}

/**
 * Composed planet card for the mob funnel.
 *
 * Composes: Card(bgIcon) → SectionHeader → StatBlock → optional Badge
 * The background icon is determined by the planet's category.
 *
 * @example
 * ```tsx
 * <PlanetCard
 *   planet={planet}
 *   category="planet"
 *   onClick={() => selectPlanet(planet.planetName)}
 *   highlight={planet.planetName === "Calypso"}
 * />
 * ```
 */
export function PlanetCard({
  planet,
  category = "planet",
  onClick,
  highlight = false,
  subtitle,
  className,
}: PlanetCardProps) {
  const BgIcon = CATEGORY_ICONS[category];
  const planetImage = getPlanetImage(planet.planetName);

  return (
    <Card
      variant="interactive"
      bgIcon={BgIcon}
      bgImage={planetImage ?? undefined}
      onClick={onClick}
      className={className}
    >
      <SectionHeader title={planet.planetName} accent />
      {subtitle && <span className={styles.parentLabel}>{subtitle}</span>}
      <StatBlock label="Creatures" value={planet.mobCount} size="sm" />
      {highlight && <Badge variant="accent">START HERE</Badge>}
    </Card>
  );
}
