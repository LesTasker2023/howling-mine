import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";
import { MAP_POIS_QUERY } from "@/sanity/queries";
import { HowlingMineMap } from "@/components/composed/HowlingMineMap";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sector Map — The Howling Mine",
  description:
    "Interactive map of the Howling Mine sector. Stations, asteroids, and POIs with copyable in-game coordinates.",
};

export default async function MapPage() {
  const { data: pois } = await sanityFetch({
    query: MAP_POIS_QUERY,
  });

  return (
    <div className={styles.page}>
      <HowlingMineMap pois={pois ?? []} />
    </div>
  );
}
