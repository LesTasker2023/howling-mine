/**
 * Seed script — creates a showcase page demonstrating every page-builder section.
 *
 * Usage:
 *   SANITY_API_TOKEN=<your-write-token> npx tsx scripts/seed-showcase-page.ts
 *
 * Creates a page at /showcase with:
 *   1. Hero Banner (with background image)
 *   2. Stats Row (4 stats with trends)
 *   3. Feature Grid (6 cards with Lucide icons)
 *   4. Rich Text Section (prose block)
 *   5. Image Gallery (6 images, grid layout)
 *   6. CTA Banner (accent variant with two buttons)
 *   7. Stats Row (3 stats, accent variant)
 *   8. Feature Grid (3 cards with images)
 *   9. Rich Text Section (medium width)
 *   10. CTA Banner (danger variant)
 */

import { createClient } from "@sanity/client";

const projectId = "u2kuytve";
const dataset = "production";
const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_TOKEN;

if (!token) {
  console.error(
    "⛔  Set SANITY_API_TOKEN or SANITY_TOKEN env var to a write-capable token.\n" +
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

/* ── Helpers ── */
let keyIdx = 0;
const key = () => `showcase-${++keyIdx}`;

/** Upload an image from a URL and return the asset _id */
async function uploadImage(url: string, filename: string): Promise<string> {
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

function imageRef(assetId: string) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
  };
}

/* ── Portable Text helpers for richTextSection body ── */
function span(text: string, marks: string[] = []) {
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

function callout(tone: "info" | "tip" | "warning" | "danger", text: string) {
  return {
    _type: "callout",
    _key: key(),
    tone,
    body: [block([span(text)])],
  };
}

/* ────────────────────────────────────────────────── */
/*  Main                                              */
/* ────────────────────────────────────────────────── */
async function seed() {
  console.log("📤 Uploading showcase images...\n");

  // Upload images in parallel
  const [
    heroBg,
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    featureImg1,
    featureImg2,
    featureImg3,
  ] = await Promise.all([
    uploadImage(
      "https://picsum.photos/seed/sc-hero/1920/1080",
      "showcase-hero-bg.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-gal-1/800/600",
      "showcase-gallery-1.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-gal-2/800/600",
      "showcase-gallery-2.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-gal-3/800/600",
      "showcase-gallery-3.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-gal-4/800/600",
      "showcase-gallery-4.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-gal-5/800/600",
      "showcase-gallery-5.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-gal-6/800/600",
      "showcase-gallery-6.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-feat-1/600/340",
      "showcase-feature-1.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-feat-2/600/340",
      "showcase-feature-2.jpg",
    ),
    uploadImage(
      "https://picsum.photos/seed/sc-feat-3/600/340",
      "showcase-feature-3.jpg",
    ),
  ]);

  console.log("\n🔨 Building showcase page...\n");

  /* ──────────────────────────────────────────────── */
  /*  Section 1: Hero Banner                          */
  /* ──────────────────────────────────────────────── */
  const heroSection = {
    _type: "heroSection",
    _key: key(),
    heading: "Welcome to The Howling Mine",
    subheading:
      "Your tactical mining companion for Entropia Universe. Track runs, analyze markup, and mine smarter — not harder.",
    backgroundImage: imageRef(heroBg),
    cta: {
      label: "Start Mining",
      href: "/guides",
    },
    align: "center",
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 2: Stats Row — Platform metrics         */
  /* ──────────────────────────────────────────────── */
  const statsRow1 = {
    _type: "statsRowSection",
    _key: key(),
    heading: "Platform Overview",
    accent: false,
    stats: [
      {
        _key: key(),
        label: "Active Miners",
        value: "2,847",
        trendDirection: "up",
        trendValue: "12%",
        subtitle: "Last 30 days",
      },
      {
        _key: key(),
        label: "Mining Runs Tracked",
        value: "184,293",
        trendDirection: "up",
        trendValue: "8.4%",
        subtitle: "All time",
      },
      {
        _key: key(),
        label: "Total TT Returns",
        value: "2.4M PED",
        trendDirection: "neutral",
        trendValue: "0.3%",
        subtitle: "This month",
      },
      {
        _key: key(),
        label: "Avg. Markup Return",
        value: "114.7%",
        trendDirection: "up",
        trendValue: "2.1%",
        subtitle: "vs last month",
      },
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 3: Feature Grid — Icon cards            */
  /* ──────────────────────────────────────────────── */
  const featureGrid1 = {
    _type: "featureGridSection",
    _key: key(),
    heading: "Core Features",
    subheading:
      "Everything you need to turn raw mining data into actionable intelligence.",
    columns: 3,
    features: [
      {
        _key: key(),
        title: "Real-Time Tracking",
        description:
          "Auto-detect claims as they happen. Every probe, every drop, logged and categorized instantly.",
        icon: "radar",
      },
      {
        _key: key(),
        title: "Markup Analytics",
        description:
          "See your true profit — not just TT returns. Live auction data adjusts your P&L in real time.",
        icon: "trending-up",
      },
      {
        _key: key(),
        title: "Resource Database",
        description:
          "Complete ore and enmattar catalog with current market values, depth data, and finder recommendations.",
        icon: "database",
      },
      {
        _key: key(),
        title: "Run History",
        description:
          "Track performance across hundreds of runs. Spot patterns, optimize locations, and refine your strategy.",
        icon: "history",
      },
      {
        _key: key(),
        title: "Custom HUD",
        description:
          "Fully themed dashboard with gold/amber sci-fi aesthetic. Dark mode by default, 6 accent presets available.",
        icon: "palette",
      },
      {
        _key: key(),
        title: "Open Source",
        description:
          "100% free. No premium tiers, no ads, no data selling. Built by miners, for miners. PRs welcome.",
        icon: "code",
      },
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 4: Rich Text — How it works             */
  /* ──────────────────────────────────────────────── */
  const richText1 = {
    _type: "richTextSection",
    _key: key(),
    heading: "How It Works",
    maxWidth: "narrow",
    body: [
      block([
        span("The Howling Mine connects to your "),
        span("Entropia Universe", ["strong"]),
        span(
          " client and automatically detects mining activity. No manual input required — just equip your finder and start probing.",
        ),
      ]),

      heading("Step 1: Connect", "h3"),
      block([
        span(
          "Launch The Howling Mine alongside your EU client. The tracker auto-detects your character and begins monitoring chat logs for claim notifications.",
        ),
      ]),

      heading("Step 2: Mine", "h3"),
      block([
        span(
          "Go mining as you normally would. Every probe drop, claim hit, and miss is logged automatically. The HUD updates in real time with running totals.",
        ),
      ]),

      heading("Step 3: Analyze", "h3"),
      block([
        span(
          "After your run, dive into the analytics panel. See hit rates, average claim sizes, cost-per-probe, and — most importantly — your ",
        ),
        span("markup-adjusted return", ["strong"]),
        span(". This is the number that actually matters for profitability."),
      ]),

      callout(
        "tip",
        "Pro tip: Run at least 200 probes before drawing conclusions. Small sample sizes can be misleading — mining variance is brutal in the short term.",
      ),
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 5: Image Gallery                        */
  /* ──────────────────────────────────────────────── */
  const imageGallery = {
    _type: "imageGallerySection",
    _key: key(),
    heading: "From The Mines",
    layout: "grid",
    columns: 3,
    images: [
      {
        _key: key(),
        image: imageRef(gallery1),
        alt: "Mining run overview dashboard",
        caption: "Run overview with real-time metrics",
      },
      {
        _key: key(),
        image: imageRef(gallery2),
        alt: "Resource markup chart",
        caption: "Markup trends over 30 days",
      },
      {
        _key: key(),
        image: imageRef(gallery3),
        alt: "Claim size distribution",
        caption: "Claim size distribution analysis",
      },
      {
        _key: key(),
        image: imageRef(gallery4),
        alt: "Mining heatmap overlay",
        caption: "Community mining heatmap (opt-in)",
      },
      {
        _key: key(),
        image: imageRef(gallery5),
        alt: "HUD customization panel",
        caption: "Fully customizable HUD themes",
      },
      {
        _key: key(),
        image: imageRef(gallery6),
        alt: "Historical run comparison",
        caption: "Compare runs side-by-side",
      },
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 6: CTA Banner — Accent variant          */
  /* ──────────────────────────────────────────────── */
  const ctaAccent = {
    _type: "ctaSection",
    _key: key(),
    heading: "Ready to Mine Smarter?",
    body: "Join thousands of Entropia Universe miners who use The Howling Mine to track runs, optimize locations, and maximize markup returns.",
    variant: "accent",
    primaryAction: {
      label: "Get Started — It's Free",
      href: "/guides/mining-101",
    },
    secondaryAction: {
      label: "View on GitHub",
      href: "https://github.com",
    },
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 7: Stats Row — Accent variant           */
  /* ──────────────────────────────────────────────── */
  const statsRow2 = {
    _type: "statsRowSection",
    _key: key(),
    heading: "Community Impact",
    accent: true,
    stats: [
      {
        _key: key(),
        label: "Resources Catalogued",
        value: "347",
        trendDirection: "none",
        subtitle: "Ores, enmattars, and treasures",
      },
      {
        _key: key(),
        label: "GitHub Stars",
        value: "1,204",
        trendDirection: "up",
        trendValue: "89",
        subtitle: "This quarter",
      },
      {
        _key: key(),
        label: "Community Contributors",
        value: "42",
        trendDirection: "up",
        trendValue: "6",
        subtitle: "Active PRs this month",
      },
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 8: Feature Grid — Image cards           */
  /* ──────────────────────────────────────────────── */
  const featureGrid2 = {
    _type: "featureGridSection",
    _key: key(),
    heading: "Latest Updates",
    subheading: "What's new in The Howling Mine ecosystem.",
    columns: 3,
    features: [
      {
        _key: key(),
        title: "Crafting Integration",
        description:
          "Track component costs and markup for crafting alongside your mining data. See the full production pipeline.",
        image: imageRef(featureImg1),
        href: "/news",
      },
      {
        _key: key(),
        title: "Mobile Dashboard",
        description:
          "Check your latest run results from your phone. Responsive layout works on any device.",
        image: imageRef(featureImg2),
        href: "/guides",
      },
      {
        _key: key(),
        title: "Community Heatmaps",
        description:
          "Anonymized, opt-in heatmaps showing resource density across all planets. Find the sweet spots.",
        image: imageRef(featureImg3),
        href: "/news",
      },
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 9: Rich Text — Full width               */
  /* ──────────────────────────────────────────────── */
  const richText2 = {
    _type: "richTextSection",
    _key: key(),
    heading: "Frequently Asked Questions",
    maxWidth: "medium",
    body: [
      heading("Is The Howling Mine free?", "h3"),
      block([
        span(
          "Yes — 100% free and open-source. No premium tiers, no ads, no data harvesting. ",
        ),
        span("Ever.", ["strong"]),
      ]),

      heading("Does it work with all finders?", "h3"),
      block([
        span(
          "Yes. The tracker works with any finder at any depth. It reads claim notifications from the chat log, so it doesn't matter what equipment you use.",
        ),
      ]),

      heading("Is my data shared?", "h3"),
      block([
        span(
          "By default, your mining data stays entirely on your machine. Community features like heatmaps are strictly ",
        ),
        span("opt-in", ["strong"]),
        span(
          " — you choose exactly what (if anything) you want to contribute.",
        ),
      ]),

      heading("Can I contribute?", "h3"),
      block([span("Absolutely! The project is open-source. You can:")]),
      bullet("Report bugs on GitHub Issues"),
      bullet("Submit feature requests"),
      bullet("Open pull requests — all skill levels welcome"),
      bullet("Help with documentation and guides"),
      bullet(
        "Share your mining data (opt-in) to improve the community dataset",
      ),

      callout(
        "info",
        "All contributions are reviewed by the core team. We have a contributor guide in the repo to help you get started.",
      ),
    ],
  };

  /* ──────────────────────────────────────────────── */
  /*  Section 10: CTA Banner — Danger variant         */
  /* ──────────────────────────────────────────────── */
  const ctaDanger = {
    _type: "ctaSection",
    _key: key(),
    heading: "Mining Without Data is Gambling",
    body: "Every probe has a cost. Every run has variance. Without tracking, you're flying blind. The Howling Mine gives you the instruments you need to navigate the mines.",
    variant: "danger",
    primaryAction: {
      label: "Start Tracking Now",
      href: "/guides/mining-101",
    },
  };

  /* ──────────────────────────────────────────────── */
  /*  Assemble & push the page                        */
  /* ──────────────────────────────────────────────── */
  const showcasePage = {
    _id: "page-showcase",
    _type: "page",
    title: "The Howling Mine — Showcase",
    slug: { _type: "slug", current: "showcase" },
    description:
      "A showcase of every page builder section available in The Howling Mine CMS. Hero banners, stat rows, feature grids, CTAs, rich text, and image galleries.",
    sections: [
      heroSection,
      statsRow1,
      featureGrid1,
      richText1,
      imageGallery,
      ctaAccent,
      statsRow2,
      featureGrid2,
      richText2,
      ctaDanger,
    ],
  };

  console.log("📄 Creating showcase page...");

  const tx = client.transaction();
  tx.createOrReplace(showcasePage);
  const result = await tx.commit();

  console.log("\n✅ Showcase page seeded!");
  console.log(`   Transaction: ${result.transactionId}`);
  console.log("   📄 View at: /showcase");
  console.log("   ✏️  Edit in: /studio → Pages → The Howling Mine — Showcase");
  console.log("\n   Sections created:");
  console.log("    1. 🏔  Hero Banner (centered, with background image + CTA)");
  console.log("    2. 📊 Stats Row (4 stats with trends)");
  console.log("    3. 🔲 Feature Grid (6 icon cards, 3 columns)");
  console.log("    4. 📝 Rich Text (how-it-works, narrow width)");
  console.log("    5. 🖼  Image Gallery (6 images, 3-column grid)");
  console.log("    6. 📢 CTA Banner (accent variant, 2 buttons)");
  console.log("    7. 📊 Stats Row (3 stats, accent variant)");
  console.log("    8. 🔲 Feature Grid (3 image cards, linked)");
  console.log("    9. 📝 Rich Text (FAQ, medium width)");
  console.log("   10. 📢 CTA Banner (danger variant)");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
