import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

const IMAGE_PATH =
  "C:\\Users\\les-t\\Documents\\GitHub\\ProjectDelta\\public\\images\\space-mining\\asteroid-nd-type-lg.webp";

console.log("📊 Generating names and descriptions for M-Type asteroids...\n");

// Fetch all M-Types
const asteroids = await client.fetch(
  `*[_type == "mapPoi" && category == "asteroid-m"]`,
);
console.log(`Found ${asteroids.length} M-Type asteroids\n`);

// Calculate spatial metrics
const centerX = asteroids.reduce((sum, a) => sum + a.euX, 0) / asteroids.length;
const centerY = asteroids.reduce((sum, a) => sum + a.euY, 0) / asteroids.length;

const zValues = asteroids.map((a) => a.euZ).sort((a, b) => a - b);
const zQ1 = zValues[Math.floor(zValues.length * 0.25)];
const zQ3 = zValues[Math.floor(zValues.length * 0.75)];

const distances = asteroids.map((a) => {
  const dx = a.euX - centerX;
  const dy = a.euY - centerY;
  return Math.sqrt(dx * dx + dy * dy);
});
const distMin = Math.min(...distances);
const distMax = Math.max(...distances);
const distMid = (distMin + distMax) / 2;

// Classify and assign names
const updates = asteroids.map((a) => {
  const dx = a.euX - centerX;
  const dy = a.euY - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let size = "medium";
  let zClass = "mid";

  if (a.euZ <= zQ1) zClass = "deep";
  else if (a.euZ >= zQ3) zClass = "high";

  if ((zClass === "deep" || zClass === "high") && dist > distMid * 1.1) {
    size = "large";
  } else if (dist < distMid * 1.1) {
    size = "small";
  }

  const newName = `M-${size.charAt(0).toUpperCase() + size.slice(1)}`;

  return {
    _id: a._id,
    oldName: a.name,
    newName,
    size,
  };
});

// Group by size
const bySize = {
  large: updates.filter((u) => u.size === "large"),
  medium: updates.filter((u) => u.size === "medium"),
  small: updates.filter((u) => u.size === "small"),
};

console.log(`📝 NAMING SUMMARY:`);
console.log(`   M-Large:  ${bySize.large.length} asteroids`);
console.log(`   M-Medium: ${bySize.medium.length} asteroids`);
console.log(`   M-Small:  ${bySize.small.length} asteroids\n`);

// Create unified description
const description = `M-Type metallic asteroid anchoring the regional mining architecture. Upon approach, the site yields a varied composition of secondary asteroid types—C, S, and F classifications across all four difficulty tiers. The density and size distribution of secondary asteroids correlate directly with depth: asteroids found at extreme altitudes and depths host the largest secondary formations, while those in mid-range zones present moderate specimens. Crossover zones and inner ring positions yield smaller but densely clustered secondary asteroids. Plan mining strategy accordingly.`;

console.log(`📄 DESCRIPTION (unified for all):`);
console.log(`   "${description}"\n`);

// Validate image exists
if (!fs.existsSync(IMAGE_PATH)) {
  console.error(`❌ Image not found: ${IMAGE_PATH}`);
  process.exit(1);
}

console.log(`🖼️  Image: ${IMAGE_PATH}`);
console.log(`   File exists: ✅\n`);

// Prepare for upload
console.log(`⏳ Ready to update all ${asteroids.length} M-Type POIs with:`);
console.log(`   • Names: M-Large, M-Medium, M-Small`);
console.log(`   • Description: Unified spatial template`);
console.log(`   • Image: asteroid-nd-type-lg.webp\n`);

console.log(
  `📋 SAMPLE UPDATES:\n${JSON.stringify(updates.slice(0, 3), null, 2)}\n...`,
);

// Ask for confirmation
console.log(`\n⚠️  This will update ${asteroids.length} documents in Sanity.`);
console.log(`    Run: node update-m-types.mjs to proceed`);
