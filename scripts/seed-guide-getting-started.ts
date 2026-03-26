/**
 * Seed: Getting Started (Asteroid Mining intro)
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-getting-started.ts
 */

import { createClient } from "@sanity/client";

const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN;
if (!token) { console.error("Set SANITY_API_TOKEN"); process.exit(1); }

const client = createClient({
  projectId: "u2kuytve",
  dataset: "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

let _k = 0;
const key = () => `k${++_k}`;
const span = (text: string, marks: string[] = []) => ({ _type: "span" as const, _key: key(), text, marks });
const block = (children: ReturnType<typeof span>[], style = "normal") => ({ _type: "block" as const, _key: key(), style, markDefs: [], children });
const h2 = (t: string) => block([span(t)], "h2");
const h3 = (t: string) => block([span(t)], "h3");
const p = (t: string) => block([span(t)]);
const bullet = (t: string) => ({ _type: "block" as const, _key: key(), style: "normal", listItem: "bullet" as const, level: 1, markDefs: [], children: [span(t)] });
const callout = (tone: string, text: string) => ({ _type: "callout" as const, _key: key(), tone, body: text });

const GUIDE_ID = "8849158f-a819-47f2-aec1-ee36cd33c135";

const body = [
  h2("What Is Asteroid Mining?"),
  p("Asteroid mining is a specialised branch of mining in Entropia Universe that takes place in space rather than on planetary surfaces. You travel to asteroid fields orbiting between planets and mine resources from asteroids. The ores and enmatter found in space are often different from — and more valuable than — those found on planets."),
  p("Asteroid mining carries higher risk than planetary mining due to PvP-lootable space zones, but the potential rewards are significantly greater."),

  callout("info", "Asteroid mining is not recommended for brand-new players. Complete the Setesh tutorial, get comfortable with planetary mining first, then come to space when you are ready."),

  h2("Prerequisites"),
  h3("Skills"),
  bullet("Basic Prospecting and Surveying skills from planetary mining"),
  bullet("Spaceship piloting is helpful but not strictly required if hitching rides"),

  h3("Equipment"),
  bullet("A Finder that works in space — most planetary Finders work on asteroids too"),
  bullet("An Excavator — same as planetary mining"),
  bullet("Probes — same as planetary, 0.50 PED each"),
  bullet("A spacecraft or access to someone else's — you need to physically get to the asteroid"),

  h3("Budget"),
  p("Budget more generously than planetary mining. Space travel has costs (fuel, vehicle decay), and you may need to make multiple trips. Start with at least 50–100 PED allocated for your first asteroid mining expedition."),

  h2("Getting to an Asteroid"),
  h3("The Space System"),
  p("Entropia Universe space is a connected zone between planets. You access it by going to a planetary space station (usually via teleporter) and then launching a spacecraft. Asteroids are located at specific coordinates in space."),

  h3("Finding Asteroids"),
  bullet("Community resources — The Howling Mine Discord shares known asteroid locations"),
  bullet("Space radar — some ships have radar that can detect asteroids"),
  bullet("Exploration — fly around and look for them visually"),

  h3("Transport Options"),
  bullet("Personal spacecraft — Quad Wing (free, slow), Sleipnir (faster, costs PED)"),
  bullet("Mothership — large community-owned ships that ferry miners to asteroids"),
  bullet("Hitchhiking — ask in chat for a ride, pilots often welcome passengers"),

  callout("warning", "Space between planets includes PvP-lootable zones. Other players (pirates) can attack and loot you. Travel light and keep valuable items stored safely until you understand the risks."),

  h2("Mining on an Asteroid"),
  h3("How It Differs from Planetary Mining"),
  p("The core mechanic is identical — equip Finder, drop probes, extract claims. The differences are practical rather than mechanical:"),
  bullet("Asteroid surfaces are smaller than planets — you cover the whole thing faster"),
  bullet("Resources are often concentrated — hit rates can be higher than planetary mining"),
  bullet("Some asteroid-exclusive resources exist with high markup"),
  bullet("You are exposed to PvP while mining in lootable space"),
  bullet("No Trade Terminal on most asteroids — you must carry your loot back"),

  h3("The Mining Loop"),
  p("Arrive at asteroid. Drop probes systematically across the surface. Extract all claims. Return to a space station or planet to sell resources. Repeat."),

  callout("tip", "Mine in groups when possible. Having a lookout watching for pirates while others mine is standard practice in PvP zones."),

  h2("PvP and Safety"),
  h3("Lootable vs Non-Lootable Space"),
  p("Some areas of space are PvP-lootable — players can kill you and take items from your inventory. Other areas are non-lootable — PvP exists but losers keep their stuff. Know which zone you are in before you start mining."),

  h3("Staying Safe"),
  bullet("Travel in groups — solo miners are easy targets"),
  bullet("Keep your inventory light — deposit resources frequently"),
  bullet("Watch local radar for incoming ships"),
  bullet("Have an escape plan — know the nearest safe zone or station"),
  bullet("Consider hiring PvP escorts for high-value mining runs"),

  h2("Asteroid Resources"),
  h3("Common Asteroid Ores"),
  p("Asteroids yield many of the same ores found on planets, but some resources are space-exclusive or found in higher concentrations. These space-exclusive resources often carry premium markup because they can only be obtained in space."),

  h3("Markup Potential"),
  p("Space-exclusive resources frequently sell at 150–300%+ markup to crafters who need them. This is the primary reason miners accept the PvP risk — the profit margins are substantially higher than planetary mining."),

  callout("info", "Check auction prices before selling any space resources to the Trade Terminal. Some rare asteroid ores sell for 5–10x their TT value to the right buyer."),

  h2("Joining the Community"),
  h3("The Howling Mine"),
  p("The Howling Mine community specialises in mining — both planetary and asteroid. Join the Discord for asteroid coordinates, group mining runs, escort services, and market price discussions."),

  h3("Group Mining Runs"),
  p("Organised mining runs are the safest and most efficient way to mine asteroids. A typical group includes miners, a pilot, and PvP escorts. Loot is usually yours to keep — the group provides safety, not loot sharing."),
];

async function seed() {
  console.log("Seeding Getting Started (Asteroid Mining) guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/getting-started");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
