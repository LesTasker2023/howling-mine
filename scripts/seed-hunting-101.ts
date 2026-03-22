/**
 * Seed script — pushes the Hunting 101 guide into Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=<your-write-token> npx tsx scripts/seed-hunting-101.ts
 */

import { createClient } from "@sanity/client";

const projectId = "u2kuytve";
const dataset = "production";
const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN;

if (!token) {
  console.error(
    "⛔  Set SANITY_API_TOKEN env var to a write-capable token.\n" +
      "   Create one at https://www.sanity.io/manage",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

/* ────────────────────────────────────────────────── */
/*  Portable Text helpers                              */
/* ────────────────────────────────────────────────── */
let _k = 0;
const key = () => `k${++_k}`;

type Mark = "strong" | "em" | "code";

const span = (text: string, marks: Mark[] = []) => ({
  _type: "span" as const,
  _key: key(),
  text,
  marks,
});

const block = (
  children: ReturnType<typeof span>[],
  style: string = "normal",
) => ({
  _type: "block" as const,
  _key: key(),
  style,
  markDefs: [],
  children,
});

const h2 = (t: string) => block([span(t)], "h2");
const h3 = (t: string) => block([span(t)], "h3");
const h4 = (t: string) => block([span(t)], "h4");
const p = (t: string) => block([span(t)]);

const bullet = (t: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "normal",
  listItem: "bullet" as const,
  level: 1,
  markDefs: [],
  children: [span(t)],
});

const numbered = (t: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "normal",
  listItem: "number" as const,
  level: 1,
  markDefs: [],
  children: [span(t)],
});

const callout = (
  tone: "info" | "tip" | "warning" | "danger",
  text: string,
) => ({
  _type: "callout" as const,
  _key: key(),
  tone,
  body: text,
});

/* ────────────────────────────────────────────────── */
/*  Category (ensure it exists)                        */
/* ────────────────────────────────────────────────── */
const huntingCategory = {
  _id: "cat-hunting",
  _type: "category",
  title: "Hunting",
  slug: { _type: "slug", current: "hunting" },
  description:
    "Guides covering mob hunting, loot mechanics, and markup strategies.",
};

