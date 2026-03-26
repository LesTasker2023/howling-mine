/**
 * Seed: Crafting 101 guide
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-crafting-101.ts
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
const numbered = (t: string) => ({ _type: "block" as const, _key: key(), style: "normal", listItem: "number" as const, level: 1, markDefs: [], children: [span(t)] });
const callout = (tone: string, text: string) => ({ _type: "callout" as const, _key: key(), tone, body: text });

const GUIDE_ID = "aee8c61c-9362-4b32-9c2c-fe9aed728e38";

const body = [
  h2("What Is Crafting?"),
  p("Crafting is the third core profession in Entropia Universe alongside hunting and mining. Crafters take raw materials — ores, enmatter, animal parts, and other resources — and combine them using blueprints to create finished items: weapons, armor, tools, ammunition, components, and more."),
  p("Crafting sits at the centre of the economy. Miners extract resources, hunters loot materials, and crafters turn those raw materials into usable equipment. Every piece of gear in the game was either created by a crafter or sold by the Trade Terminal."),

  callout("info", "Crafting in Entropia Universe is not like crafting in most MMOs. There is no guaranteed output. Each craft attempt has a chance to succeed, fail, or produce a near-success. The system involves real PED and real risk."),

  h2("How Crafting Works"),
  h3("The Crafting Interface"),
  p("You craft at a Crafting Machine terminal found in most cities and outposts. Open the terminal, load a blueprint, add the required materials, and click craft. The machine processes the attempt and tells you the result."),

  h3("The Craft Attempt"),
  numbered("Select a blueprint from your inventory"),
  numbered("Load the required materials (the blueprint tells you what and how much)"),
  numbered("Click Craft"),
  numbered("The system calculates a result — success, near-success, or failure"),
  numbered("Receive the crafted item (on success) or partial residue (on failure)"),

  h3("Outcomes"),
  bullet("Success — you receive the finished item. Its quality (condition, TT value) varies."),
  bullet("Near success — you receive the item but at reduced quality or condition."),
  bullet("Failure — you lose most of the materials but receive residue (a small PED-value byproduct)."),

  callout("warning", "Every craft attempt costs PED in materials, blueprint decay, and machine fees. Failed crafts return only residue — you lose the majority of your investment. Budget accordingly."),

  h2("Blueprints"),
  h3("What Are Blueprints?"),
  p("Blueprints are the recipes for crafting. Each blueprint specifies what materials are needed and in what quantities. You must own a blueprint to craft that item. Blueprints have quality levels (QR) that improve as you use them, increasing your success rate."),

  h3("Blueprint Sources"),
  bullet("Trade Terminal — basic blueprints available for a small PED cost"),
  bullet("Loot drops — blueprints can drop from mobs, especially rare or limited ones"),
  bullet("Auction — other players sell blueprints, sometimes at high markup"),
  bullet("Mission rewards — some mission chains reward unique blueprints"),

  h3("Blueprint Quality Rating (QR)"),
  p("Every blueprint has a QR that starts at 0 and increases with each craft attempt. Higher QR means better success rates and potentially higher-quality outputs. QR only increases when you use that specific blueprint — crafting one item does not improve a different blueprint."),

  callout("tip", "Focus on a small number of blueprints and level them up. Spreading your crafting across many different blueprints means none of them improve efficiently."),

  h2("Materials"),
  h3("Material Types"),
  bullet("Ores — mined from the ground, used in weapons, armor, and vehicles"),
  bullet("Enmatter (Energy Matter) — mined at deeper depths, used in ammo, tools, and electronics"),
  bullet("Animal Parts — looted from hunting (hides, oils, extracts)"),
  bullet("Components — intermediate crafted items used as ingredients in higher-level crafting"),
  bullet("Residue — byproduct from failed crafts, used as a filler material in some recipes"),

  h3("Buying Materials"),
  p("You can buy materials from the Trade Terminal at TT value, or from other players via the auction house (usually at markup). Buying at TT is cheaper but limits you to basic materials. Buying from players gives access to higher-tier resources."),

  h2("Crafting Categories"),
  h3("Weapons"),
  p("Weapon crafting produces guns, melee weapons, and mindforce implants. High-end weapon blueprints are among the most valuable items in the game. Weapon crafting requires ores and sometimes animal parts."),

  h3("Armor"),
  p("Armor crafting creates protective gear for hunters. Different armor pieces use different material combinations depending on the damage types they protect against."),

  h3("Tools"),
  p("Tool crafting covers mining finders, excavators, healing tools, and other utility items. This is a popular starting point for new crafters because many tool blueprints are cheap and accessible."),

  h3("Ammunition"),
  p("Ammo crafting turns enmatter and residue into ammunition. This is one of the highest-volume crafting activities because hunters consume massive amounts of ammo. Margins are thin but volume is enormous."),

  h3("Components"),
  p("Component crafting produces intermediate parts that other crafters use in more complex recipes. Components are always in demand and are a steady income source once you have the right blueprints."),

  callout("info", "Most crafters specialise in one or two categories rather than trying to do everything. Specialisation lets you level specific blueprints faster and build a reputation with buyers."),

  h2("Crafting Economics"),
  h3("Cost Per Attempt"),
  p("The cost of a single craft attempt equals the TT value of the materials consumed plus the blueprint decay plus machine fees. This is your investment — the output needs to be worth more than this to profit."),

  h3("Markup and Profit"),
  p("Crafted items sell above TT value if they are in demand. The difference between your material cost and the sale price is your profit. Successful crafters understand which items carry markup and which do not."),

  h3("The Residue Problem"),
  p("Failed crafts return residue instead of the item. Residue has a very low value. If you fail too often, your residue pile grows and your PED balance shrinks. This is the primary risk of crafting."),

  callout("warning", "Crafting can consume PED very quickly. A session of 100 craft attempts might cost 50–200 PED in materials. Do not invest more than you are comfortable losing while you are learning."),

  h2("Getting Started as a Crafter"),
  h3("First Steps"),
  numbered("Buy a cheap blueprint from the Trade Terminal (tools or basic components)"),
  numbered("Buy the required materials from the Trade Terminal"),
  numbered("Find a Crafting Machine terminal"),
  numbered("Craft 10–20 attempts to learn the interface and see the outcomes"),
  numbered("Sell successes on the auction or to Trade Terminal"),
  numbered("Track your costs and returns in a spreadsheet"),

  h3("Beginner Tips"),
  bullet("Start with low-cost blueprints — learn the system before investing serious PED"),
  bullet("Track every craft attempt: materials in, items out, PED profit/loss"),
  bullet("Sell crafted items on auction, not to the Trade Terminal — markup is your profit margin"),
  bullet("Level one blueprint at a time for faster QR improvement"),
  bullet("Join the community for blueprint advice and material sourcing"),

  callout("tip", "Crafting pairs naturally with mining. If you mine your own materials, your effective cost is lower than buying from other players. Many successful players combine mining and crafting."),
];

async function seed() {
  console.log("Seeding Crafting 101 guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/crafting-101");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
