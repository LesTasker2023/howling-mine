/* ═══════════════════════════════════════════════════════════════════════════
   seed-events.ts — Seeds sample events for the Events page
   Run: npx tsx scripts/seed-events.ts
   ═══════════════════════════════════════════════════════════════════════════ */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "u2kuytve",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

/* ── Sample events ── */
const events = [
  {
    _type: "event" as const,
    _id: "event-weekly-mining-run-feb",
    title: "Weekly Mining Run — Deep Howling Mine",
    slug: { _type: "slug" as const, current: "weekly-mining-run-feb" },
    excerpt:
      "Join the community for our weekly deep mining expedition into the Howling Mine. All skill levels welcome — bring your best finder!",
    startDate: "2026-02-21T19:00:00Z",
    endDate: "2026-02-21T22:00:00Z",
    location: "Howling Mine",
    eventType: "mining-run",
    featured: true,
  },
  {
    _type: "event" as const,
    _id: "event-pvp-tournament-march",
    title: "Calypso Gateway PvP Tournament",
    slug: { _type: "slug" as const, current: "calypso-gateway-pvp-tournament" },
    excerpt:
      "Competitive PvP bracket tournament at the Calypso Gateway. Prize pool of 500 PED. Sign-ups open now.",
    startDate: "2026-03-08T18:00:00Z",
    endDate: "2026-03-08T23:00:00Z",
    location: "Calypso Space Station",
    eventType: "pvp",
    featured: false,
  },
  {
    _type: "event" as const,
    _id: "event-community-meetup-feb",
    title: "Howling Mine Community Meetup",
    slug: { _type: "slug" as const, current: "community-meetup-feb-2026" },
    excerpt:
      "Monthly community hangout at the Howling Mine outpost. Share tips, trade resources, and meet fellow miners.",
    startDate: "2026-02-28T20:00:00Z",
    endDate: "2026-02-28T22:00:00Z",
    location: "Howling Mine Outpost",
    eventType: "community",
    featured: false,
  },
  {
    _type: "event" as const,
    _id: "event-hunting-party-march",
    title: "Cosmic Horror Hunting Party",
    slug: { _type: "slug" as const, current: "cosmic-horror-hunt-march" },
    excerpt:
      "Team up for a coordinated hunt against the Cosmic Horrors near Howling Mine. Loot split rules will be announced.",
    startDate: "2026-03-15T17:00:00Z",
    endDate: "2026-03-15T21:00:00Z",
    location: "Howling Mine Perimeter",
    eventType: "hunting",
    featured: true,
  },
  {
    _type: "event" as const,
    _id: "event-spring-trading-fair",
    title: "Spring Trading Fair 2026",
    slug: { _type: "slug" as const, current: "spring-trading-fair-2026" },
    excerpt:
      "Multi-day trading event — buy, sell, and auction rare mining finds, crafted gear, and collectibles.",
    startDate: "2026-03-22T12:00:00Z",
    endDate: "2026-03-24T20:00:00Z",
    location: "Calypso Trade Center",
    eventType: "trading",
    featured: false,
  },
  {
    _type: "event" as const,
    _id: "event-special-anniversary",
    title: "Howling Mine 1st Anniversary Celebration",
    slug: { _type: "slug" as const, current: "howling-mine-anniversary" },
    excerpt:
      "Celebrate our first year with special in-game activities, giveaways, and an exclusive community mining run with boosted loot.",
    startDate: "2026-04-05T16:00:00Z",
    endDate: "2026-04-06T22:00:00Z",
    location: "Howling Mine",
    eventType: "special",
    featured: true,
  },
];

async function seed() {
  console.log("🗓️  Seeding events…");

  for (const event of events) {
    const result = await client.createOrReplace(event);
    console.log(`  ✓ ${result._id} — ${event.title}`);
  }

  console.log(`\n✅ Done — ${events.length} events seeded.`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
