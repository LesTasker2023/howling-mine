import { defineField, defineType } from "sanity";
import { Home } from "lucide-react";
import { IconPickerInput } from "@/sanity/components/IconPickerInput";

/**
 * Homepage singleton — every section of the landing page is CMS-editable.
 *
 * Tabs: Hero · Stats · Earnings · Steps · About · FAQ · Final CTA · SEO
 */
export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: Home,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats Bar" },
    { name: "earnings", title: "Earnings" },
    { name: "steps", title: "Steps" },
    { name: "about", title: "About" },
    { name: "faq", title: "FAQ" },
    { name: "finalCta", title: "Final CTA" },
    { name: "seo", title: "SEO & Meta" },
  ],
  fields: [
    /* ════════════════════════ HERO ════════════════════════ */
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow Text",
      type: "string",
      group: "hero",
      description:
        "Small label above the title (e.g. 'REAL CASH · REAL ECONOMY · SINCE 2003').",
      initialValue: "REAL CASH · REAL ECONOMY · SINCE 2003",
    }),
    defineField({
      name: "heroTitle",
      title: "Title",
      type: "string",
      group: "hero",
      description:
        "Main headline. Wrap a word in *asterisks* for accent color (e.g. 'GET *PAID* TO PLAY').",
      initialValue: "GET *PAID* TO PLAY",
    }),
    defineField({
      name: "heroTagline",
      title: "Tagline",
      type: "text",
      rows: 3,
      group: "hero",
      description:
        "Paragraph below the title. Use **double asterisks** for bold text.",
      initialValue:
        "Earn up to **$18/month** with free weapons, free ammo, and a real community behind you. The in-game currency converts to **real dollars** — withdraw to your bank account whenever you want.",
    }),
    defineField({
      name: "heroDepositLine",
      title: "Deposit Line",
      type: "string",
      group: "hero",
      description:
        "The small line below the tagline (e.g. '$0 Deposit — Start Right Now').",
      initialValue: "$0 Deposit — Start Right Now",
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA Button",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "URL", type: "string" }),
      ],
      initialValue: {
        label: "Create Free Account →",
        href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
      },
    }),
    defineField({
      name: "heroTrustBadges",
      title: "Trust Badges",
      type: "array",
      group: "hero",
      description:
        "Short trust markers below the CTA (e.g. 'Zero startup cost', 'Free weapons & ammo').",
      of: [{ type: "string" }],
      initialValue: [
        "Zero startup cost",
        "Free weapons & ammo",
        "Real USD withdrawals",
        "20+ year track record",
      ],
    }),
    defineField({
      name: "heroVideos",
      title: "Background Videos",
      type: "array",
      group: "hero",
      description:
        "Upload .webm or .mp4 videos that cross-fade in the hero background.",
      of: [
        {
          type: "file",
          title: "Video",
          options: { accept: "video/*" },
          fields: [
            defineField({
              name: "alt",
              title: "Description",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "heroCoords",
      title: "Coordinate Bar Text",
      type: "array",
      group: "hero",
      description:
        "Items shown in the coordinate bar at the bottom of the hero.",
      of: [{ type: "string" }],
      initialValue: ["X:79228", "Y:79228", "Z:25", "HOWLING MINE"],
    }),

    /* ════════════════════════ STATS BAR ════════════════════════ */
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "stats",
      description: "4 stat cards shown below the hero.",
      validation: (r) => r.max(6),
      of: [
        {
          type: "object",
          name: "statItem",
          title: "Stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      initialValue: [
        { _key: "s1", value: "$0", label: "Required Investment" },
        { _key: "s2", value: "20+", label: "Years Running" },
        { _key: "s3", value: "$18", label: "Monthly Earnings" },
        { _key: "s4", value: "Millions", label: "USD Withdrawn by Players" },
      ],
    }),

    /* ════════════════════════ EARNINGS ════════════════════════ */
    defineField({
      name: "earningsTitle",
      title: "Section Title",
      type: "string",
      group: "earnings",
      initialValue: "Earnings Breakdown",
    }),
    defineField({
      name: "earningsSubtitle",
      title: "Subtitle",
      type: "string",
      group: "earnings",
      initialValue:
        "The Job System pays you to play. Here's exactly what you earn.",
    }),
    defineField({
      name: "earningsItems",
      title: "Earnings Cards",
      type: "array",
      group: "earnings",
      validation: (r) => r.max(6),
      of: [
        {
          type: "object",
          name: "earningsItem",
          title: "Earnings Card",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "usd",
              title: "USD Equivalent",
              type: "string",
            }),
            defineField({
              name: "highlight",
              title: "Highlight?",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "earningsNote",
      title: "Footnote",
      type: "string",
      group: "earnings",
      initialValue:
        "* Combine Howling Mine and Rocktropia jobs for maximum earnings. Withdraw directly to your bank account.",
    }),
    defineField({
      name: "earningsCta",
      title: "Earnings CTA",
      type: "object",
      group: "earnings",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "URL", type: "string" }),
      ],
      initialValue: {
        label: "Start Earning →",
        href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
      },
    }),

    /* ════════════════════════ STEPS ════════════════════════ */
    defineField({
      name: "stepsTitle",
      title: "Section Title",
      type: "string",
      group: "steps",
      initialValue: "From Zero to Earning",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      group: "steps",
      validation: (r) => r.max(8),
      of: [
        {
          type: "object",
          name: "stepItem",
          title: "Step",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              components: { input: IconPickerInput },
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "stepsCta",
      title: "Steps CTA",
      type: "object",
      group: "steps",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "URL", type: "string" }),
      ],
      initialValue: {
        label: "Get Started →",
        href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
      },
    }),

    /* ════════════════════════ ABOUT ════════════════════════ */
    defineField({
      name: "aboutTitle",
      title: "Section Title",
      type: "string",
      group: "about",
      initialValue: "Who Is NEVERDIE?",
    }),
    defineField({
      name: "aboutName",
      title: "Person Name",
      type: "string",
      group: "about",
      initialValue: "Jon NEVERDIE Jacobs",
    }),
    defineField({
      name: "aboutMetaTags",
      title: "Meta Tags",
      type: "array",
      group: "about",
      description: "Small labels below the icon (e.g. 'Metaverse Pioneer').",
      of: [{ type: "string" }],
      initialValue: ["Metaverse Pioneer", "Guinness Record", "Est. 2005"],
    }),
    defineField({
      name: "aboutParagraphs",
      title: "Bio Paragraphs",
      type: "array",
      group: "about",
      description:
        "Each item becomes a paragraph. Use **double asterisks** for bold.",
      of: [{ type: "text" }],
    }),

    /* ════════════════════════ FAQ ════════════════════════ */
    defineField({
      name: "faqTitle",
      title: "Section Title",
      type: "string",
      group: "faq",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "faqs",
      title: "FAQ Items",
      type: "array",
      group: "faq",
      of: [
        {
          type: "object",
          name: "faqItem",
          title: "FAQ",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),

    /* ════════════════════════ FINAL CTA ════════════════════════ */
    defineField({
      name: "finalCtaTitle",
      title: "Title",
      type: "string",
      group: "finalCta",
      description: "Use a pipe | to insert a line break.",
      initialValue: "Stop Playing for Free.|Start Getting Paid.",
    }),
    defineField({
      name: "finalCtaBody",
      title: "Body Text",
      type: "text",
      rows: 3,
      group: "finalCta",
      initialValue:
        "No deposit. No credit card. Real money, your bank account. Join thousands of players already earning in Entropia Universe.",
    }),
    defineField({
      name: "finalCtaButton",
      title: "CTA Button",
      type: "object",
      group: "finalCta",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "URL", type: "string" }),
      ],
      initialValue: {
        label: "Create Free Account →",
        href: "https://account.entropiauniverse.com/create-account?ref=howlingmine",
      },
    }),

    /* ════════════════════════ SEO & META ════════════════════════ */
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "The <title> tag for this page. ~60 chars recommended.",
      initialValue:
        "Get Paid to Play — Join The Howling Mine | Entropia Universe Jobs 2025",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Meta description. ~155 chars recommended.",
      initialValue:
        "Earn up to $18/month playing Entropia Universe. Free weapons, free ammo, zero deposit required. Real cash withdrawals since 2003. Join The Howling Mine crew and start earning today.",
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO Keywords",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
      description: "Comma-style keywords for the meta tag.",
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph Title",
      type: "string",
      group: "seo",
      initialValue: "Get Paid to Play — Join The Howling Mine",
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph Description",
      type: "string",
      group: "seo",
      initialValue:
        "Earn $18/month with free weapons & ammo. Real cash economy since 2003. Zero deposit required.",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      group: "seo",
      description: "Social share image (1200×630 recommended).",
    }),
    defineField({
      name: "twitterTitle",
      title: "Twitter Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "twitterDescription",
      title: "Twitter Description",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "twitterCreator",
      title: "Twitter @handle",
      type: "string",
      group: "seo",
      initialValue: "@JonNEVERDIE",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "string",
      group: "seo",
      description:
        "Override the automatic canonical (leave blank for default).",
    }),
    defineField({
      name: "signupBaseUrl",
      title: "Signup Base URL",
      type: "string",
      group: "seo",
      description:
        "Base URL for the signup link. ?ref= param is appended automatically.",
      initialValue:
        "https://account.entropiauniverse.com/create-account?ref=howlingmine",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
