import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

console.log("🔄 Reverting M-Type names back to 'M'...\n");

// Fetch all M-Types
const asteroids = await client.fetch(
  `*[_type == "mapPoi" && category == "asteroid-m"]`,
);
console.log(`Found ${asteroids.length} M-Type asteroids to revert\n`);

// Batch updates
const updates = [];

for (const asteroid of asteroids) {
  updates.push(
    client
      .patch(asteroid._id)
      .set({
        name: "M",
      })
      .commit(),
  );
}

console.log(`⏳ Applying ${updates.length} updates...\n`);

const results = await Promise.allSettled(updates);

const succeeded = results.filter((r) => r.status === "fulfilled").length;
const failed = results.filter((r) => r.status === "rejected").length;

console.log(`\n✅ COMPLETE`);
console.log(`   ${succeeded} reverted back to "M"`);
if (failed > 0) console.log(`   ❌ ${failed} failed`);

console.log(`\n🎉 All M-Type asteroids renamed back to just "M"!`);
