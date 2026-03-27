#!/usr/bin/env node
/**
 * Check for duplicate M-Type asteroids in map POIs
 * Run: node check-map-duplicates.mjs
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error("Missing SANITY env vars");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const query = `
  *[_type == "mapPoi" && category == "asteroid-m"] | order(name asc) {
    _id,
    name,
    category,
    euX,
    euY,
    euZ
  }
`;

async function checkDuplicates() {
  try {
    const pois = await client.fetch(query);
    console.log(`\n📍 Found ${pois.length} M-Type Asteroids\n`);

    const byName = {};
    const byCoords = {};

    pois.forEach((poi) => {
      // Check by name
      if (!byName[poi.name]) byName[poi.name] = [];
      byName[poi.name].push(poi);

      // Check by coordinates
      const coords = `${poi.euX},${poi.euY},${poi.euZ}`;
      if (!byCoords[coords]) byCoords[coords] = [];
      byCoords[coords].push(poi);
    });

    // Report name duplicates
    console.log("❌ DUPLICATES BY NAME:");
    let nameDupes = 0;
    Object.entries(byName).forEach(([name, items]) => {
      if (items.length > 1) {
        console.log(`  "${name}" — ${items.length} POIs`);
        items.forEach((poi) =>
          console.log(
            `    - ID: ${poi._id} | Coords: (${poi.euX}, ${poi.euY}, ${poi.euZ})`,
          ),
        );
        nameDupes++;
      }
    });

    // Report coordinate duplicates
    console.log("\n❌ DUPLICATES BY COORDINATES:");
    let coordDupes = 0;
    Object.entries(byCoords).forEach(([coords, items]) => {
      if (items.length > 1) {
        console.log(`  Coords (${coords}) — ${items.length} POIs`);
        items.forEach((poi) =>
          console.log(`    - "${poi.name}" (ID: ${poi._id})`),
        );
        coordDupes++;
      }
    });

    console.log(`\n📊 SUMMARY:`);
    console.log(`  Total M-Type Asteroids: ${pois.length}`);
    console.log(`  Duplicate Names: ${nameDupes}`);
    console.log(`  Duplicate Coordinates: ${coordDupes}`);

    if (nameDupes === 0 && coordDupes === 0) {
      console.log("\n✅ No duplicates found!");
    }
  } catch (error) {
    console.error("Error fetching POIs:", error.message);
    process.exit(1);
  }
}

checkDuplicates();
