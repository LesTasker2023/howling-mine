/* ═══════════════════════════════════════════════════════════════════════════
   seed-mining-stats.ts — Seeds a miningStats document with realistic data
   Run: npx tsx scripts/seed-mining-stats.ts
   ═══════════════════════════════════════════════════════════════════════════ */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "u2kuytve",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const doc = {
  _type: "miningStats" as const,
  _id: "miningStats-current",

  periodLabel: "Last 30 Days",

  /* ── Overview metrics ── */
  totalRuns: 1847,
  totalGlobals: 312,
  totalPedMined: 48726,
  totalPedCost: 42150,
  netProfit: 6576,
  returnPercent: 115.6,
  avgGlobal: 156.2,
  highestGlobal: 4872,
  hofCount: 23,
  uniqueMiners: 47,
  asteroidsHit: 14,

  /* ── Trends ── */
  profitTrend: "up",
  profitTrendValue: "+12.3%",
  globalsTrend: "up",
  globalsTrendValue: "+8.7%",

  /* ── Activity timeline (daily for 14 days) ── */
  activityTimeline: [
    { name: "Jan 14", globals: 18, ped: 2810, runs: 112 },
    { name: "Jan 15", globals: 24, ped: 3745, runs: 128 },
    { name: "Jan 16", globals: 12, ped: 1872, runs: 95 },
    { name: "Jan 17", globals: 31, ped: 5124, runs: 145 },
    { name: "Jan 18", globals: 22, ped: 3436, runs: 130 },
    { name: "Jan 19", globals: 28, ped: 4260, runs: 138 },
    { name: "Jan 20", globals: 15, ped: 2340, runs: 108 },
    { name: "Jan 21", globals: 19, ped: 2966, runs: 118 },
    { name: "Jan 22", globals: 35, ped: 5460, runs: 152 },
    { name: "Jan 23", globals: 26, ped: 4058, runs: 135 },
    { name: "Jan 24", globals: 20, ped: 3120, runs: 125 },
    { name: "Jan 25", globals: 29, ped: 4524, runs: 142 },
    { name: "Jan 26", globals: 17, ped: 2652, runs: 110 },
    { name: "Jan 27", globals: 16, ped: 2359, runs: 109 },
  ],

  /* ── Asteroid type breakdown ── */
  asteroidBreakdown: [
    { name: "M-Type", value: 28420 },
    { name: "ND-Type", value: 9240 },
    { name: "C-Type", value: 6350 },
    { name: "S-Type", value: 3180 },
    { name: "F-Type", value: 1536 },
  ],

  /* ── Hourly distribution (UTC) ── */
  hourlyDistribution: [
    { name: "00", globals: 8, ped: 1248 },
    { name: "01", globals: 5, ped: 780 },
    { name: "02", globals: 3, ped: 468 },
    { name: "03", globals: 2, ped: 312 },
    { name: "04", globals: 4, ped: 624 },
    { name: "05", globals: 6, ped: 936 },
    { name: "06", globals: 9, ped: 1404 },
    { name: "07", globals: 12, ped: 1872 },
    { name: "08", globals: 15, ped: 2340 },
    { name: "09", globals: 18, ped: 2808 },
    { name: "10", globals: 22, ped: 3432 },
    { name: "11", globals: 20, ped: 3120 },
    { name: "12", globals: 24, ped: 3744 },
    { name: "13", globals: 21, ped: 3276 },
    { name: "14", globals: 19, ped: 2964 },
    { name: "15", globals: 23, ped: 3588 },
    { name: "16", globals: 25, ped: 3900 },
    { name: "17", globals: 20, ped: 3120 },
    { name: "18", globals: 18, ped: 2808 },
    { name: "19", globals: 16, ped: 2496 },
    { name: "20", globals: 14, ped: 2184 },
    { name: "21", globals: 11, ped: 1716 },
    { name: "22", globals: 10, ped: 1560 },
    { name: "23", globals: 6, ped: 936 },
  ],

  /* ── Value distribution (PED buckets) ── */
  valueDistribution: [
    { name: "50–100", count: 98 },
    { name: "100–200", count: 124 },
    { name: "200–500", count: 52 },
    { name: "500–1k", count: 24 },
    { name: "1k–2k", count: 10 },
    { name: "2k–5k", count: 3 },
    { name: "5k+", count: 1 },
  ],

  /* ── Top miners ── */
  topMiners: [
    { name: "GoldDigger Prime", totalPed: 8945, globals: 62, hofs: 5 },
    { name: "AstroMiner X7", totalPed: 6723, globals: 48, hofs: 4 },
    { name: "VoidHarvester", totalPed: 5310, globals: 38, hofs: 3 },
    { name: "NebulaDrill", totalPed: 4876, globals: 35, hofs: 3 },
    { name: "CosmicPickaxe", totalPed: 4120, globals: 30, hofs: 2 },
    { name: "StarDust Mining Co", totalPed: 3890, globals: 28, hofs: 2 },
    { name: "DeepCore Alpha", totalPed: 3456, globals: 24, hofs: 1 },
    { name: "OreRunner99", totalPed: 2987, globals: 21, hofs: 1 },
    { name: "MeteorStrike", totalPed: 2540, globals: 14, hofs: 1 },
    { name: "Howler Mining Guild", totalPed: 2230, globals: 12, hofs: 1 },
  ],

  /* ── Top asteroids ── */
  topAsteroids: [
    { name: "Howler's Bounty M", totalPed: 12840, globals: 89, miners: 28 },
    { name: "Sector 7 Alpha M", totalPed: 8760, globals: 61, miners: 22 },
    { name: "Deep Vein ND-12", totalPed: 5420, globals: 38, miners: 15 },
    { name: "Outer Ring M-4", totalPed: 4980, globals: 34, miners: 18 },
    { name: "Crimson Drift C-2", totalPed: 3850, globals: 27, miners: 12 },
    { name: "Nebula Pocket ND-7", totalPed: 3820, globals: 26, miners: 11 },
    { name: "Sentinel Rock M-9", totalPed: 3210, globals: 22, miners: 14 },
    { name: "Twilight Seam S-3", totalPed: 3180, globals: 21, miners: 10 },
  ],

  /* ── Recent globals (feed) ── */
  recentGlobals: [
    {
      miner: "GoldDigger Prime",
      asteroid: "Howler's Bounty M",
      value: 4872,
      isHof: true,
      timestamp: "2026-01-27T16:42:00Z",
    },
    {
      miner: "AstroMiner X7",
      asteroid: "Sector 7 Alpha M",
      value: 1245,
      isHof: true,
      timestamp: "2026-01-27T15:18:00Z",
    },
    {
      miner: "VoidHarvester",
      asteroid: "Deep Vein ND-12",
      value: 523,
      isHof: false,
      timestamp: "2026-01-27T14:55:00Z",
    },
    {
      miner: "NebulaDrill",
      asteroid: "Howler's Bounty M",
      value: 387,
      isHof: false,
      timestamp: "2026-01-27T13:30:00Z",
    },
    {
      miner: "CosmicPickaxe",
      asteroid: "Outer Ring M-4",
      value: 892,
      isHof: true,
      timestamp: "2026-01-27T12:44:00Z",
    },
    {
      miner: "StarDust Mining Co",
      asteroid: "Crimson Drift C-2",
      value: 234,
      isHof: false,
      timestamp: "2026-01-27T11:20:00Z",
    },
    {
      miner: "DeepCore Alpha",
      asteroid: "Howler's Bounty M",
      value: 167,
      isHof: false,
      timestamp: "2026-01-27T10:05:00Z",
    },
    {
      miner: "OreRunner99",
      asteroid: "Nebula Pocket ND-7",
      value: 445,
      isHof: false,
      timestamp: "2026-01-27T09:38:00Z",
    },
    {
      miner: "GoldDigger Prime",
      asteroid: "Sector 7 Alpha M",
      value: 1876,
      isHof: true,
      timestamp: "2026-01-27T08:15:00Z",
    },
    {
      miner: "MeteorStrike",
      asteroid: "Sentinel Rock M-9",
      value: 312,
      isHof: false,
      timestamp: "2026-01-27T07:50:00Z",
    },
    {
      miner: "AstroMiner X7",
      asteroid: "Howler's Bounty M",
      value: 678,
      isHof: false,
      timestamp: "2026-01-26T22:30:00Z",
    },
    {
      miner: "Howler Mining Guild",
      asteroid: "Twilight Seam S-3",
      value: 156,
      isHof: false,
      timestamp: "2026-01-26T20:10:00Z",
    },
    {
      miner: "VoidHarvester",
      asteroid: "Outer Ring M-4",
      value: 1023,
      isHof: true,
      timestamp: "2026-01-26T18:45:00Z",
    },
    {
      miner: "NebulaDrill",
      asteroid: "Deep Vein ND-12",
      value: 289,
      isHof: false,
      timestamp: "2026-01-26T16:20:00Z",
    },
    {
      miner: "GoldDigger Prime",
      asteroid: "Crimson Drift C-2",
      value: 534,
      isHof: false,
      timestamp: "2026-01-26T14:00:00Z",
    },
  ],

  /* ── Records ── */
  biggestHit: {
    miner: "GoldDigger Prime",
    asteroid: "Howler's Bounty M",
    value: 4872,
    date: "2026-01-27T16:42:00Z",
  },

  bestReturnRun: {
    miner: "AstroMiner X7",
    returnPct: 347,
    pedOut: 2876,
  },

  /* ── Performance gauges ── */
  avgReturnPct: 115.6,
  hofRate: 7.4,

  updatedAt: new Date().toISOString(),
};

async function seed() {
  console.log("🔧 Seeding mining stats...");

  const result = await client.createOrReplace(doc);

  console.log(`✅ Done — ${result._id}`);
  console.log(`   Period: ${doc.periodLabel}`);
  console.log(`   Globals: ${doc.totalGlobals} | PED: ${doc.totalPedMined}`);
  console.log(`   Miners: ${doc.uniqueMiners} | HoFs: ${doc.hofCount}`);
  console.log(`   Timeline: ${doc.activityTimeline.length} entries`);
  console.log(`   Top miners: ${doc.topMiners.length}`);
  console.log(`   Recents: ${doc.recentGlobals.length}`);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
