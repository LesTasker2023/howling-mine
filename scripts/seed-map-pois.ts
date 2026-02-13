/**
 * Seed Howling Mine map POIs into Sanity.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-map-pois.ts
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "u2kuytve",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_TOKEN ?? process.env.SANITY_API_TOKEN ?? "",
  apiVersion: "2024-01-01",
  useCdn: false,
});

interface PoiSeed {
  name: string;
  category: string;
  euX: number;
  euY: number;
  euZ: number;
  description?: string;
  pvpLootable?: boolean;
}

const POIS: PoiSeed[] = [
  // ─── Station ───
  {
    name: "Howling Mine SS",
    category: "station",
    euX: 78075,
    euY: 79467,
    euZ: -732,
    description: "Howling Mine space station. The primary hub of the sector.",
  },

  // ─── C-Type Asteroid ───
  {
    name: "C Cluster",
    category: "asteroid-c",
    euX: 75973,
    euY: 74597,
    euZ: -1815,
    description: "Carbon-type asteroid cluster on the southern fringe.",
  },

  // ─── M-Type Asteroids (PVP Lootable zone) ───
  {
    name: "M Big Alpha",
    category: "asteroid-m",
    euX: 78482,
    euY: 77117,
    euZ: -2919,
    pvpLootable: true,
  },
  {
    name: "M Massive 1",
    category: "asteroid-m",
    euX: 77024,
    euY: 77385,
    euZ: -2583,
    pvpLootable: true,
  },
  {
    name: "M Massive 2",
    category: "asteroid-m",
    euX: 77379,
    euY: 76741,
    euZ: -2937,
    pvpLootable: true,
  },
  {
    name: "M Big Beta",
    category: "asteroid-m",
    euX: 77347,
    euY: 75283,
    euZ: -1966,
    pvpLootable: true,
  },
  {
    name: "M Medium 1",
    category: "asteroid-m",
    euX: 76838,
    euY: 77232,
    euZ: -1378,
    pvpLootable: true,
  },
  {
    name: "M Small 1",
    category: "asteroid-m",
    euX: 76749,
    euY: 77395,
    euZ: -1883,
    pvpLootable: true,
  },
  {
    name: "M Small 2",
    category: "asteroid-m",
    euX: 79340,
    euY: 77095,
    euZ: -1240,
    pvpLootable: true,
  },
  {
    name: "M Small 3",
    category: "asteroid-m",
    euX: 79038,
    euY: 78130,
    euZ: -1407,
    pvpLootable: true,
  },
  {
    name: "M Small 4",
    category: "asteroid-m",
    euX: 79372,
    euY: 76779,
    euZ: -1380,
    pvpLootable: true,
  },
  {
    name: "M Small 5",
    category: "asteroid-m",
    euX: 79705,
    euY: 76131,
    euZ: -1631,
    pvpLootable: true,
  },
  {
    name: "M Small 6",
    category: "asteroid-m",
    euX: 79652,
    euY: 75665,
    euZ: -912,
    pvpLootable: true,
  },
  {
    name: "M Big Gamma",
    category: "asteroid-m",
    euX: 78376,
    euY: 76365,
    euZ: -149,
    pvpLootable: true,
  },
  {
    name: "M Big Delta",
    category: "asteroid-m",
    euX: 77081,
    euY: 75681,
    euZ: -1685,
    pvpLootable: true,
  },
  {
    name: "M Big Epsilon",
    category: "asteroid-m",
    euX: 76768,
    euY: 76331,
    euZ: -2249,
    pvpLootable: true,
  },
  {
    name: "M Big Zeta",
    category: "asteroid-m",
    euX: 77301,
    euY: 77748,
    euZ: -1905,
    pvpLootable: true,
  },
  {
    name: "M Big Eta",
    category: "asteroid-m",
    euX: 77167,
    euY: 77523,
    euZ: -1850,
    pvpLootable: true,
  },
  {
    name: "M Big Theta",
    category: "asteroid-m",
    euX: 77119,
    euY: 77148,
    euZ: -1769,
    pvpLootable: true,
  },
  {
    name: "M Big Iota",
    category: "asteroid-m",
    euX: 77068,
    euY: 76940,
    euZ: -1786,
    pvpLootable: true,
  },
  {
    name: "M Big Kappa",
    category: "asteroid-m",
    euX: 77710,
    euY: 75342,
    euZ: -1863,
    pvpLootable: true,
  },
  {
    name: "M Big Lambda",
    category: "asteroid-m",
    euX: 78242,
    euY: 78294,
    euZ: -2002,
    pvpLootable: true,
  },
  {
    name: "M Big Mu",
    category: "asteroid-m",
    euX: 77879,
    euY: 77984,
    euZ: -1741,
    pvpLootable: true,
  },
  {
    name: "M Small 7",
    category: "asteroid-m",
    euX: 77976,
    euY: 78633,
    euZ: -1920,
    pvpLootable: true,
  },

  // ─── ND-Type Asteroids ───
  {
    name: "ND Asteroid 1",
    category: "asteroid-nd",
    euX: 79145,
    euY: 78826,
    euZ: -996,
    description: "Non-depleting asteroid near the station.",
  },
  {
    name: "ND Cluster 1-4",
    category: "asteroid-nd",
    euX: 75733,
    euY: 77524,
    euZ: -1753,
    description: "Non-depleting asteroid group on the western edge.",
  },
];

async function seed() {
  console.log("🗺️  Seeding Howling Mine map POIs...\n");

  // Delete existing mapPoi documents
  const existing = await client.fetch<string[]>(`*[_type == "mapPoi"]._id`);
  if (existing.length) {
    console.log(`   Deleting ${existing.length} existing POIs...`);
    const tx = client.transaction();
    for (const id of existing) tx.delete(id);
    await tx.commit();
  }

  // Create new POIs
  const tx = client.transaction();
  for (const poi of POIS) {
    tx.create({
      _type: "mapPoi",
      name: poi.name,
      category: poi.category,
      euX: poi.euX,
      euY: poi.euY,
      euZ: poi.euZ,
      description: poi.description ?? "",
      pvpLootable: poi.pvpLootable ?? false,
      visible: true,
    });
  }

  const result = await tx.commit();
  console.log(
    `   ✅ Created ${POIS.length} POIs (tx: ${result.transactionId})\n`,
  );

  // Summary
  const cats = new Map<string, number>();
  for (const p of POIS) cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
  for (const [cat, count] of cats) {
    console.log(`   ${cat.padEnd(14)} ${count}`);
  }
  console.log(`\n   Total: ${POIS.length} POIs`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
