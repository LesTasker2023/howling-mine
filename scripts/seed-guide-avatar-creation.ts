/**
 * Seed: Avatar Creation guide skeleton
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-guide-avatar-creation.ts
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

const GUIDE_ID = "22a65a86-a69e-47f8-8e54-83e5ad670090";

const body = [
  h2("Before You Begin"),
  p("Avatar creation is your first real decision in Entropia Universe, and unlike most MMOs, some choices here are permanent. Your avatar's name cannot be changed after creation — ever. Take your time with this step."),
  p("Your avatar is purely cosmetic in terms of gameplay — appearance has zero effect on stats, skills, or abilities. Every new avatar starts with identical base stats regardless of how it looks."),

  h2("Choosing Your Name"),
  h3("Name Format"),
  p("Your avatar name in Entropia Universe follows a specific format: First Name, optional Nickname (in quotes), and Last Name. For example: John \"Miner\" Smith. The nickname appears in quotes in-game and is how most players will refer to you."),

  h3("Name Rules"),
  bullet("Names are permanent and cannot be changed"),
  bullet("Must be between 2–20 characters per field"),
  bullet("No offensive or trademarked names — MindArk will force a rename or ban"),
  bullet("Avoid names that look like item IDs or system text"),
  bullet("Your name is your brand — other players will know you by it for years"),

  callout("warning", "Choose your name carefully. There is no rename option in Entropia Universe. Players who have been active for 15+ years still carry the name they picked on day one."),

  h2("Appearance Customisation"),
  h3("Gender"),
  p("Choose male or female. This is permanent and cannot be changed after creation. Gender affects only the avatar model and available clothing — it has no gameplay impact."),

  h3("Face and Body"),
  p("The character creator offers sliders for facial features, body proportions, hair style, hair colour, skin tone, and eye colour. You can fine-tune these to create a unique look."),

  h3("What Can Be Changed Later"),
  bullet("Hair style and colour — visit a Beauty Centre terminal in-game"),
  bullet("Clothing and armor — purchased or looted throughout the game"),
  bullet("Face paint and tattoos — available from certain vendors"),

  h3("What Cannot Be Changed"),
  bullet("Your name (first, nickname, last)"),
  bullet("Gender"),
  bullet("Base body proportions (height)"),

  callout("tip", "Don't spend too long on appearance details. You will be wearing armor and helmets most of the time, and other players mainly see your name tag. Get it roughly right and move on."),

  h2("Starting Planet"),
  h3("Planet Calypso"),
  p("The original planet and most populated. Has the largest economy, most diverse content, and biggest player base. Recommended for most new players. The tutorial is well-established and starting areas are busy with helpful veterans."),

  h3("Planet Arkadia"),
  p("Treasure-hunting themed planet with unique underground instances and IFN missions. Good community and solid beginner content. Slightly less populated than Calypso but very welcoming to newcomers."),

  h3("Planet Cyrene"),
  p("Newer planet with unique mob types and a focus on mission chains. Smaller population but dedicated community. Good if you want a less crowded experience."),

  h3("Next Island"),
  p("Tropical-themed planet with time travel storylines and Greek mythology elements. Smallest active population but has unique content not found elsewhere."),

  h3("Planet Toulan"),
  p("Arabian Nights themed planet. Small but dedicated community. Unique crafting blueprints and mob types."),

  callout("info", "You can travel between planets later via the space system. Your starting planet is not a permanent choice — but it determines where you begin your journey and which community you first interact with."),

  h2("The Tutorial"),
  h3("What the Tutorial Covers"),
  bullet("Basic movement and camera controls"),
  bullet("Interacting with NPCs and terminals"),
  bullet("Equipping items from your inventory"),
  bullet("Your first combat encounter"),
  bullet("Using a Trade Terminal to buy and sell"),
  bullet("Teleporter system basics"),

  h3("Should You Skip It?"),
  p("No. Even if you have played other MMOs, the Entropia Universe tutorial teaches mechanics that are unique to this game. The real-cash economy means mistakes cost real money — the tutorial helps you avoid the most common early errors."),

  callout("tip", "Complete the full tutorial. It rewards you with starter equipment including a basic weapon, a small amount of ammo, and a First Aid Pack. These items have real PED value and will get you started without depositing immediately."),

  h2("After Character Creation"),
  h3("Verify Your Account"),
  p("MindArk requires identity verification before you can withdraw funds. You do not need to verify immediately, but it is worth doing early so there are no delays when you eventually want to cash out."),

  h3("First Deposit"),
  p("You do not need to deposit money immediately. The tutorial gear and daily login rewards can sustain you for a short while. When you do deposit, start small — 10 to 20 USD is plenty to learn the basics without risking significant funds."),

  h3("Join a Society"),
  p("Societies are Entropia Universe's guilds. Joining one early gives you access to experienced players, shared knowledge, team hunts, and mentoring. Ask in local chat or check community forums for societies recruiting new players."),

  callout("info", "The Howling Mine community Discord is a good place to find active societies and ask questions before you even log in for the first time."),
];

async function seed() {
  console.log("Seeding Avatar Creation guide...");
  await client.patch(GUIDE_ID).set({ body }).commit();
  console.log("Done — /guides/avatar-creation");
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
