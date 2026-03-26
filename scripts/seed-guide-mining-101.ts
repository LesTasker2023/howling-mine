/**
 * Seed: Mining 101 guide
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-mining-101.ts
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

const GUIDE_ID = "2b9acd87-4a7c-44c6-bb5d-dba501fdacfe";

const body = [
  h2("What Is Mining?"),
  p("Mining is one of the three core professions in Entropia Universe alongside hunting and crafting. You use a Finder tool to scan underground for resource deposits, then an Excavator to dig them up. The resources you extract have real PED value — they can be sold to other players for crafting, or sold to the Trade Terminal at base value."),
  p("Mining does not require combat skills, making it a popular choice for new players who prefer a less confrontational playstyle. However, it does carry risk — every probe drop costs PED, and there is no guarantee of finding anything."),

  callout("info", "Mining is often described as gambling with better odds. You will not profit every run, but over time, skilled miners who understand the mechanics and manage their costs can sustain themselves or even come out ahead."),

  h2("Essential Equipment"),
  h3("The Finder"),
  p("A Finder is the tool that detects underground resources. You equip it and drop probes into the ground. If a resource deposit exists nearby, the Finder detects it and places a claim marker on the ground. Different Finders have different depth ranges, detection ranges, and decay costs."),
  bullet("Beginner Finders — cheap, shallow depth range (100–200m), detect only Ores"),
  bullet("Intermediate Finders — deeper range, can detect both Ores and Enmatter (Energy Matter)"),
  bullet("Advanced Finders — deepest range, highest detection radius, most expensive to operate"),

  h3("The Excavator"),
  p("Once a Finder detects a claim, you equip an Excavator to dig it up. The Excavator extracts the resource from the claim marker. Like Finders, Excavators come in different tiers — but for beginners, any Trade Terminal Excavator works fine."),

  h3("Probes"),
  p("Every time you activate your Finder, it consumes one probe. Probes are purchased from the Trade Terminal. They cost 0.50 PED each — this is your primary mining cost. Each probe drop is essentially a 0.50 PED bet that there is a resource deposit below you."),

  callout("tip", "Start with a TT Finder (Trade Terminal Finder) — it is unlimited, meaning it can be repaired indefinitely, and it is the cheapest option for learning the mechanics. Upgrade once you understand the system."),

  h2("How Mining Works"),
  h3("Drop a Probe"),
  p("Equip your Finder and activate it (left click in Aim Mode). Your avatar kneels down and drops a probe into the ground. The probe scans a radius around you and at a depth determined by your Finder's range."),

  h3("Read the Result"),
  bullet("Claim found — a resource deposit was detected. A claim marker appears on the ground."),
  bullet("No resource found — the probe found nothing in range. You lose the probe cost."),
  bullet("Near miss — sometimes displayed when a deposit exists just outside your detection range."),

  h3("Extract the Claim"),
  p("Walk to the claim marker, equip your Excavator, and activate it. The Excavator digs up the resource over a few seconds. The extracted resource goes into your inventory. Claims have a timer — if you do not extract them within about 30 minutes, they expire and you lose the find."),

  h3("Two Resource Types"),
  bullet("Ores — metal and mineral resources. Found at shallower depths. Used in weapon, armor, and vehicle crafting."),
  bullet("Enmatter (Energy Matter) — energy-based resources. Found at deeper depths. Used in ammunition, medical tools, and electronics crafting."),

  callout("info", "Some Finders can detect both Ores and Enmatter. Others only detect one type. Check your Finder's description to know what it can find."),

  h2("Mining Costs"),
  h3("Cost Per Probe Drop"),
  bullet("Probe cost — 0.50 PED per drop (non-negotiable)"),
  bullet("Finder decay — a small amount of durability is lost each drop, which costs PED to repair"),
  bullet("Excavator decay — durability loss when extracting a claim"),
  bullet("Amplifier decay — if using an amplifier (optional, increases detection range and claim size)"),

  h3("Typical Beginner Budget"),
  p("A mining run of 50 probe drops costs approximately 25 PED in probes alone, plus 2–5 PED in Finder and Excavator decay. Budget 30 PED per run as a beginner. You may get 20–35 PED back in resources, depending on luck and location."),

  callout("warning", "Do not spend PED you cannot afford to lose. Mining has high variance — you can go 20 drops without a hit, then find three in a row. Budget for the dry spells."),

  h2("Where to Mine"),
  h3("Choosing a Location"),
  p("Resources are not evenly distributed across the map. Some areas are rich in specific ores, while others are better for enmatter. Location choice significantly affects your results."),
  bullet("Check community mining maps for known resource hotspots"),
  bullet("Avoid areas with high-level aggressive mobs unless you can defend yourself"),
  bullet("Stay near teleporters and revival terminals when starting out"),
  bullet("Move around — if an area is not producing after 10–15 drops, relocate"),

  h3("Mining Patterns"),
  p("Experienced miners use systematic patterns to cover ground efficiently. The most common approach is to walk in a straight line, dropping a probe every 50–100 meters. This ensures you are not re-scanning the same ground while maximizing coverage."),

  callout("tip", "Drop probes in a grid pattern or along a straight line. Walking randomly wastes probes by re-scanning areas you have already covered."),

  h2("Understanding Claims"),
  h3("Claim Size"),
  p("Claims come in different sizes, which determine the total value of the resource deposit. The size is determined at the moment of discovery and is influenced by your skills, your Finder, and whether you use an amplifier."),
  bullet("Size I to V — small claims, common, low value"),
  bullet("Size VI to IX — medium claims, moderate value"),
  bullet("Size X+ — large claims, rare and valuable"),

  h3("Globals and Hall of Fame"),
  p("Finding a very large claim triggers a Global notification visible to all players on the server. If the claim is among the top 100 of the day, it hits the Hall of Fame. These are exciting but rare — do not mine expecting to hit one."),

  h2("Skills and Progression"),
  h3("Key Mining Skills"),
  bullet("Prospecting — increases detection range and claim size"),
  bullet("Surveying — improves your ability to find resources"),
  bullet("Mining (general) — overall mining effectiveness"),
  bullet("Geology — affects ore detection specifically"),
  bullet("Energy Matter Engineering — affects enmatter detection"),

  h3("How Skills Build"),
  p("You gain mining skills every time you drop a probe, whether or not you find something. Extracting claims also grants skill points. Higher skills mean larger detection range, bigger claims on average, and access to better Finders."),

  h2("Tips for New Miners"),
  bullet("Start with a TT Finder and TT Excavator — do not buy expensive gear before you understand the basics"),
  bullet("Keep a spreadsheet or use a tracking tool to log your runs — knowing your cost per claim is essential"),
  bullet("Do not use amplifiers until you have at least mid-level Prospecting skills"),
  bullet("Sell resources with markup to other players, not to the Trade Terminal — many ores and enmatters sell for 110–200% or more"),
  bullet("Join a mining society or community like The Howling Mine — experienced miners share locations, tips, and data"),
  bullet("Accept that dry runs happen — variance is part of the system"),

  callout("info", "Mining is a long-term profession. Your first 100 PED of probes are a learning investment. Track everything, learn the patterns, and refine your approach over time."),
];

async function seed() {
  console.log("Seeding Mining 101 guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/mining-101");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
