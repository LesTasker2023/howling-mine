/**
 * Full site seed — populates Sanity with a complete set of pages, news & guides.
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/seed-full-site.ts
 */

import { createClient } from "@sanity/client";

const projectId = "u2kuytve";
const dataset = "production";
const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN;

if (!token) {
  console.error(
    "⛔  Set SANITY_API_TOKEN env var.\n" +
      "   Create one at https://www.sanity.io/manage → API → Tokens (Editor role)",
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

/* ──────────────────────────────────────────────────
   Portable Text helpers
   ────────────────────────────────────────────────── */
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
const pBold = (t: string) => block([span(t, ["strong"])]);

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

const callout = (tone: "info" | "tip" | "warning" | "danger", text: string) => ({
  _type: "callout" as const,
  _key: key(),
  tone,
  body: text,
});

const codeBlock = (code: string, language = "typescript", filename?: string) => ({
  _type: "codeBlock" as const,
  _key: key(),
  language,
  code,
  ...(filename ? { filename } : {}),
});

const quote = (t: string) => block([span(t)], "blockquote");

/* ──────────────────────────────────────────────────
   Image upload helper
   ────────────────────────────────────────────────── */
async function uploadImage(
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
  console.log(`  📸 ${filename} → ${asset._id}`);
  return asset._id;
}

function imageRef(assetId: string) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

/* ──────────────────────────────────────────────────
   Lorem content
   ────────────────────────────────────────────────── */
const L = {
  short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  med: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  sentence: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  para2: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
  para3: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.",
  para4: "Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.",
};

/* ──────────────────────────────────────────────────
   Rich body builder (for news/guides)
   ────────────────────────────────────────────────── */
function richBody(topic: string) {
  return [
    p(L.long),
    h2(`Understanding ${topic}`),
    p(L.med),
    p(L.para2),
    callout("info", `This section covers the fundamentals of ${topic.toLowerCase()}.`),
    h3("Key Concepts"),
    bullet("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
    bullet("Ut enim ad minim veniam, quis nostrud exercitation"),
    bullet("Duis aute irure dolor in reprehenderit in voluptate"),
    bullet("Excepteur sint occaecat cupidatat non proident"),
    p(L.para3),
    h3("Technical Details"),
    p(L.med),
    codeBlock(
      `// Example ${topic} configuration\nconst config = {\n  mode: "advanced",\n  threshold: 0.75,\n  maxRetries: 3,\n  timeout: 5000,\n};\n\nexport default config;`,
      "typescript",
      `${topic.toLowerCase().replace(/\s/g, "-")}-config.ts`,
    ),
    p(L.para4),
    callout("tip", "Pro tip: Always test your configuration in a safe environment before applying changes."),
    h2("Advanced Strategies"),
    p(L.long),
    h3("Method One"),
    numbered("Prepare your equipment and verify all settings"),
    numbered("Navigate to the designated sector coordinates"),
    numbered("Deploy the appropriate tools for the task"),
    numbered("Monitor output metrics and adjust accordingly"),
    numbered("Extract results and calculate efficiency"),
    p(L.para2),
    h3("Method Two"),
    p(L.med),
    callout("warning", "Caution: This method involves higher risk. Ensure adequate resources before proceeding."),
    p(L.para3),
    quote("In the howling depths of space, preparation separates the profitable from the bankrupt."),
    h2("Summary"),
    p(L.med),
    p(L.para4),
    callout("danger", "Remember: PVP-lootable zones carry real risk. Never carry more than you can afford to lose."),
  ];
}

/* ──────────────────────────────────────────────────
   MAIN
   ────────────────────────────────────────────────── */
async function main() {
  console.log("🌱 Seeding full site content…\n");

  // ── Upload placeholder images ──
  console.log("📸 Uploading placeholder images…");
  const images = {
    hero1: await uploadImage("https://picsum.photos/seed/hm-hero1/1600/900", "hero-1.jpg"),
    hero2: await uploadImage("https://picsum.photos/seed/hm-hero2/1600/900", "hero-2.jpg"),
    cover1: await uploadImage("https://picsum.photos/seed/hm-cover1/800/450", "cover-1.jpg"),
    cover2: await uploadImage("https://picsum.photos/seed/hm-cover2/800/450", "cover-2.jpg"),
    cover3: await uploadImage("https://picsum.photos/seed/hm-cover3/800/450", "cover-3.jpg"),
    cover4: await uploadImage("https://picsum.photos/seed/hm-cover4/800/450", "cover-4.jpg"),
    cover5: await uploadImage("https://picsum.photos/seed/hm-cover5/800/450", "cover-5.jpg"),
    cover6: await uploadImage("https://picsum.photos/seed/hm-cover6/800/450", "cover-6.jpg"),
    feature1: await uploadImage("https://picsum.photos/seed/hm-feat1/600/400", "feature-1.jpg"),
    feature2: await uploadImage("https://picsum.photos/seed/hm-feat2/600/400", "feature-2.jpg"),
    feature3: await uploadImage("https://picsum.photos/seed/hm-feat3/600/400", "feature-3.jpg"),
    feature4: await uploadImage("https://picsum.photos/seed/hm-feat4/600/400", "feature-4.jpg"),
    gallery1: await uploadImage("https://picsum.photos/seed/hm-gal1/800/600", "gallery-1.jpg"),
    gallery2: await uploadImage("https://picsum.photos/seed/hm-gal2/800/600", "gallery-2.jpg"),
    gallery3: await uploadImage("https://picsum.photos/seed/hm-gal3/800/600", "gallery-3.jpg"),
    gallery4: await uploadImage("https://picsum.photos/seed/hm-gal4/800/600", "gallery-4.jpg"),
    gallery5: await uploadImage("https://picsum.photos/seed/hm-gal5/800/600", "gallery-5.jpg"),
    gallery6: await uploadImage("https://picsum.photos/seed/hm-gal6/800/600", "gallery-6.jpg"),
  };
  console.log("");

  // ── Author ──
  const author = {
    _id: "author-howling-mine",
    _type: "author",
    name: "The Howling Mine",
    slug: { _type: "slug", current: "the-howling-mine" },
    bio: "Official news and guides from The Howling Mine crew.",
  };

  // ── Categories ──
  const categories = [
    {
      _id: "cat-mining",
      _type: "category",
      title: "Mining",
      slug: { _type: "slug", current: "mining" },
      description: "Guides covering ore extraction, finder management, and claim optimization.",
    },
    {
      _id: "cat-hunting",
      _type: "category",
      title: "Hunting",
      slug: { _type: "slug", current: "hunting" },
      description: "Guides covering mob hunting, loot mechanics, and markup strategies.",
    },
    {
      _id: "cat-trading",
      _type: "category",
      title: "Trading",
      slug: { _type: "slug", current: "trading" },
      description: "Market analysis, auction tips, and trade route optimization.",
    },
    {
      _id: "cat-exploration",
      _type: "category",
      title: "Exploration",
      slug: { _type: "slug", current: "exploration" },
      description: "Navigation, space travel, and sector mapping guides.",
    },
    {
      _id: "cat-news",
      _type: "category",
      title: "News",
      slug: { _type: "slug", current: "news" },
      description: "Latest updates, patch notes, and community news.",
    },
    {
      _id: "cat-community",
      _type: "category",
      title: "Community",
      slug: { _type: "slug", current: "community" },
      description: "Society updates, events, and member spotlights.",
    },
  ];

  // ── Guides (6) ──
  const guides = [
    {
      _id: "guide-mining-101",
      _type: "guide",
      title: "Mining 101 — Your First Claim",
      slug: { _type: "slug", current: "mining-101" },
      excerpt: "Everything a new miner needs to know to drop their first probe and hit their first global in the Howling Mine sector.",
      coverImage: imageRef(images.cover1),
      category: { _type: "reference", _ref: "cat-mining" },
      difficulty: "beginner",
      order: 1,
      publishedAt: "2026-01-15T10:00:00Z",
      body: richBody("Mining Fundamentals"),
    },
    {
      _id: "guide-finder-guide",
      _type: "guide",
      title: "Finder Tier Guide — Which Finder to Use",
      slug: { _type: "slug", current: "finder-tier-guide" },
      excerpt: "A comprehensive breakdown of every finder in the game, their depth ranges, decay costs, and optimal use cases.",
      coverImage: imageRef(images.cover2),
      category: { _type: "reference", _ref: "cat-mining" },
      difficulty: "intermediate",
      order: 2,
      publishedAt: "2026-01-20T10:00:00Z",
      body: richBody("Finder Optimization"),
    },
    {
      _id: "guide-pvp-survival",
      _type: "guide",
      title: "PVP Zone Survival — Mining Safely in Lootable Space",
      slug: { _type: "slug", current: "pvp-zone-survival" },
      excerpt: "How to mine efficiently in PVP-lootable asteroid zones while minimizing losses to pirates and griefers.",
      coverImage: imageRef(images.cover3),
      category: { _type: "reference", _ref: "cat-mining" },
      difficulty: "advanced",
      order: 3,
      publishedAt: "2026-01-25T10:00:00Z",
      body: richBody("PVP Zone Mining"),
    },
    {
      _id: "guide-mob-hunting",
      _type: "guide",
      title: "Mob Hunting Basics — Loot and Damage Types",
      slug: { _type: "slug", current: "mob-hunting-basics" },
      excerpt: "Understanding mob HP, damage types, loot tables, and how to choose the right weapon and armor for each creature.",
      coverImage: imageRef(images.cover4),
      category: { _type: "reference", _ref: "cat-hunting" },
      difficulty: "beginner",
      order: 4,
      publishedAt: "2026-02-01T10:00:00Z",
      body: richBody("Mob Hunting Mechanics"),
    },
    {
      _id: "guide-market-trading",
      _type: "guide",
      title: "Market Trading — Reading Markup and Auction Strategy",
      slug: { _type: "slug", current: "market-trading" },
      excerpt: "How to identify profitable items, read markup trends, time your auctions, and build a steady income stream from trading.",
      coverImage: imageRef(images.cover5),
      category: { _type: "reference", _ref: "cat-trading" },
      difficulty: "intermediate",
      order: 5,
      publishedAt: "2026-02-05T10:00:00Z",
      body: richBody("Market Analysis"),
    },
    {
      _id: "guide-space-navigation",
      _type: "guide",
      title: "Space Navigation — Sector Maps and Waypoints",
      slug: { _type: "slug", current: "space-navigation" },
      excerpt: "Master the art of space travel: setting waypoints, reading sector coordinates, and navigating to asteroids efficiently.",
      coverImage: imageRef(images.cover6),
      category: { _type: "reference", _ref: "cat-exploration" },
      difficulty: "beginner",
      order: 6,
      publishedAt: "2026-02-08T10:00:00Z",
      body: richBody("Space Navigation"),
    },
  ];

  // ── News Posts (6) ──
  const now = Date.now();
  const day = 86400000;
  const posts = [
    {
      _id: "post-sector-update",
      _type: "post",
      title: "Sector Map Update — New Asteroid Fields Discovered",
      slug: { _type: "slug", current: "sector-map-update" },
      excerpt: "Three previously uncharted asteroid fields have been added to the Howling Mine sector map, including two M-type clusters.",
      coverImage: imageRef(images.cover1),
      author: { _type: "reference", _ref: "author-howling-mine" },
      categories: [{ _type: "reference", _ref: "cat-news", _key: key() }],
      publishedAt: new Date(now - day * 1).toISOString(),
      featured: true,
      body: richBody("Sector Map Expansion"),
    },
    {
      _id: "post-weekly-stats",
      _type: "post",
      title: "Weekly Mining Report — Record-Breaking Globals",
      slug: { _type: "slug", current: "weekly-mining-report" },
      excerpt: "This week saw unprecedented mining activity with over 150 globals recorded across the sector. Full breakdown inside.",
      coverImage: imageRef(images.cover2),
      author: { _type: "reference", _ref: "author-howling-mine" },
      categories: [{ _type: "reference", _ref: "cat-news", _key: key() }],
      publishedAt: new Date(now - day * 3).toISOString(),
      featured: false,
      body: richBody("Weekly Mining Statistics"),
    },
    {
      _id: "post-community-event",
      _type: "post",
      title: "Community Mining Event — Double Global Weekend",
      slug: { _type: "slug", current: "community-mining-event" },
      excerpt: "Join the Howling Mine society for a coordinated mining event this weekend. Prizes for top miners and most creative claims.",
      coverImage: imageRef(images.cover3),
      author: { _type: "reference", _ref: "author-howling-mine" },
      categories: [
        { _type: "reference", _ref: "cat-community", _key: key() },
        { _type: "reference", _ref: "cat-news", _key: key() },
      ],
      publishedAt: new Date(now - day * 5).toISOString(),
      featured: true,
      body: richBody("Community Events"),
    },
    {
      _id: "post-patch-notes",
      _type: "post",
      title: "Patch Notes — Finder Balance and New Resources",
      slug: { _type: "slug", current: "patch-notes-finder-balance" },
      excerpt: "A breakdown of the latest game patch affecting finder decay, new resource types, and adjusted loot tables.",
      coverImage: imageRef(images.cover4),
      author: { _type: "reference", _ref: "author-howling-mine" },
      categories: [{ _type: "reference", _ref: "cat-news", _key: key() }],
      publishedAt: new Date(now - day * 8).toISOString(),
      featured: false,
      body: richBody("Patch Analysis"),
    },
    {
      _id: "post-pvp-incident",
      _type: "post",
      title: "PVP Zone Incident Report — Pirate Ambush at M-Big Delta",
      slug: { _type: "slug", current: "pvp-incident-report" },
      excerpt: "A coordinated pirate attack on miners at M-Big Delta resulted in significant losses. Here's what happened and how to protect yourself.",
      coverImage: imageRef(images.cover5),
      author: { _type: "reference", _ref: "author-howling-mine" },
      categories: [
        { _type: "reference", _ref: "cat-news", _key: key() },
        { _type: "reference", _ref: "cat-community", _key: key() },
      ],
      publishedAt: new Date(now - day * 12).toISOString(),
      featured: false,
      body: richBody("PVP Incident Analysis"),
    },
    {
      _id: "post-new-members",
      _type: "post",
      title: "Welcome New Members — February 2026 Intake",
      slug: { _type: "slug", current: "welcome-new-members-feb-2026" },
      excerpt: "The Howling Mine society welcomes twelve new members this month. Meet the newest miners joining our ranks.",
      coverImage: imageRef(images.cover6),
      author: { _type: "reference", _ref: "author-howling-mine" },
      categories: [{ _type: "reference", _ref: "cat-community", _key: key() }],
      publishedAt: new Date(now - day * 15).toISOString(),
      featured: false,
      body: richBody("Community Growth"),
    },
  ];

  // ── Pages (5) — built with section page builder ──
  const pages = [
    // ─── About Page ───
    {
      _id: "page-about",
      _type: "page",
      title: "About The Howling Mine",
      slug: { _type: "slug", current: "about" },
      description: "Learn about The Howling Mine — a mining society in Entropia Universe dedicated to space mining.",
      sections: [
        {
          _type: "pageHeroSection",
          _key: key(),
          heading: "About The Howling Mine",
          subheading: "A society of miners, explorers, and pioneers carving profit from the asteroids of Entropia Universe.",
          breadcrumb: "About",
          align: "center",
        },
        {
          _type: "richTextSection",
          _key: key(),
          heading: "Our Story",
          body: [
            p(L.long),
            p(L.para2),
            p(L.para3),
            h3("Our Mission"),
            p(L.med),
            bullet("Provide miners with the best tools and data available"),
            bullet("Build a community of experienced and aspiring space miners"),
            bullet("Map and document every asteroid in the Howling Mine sector"),
            bullet("Share knowledge freely through guides and reports"),
            p(L.para4),
          ],
          maxWidth: "narrow",
        },
        {
          _type: "statsRowSection",
          _key: key(),
          heading: "By the Numbers",
          stats: [
            { _key: key(), label: "Active Miners", value: "47", trendDirection: "up", trendValue: "+8%" },
            { _key: key(), label: "Total PED Mined", value: "1.2M", trendDirection: "up", trendValue: "+15%" },
            { _key: key(), label: "Asteroids Mapped", value: "38" },
            { _key: key(), label: "Guides Published", value: "12" },
          ],
          accent: true,
        },
        {
          _type: "ctaSection",
          _key: key(),
          heading: "Ready to Join?",
          body: "The Howling Mine is always looking for dedicated miners. Whether you're a veteran or just starting out, there's a place for you.",
          primaryAction: { label: "Join Our Discord", href: "https://discord.gg/example" },
          secondaryAction: { label: "Read Our Guides", href: "/guides" },
          variant: "accent",
        },
      ],
    },
    // ─── Features Page ───
    {
      _id: "page-features",
      _type: "page",
      title: "Features",
      slug: { _type: "slug", current: "features" },
      description: "Explore the tools and features built by The Howling Mine for Entropia Universe miners.",
      sections: [
        {
          _type: "pageHeroSection",
          _key: key(),
          heading: "Features & Tools",
          subheading: "Everything we've built to help miners succeed in the Howling Mine sector.",
          breadcrumb: "Features",
          align: "center",
        },
        {
          _type: "featureGridSection",
          _key: key(),
          heading: "Core Tools",
          subheading: "Data-driven tools built for serious miners.",
          features: [
            {
              _key: key(),
              title: "Interactive Sector Map",
              description: "3D WebGL map of every asteroid, station, and POI with copyable in-game coordinates.",
              icon: "map",
              href: "/map",
            },
            {
              _key: key(),
              title: "Live Mining Stats",
              description: "Real-time global and HoF tracking with 24-hour rolling statistics per asteroid.",
              icon: "bar-chart-3",
            },
            {
              _key: key(),
              title: "Profit Calculator",
              description: "Calculate expected returns based on finder tier, depth, and current markup rates.",
              icon: "calculator",
            },
            {
              _key: key(),
              title: "Mining Guides",
              description: "Comprehensive guides from beginner basics to advanced PVP mining strategies.",
              icon: "book-open",
              href: "/guides",
            },
            {
              _key: key(),
              title: "Claim Tracker",
              description: "Log your mining runs, track claims, and analyze your long-term profitability.",
              icon: "clipboard-list",
            },
            {
              _key: key(),
              title: "Community Discord",
              description: "Join 200+ active miners sharing intel, coordinating runs, and helping new players.",
              icon: "message-circle",
            },
          ],
          columns: 3,
        },
        {
          _type: "ctaSection",
          _key: key(),
          heading: "Start Mining Smarter",
          body: "All our tools are free for Howling Mine society members. Join today and take your mining to the next level.",
          primaryAction: { label: "View the Map", href: "/map" },
          secondaryAction: { label: "Read Guides", href: "/guides" },
          variant: "default",
        },
      ],
    },
    // ─── Gallery Page ───
    {
      _id: "page-gallery",
      _type: "page",
      title: "Gallery",
      slug: { _type: "slug", current: "gallery" },
      description: "Screenshots and visuals from The Howling Mine sector.",
      sections: [
        {
          _type: "pageHeroSection",
          _key: key(),
          heading: "Gallery",
          subheading: "Scenes from the Howling Mine sector — asteroids, globals, and the void between.",
          breadcrumb: "Gallery",
          align: "center",
        },
        {
          _type: "imageGallerySection",
          _key: key(),
          heading: "Sector Highlights",
          images: [
            { _key: key(), image: imageRef(images.gallery1), alt: "Asteroid field at sunset", caption: "C-Type cluster viewed from approach vector" },
            { _key: key(), image: imageRef(images.gallery2), alt: "Mining claim explosion", caption: "Global hit on M-Big Delta" },
            { _key: key(), image: imageRef(images.gallery3), alt: "Space station exterior", caption: "Howling Mine station docking bay" },
            { _key: key(), image: imageRef(images.gallery4), alt: "Nebula background", caption: "Nebula visible from the outer ring" },
            { _key: key(), image: imageRef(images.gallery5), alt: "PVP zone warning", caption: "Entering the PVP-lootable zone" },
            { _key: key(), image: imageRef(images.gallery6), alt: "Mining operation", caption: "Coordinated mining run in progress" },
          ],
          layout: "grid",
          columns: 3,
        },
      ],
    },
    // ─── FAQ Page ───
    {
      _id: "page-faq",
      _type: "page",
      title: "FAQ",
      slug: { _type: "slug", current: "faq" },
      description: "Frequently asked questions about The Howling Mine society and space mining.",
      sections: [
        {
          _type: "pageHeroSection",
          _key: key(),
          heading: "Frequently Asked Questions",
          subheading: "Common questions about The Howling Mine, mining mechanics, and our community.",
          breadcrumb: "FAQ",
          align: "center",
        },
        {
          _type: "richTextSection",
          _key: key(),
          heading: "General Questions",
          body: [
            h3("What is The Howling Mine?"),
            p("The Howling Mine is a mining-focused society in Entropia Universe. We provide tools, guides, and community for space miners of all experience levels."),
            h3("How do I join?"),
            p("Join our Discord server and introduce yourself. An officer will review your application and get you set up within 24 hours."),
            h3("Is there a membership fee?"),
            p("No. The Howling Mine is free to join. We believe in open access to mining knowledge and community support."),
            h3("What platform is this for?"),
            p("Entropia Universe — specifically the space mining sector. Our tools and guides focus on asteroid mining, but we welcome all professions."),
          ],
          maxWidth: "narrow",
        },
        {
          _type: "richTextSection",
          _key: key(),
          heading: "Mining Questions",
          body: [
            h3("What finder should I start with?"),
            p(L.med),
            h3("How do I read the sector map?"),
            p(L.med),
            h3("Are PVP zones worth the risk?"),
            p(L.long),
            callout("warning", "PVP zones offer higher yields but you can lose everything you're carrying. Start with safe zones until you're experienced."),
            h3("How are mining stats calculated?"),
            p(L.med),
          ],
          maxWidth: "narrow",
        },
        {
          _type: "ctaSection",
          _key: key(),
          heading: "Still Have Questions?",
          body: "Our community is happy to help. Drop into Discord and ask away.",
          primaryAction: { label: "Join Discord", href: "https://discord.gg/example" },
          variant: "default",
        },
      ],
    },
    // ─── Contact Page ───
    {
      _id: "page-contact",
      _type: "page",
      title: "Contact",
      slug: { _type: "slug", current: "contact" },
      description: "Get in touch with The Howling Mine team.",
      sections: [
        {
          _type: "pageHeroSection",
          _key: key(),
          heading: "Contact Us",
          subheading: "Questions, feedback, or partnership enquiries — we'd love to hear from you.",
          breadcrumb: "Contact",
          align: "center",
        },
        {
          _type: "richTextSection",
          _key: key(),
          heading: "Get In Touch",
          body: [
            p("The fastest way to reach us is through our Discord server. Our officers are active daily and typically respond within a few hours."),
            h3("Discord"),
            p("Join the server and post in #general or #support for the quickest response."),
            h3("In-Game"),
            p("Send a message to any Howling Mine officer in Entropia Universe. Look for the [HM] tag."),
            h3("Email"),
            p("For business enquiries or partnership proposals, reach out via email. Response time is typically 48 hours."),
            callout("info", "For urgent matters, Discord is always the fastest channel. Our team monitors it around the clock."),
          ],
          maxWidth: "narrow",
        },
        {
          _type: "statsRowSection",
          _key: key(),
          heading: "Response Times",
          stats: [
            { _key: key(), label: "Discord", value: "< 2h" },
            { _key: key(), label: "In-Game", value: "< 12h" },
            { _key: key(), label: "Email", value: "< 48h" },
          ],
          accent: false,
        },
      ],
    },
  ];

  // ── Write everything ──
  console.log("📝 Writing documents…");
  const tx = client.transaction();

  tx.createOrReplace(author);
  console.log("  ✓ Author");

  for (const cat of categories) {
    tx.createOrReplace(cat);
  }
  console.log(`  ✓ ${categories.length} categories`);

  for (const guide of guides) {
    tx.createOrReplace(guide);
  }
  console.log(`  ✓ ${guides.length} guides`);

  for (const post of posts) {
    tx.createOrReplace(post);
  }
  console.log(`  ✓ ${posts.length} news posts`);

  for (const page of pages) {
    tx.createOrReplace(page);
  }
  console.log(`  ✓ ${pages.length} pages`);

  await tx.commit();

  console.log("\n✅ Done! Full site seeded successfully.");
  console.log("   Pages:  about, features, gallery, faq, contact");
  console.log("   News:   6 posts (2 featured)");
  console.log("   Guides: 6 guides (beginner → advanced)");
  console.log("   Categories: mining, hunting, trading, exploration, news, community");
}

main().catch((err) => {
  console.error("💥 Seed failed:", err);
  process.exit(1);
});
