/**
 * Seed: Setesh Guide
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-setesh.ts
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

const GUIDE_ID = "5cf10259-9304-433d-b53d-5fef9849bcc0";

const body = [
  h2("What Is Setesh?"),
  p("Setesh is the tutorial and starter area on Planet Calypso in Entropia Universe. It is a guided experience designed to teach new players the fundamental mechanics of the game — movement, combat, looting, trading, and crafting. If you created your avatar on Calypso, Setesh is where you wake up."),
  p("The name comes from the Egyptian deity Set — fitting for a desert-themed starting zone. You will spend roughly 30 to 60 minutes here depending on how thoroughly you explore."),

  callout("info", "Setesh was introduced as part of the new player experience overhaul. If you are returning to the game after a long break, the starting area may be different from what you remember."),

  h2("The Setesh Mission Chain"),
  h3("Starting the Missions"),
  p("When you first load into Setesh, an NPC will greet you and offer the first mission. Accept it. The mission chain is linear — each mission leads to the next — and it walks you through every core mechanic."),

  h3("Mission Sequence Overview"),
  numbered("Movement tutorial — WASD controls, jumping, camera rotation"),
  numbered("Interaction tutorial — talking to NPCs, using terminals"),
  numbered("Equipment tutorial — opening inventory, equipping items"),
  numbered("Combat tutorial — targeting, firing, using a healing tool"),
  numbered("Looting tutorial — collecting drops from defeated mobs"),
  numbered("Crafting introduction — basic crafting at a terminal"),
  numbered("Trading tutorial — buying from and selling to Trade Terminals"),
  numbered("Teleporter tutorial — using the TP system to fast-travel"),

  callout("tip", "Do not skip any missions, even if the instructions seem obvious. Each mission rewards you with starter gear and a small amount of PED or ammo. Skipping means leaving free items on the table."),

  h2("Starter Equipment Rewards"),
  h3("What You Receive"),
  bullet("A basic weapon (usually a TT pistol or rifle)"),
  bullet("A small amount of Universal Ammo"),
  bullet("A First Aid Pack (FAP) for healing"),
  bullet("Basic armor pieces"),
  bullet("A set of starter clothing"),

  h3("Keep or Sell?"),
  p("Keep everything for now. The starter gear is designed for the first few hours of gameplay outside Setesh. You can sell items later once you have a better understanding of what you need and what has value."),

  h2("Combat in Setesh"),
  h3("Your First Fight"),
  p("The combat tutorial pits you against very low-level training mobs. These have minimal HP and deal almost no damage. The goal is to learn the targeting and firing mechanics, not to challenge you."),

  h3("Key Controls"),
  bullet("Left Alt — toggle between Cursor Mode and Aim Mode"),
  bullet("Left Click — fire weapon (in Aim Mode) or interact (in Cursor Mode)"),
  bullet("Use hotbar keys to activate your FAP when health drops"),

  callout("warning", "Do not waste ammo shooting at nothing. Each shot costs real PED. Even in the tutorial, get into the habit of only firing when you have a target locked."),

  h2("Leaving Setesh"),
  h3("When to Leave"),
  p("You can leave Setesh at any time, but it is recommended to complete all tutorial missions first. Once you leave, you cannot return — the area is only accessible to new characters."),

  h3("How to Leave"),
  p("The final tutorial mission directs you to a teleporter that takes you to the main Calypso landmass. Use it when you are ready. You will arrive at a populated area with other players, trade terminals, and access to the wider game world."),

  h3("What Happens Next"),
  bullet("Explore the area around your arrival point"),
  bullet("Register the nearest teleporter to save your location"),
  bullet("Check the Mission Terminal for daily missions — these give bonus rewards"),
  bullet("Consider joining a Society (guild) for guidance and community"),
  bullet("Refer to our other guides: Mining 101, Hunting 101, and Getting to The Howling Mine"),

  callout("tip", "Your first priority after leaving Setesh should be finding a Revival Terminal and a Trade Terminal near where you want to hunt or mine. Knowing where these are saves time and PED."),

  h2("Common Setesh Questions"),
  h3("Can I Go Back to Setesh?"),
  p("No. Once you leave the tutorial area, it is permanently closed to your character. Make sure you have completed everything and collected all rewards before leaving."),

  h3("I Skipped a Mission — Can I Redo It?"),
  p("Some missions can be picked up again from the mission terminal. If a mission is truly gone, do not worry — the gear rewards are small and you can buy equivalent items from any Trade Terminal."),

  h3("Is Setesh the Same on Every Planet?"),
  p("No. Each planet has its own starting experience. Setesh is specific to Planet Calypso. Other planets like Arkadia and Cyrene have their own tutorial areas with different themes and rewards, but the core mechanics taught are the same."),
];

async function seed() {
  console.log("Seeding Setesh Guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/setesh-guide");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
