import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { MAP_POIS_QUERY } from "@/sanity/queries";
import { HowlingMineMap } from "@/components/composed/HowlingMineMap";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sector Map — The Howling Mine",
  description:
    "Interactive map of the Howling Mine sector. Stations, asteroids, and POIs with copyable in-game coordinates.",
};

export default async function MapPage() {
  let pois = [];
  try {
    pois =
      (await client.fetch(MAP_POIS_QUERY, {}, { next: { revalidate: 60 } })) ??
      [];
  } catch {
    /* Sanity not configured yet */
  }

  return (
    <div className={styles.page}>
      <HowlingMineMap pois={pois} />
    </div>
  );
}
