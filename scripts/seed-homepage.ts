/**
 * Seed script — creates the homepage singleton document in Sanity.
 *
 * Usage:
 *   npx tsx scripts/seed-homepage.ts
 *
 * Reads SANITY_TOKEN (or SANITY_API_TOKEN) from .env.local.
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "u2kuytve";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_TOKEN;

if (!token) {
  console.error("❌  Missing SANITY_TOKEN or SANITY_API_TOKEN in env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

async function seed() {
  console.log("🌱  Seeding homepage…");

  const doc = {
    _id: "homepage",
    _type: "homepage",

    /* ── Hero ── */
    heroEyebrow: "REAL CASH · REAL ECONOMY · SINCE 2003",
    heroTitle: "GET *PAID* TO PLAY",
    heroTagline:
      "Earn up to **$18/month** with free weapons, free ammo, and a real community behind you. The in-game currency converts to **real dollars** — withdraw to your bank account whenever you want.",
    heroDepositLine: "$0 Deposit — Start Right Now",
    heroCta: {
      label: "Create Free Account →",
      href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
    },
    heroTrustBadges: [
      "Zero startup cost",
      "Free weapons & ammo",
      "Real USD withdrawals",
      "20+ year track record",
    ],
    heroCoords: ["X:79228", "Y:79228", "Z:25", "HOWLING MINE"],

    /* ── Stats ── */
    stats: [
      { _key: "s1", value: "$0", label: "Required Investment" },
      { _key: "s2", value: "20+", label: "Years Running" },
      { _key: "s3", value: "$18", label: "Monthly Earnings" },
      { _key: "s4", value: "Millions", label: "USD Withdrawn by Players" },
    ],

    /* ── Earnings ── */
    earningsTitle: "Earnings Breakdown",
    earningsSubtitle:
      "The Job System pays you to play. Here's exactly what you earn.",
    earningsItems: [
      {
        _key: "e1",
        label: "Daily Mission Pay",
        value: "2 PED",
        usd: "≈ $0.20 USD",
        highlight: false,
      },
      {
        _key: "e2",
        label: "Monthly (30 days)",
        value: "60 PED",
        usd: "≈ $6.00 USD",
        highlight: false,
      },
      {
        _key: "e3",
        label: "With Rocktropia",
        value: "180 PED",
        usd: "≈ $18.00 USD/month",
        highlight: true,
      },
      {
        _key: "e4",
        label: "Your Investment",
        value: "$0",
        usd: "Free weapons & ammo provided",
        highlight: false,
      },
    ],
    earningsNote:
      "* Combine Howling Mine and Rocktropia jobs for maximum earnings. Withdraw directly to your bank account.",
    earningsCta: {
      label: "Start Earning →",
      href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
    },

    /* ── Steps ── */
    stepsTitle: "From Zero to Earning",
    steps: [
      {
        _key: "st1",
        icon: "shield",
        title: "Create Free Account",
        description:
          "Sign up for Entropia Universe — completely free. Complete the short Setesh tutorial to learn combat, looting, and navigation.",
      },
      {
        _key: "st2",
        icon: "rocket",
        title: "Catch the Free Shuttle",
        description:
          "Take the FREE daily shuttle from any major spaceport. You'll land at Howling Mine Space Terminal — that's home base. No cost, no strings.",
      },
      {
        _key: "st3",
        icon: "crosshair",
        title: "Grab Free Gear",
        description:
          'Find "The Employer" NPC inside the terminal. Accept a daily mission — free weapons and ammo included. Walk in, gear up, walk out armed.',
      },
      {
        _key: "st4",
        icon: "banknote",
        title: "Hunt & Cash Out",
        description:
          "Clear AI bots using your free gear. Earn 2 PED ($0.20 USD) daily. Withdraw to your bank account anytime. The daily job resets every 24 hours.",
      },
    ],
    stepsCta: {
      label: "Get Started →",
      href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
    },

    /* ── About ── */
    aboutTitle: "Who Is NEVERDIE?",
    aboutName: "Jon NEVERDIE Jacobs",
    aboutMetaTags: ["Metaverse Pioneer", "Guinness Record", "Est. 2005"],
    aboutParagraphs: [
      "**Jon NEVERDIE Jacobs** is a Metaverse pioneer and **Guinness World Record holder**. He founded **Club NEVERDIE** (2005), **Planet Rocktropia** (2010), and **The Howling Mine** (2025) — all inside Entropia Universe.",
      "After discovering rare minerals at Howling Mine that enabled interplanetary teleportation, NEVERDIE created the **Job System** — so new players could enter the economy and start earning from day one.",
    ],

    /* ── FAQ ── */
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        _key: "f1",
        question: "Is this really free?",
        answer:
          "100% free. No credit card, no hidden fees. Create your avatar, complete the tutorial, take the free shuttle. The Job Broker provides weapons and ammo at zero cost. Many players never deposit a single dollar.",
      },
      {
        _key: "f2",
        question: "Can I actually withdraw real money?",
        answer:
          "Yes. Entropia Universe has processed tens of millions USD in player withdrawals since 2003. PED converts to USD at a fixed 10:1 rate. Withdraw directly to your bank account — this is not a gimmick, it's a 20+ year system.",
      },
      {
        _key: "f3",
        question: "What good is a job that only pays $18/month?",
        answer:
          "You already spend hours watching Netflix or playing games — and you pay for the privilege. At Howling Mine, we flip that model. You get paid to play. The job system supports you while you level up skills and learn the economy. In many countries, $18/month makes a real difference — and as you grow, so do the opportunities.",
      },
      {
        _key: "f4",
        question: "What's the catch?",
        answer:
          "No catch. Entropia Universe is a functioning virtual economy, not a poker table. People spend money for entertainment, to collect rare items, or to enjoy an immersive experience. Some of that value flows to builders, miners, creators — like you. Howling Mine jobs are designed to bring in new players and help them learn the ropes.",
      },
      {
        _key: "f5",
        question: "How do I get to Howling Mine?",
        answer:
          "New players start on Setesh tutorial moon. After learning the basics, take the FREE daily shuttle from any major spaceport. You can also use 6 Teleporter Tokens for instant travel. Note: 150kg weight limit for teleportation.",
      },
      {
        _key: "f6",
        question: "How much time does it take?",
        answer:
          "Daily hunts take about 30 minutes. Play as much or as little as you want — the daily job resets every 24 hours. No grind required.",
      },
      {
        _key: "f7",
        question: "Do I need a good PC?",
        answer:
          "The game runs on most modern PCs. It's a downloadable client (~40GB). If your PC was made in the last 5-6 years, you should be fine. Check the Entropia Universe site for minimum specs.",
      },
    ],

    /* ── Final CTA ── */
    finalCtaTitle: "Stop Playing for Free.|Start Getting Paid.",
    finalCtaBody:
      "No deposit. No credit card. Real money, your bank account. Join thousands of players already earning in Entropia Universe.",
    finalCtaButton: {
      label: "Create Free Account →",
      href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
    },

    /* ── SEO ── */
    seoTitle:
      "Get Paid to Play — Join The Howling Mine | Entropia Universe Jobs 2025",
    seoDescription:
      "Earn up to $18/month playing Entropia Universe. Free weapons, free ammo, zero deposit required. Real cash withdrawals since 2003. Join The Howling Mine crew and start earning today.",
    seoKeywords: [
      "earn money playing games",
      "games that pay real money",
      "get paid to play games",
      "free games that pay real money",
      "make money gaming",
      "play to earn games",
      "mmo that pays real money",
      "entropia universe jobs",
      "howling mine",
      "entropia universe",
      "neverdie",
      "club neverdie",
      "entropia job broker",
      "real cash economy mmo",
      "free mmo no deposit",
      "withdraw real money mmo",
      "entropia free to play earn",
      "entropia mining",
    ],
    ogTitle: "Get Paid to Play — Join The Howling Mine",
    ogDescription:
      "Earn $18/month with free weapons & ammo. Real cash economy since 2003. Zero deposit required.",
    twitterTitle: "Get Paid to Play — The Howling Mine",
    twitterDescription:
      "Earn $18/month with free weapons & ammo. Real cash economy since 2003.",
    twitterCreator: "@JonNEVERDIE",
    signupBaseUrl:
      "https://account.entropiauniverse.com/create-account?ref=howlingmine",
  };

  await client.createOrReplace(doc);
  console.log("✅  Homepage seeded (id: homepage)");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
