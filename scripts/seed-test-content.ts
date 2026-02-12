/**
 * Seed script — pushes sample content into Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=<your-write-token> npx tsx scripts/seed-test-content.ts
 *
 * If you don't have a write token yet, create one in
 *   https://www.sanity.io/manage → project → API → Tokens → Add token (Editor)
 *
 * You can also just paste these into Studio manually — the script is a
 * convenience.
 */

import { createClient } from "@sanity/client";

const projectId = "u2kuytve";
const dataset = "production";
const token = process.env.SANITY_API_TOKEN;

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
/*  Helper: Portable Text block                       */
/* ────────────────────────────────────────────────── */
let blockKey = 0;
const key = () => `k${++blockKey}`;

type Mark = "strong" | "em" | "code";

function span(text: string, marks: Mark[] = []) {
  return { _type: "span", _key: key(), text, marks };
}

function block(children: ReturnType<typeof span>[], style: string = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children,
  };
}

function heading(text: string, level: "h2" | "h3" | "h4" = "h2") {
  return block([span(text)], level);
}

function bullet(text: string) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(text)],
  };
}

function numbered(text: string, n: number) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "number",
    level: 1,
    markDefs: [],
    children: [span(`${text}`)],
  };
}

function callout(tone: "info" | "tip" | "warning" | "danger", text: string) {
  return {
    _type: "callout",
    _key: key(),
    tone,
    body: [block([span(text)])],
  };
}

function codeBlock(code: string, language = "typescript", filename?: string) {
  return {
    _type: "codeBlock",
    _key: key(),
    language,
    code,
    ...(filename ? { filename } : {}),
  };
}

/* ────────────────────────────────────────────────── */
/*  Helper: imageWithAlt block from an asset ref      */
/* ────────────────────────────────────────────────── */
function imageBlock(assetRef: string, alt: string, caption?: string) {
  return {
    _type: "imageWithAlt",
    _key: key(),
    asset: { _type: "reference", _ref: assetRef },
    alt,
    ...(caption ? { caption } : {}),
  };
}

/** Upload an image from a URL and return the asset _id */
async function uploadImageFromUrl(
  url: string,
  filename: string,
): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: res.headers.get("content-type") ?? "image/jpeg",
  });
  console.log(`   📸 Uploaded ${filename} → ${asset._id}`);
  return asset._id;
}

/* ────────────────────────────────────────────────── */
/*  Category                                          */
/* ────────────────────────────────────────────────── */
const miningCategory = {
  _id: "cat-mining",
  _type: "category",
  title: "Mining",
  slug: { _type: "slug", current: "mining" },
  description:
    "Guides covering ore extraction, finder management, and claim optimization.",
};

const huntingCategory = {
  _id: "cat-hunting",
  _type: "category",
  title: "Hunting",
  slug: { _type: "slug", current: "hunting" },
  description: "Guides covering mob hunting, loot, and markup strategies.",
};