/* ────────────────────────────────────────────────── */
/*  Hunting 101 Guide                                  */
/* ────────────────────────────────────────────────── */
const hunting101 = {
  _id: "guide-hunting-101",
  _type: "guide",
  title: "Hunting 101 — Your First Hunt in Entropia Universe",
  slug: { _type: "slug", current: "hunting-101" },
  excerpt:
    "A complete beginner's guide to hunting in Entropia Universe — from choosing your first weapon and armor to understanding loot, damage types, and how to make your PED last longer.",
  difficulty: "beginner",
  order: 1,
  publishedAt: new Date().toISOString(),
  category: { _type: "reference", _ref: "cat-hunting" },
  body: [
    // ── Introduction ──
    h2("What Is Hunting?"),
    block([
      span(
        "Hunting is one of the core professions in Entropia Universe and the most common entry point for new players. In simple terms, you kill creatures — called ",
      ),
      span("mobs", ["strong"]),
      span(
        " — to collect the loot they drop. That loot has real PED value and can be sold at the Trade Terminal, auctioned to other players, or used to fuel your next adventure.",
      ),
    ]),
    block([
      span(
        "There is no barehanded fighting in Entropia Universe. To deal damage you always need a weapon, and for ranged weapons you need ammunition. This guide covers everything you need to go from zero to your first successful hunt.",
      ),
    ]),

    callout(
      "info",
      "Hunting is a PED sink — you will spend money on ammo, weapon decay, armor decay, and healing. The goal is not to profit on every run, but to minimize losses while building skills and occasionally hitting a big loot event.",
    ),

    // ── Essential Equipment ──
    h2("Essential Equipment"),
    block([
      span(
        "Before heading out, you need to gather your gear. Here is the minimum loadout for a beginner hunter:",
      ),
    ]),

    h3("1. Weapon"),
    block([
      span(
        "Your weapon is your primary tool. As a new player, start with a Trade Terminal (TT) weapon — these are cheap, unlimited (repairable), and perfectly adequate for low-level mobs. Good starter options include:",
      ),
    ]),
    bullet("TT Pistol — ranged, uses Universal Ammo, good for building Handgun skills"),
    bullet("TT Rifle — ranged, slightly more damage, good for Rifle skills"),
    bullet("Powerfist or Shortblade — melee alternatives if you prefer close combat"),

    callout(
      "tip",
      "Ranged weapons are recommended for beginners. While melee weapons don't consume ammo, they decay much faster — making them more expensive overall than buying ammunition for a ranged weapon.",
    ),

    h3("2. Ammunition"),
    block([
      span("Ranged weapons require ammunition purchased from any "),
      span("Trade Terminal", ["strong"]),
      span(". Most beginner weapons use "),
      span("Universal Ammo", ["strong"]),
      span(
        ", which is compatible with both BLP and Laser weapon types. If you buy the wrong ammo type, you can sell it back to the terminal at full price — no loss.",
      ),
    ]),

    h3("3. Healing Tool (FAP)"),
    block([
      span("A "),
      span("First Aid Pack", ["strong"]),
      span(
        " (commonly called a FAP) lets you heal yourself during combat. Your health regenerates slowly on its own, but that is far too slow during a fight. Buy a basic FAP from the Trade Terminal — it will save your life repeatedly.",
      ),
    ]),
    block([
      span(
        "Most FAPs heal instantly when used, then go on a short cooldown before you can use them again. Higher-tier FAPs heal more per use but cost more in decay.",
      ),
    ]),

    h3("4. Armor (Optional but Recommended)"),
    block([
      span(
        "Armor absorbs incoming damage on the body part it protects. Beginner armor is available from the Trade Terminal or included in Starter Packs. Each armor piece protects against specific ",
      ),
      span("damage types", ["strong"]),
      span(
        " — so the armor you wear should match the damage type of the mob you are hunting.",
      ),
    ]),

    callout(
      "warning",
      "Some experienced players advise skipping armor entirely at very low levels until you have built up some Evade skill, as armor decay can eat into a tight budget. If your budget is under 10 PED per run, consider hunting without armor on the lowest-level mobs.",
    ),

    // ── Weapon Types ──
    h2("Weapon Types"),
    block([
      span(
        "Entropia Universe has several weapon categories. Each one builds different skills and has different cost characteristics:",
      ),
    ]),

    h3("Ranged Weapons"),
    bullet("Laser — uses Universal Ammo or Laser Cells. Common, well-rounded."),
    bullet("BLP (Ballistic Laser Plasma) — uses Universal Ammo or BLP Packs. Slightly different damage profiles than Laser."),
    bullet("Pistols, Carbines, Rifles — subcategories within Laser/BLP that each build their own skill trees."),

    h3("Melee Weapons"),
    bullet("Swords, Knives, Clubs, Powerfists — no ammo cost but high decay."),
    bullet("Best for players who want to build melee-specific skills."),
    bullet("Require you to be in close range, meaning you take more hits."),

    h3("Mindforce (MF)"),
    bullet("Requires a Mindforce Implant inserted into your avatar's head."),
    bullet("Uses Mind Essence or Universal Ammo as fuel."),
    bullet("Can deal damage, heal, teleport, and apply buffs — very versatile but complex for beginners."),

    callout(
      "info",
      "Each weapon has two profession requirements: a Hit profession and a Damage profession. If your skill is too low for a weapon, you will miss more often, deal less damage, and waste ammo. Always check that you meet the profession requirements before equipping a weapon.",
    ),

    // ── Understanding Damage Types ──
    h2("Understanding Damage Types"),
    block([
      span("Every creature in Entropia Universe deals one or more "),
      span("damage types", ["strong"]),
      span(
        " when it attacks you. Likewise, your armor protects against specific damage types. Understanding this system is key to surviving efficiently.",
      ),
    ]),

    h3("The Nine Damage Types"),
    block([
      span("Damage types are divided into three categories:"),
    ]),

    h4("Melee Damage Types"),
    bullet("Impact — blunt force damage (e.g., Berycled)"),
    bullet("Cut — slashing damage (e.g., Argonaut)"),
    bullet("Stab — piercing damage (e.g., Sabakuma)"),

    h4("Ranged Damage Types"),
    bullet("Burn — heat/fire damage (e.g., Drones)"),
    bullet("Penetration — armor-piercing damage (e.g., Robots)"),

    h4("Exotic Damage Types"),
    bullet("Electric — shock damage (e.g., Allophyl)"),
    bullet("Cold — freeze damage (e.g., Feffoid)"),
    bullet("Acid — corrosive damage (e.g., Snablesnot)"),
    bullet("Shrapnel — fragmentation damage (e.g., PvP combat)"),

    callout(
      "tip",
      "Before hunting a new mob, check what damage type it deals. You can scan creatures in-game or look them up on community wikis. Then equip armor that protects against that specific damage type. Wearing burn-resistant armor against a mob that deals Stab damage is almost the same as wearing nothing.",
    ),

    // ── Mob Maturity Levels ──
    h2("Mob Maturity Levels"),
    block([
      span(
        "Every creature species in Entropia Universe comes in a range of maturity levels. Higher maturity means more HP, more damage, and potentially better loot — but also higher risk and cost to kill.",
      ),
    ]),

    block([
      span("The standard maturity progression from weakest to strongest is:"),
    ]),

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

    block([
      span(
        "Some species have unique maturity names — for example, Cornundos start at Puny, while Mermoths start at Cub and Sabakuma at Hatchling. The principle is always the same: ",
      ),
      span("start at the bottom and work up as your skills and gear improve.", ["strong"]),
    ]),

    callout(
      "warning",
      "As a new player, stick to Puny, Young, and Mature mobs. Anything above Mature will likely kill you faster than you can heal, wasting PED on armor decay and revival costs.",
    ),

    // ── Your First Hunt ──
    h2("Your First Hunt — Step by Step"),

    h3("Step 1: Gear Up"),
    block([
      span(
        "Visit a Trade Terminal. Buy a TT Pistol or TT Rifle, enough Universal Ammo for your budget (even 5 PED of ammo is fine for a first run), and a basic FAP. If you can afford it, grab a set of beginner armor.",
      ),
    ]),

    h3("Step 2: Pick Your Target"),
    block([
      span(
        "Choose a low-HP mob near a revival terminal or outpost. On Calypso, good starter targets include:",
      ),
    ]),
    bullet("Cornundos (Puny) — 10 HP, found near starting areas"),
    bullet("Tripudion (Puny) — 10 HP, commonly found in open fields"),
    bullet("Sabakuma (Hatchling) — 10 HP, found along roads"),
    bullet("Berycled (Puny) — 13 HP, slightly tougher but still easy"),
    bullet("Hiryuu (Fledgling) — 20 HP, a small step up"),

    callout(
      "tip",
      "Use the /wp command in chat to set waypoints. Format: /wp [Planet, X, Y, Z, Label]. Community guides and codex sites list coordinates for popular hunting spots.",
    ),

    h3("Step 3: Engage the Mob"),
    block([
      span("Toggle between "),
      span("Cursor Mode", ["strong"]),
      span(" and "),
      span("Aim Mode", ["strong"]),
      span(
        " using the Left Alt key. In Aim Mode you can target and fire directly. Click on a creature to attack it. Keep firing until it dies — watch your health and use your FAP when it drops low.",
      ),
    ]),

    h3("Step 4: Loot"),
    block([
      span(
        "Once the creature is dead, approach it and loot the corpse. In Cursor Mode, right-click the corpse. In Aim Mode, use the interact key. A loot window will appear showing what you received. Items are automatically transferred to your inventory.",
      ),
    ]),

    h3("Step 5: Repeat and Learn"),
    block([
      span(
        "Keep hunting the same mob type to build up skills and learn the rhythm of combat. Pay attention to how much ammo you use per kill, how much damage you take, and what loot drops. This awareness is the foundation of efficient hunting.",
      ),
    ]),

    // ── Loot ──
    h2("Understanding Loot"),
    block([
      span(
        "Loot is the reason you hunt. Every creature drops something when it dies — but what you get and how much it is worth varies significantly.",
      ),
    ]),

    h3("Common Loot Types"),
    bullet("Shrapnel — the most common drop. Converts to Universal Ammo at a 101:100 ratio (a small 1% bonus)."),
    bullet("Animal Hides, Oils, and Extracts — crafting materials that can be sold to other players, often above TT value."),
    bullet("Weapons and Armor — rare drops, especially from higher-maturity mobs."),
    bullet("Ammunition and Medical Supplies — useful for extending your hunting run."),

    h3("Globals and Hall of Fame"),
    block([
      span("When you receive an unusually large loot from a single kill, the game triggers a "),
      span("Global", ["strong"]),
      span(
        " — your avatar lights up with special effects and a notification appears in the global chat for all players to see. ",
      ),
    ]),
    block([
      span("If your loot is among the "),
      span("top 100 highest of the day", ["strong"]),
      span(
        ", it earns a spot on the Hall of Fame (HOF) board. Globals and HOFs are exciting milestones, but they are uncommon at low levels — do not hunt expecting to hit one.",
      ),
    ]),

    h3("Loot Value vs. Markup"),
    block([
      span(
        "Every item has a Trade Terminal (TT) value — the base price you can always sell it for. Many items also carry ",
      ),
      span("markup", ["strong"]),
      span(
        " — the percentage above TT value that other players will pay. For example, an item with 1 PED TT value and 200% markup is worth 2 PED to another player. Always check auction prices before selling loot to the terminal.",
      ),
    ]),

    callout(
      "info",
      "The Loot 2.0 system rewards efficient hunting. Matching your skills and gear to the creature you hunt affects loot composition — what items you receive. It does not change the total loot value, but you will get more interesting and useful drops when you hunt optimally.",
    ),

    // ── Skills and Progression ──
    h2("Skills and Progression"),
    block([
      span(
        "Every action in Entropia Universe builds skills. When you hunt, you gain skills based on the weapon you use, the damage you take, and the creatures you kill.",
      ),
    ]),

    h3("Weapon Skills"),
    block([
      span(
        "Using a weapon builds proficiency in its category. Pistols build Handgun skills, rifles build Rifle skills, and so on. Each weapon has two key profession levels:",
      ),
    ]),
    bullet("Hit Profession — affects attacks per minute, accuracy, and critical hit chance."),
    bullet("Damage Profession — affects the damage range you can deal with that weapon."),

    block([
      span("A weapon is considered "),
      span("maxed", ["strong"]),
      span(
        " when your skills are high enough to use it at 100% of its potential — full attack speed, full damage range, and 10/10 hit ability. Always aim to use weapons you can max or are close to maxing.",
      ),
    ]),

    h3("Defense Skills"),
    block([
      span(
        "Taking damage builds Evade and Dodge skills over time. These passively reduce the damage you take, making you more efficient as you level up.",
      ),
    ]),

    h3("The Codex"),
    block([
      span("The "),
      span("Codex", ["strong"]),
      span(
        " is Entropia Universe's dynamic mission system. Each creature species has its own Codex progress bar that fills as you kill mobs of that type. Completing a Codex rank lets you choose a skill reward — a free injection of skill points into any profession you pick.",
      ),
    ]),

    callout(
      "tip",
      "Focus on one mob type at a time to complete Codex ranks efficiently. The skill rewards from Codex are free and can significantly accelerate your progression, especially at early levels.",
    ),

    h3("SIB vs. Non-SIB Weapons"),
    block([
      span("Weapons marked as "),
      span("SIB (Skill Increase Bonus)", ["strong"]),
      span(
        " give you extra skill gains while you use them, up until your skill is high enough to max the weapon. Non-SIB weapons never provide a skill bonus. For newer players, SIB weapons are often the better choice for long-term skill building.",
      ),
    ]),

    // ── Cost Management ──
    h2("Managing Your Costs"),
    block([
      span(
        "Hunting in Entropia Universe has a real cost. Understanding where your PED goes is essential for making your budget last.",
      ),
    ]),

    h3("The Cost Formula"),
    block([
      span("Every shot you fire has two costs:"),
    ]),
    bullet("Ammo Burn — the amount of ammunition consumed per shot."),
    bullet("Weapon Decay — the durability loss on your weapon per shot, which costs PED to repair."),
    block([
      span("The total "),
      span("cost per shot = ammo burn + weapon decay", ["strong"]),
      span(". This is the foundation of hunting economics."),
    ]),

    h3("Damage Per PEC (DPP)"),
    block([
      span("DPP measures how much damage you deal per PEC (1/100th of a PED) spent. A higher DPP means you deal more damage per unit of currency — making your hunts cheaper. When comparing weapons, DPP is one of the most important metrics."),
    ]),

    h3("Efficiency"),
    block([
      span("Weapon "),
      span("efficiency", ["strong"]),
      span(
        " is a percentage value that factors into your loot returns. Higher efficiency contributes to better loot quality. Efficiency tiers are roughly:",
      ),
    ]),
    bullet("Below 50% — poor"),
    bullet("50–60% — average"),
    bullet("60–70% — very good"),
    bullet("70%+ — exceptional (usually expensive weapons)"),

    h3("Armor and Healing Costs"),
    block([
      span(
        "Armor decays every time you get hit. Your FAP decays every time you heal. These are ongoing costs that add up. Match your armor to the mob's damage type so every point of protection counts, and try to take as little unnecessary damage as possible.",
      ),
    ]),

    callout(
      "warning",
      "Never hunt with PED you cannot afford to lose. The average return rate across all hunters is approximately 96–99% — meaning most runs lose a small percentage. The system rewards long-term play, not individual sessions.",
    ),

    // ── Team Hunting ──
    h2("Team Hunting"),
    block([
      span(
        "Teams can have up to 12 members and are a great way to tackle mobs above your solo ability. When you team up, loot is distributed according to the team's chosen distribution setting.",
      ),
    ]),

    h3("Loot Distribution Options"),
    bullet("Damage Item Share — loot is split proportionally based on damage dealt."),
    bullet("Damage Stack Share — stackable loot is split by damage proportion."),
    bullet("Damage Decides Order — highest damage dealer loots first."),
    bullet("Looter Takes All — first person to loot gets everything."),
    bullet("Most Damage Wins All — top damage dealer gets all loot."),
    bullet("Queue — team members take turns looting."),

    callout(
      "tip",
      "For beginner teams, Damage Item Share is the fairest option. Bring a dedicated healer if you are tackling mobs above your level — some players specialize in healing and offer their services for a share of the loot.",
    ),

    // ── Survival Tips ──
    h2("Survival Tips for New Hunters"),

    bullet("Stay near a Revival Terminal — if you die, you respawn at the nearest one. Being close means less running."),
    bullet("Hug the shoreline — fewer aggressive mobs spawn near water, and creatures die shortly after entering water."),
    bullet("Check the mob's damage type before you hunt — match your armor or go without."),
    bullet("Do not overkill — using a weapon that is too powerful for the mob wastes ammo on damage that exceeds the mob's remaining HP."),
    bullet("Start with one weapon type and stick with it — switching between weapon types fragments your skill gains."),
    bullet("Complete daily missions from the Mission Terminal for bonus tokens and rewards."),
    bullet("Scan mobs in-game to learn their damage types and HP values before engaging."),
    bullet("Move to a different area if you feel your loot is consistently poor — changing location can sometimes help."),

    // ── Common Mistakes ──
    h2("Common Beginner Mistakes"),

    bullet("Using a weapon you haven't maxed — you lose efficiency and waste PED on missed shots and reduced damage."),
    bullet("Ignoring armor damage types — generic armor is nearly useless if it doesn't match the mob's damage type."),
    bullet("Hunting mobs that are too high level — you burn through ammo and healing while dealing less damage."),
    bullet("Selling loot to the Trade Terminal without checking markup — you could be leaving significant value on the table."),
    bullet("Spending all your PED in one run — always keep a reserve so you can hunt again tomorrow."),

    callout(
      "danger",
      "Avoid PvP-lootable zones until you are experienced. In these areas, other players can kill you and take everything you are carrying. There is no undo.",
    ),

    // ── What's Next ──
    h2("What's Next?"),
    block([
      span(
        "Once you are comfortable with the basics, there is a whole world of hunting depth to explore:",
      ),
    ]),
    bullet("Weapon attachments — scopes, laser sights, and amplifiers increase your effectiveness."),
    bullet("Enhancers — temporary boosts that add stats to your weapon at a cost."),
    bullet("Higher-maturity mobs — better Codex rewards and more valuable loot."),
    bullet("Markup hunting — targeting specific mobs that drop high-markup materials."),
    bullet("Planet hopping — each planet (Calypso, Arkadia, Cyrene, Next Island, Toulan, Rocktropia, Monria) has unique mobs and loot tables."),
    bullet("Specialized builds — optimizing your entire loadout around a specific weapon class and mob type."),

    block([
      span("Welcome to the hunt — and remember: "),
      span(
        "every veteran was once a beginner who refused to quit.",
        ["em"],
      ),
    ]),
  ],
};

/* ────────────────────────────────────────────────── */
/*  Push to Sanity                                     */
/* ────────────────────────────────────────────────── */
async function seed() {
  console.log("🎯 Seeding Hunting 101 guide…\n");

  const tx = client.transaction();
  tx.createOrReplace(huntingCategory);
  tx.createOrReplace(hunting101);

  const result = await tx.commit();
  console.log("✅ Seeded Hunting 101 — transaction:", result.transactionId);
  console.log("   📘 Guide: /guides/hunting-101");
  console.log("   🏷️  Category: Hunting");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
