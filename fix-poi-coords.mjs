import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

console.log("🔍 Checking POI coordinates for commas...\n");

// Query all POIs
const pois = await client.fetch(`*[_type == "mapPoi"]`);

const poisWithCommas = [];

for (const poi of pois) {
  let hasCommas = false;
  const updates = {};

  // Check euX
  if (typeof poi.euX === "string" && poi.euX.includes(",")) {
    updates.euX = parseInt(poi.euX.replace(/,/g, ""), 10);
    hasCommas = true;
  }

  // Check euY
  if (typeof poi.euY === "string" && poi.euY.includes(",")) {
    updates.euY = parseInt(poi.euY.replace(/,/g, ""), 10);
    hasCommas = true;
  }

  // Check euZ
  if (typeof poi.euZ === "string" && poi.euZ.includes(",")) {
    updates.euZ = parseInt(poi.euZ.replace(/,/g, ""), 10);
    hasCommas = true;
  }

  if (hasCommas) {
    poisWithCommas.push({
      _id: poi._id,
      name: poi.name,
      before: { euX: poi.euX, euY: poi.euY, euZ: poi.euZ },
      after: {
        euX: updates.euX || poi.euX,
        euY: updates.euY || poi.euY,
        euZ: updates.euZ || poi.euZ,
      },
    });
  }
}

if (poisWithCommas.length === 0) {
  console.log("✅ All POI coordinates are clean (no commas found)");
} else {
  console.log(
    `⚠️  Found ${poisWithCommas.length} POI(s) with comma-formatted coordinates:\n`,
  );

  for (const poi of poisWithCommas) {
    console.log(`  ${poi.name} (${poi._id})`);
    console.log(
      `    Before: euX=${poi.before.euX}, euY=${poi.before.euY}, euZ=${poi.before.euZ}`,
    );
    console.log(
      `    After:  euX=${poi.after.euX}, euY=${poi.after.euY}, euZ=${poi.after.euZ}\n`,
    );
  }

  console.log(`\n🔧 Updating ${poisWithCommas.length} POI(s)...\n`);

  // Update all POIs with commas
  for (const poi of poisWithCommas) {
    try {
      const updates = {};
      if (typeof poi.before.euX === "string")
        updates.euX = parseInt(poi.before.euX.replace(/,/g, ""), 10);
      if (typeof poi.before.euY === "string")
        updates.euY = parseInt(poi.before.euY.replace(/,/g, ""), 10);
      if (typeof poi.before.euZ === "string")
        updates.euZ = parseInt(poi.before.euZ.replace(/,/g, ""), 10);

      await client.patch(poi._id).set(updates).commit();

      console.log(`✅ Updated: ${poi.name}`);
    } catch (error) {
      console.error(`❌ Failed to update ${poi.name}:`, error.message);
    }
  }

  console.log(
    `\n✨ Coordinate cleanup complete! ${poisWithCommas.length} POI(s) updated.`,
  );
}