/* ────────────────────────────────────────────────── */
/*  Test Guide                                        */
/* ────────────────────────────────────────────────── */
const testGuide = {
  _id: "guide-mining-101",
  _type: "guide",
  title: "Mining 101 — Getting Started with the Howling Mine",
  slug: { _type: "slug", current: "mining-101" },
  excerpt:
    "Everything a new miner needs to know — from choosing your first finder to reading the loot window like a pro.",
  difficulty: "beginner",
  order: 1,
  publishedAt: new Date().toISOString(),
  category: { _type: "reference", _ref: "cat-mining" },
  body: [
    heading("Welcome, Miner"),
    block([
      span("The Howling Mine is "),
      span("Entropia Universe's", ["em"]),
      span(
        " most complete mining companion. This guide walks you through the basics so you can hit the ground running — or rather, hit the ground ",
      ),
      span("drilling", ["strong"]),
      span("."),
    ]),

    heading("What You'll Need"),
    bullet("A Finder (any TT finder works to start)"),
    bullet("Enough PED to cover a short run (~20 PED)"),
    bullet("Excavator (amps are optional but helpful)"),
    bullet("Patience — mining is a long game"),

    callout(
      "tip",
      "Start on Calypso or Arkadia — both have well-documented mining areas and stable markup on common ores.",
    ),

    heading("Reading the HUD"),
    block([
      span("When you open "),
      span("The Howling Mine", ["strong"]),
      span(" tracker, you'll see three main panels:"),
    ]),
    numbered("Run Overview — total cost, returns, and net PED", 1),
    numbered("Drop Log — every claim as it happens", 2),
    numbered(
      "Analytics — charts showing your hit rate, avg size, and markup-adjusted returns",
      3,
    ),

    heading("Your First Run", "h3"),
    block([
      span(
        "Head to a known mining spot, equip your finder, and drop your first probe. The tracker will automatically detect the claim and start logging.",
      ),
    ]),

    codeBlock(
      `// Example: Quick API check for current markup
const res = await fetch('/api/markup?item=Lysterium+Ingot');
const data = await res.json();
console.log(\`Lysterium markup: \${data.markup}%\`);`,
      "typescript",
      "markup-check.ts",
    ),

    heading("Understanding Claim Sizes", "h3"),
    block([
      span("Claims are categorized from "),
      span("I", ["code"]),
      span(" (smallest) to "),
      span("XIII", ["code"]),
      span(
        " (largest). Most beginner runs will yield size I–IV claims. Don't be discouraged — consistent small claims often outperform chasing globals.",
      ),
    ]),

    callout(
      "warning",
      "Never mine with PED you can't afford to lose. Mining has negative expected returns before markup. The tracker helps you find edges, but it isn't magic.",
    ),

    heading("Key Metrics to Watch"),
    block([
      span("The "),
      span("Run Analytics", ["strong"]),
      span(" panel tracks several important metrics:"),
    ]),
    bullet("Hit Rate — percentage of probes that return a claim"),
    bullet("Average TT Return — mean value per successful claim"),
    bullet("Cost Per Probe — decay + ammo cost per drop"),
    bullet(
      "Markup-Adjusted Return — what your drops are actually worth after market value",
    ),

    callout(
      "info",
      "Markup can turn a negative-TT run into a profitable one. Always check current auction prices for your most common finds.",
    ),

    heading("Next Steps"),
    block([
      span("Once you're comfortable with basic runs, check out the "),
      span("Intermediate Guides", ["strong"]),
      span(" to learn about:"),
    ]),
    bullet("Finder amp selection and depth strategies"),
    bullet("Resource density mapping"),
    bullet("Multi-run analytics and trend detection"),
    bullet("Markup tracking and sell-timing"),

    block([
      span("Happy mining — and remember: "),
      span("the house always wins, but the Howling Mine helps you lose less.", [
        "em",
      ]),
    ]),
  ],
};

/* ────────────────────────────────────────────────── */
/*  Test Page (generic CMS page)                      */
/* ────────────────────────────────────────────────── */
const testPage = {
  _id: "page-about",
  _type: "page",
  title: "About The Howling Mine",
  slug: { _type: "slug", current: "about" },
  description:
    "Learn about The Howling Mine — the community mining tracker built for Entropia Universe.",
  body: [
    heading("What Is The Howling Mine?"),
    block([
      span("The Howling Mine is a "),
      span("community-built mining companion", ["strong"]),
      span(
        " for Entropia Universe. It tracks your mining runs, provides real-time analytics, and helps you make data-driven decisions about where and when to mine.",
      ),
    ]),

    heading("Why We Built It"),
    block([
      span(
        "Mining in EU is expensive. Every probe has a cost, and without good data, it's almost impossible to tell whether your strategy is working or you're just getting lucky (or unlucky). We built The Howling Mine to solve that.",
      ),
    ]),

    heading("Features"),
    bullet("Real-time run tracking with auto-claim detection"),
    bullet("Markup-adjusted profit calculations"),
    bullet("Historical analytics across runs, resources, and locations"),
    bullet("Customizable HUD with dark/light themes"),
    bullet("Community data sharing (opt-in)"),

    callout(
      "tip",
      "The Howling Mine is 100% free and open-source. No premium tiers, no ads, no data selling — just tools built by miners, for miners.",
    ),

    heading("The Team"),
    block([
      span(
        "We're a small group of EU veterans who got tired of spreadsheets. The project is maintained by ",
      ),
      span("Delta", ["strong"]),
      span(" and the Howling Mine community contributors."),
    ]),

    heading("Get Involved"),
    block([
      span(
        "Want to contribute? The project is open-source. Whether you're a developer, a designer, or just a miner with good ideas — we'd love to hear from you.",
      ),
    ]),
    bullet("Report bugs or suggest features on GitHub"),
    bullet("Join the community Discord for discussion"),
    bullet("Submit pull requests — all skill levels welcome"),

    block([span("See you in the mines. ⛏️")]),
  ],
};

