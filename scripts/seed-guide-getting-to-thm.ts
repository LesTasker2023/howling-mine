/**
 * Seed: Getting to The Howling Mine guide
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-getting-to-thm.ts
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

const GUIDE_ID = "f3479b19-6983-4191-85e4-a17a201cec50";

const body = [
  h2("What Is The Howling Mine?"),
  p("The Howling Mine is a community-run mining operation and social hub within Entropia Universe. It serves as a gathering point for miners, hunters, and traders — particularly those focused on asteroid and planetary mining. If you are reading this site, you are already connected to the community. This guide explains how to physically get your avatar there in-game."),

  h2("Where Is It Located?"),
  p("The Howling Mine is situated on Planet Calypso. You will need to be on Calypso or travel there from another planet to reach it. If you started on Calypso, you are already on the right planet."),

  h3("Coordinates"),
  p("The exact coordinates depend on the current Land Area location. Check the community Discord for the latest waypoint — coordinates are pinned in the general channel."),

  callout("info", "Use the /wp command in local chat to set a waypoint. Format: /wp [Calypso, X, Y, Z, The Howling Mine]. Replace X, Y, Z with the coordinates from Discord."),

  h2("Getting There from a Starting Area"),
  h3("Option 1: Teleporter"),
  p("The fastest method. Open your map (M key), look for the nearest teleporter chip terminal, and check if there is a direct teleport to the area. Teleporting costs a small PED fee based on distance. If you have not discovered the destination teleporter yet, you will need to travel there once on foot or by vehicle first."),

  h3("Option 2: Running on Foot"),
  p("Free but slow. Set your waypoint and start running. Entropia Universe has no fast-travel for undiscovered locations — you must physically reach a teleporter before you can use it. Stick to roads where possible to avoid aggressive mobs."),

  bullet("Bring a healing tool (FAP) in case you aggro mobs on the way"),
  bullet("Avoid high-level mob areas — check your map for danger indicators"),
  bullet("Run in a straight line toward the waypoint — the terrain is mostly passable"),

  h3("Option 3: Vehicle"),
  p("If you own or can borrow a vehicle (Sleipnir, Valkyrie, or other land vehicle), this is the best balance of speed and cost. Vehicles use Oil as fuel, which costs PED, but they are significantly faster than running and safer since most mobs cannot catch you at full speed."),

  h3("Option 4: Summon from a Society Member"),
  p("Some high-level players own summon tools or revival terminals near The Howling Mine. Ask in the community Discord if someone can summon or revive you at the location. This is instant and free."),

  callout("tip", "Once you arrive at The Howling Mine for the first time, immediately register the nearest teleporter. This saves you the trip next time — you can teleport directly back whenever you want."),

  h2("If You Are on Another Planet"),
  h3("Space Travel"),
  p("To reach Calypso from another planet, you need to travel through space. This requires going to a space station (usually via a planetary teleporter), then either piloting your own spacecraft or hitching a ride with another player."),

  h3("Hitchhiking"),
  bullet("Go to the planet's space station via teleporter"),
  bullet("Ask in local chat or Trade channel for a ride to Calypso"),
  bullet("Many pilots offer free or cheap transport — tip them if you can"),

  h3("Quad Wing"),
  p("The Quad Wing is a free personal spacecraft available to all players. It is slow and vulnerable to pirates in PvP space, but it gets the job done for planet-to-planet travel."),

  callout("warning", "Space between planets includes PvP-lootable zones. If you are carrying valuable items, consider storing them in a terminal before travelling. Pirates actively patrol popular routes."),

  h2("What to Bring"),
  h3("Essential Gear"),
  bullet("A weapon and ammo — mobs may aggro you on the way"),
  bullet("A First Aid Pack (FAP) — for healing during travel"),
  bullet("Minimal valuable items — keep inventory light in case of PvP encounters in space"),

  h3("Optional"),
  bullet("A vehicle and Oil — faster ground travel"),
  bullet("Teleport chips — if you have already discovered nearby teleporters"),
  bullet("A Mining Finder and Excavator — so you can start mining as soon as you arrive"),

  h2("Once You Arrive"),
  h3("Register the Teleporter"),
  p("This is the single most important thing to do. Walk to the nearest teleporter and interact with it. It is now permanently saved to your teleporter list."),

  h3("Introduce Yourself"),
  p("Say hello in local chat or the community Discord. The Howling Mine community is welcoming to new players. Let people know you are new and you will likely get offers of help, advice, and possibly free starter gear."),

  h3("Explore the Area"),
  bullet("Check the local Trade Terminal for buying ammo and selling loot"),
  bullet("Look for the Repair Terminal to fix damaged equipment"),
  bullet("Note the nearest Revival Terminal in case you die"),
  bullet("Scout the surrounding area for mining spots and mob spawns"),
];

async function seed() {
  console.log("Seeding Getting to The Howling Mine guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/getting-to-the-howling-mine");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
