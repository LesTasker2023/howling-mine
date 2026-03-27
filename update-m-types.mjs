import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

const IMAGE_PATH =
  "C:\\Users\\les-t\\Documents\\GitHub\\ProjectDelta\\public\\images\\space-mining\\asteroid-nd-type-lg.webp";

const DESCRIPTION =
  "Size varies by depth. Accompanied by C, S, and F types (L1-L5).";

console.log("🚀 Updating M-Type asteroids...\n");

// Fetch all M-Types
const asteroids = await client.fetch(
  `*[_type == "mapPoi" && category == "asteroid-m"]`,
);
console.log(`Found ${asteroids.length} M-Type asteroids to update\n`);

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

// Upload image
console.log("📤 Uploading image to Sanity...");
const imageBuffer = fs.readFileSync(IMAGE_PATH);
const imageAsset = await client.assets.upload("image", imageBuffer, {
  filename: path.basename(IMAGE_PATH),
});
console.log(`✅ Image uploaded: ${imageAsset._id}\n`);

// Batch updates
const updates = [];
let largeCount = 0,
  mediumCount = 0,
  smallCount = 0;

for (const asteroid of asteroids) {
  const dx = asteroid.euX - centerX;
  const dy = asteroid.euY - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let size = "medium";
  let zClass = "mid";

  if (asteroid.euZ <= zQ1) zClass = "deep";
  else if (asteroid.euZ >= zQ3) zClass = "high";

  if ((zClass === "deep" || zClass === "high") && dist > distMid * 1.1) {
    size = "large";
    largeCount++;
  } else if (dist < distMid * 1.1) {
    size = "small";
    smallCount++;
  } else {
    mediumCount++;
  }

  const newName = `M-${size.charAt(0).toUpperCase() + size.slice(1)}`;

  updates.push(
    client
      .patch(asteroid._id)
      .set({
        name: newName,
        description: DESCRIPTION,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
      })
      .commit(),
  );
}

console.log(`📊 Update breakdown:`);
console.log(`   M-Large:  ${largeCount}`);
console.log(`   M-Medium: ${mediumCount}`);
console.log(`   M-Small:  ${smallCount}\n`);

console.log(`⏳ Applying ${updates.length} updates...\n`);

const results = await Promise.allSettled(updates);

const succeeded = results.filter((r) => r.status === "fulfilled").length;
const failed = results.filter((r) => r.status === "rejected").length;

console.log(`\n✅ COMPLETE`);
console.log(`   ${succeeded} updated successfully`);
if (failed > 0) console.log(`   ❌ ${failed} failed`);

console.log(
  `\n🎉 All M-Type asteroids now have names, descriptions, and images!`,
);
