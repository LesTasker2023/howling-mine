/**
 * Seed: Hunting 101 guide (replaces old content)
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-guide-hunting-101-v2.ts
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

const GUIDE_ID = "guide-hunting-101";

const body = [
  h2("What Is Hunting?"),
  p("Hunting is the most popular profession in Entropia Universe. You kill creatures — called mobs — to collect loot drops with real PED value. That loot can be sold at Trade Terminals, auctioned to other players, or used to fuel other professions like crafting."),
  p("Hunting requires a weapon, ammunition (for ranged), and ideally a healing tool and armor. Every shot costs real PED, so understanding the economics is just as important as the combat itself."),

  callout("info", "Hunting is a PED sink — you spend money on ammo, weapon decay, armor decay, and healing. The goal is to minimize losses while building skills and occasionally hitting valuable loot events."),

  h2("Essential Equipment"),
  h3("Weapon"),
  p("Your primary tool. Start with a Trade Terminal (TT) weapon — these are cheap, unlimited (repairable), and adequate for low-level mobs."),
  bullet("TT Pistol — ranged, uses Universal Ammo, builds Handgun skills"),
  bullet("TT Rifle — ranged, slightly more damage, builds Rifle skills"),
  bullet("Powerfist or Shortblade — melee alternatives, no ammo cost but higher decay"),

  callout("tip", "Ranged weapons are recommended for beginners. Melee weapons skip ammo costs but decay much faster, often making them more expensive overall."),

  h3("Ammunition"),
  p("Ranged weapons require ammunition from any Trade Terminal. Most beginner weapons use Universal Ammo, which works with both BLP and Laser weapon types. Wrong ammo type can be sold back at full price — no loss."),

  h3("Healing Tool (FAP)"),
  p("A First Aid Pack lets you heal during combat. Health regenerates too slowly on its own for active fighting. Buy a basic FAP from the Trade Terminal. Most FAPs heal instantly then go on a short cooldown."),

  h3("Armor"),
  p("Armor absorbs incoming damage. Each piece protects against specific damage types — match your armor to the mob you are hunting. Beginner armor is available from the Trade Terminal."),

  callout("warning", "Some veterans advise skipping armor at very low levels until you build Evade skill, as armor decay eats into tight budgets. If under 10 PED per run, consider hunting without armor on the lowest mobs."),

  h2("Weapon Types"),
  h3("Ranged Weapons"),
  bullet("Laser — uses Universal Ammo or Laser Cells, well-rounded and common"),
  bullet("BLP — uses Universal Ammo or BLP Packs, slightly different damage profiles"),
  bullet("Subcategories — Pistols, Carbines, Rifles each build their own skill trees"),

  h3("Melee Weapons"),
  bullet("Swords, Knives, Clubs, Powerfists — no ammo cost but high decay"),
  bullet("Require close range meaning you take more hits"),
  bullet("Build melee-specific skills"),

  h3("Mindforce"),
  bullet("Requires a Mindforce Implant in your avatar's head"),
  bullet("Uses Mind Essence or Universal Ammo as fuel"),
  bullet("Can deal damage, heal, teleport, and buff — versatile but complex for beginners"),

  callout("info", "Each weapon has Hit and Damage profession requirements. Too-low skill means missed shots, reduced damage, and wasted ammo. Always check profession requirements before equipping a weapon."),

  h2("Understanding Damage Types"),
  p("Every creature deals specific damage types when attacking. Your armor protects against specific types. Matching armor to mob damage type is critical for efficient hunting."),

  h3("The Nine Damage Types"),
  p("Divided into three categories:"),
  bullet("Melee: Impact (blunt), Cut (slash), Stab (pierce)"),
  bullet("Ranged: Burn (heat/fire), Penetration (armor-piercing)"),
  bullet("Exotic: Electric (shock), Cold (freeze), Acid (corrosive), Shrapnel (fragmentation)"),

  callout("tip", "Before hunting a new mob, check its damage type via in-game scan or community wiki. Wearing burn armor against a Stab mob is almost the same as wearing nothing."),

  h2("Mob Maturity Levels"),
  p("Every creature species comes in maturity levels from weakest to strongest. Higher maturity means more HP, more damage, and potentially better loot — but higher cost to kill."),
  p("Standard progression from weakest to strongest:"),
  numbered("Puny"),
  numbered("Young"),
  numbered("Mature"),
  numbered("Old"),
  numbered("Provider"),
  numbered("Guardian"),
  numbered("Dominant"),
  numbered("Alpha"),
  numbered("Old Alpha"),
  numbered("Prowler"),
  numbered("Stalker"),

  callout("warning", "As a new player, stick to Puny, Young, and Mature mobs. Anything above Mature will likely kill you faster than you can heal."),

  h2("Your First Hunt"),
  h3("Step 1: Gear Up"),
  p("Visit a Trade Terminal. Buy a TT weapon, Universal Ammo (even 5 PED is fine for a first run), and a basic FAP. Grab beginner armor if budget allows."),

  h3("Step 2: Pick Your Target"),
  p("Choose a low-HP mob near a revival terminal. Good Calypso starter targets:"),
  bullet("Cornundos (Puny) — 10 HP, near starting areas"),
  bullet("Tripudion (Puny) — 10 HP, open fields"),
  bullet("Sabakuma (Hatchling) — 10 HP, along roads"),
  bullet("Berycled (Puny) — 13 HP, slightly tougher"),

  h3("Step 3: Engage"),
  p("Toggle Aim Mode with Left Alt. Click a creature to attack. Keep firing, watch health, use FAP when it drops low."),

  h3("Step 4: Loot"),
  p("Approach the dead creature and loot it. Right-click in Cursor Mode or use interact key in Aim Mode. Items transfer to inventory automatically."),

  h3("Step 5: Repeat"),
  p("Hunt the same mob type to build skills. Track ammo used per kill, damage taken, and loot received."),

  h2("Understanding Loot"),
  h3("Common Loot Types"),
  bullet("Shrapnel — most common drop, converts to Universal Ammo at 101:100 ratio"),
  bullet("Animal Hides, Oils, Extracts — crafting materials, often sell above TT value"),
  bullet("Weapons and Armor — rare drops from higher mobs"),
  bullet("Ammo and Medical Supplies — useful for extending your run"),

  h3("Globals and Hall of Fame"),
  p("Unusually large loot triggers a Global — visible server-wide notification. Top 100 daily loots hit the Hall of Fame. Exciting but uncommon at low levels."),

  h3("Markup"),
  p("Items have a TT (Trade Terminal) value and a markup — the percentage above TT that players will pay. An item with 1 PED TT and 200% markup is worth 2 PED to another player. Always check auction prices before selling to the terminal."),

  callout("info", "The Loot 2.0 system rewards efficient hunting. Matching skills and gear to the creature affects loot composition — what items you get, not the total value."),

  h2("Skills and Progression"),
  h3("Weapon Skills"),
  bullet("Hit Profession — affects attack speed, accuracy, and critical hit chance"),
  bullet("Damage Profession — affects the damage range you deal"),
  p("A weapon is maxed when your skills use it at 100% potential — full speed, full damage, 10/10 hit ability."),

  h3("Defense Skills"),
  p("Taking damage builds Evade and Dodge passively, reducing damage over time."),

  h3("The Codex"),
  p("Each creature species has a Codex progress bar. Completing a rank lets you choose a free skill reward injection. Focus on one mob type to complete ranks efficiently."),

  h3("SIB Weapons"),
  p("Weapons marked SIB (Skill Increase Bonus) give extra skill gains until you max them. For newer players, SIB weapons are often the better long-term choice."),

  h2("Managing Costs"),
  h3("Cost Per Shot"),
  bullet("Ammo burn — ammunition consumed per shot"),
  bullet("Weapon decay — durability loss per shot, costs PED to repair"),
  p("Total cost per shot = ammo burn + weapon decay."),

  h3("DPP (Damage Per PEC)"),
  p("Measures damage dealt per 1/100th of a PED spent. Higher DPP means cheaper hunts. One of the most important weapon comparison metrics."),

  h3("Efficiency"),
  p("Weapon efficiency percentage factors into loot returns. Higher efficiency contributes to better loot quality."),
  bullet("Below 50% — poor"),
  bullet("50–60% — average"),
  bullet("60–70% — very good"),
  bullet("70%+ — exceptional"),

  callout("warning", "Never hunt with PED you cannot afford to lose. Average return rate across all hunters is approximately 96–99% — most runs lose a small percentage."),

  h2("Team Hunting"),
  p("Teams of up to 12 members can tackle mobs above solo ability. Loot distribution options:"),
  bullet("Damage Item Share — split proportionally by damage dealt (recommended for beginners)"),
  bullet("Damage Stack Share — stackable loot split by damage"),
  bullet("Most Damage Wins All — top damage dealer takes everything"),
  bullet("Queue — members take turns looting"),

  h2("Survival Tips"),
  bullet("Stay near Revival Terminals — less running after death"),
  bullet("Check mob damage type before hunting — match your armor"),
  bullet("Do not overkill — overpowered weapons waste ammo on excess damage"),
  bullet("Stick with one weapon type — switching fragments skill gains"),
  bullet("Complete daily missions for bonus tokens"),
  bullet("Scan mobs in-game to learn their stats before engaging"),

  h2("Common Beginner Mistakes"),
  bullet("Using a weapon you have not maxed — reduced efficiency and wasted PED"),
  bullet("Ignoring armor damage types — generic armor is useless against mismatched damage"),
  bullet("Hunting mobs too high level — burns ammo and healing for less damage"),
  bullet("Selling loot to terminal without checking markup — leaving value on the table"),
  bullet("Spending all PED in one run — always keep a reserve"),

  callout("danger", "Avoid PvP-lootable zones until experienced. Other players can kill you and take everything you carry. There is no undo."),
];

async function seed() {
  console.log("Seeding Hunting 101 guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/hunting-101");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
