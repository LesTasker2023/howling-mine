"use client";

import { useEffect } from "react";
import { useTopBar } from "@/context/TopBarContext";
import {
  isPlanet,
  getClassification,
  PLANET_CLASSIFICATIONS,
} from "@/lib/constants/planet-classification";
import type { PlanetStats } from "@/types/mobs";

/**
 * Sets up planet tabs in the top bar.
 *
 * Shows "All" + main planets only (moons/instances omitted for tab-bar clarity).
 * When a planet is active, shows related moons & areas as sub-tabs.
 * Tabs link to `/mobs/browse?planet=X&sort=Y` and update when sort changes.
 *
 * @param allPlanets  Full planet stats array from the server.
 * @param activePlanet  Currently selected planet (undefined = "All").
 * @param currentSort   Current sort param to preserve in tab hrefs.
 */
export function usePlanetTabs(
  allPlanets: PlanetStats[],
  activePlanet?: string,
  currentSort?: string,
) {
  const { setTabs, setActiveTab, setSubTabs, setActiveSubTab } = useTopBar();
  const sort = currentSort || "name";

  // Resolve parent if activePlanet is a moon/instance
  const cls = activePlanet ? getClassification(activePlanet) : null;
  const parentPlanet = cls?.parent ?? activePlanet; // e.g. "Arkadia" for "Arkadia Moon"
  const isChild = !!cls?.parent;

  useEffect(() => {
    const mainPlanets = allPlanets
      .filter((p) => isPlanet(p.planetName))
      .sort(
        (a, b) =>
          getClassification(a.planetName).order -
          getClassification(b.planetName).order,
      );

    const tabs = [
      ...mainPlanets.map((p) => ({
        key: p.planetName,
        label: p.planetName,
        href: `/mobs/browse?planet=${encodeURIComponent(p.planetName)}&sort=${sort}`,
      })),
    ];

    setTabs(tabs);
    // Highlight the parent planet when viewing a child
    setActiveTab(parentPlanet || "");
  }, [allPlanets, parentPlanet, sort, setTabs, setActiveTab]);

  // Compute sub-tabs: moons, stations, instances parented to the active/parent planet
  useEffect(() => {
    if (!parentPlanet) {
      setSubTabs([]);
      return;
    }

    // Find all entries whose parent matches the parent planet
    const children = Object.entries(PLANET_CLASSIFICATIONS)
      .filter(([, c]) => c.parent === parentPlanet)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([name]) => name);

    // Only include children that actually have mobs (exist in allPlanets)
    const planetSet = new Set(allPlanets.map((p) => p.planetName));
    const validChildren = children.filter((name) => planetSet.has(name));

    if (validChildren.length === 0) {
      setSubTabs([]);
      return;
    }

    const subs = validChildren.map((name) => ({
      key: name,
      label: name,
      href: `/mobs/browse?planet=${encodeURIComponent(name)}&sort=${sort}`,
    }));

    setSubTabs(subs);
    // If currently viewing a child, mark it active
    setActiveSubTab(isChild && activePlanet ? activePlanet : "");
  }, [
    parentPlanet,
    activePlanet,
    isChild,
    allPlanets,
    sort,
    setSubTabs,
    setActiveSubTab,
  ]);
}