/* ────────────────────────────────────────────────── */
/*  Push everything                                   */
/* ────────────────────────────────────────────────── */
async function seed() {
  /* ── Upload placeholder images ── */
  console.log("📤 Uploading images...");
  const [heroImg, hudImg, claimImg, aboutImg, featuresImg] = await Promise.all([
    uploadImageFromUrl(
      "https://picsum.photos/seed/mining-hero/1200/675",
      "mining-hero.jpg",
    ),
    uploadImageFromUrl(
      "https://picsum.photos/seed/mining-hud/1200/675",
      "mining-hud.jpg",
    ),
    uploadImageFromUrl(
      "https://picsum.photos/seed/mining-claims/1200/675",
      "mining-claims.jpg",
    ),
    uploadImageFromUrl(
      "https://picsum.photos/seed/about-hero/1200/675",
      "about-hero.jpg",
    ),
    uploadImageFromUrl(
      "https://picsum.photos/seed/features/1200/675",
      "features-dashboard.jpg",
    ),
  ]);

  /* ── Inject images into guide body ── */
  // After "Welcome, Miner" heading (index 0–1) → insert hero image at index 2
  testGuide.body.splice(
    2,
    0,
    imageBlock(
      heroImg,
      "A miner standing at a claim marker on Calypso",
      "Getting ready for your first mining run",
    ),
  );
  // After "Reading the HUD" heading + paragraph → insert HUD screenshot
  const hudHeadingIdx = testGuide.body.findIndex(
    (b: any) => b.style === "h2" && b.children?.[0]?.text === "Reading the HUD",
  );
  if (hudHeadingIdx !== -1) {
    testGuide.body.splice(
      hudHeadingIdx + 2,
      0,
      imageBlock(
        hudImg,
        "The Howling Mine HUD showing run analytics",
        "The three-panel HUD layout",
      ),
    );
  }
  // After "Understanding Claim Sizes" heading + paragraph → insert claim image
  const claimHeadingIdx = testGuide.body.findIndex(
    (b: any) =>
      b.style === "h3" && b.children?.[0]?.text === "Understanding Claim Sizes",
  );
  if (claimHeadingIdx !== -1) {
    testGuide.body.splice(
      claimHeadingIdx + 2,
      0,
      imageBlock(
        claimImg,
        "Different claim size markers from I to XIII",
        "Claim sizes visualized",
      ),
    );
  }

  /* ── Inject images into about page body ── */
  // After first paragraph → insert hero image
  testPage.body.splice(
    2,
    0,
    imageBlock(
      aboutImg,
      "The Howling Mine dashboard overview",
      "Your mining command center",
    ),
  );
  // After "Features" heading + bullets → insert features screenshot
  const featuresHeadingIdx = testPage.body.findIndex(
    (b: any) => b.style === "h2" && b.children?.[0]?.text === "Features",
  );
  if (featuresHeadingIdx !== -1) {
    // Skip the heading + 5 bullets + callout = insert after index+7
    testPage.body.splice(
      featuresHeadingIdx + 7,
      0,
      imageBlock(
        featuresImg,
        "Feature overview of the analytics dashboard",
        "Real-time analytics in action",
      ),
    );
  }

  /* ── Push documents ── */
  const tx = client.transaction();

  tx.createOrReplace(miningCategory);
  tx.createOrReplace(huntingCategory);
  tx.createOrReplace(testGuide);
  tx.createOrReplace(testPage);

  const result = await tx.commit();
  console.log("✅ Seeded test content — transaction:", result.transactionId);
  console.log("   📄 Page:  /about");
  console.log("   📘 Guide: /guides/mining-101");
  console.log("   🏷️  Categories: Mining, Hunting");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
