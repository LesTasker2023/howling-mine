/** Map planet names → image paths in /public/images/planets/ */

const PLANET_IMAGES: Record<string, string> = {
  Calypso: "/images/planets/calypso.png",
  Arkadia: "/images/planets/arkadia.png",
  Cyrene: "/images/planets/cyrene.png",
  "Next Island": "/images/planets/next-island.png",
  Rocktropia: "/images/planets/rocktropia.png",
};

export function getPlanetImage(planetName: string): string | null {
  return PLANET_IMAGES[planetName] ?? null;
}
