/**
 * Seed: Asteroid Mining 101 guide
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-asteroid-mining-101.ts
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

const GUIDE_ID = "b58ea730-a8c2-4ed1-8e92-db259b73c1f9";

const body = [
  h2("Asteroid Mining Overview"),
  p("Asteroid mining takes everything you know from planetary mining and moves it into space. The core mechanics are identical — Finder, probes, claims, Excavator — but the environment, economics, and risks are fundamentally different. This guide covers the specifics of mining on asteroids."),

  callout("info", "Read Mining 101 first if you have not already. This guide assumes you understand Finders, probes, claims, and basic mining economics."),

  h2("Types of Asteroids"),
  h3("Public Asteroids"),
  p("Public asteroids are accessible to all players. They exist in space at fixed or rotating coordinates. Anyone can travel to them and mine. Competition for resources is real — popular asteroids can have multiple miners active at once."),

  h3("Taxed Asteroids"),
  p("Some asteroids are owned by players or societies. The owner can set a tax rate on all resources extracted. This means a percentage of your mining output goes to the asteroid owner. Tax rates vary — check before you mine."),

  h3("Private Asteroids"),
  p("Rare and extremely expensive, private asteroids are fully owned by an individual or society. Access can be restricted. These are endgame assets worth thousands of USD."),

  callout("tip", "When mining a taxed asteroid, factor the tax into your cost calculations. A 5% tax on a 100 PED mining run costs you 5 PED — this can turn a marginal profit into a loss."),

  h2("Space-Exclusive Resources"),
  h3("Why Asteroid Ores Are Valuable"),
  p("Certain ores and enmatter only spawn on asteroids. Crafters who need these resources must buy from space miners. This creates a premium — space-exclusive resources regularly sell at 150–400% markup because supply is limited and the risk of obtaining them is high."),

  h3("Notable Space Resources"),
  bullet("Lysterium — an ore found on asteroids with consistently high markup"),
  bullet("Durulium — heavy ore used in high-end weapon and vehicle crafting"),
  bullet("Various enmatter types — used in specialised ammunition and component crafting"),
  p("Resource availability changes over time as MindArk adjusts spawn tables. Always check current auction prices before planning a mining expedition."),

  h2("Equipment for Asteroid Mining"),
  h3("Finder Selection"),
  p("Your planetary Finder works on asteroids. However, asteroid deposits are often at different depth ranges than planetary ones. A Finder with at least medium depth range is recommended. Amplifiers are more commonly used in space mining because the potential claim values are higher."),

  h3("Amplifiers"),
  p("An amplifier (amp) attaches to your Finder and increases the detection range and potential claim size. Using an amp significantly increases your cost per probe drop but also increases the potential payout. Only use amps when your skills are high enough to justify the cost."),
  bullet("Small amps — add 10–20% to detection, modest cost increase"),
  bullet("Medium amps — add 30–50% to detection, significant cost increase"),
  bullet("Large amps — double or triple detection, very expensive per drop"),

  callout("warning", "Amplifiers are consumed on use — they do not last forever. Each probe drop consumes a portion of the amplifier. Factor this into your per-drop cost calculation."),

  h3("Transport"),
  bullet("Quad Wing — free spacecraft, slow, no cargo protection, vulnerable to pirates"),
  bullet("Sleipnir — personal vehicle that works in space, faster than Quad Wing"),
  bullet("VTOL — versatile craft for planet-to-space transitions"),
  bullet("Motherships — large player-owned ships that carry multiple miners and offer protection"),

  h2("Mining Strategy on Asteroids"),
  h3("Systematic Coverage"),
  p("Asteroids are smaller than planets. You can cover an entire asteroid with 50–150 probe drops depending on size. Use a systematic pattern to ensure full coverage — walk the perimeter first, then zigzag across the interior."),

  h3("Timing and Competition"),
  p("Popular asteroids attract multiple miners. Resources respawn over time, but mining immediately after another player has swept the area yields poor results. If an asteroid feels dry, come back later or find a less popular one."),

  h3("Claim Management"),
  p("Extract claims immediately when possible. In PvP zones, unextracted claims are visible on radar and tell pirates exactly where you are. Extract, store in inventory, and keep moving."),

  callout("tip", "Mine during off-peak hours for less competition and fewer pirates. Server population drops significantly during EU/US nighttime."),

  h2("Dealing with Pirates"),
  h3("The PvP Reality"),
  p("Most asteroid fields are in PvP-lootable space. Players who specialise in attacking miners — called pirates — actively patrol these zones. Losing a fight means losing the stackable items in your inventory."),

  h3("Risk Mitigation"),
  bullet("Mine in groups — pirates avoid groups, solo miners are easy targets"),
  bullet("Deposit resources frequently — use a mothership with storage or make regular trips back"),
  bullet("Watch local radar constantly — incoming ships appear before they are in weapon range"),
  bullet("Keep your inventory as empty as possible — only carry probes and current session's resources"),
  bullet("Know your escape routes — plan where you will run before you start mining"),

  h3("What Happens If You Die"),
  p("If killed in lootable space, you lose stackable items from your inventory (ores, enmatter, ammo, probes). You keep equipped items, non-stackable items, and your skills. You respawn at the nearest revival point — usually a space station."),

  callout("danger", "Never carry more resources than you can afford to lose. Pirates are a real and persistent threat. Banking your resources every 10–15 minutes is not paranoia — it is smart practice."),

  h2("Economics of Asteroid Mining"),
  h3("Cost Breakdown"),
  bullet("Probes — 0.50 PED each, same as planetary"),
  bullet("Finder decay — same as planetary"),
  bullet("Amplifier cost — significant if using amps, 0.50–5.00 PED per drop depending on amp tier"),
  bullet("Transport cost — fuel/decay for spacecraft"),
  bullet("Time cost — travel to and from asteroids takes real time"),

  h3("Revenue"),
  p("Asteroid mining revenue comes from two sources: TT value of extracted resources and the markup those resources carry. The markup is where the real money is. Space-exclusive resources can sell at 2–4x their TT value on the auction."),

  h3("Profitability"),
  p("Asteroid mining is higher variance than planetary mining. The lows are lower (PvP losses, dry asteroids) but the highs are higher (rare space ores at high markup). Over many sessions, a skilled asteroid miner with good risk management can be more profitable than a planetary miner."),

  h2("Next Steps"),
  bullet("Complete Mining 101 if you have not already — the fundamentals apply directly to space"),
  bullet("Join The Howling Mine community for group mining runs and asteroid coordinates"),
  bullet("Start with non-lootable asteroids to learn the mechanics without PvP risk"),
  bullet("Graduate to lootable space when you are confident in your risk management"),
  bullet("Consider investing in a personal spacecraft once you are mining space regularly"),
];

async function seed() {
  console.log("Seeding Asteroid Mining 101 guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/asteroid-mining-101");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
