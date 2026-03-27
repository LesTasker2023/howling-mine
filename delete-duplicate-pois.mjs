import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

// IDs of duplicate POIs to delete (keeping first, deleting second from each pair)
const idsToDelete = [
  "24fe6ab5-4233-43f2-b8ae-28917a852f59", // duplicate of 04548c6d (77597,78042,-2237)
  "6465a6da-1374-45ee-93de-a009605a89b8", // duplicate of 49cd8b37 (76913,77497,-2399)
  "98a3354b-479a-47e4-87ec-61305edba1b9", // duplicate of 689efe72 (77646,78299,-2162)
];

console.log(`🗑️  Deleting ${idsToDelete.length} duplicate POIs...\n`);

for (const id of idsToDelete) {
  try {
    await client.delete(id);
    console.log(`✅ Deleted: ${id}`);
  } catch (error) {
    console.error(`❌ Failed to delete ${id}:`, error.message);
  }
}

console.log(`\n✨ Cleanup complete!`);
