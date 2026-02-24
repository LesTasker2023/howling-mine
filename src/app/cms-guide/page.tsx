"use client";

import { useEffect } from "react";
import { useTopBar } from "@/context/TopBarContext";
import styles from "./page.module.css";

/* ─── Subtab keys ─── */
const SUB_TABS = [
  { key: "homepage", label: "Homepage" },
  { key: "settings", label: "Settings" },
  { key: "page-builder", label: "Page Builder" },
  { key: "content", label: "Content" },
  { key: "editor", label: "Editor" },
];

/* ─── Reusable mini-components ─── */

function FieldTable({
  fields,
}: {
  fields: { name: string; type: string; required?: boolean; desc: string }[];
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.name}>
              <td>
                <span className={styles.fieldName}>{f.name}</span>
                {f.required && (
                  <>
                    {" "}
                    <span className={styles.required}>required</span>
                  </>
                )}
              </td>
              <td>{f.type}</td>
              <td>{f.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.tip}>
      <div className={styles.tipLabel}>[ TIP ]</div>
      <p className={styles.tipText}>{children}</p>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.note}>
      <div className={styles.noteLabel}>[ NOTE ]</div>
      <p className={styles.noteText}>{children}</p>
    </div>
  );
}

function Options({ items }: { items: string[] }) {
  return (
    <div className={styles.optionList}>
      {items.map((item) => (
        <span key={item} className={styles.optionPill}>
          {item}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — HOMEPAGE  (Your domain — all 8 sections of the landing page)
   ═══════════════════════════════════════════════════════════════════════════ */

function HomepageTab() {
  return (
    <>
      {/* Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>01 — Homepage Overview</h2>
        <p className={styles.sectionIntro}>
          The homepage is a <strong>single document</strong> pinned to the top
          of the Studio sidebar. Click <strong>Homepage</strong> to open it.
          You&apos;ll see <strong>8 tabs</strong> across the top — one for every
          section of the landing page.
        </p>

        <Options
          items={[
            "🎬 Hero",
            "📊 Stats Bar",
            "💰 Earnings",
            "🪜 Steps",
            "👤 About",
            "❓ FAQ",
            "📢 Final CTA",
            "🔍 SEO & Meta",
          ]}
        />

        <Note>
          Every section has a <strong>Show/Hide toggle</strong> at the top. Flip
          it off to hide that section without deleting any content — flip it
          back on whenever you&apos;re ready.
        </Note>

        <Tip>
          All fields have sensible defaults. The page works even if a field is
          left empty — it falls back to hardcoded values. But you should
          populate everything for the best result.
        </Tip>
      </section>

      {/* Hero */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>02 — Hero</h2>
        <p className={styles.sectionIntro}>
          The big first-impression section with video background, headline, CTA
          buttons, and trust badges.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show Hero Section",
              type: "Toggle",
              desc: "Turn the entire hero on/off.",
            },
            {
              name: "Eyebrow Text",
              type: "Text",
              desc: "Small uppercase text above the title (e.g. 'REAL CASH · REAL ECONOMY · SINCE 2003').",
            },
            {
              name: "Title",
              type: "Text",
              required: true,
              desc: "Main headline. Wrap a word in *asterisks* for accent colour → GET *PAID* TO PLAY.",
            },
            {
              name: "Tagline",
              type: "Text (multiline)",
              desc: "Paragraph below the title. Use **double asterisks** for bold text.",
            },
            {
              name: "Deposit Line",
              type: "Text",
              desc: "Small line below tagline (e.g. '$0 Deposit — Start Right Now').",
            },
            {
              name: "Hero CTA Button",
              type: "Label + URL",
              desc: "Primary call-to-action button. Set the button text and where it links.",
            },
            {
              name: "Hero Secondary CTA",
              type: "Label + URL",
              desc: "Optional second button (e.g. 'Join Discord'). Leave both fields empty to hide it.",
            },
            {
              name: "Trust Badges",
              type: "List (max 6)",
              desc: "Short trust markers below the buttons — e.g. 'Zero startup cost', 'Free weapons & ammo'.",
            },
            {
              name: "Background Videos",
              type: "File list (max 5)",
              desc: "Upload .webm or .mp4 videos that auto-crossfade in the background.",
            },
            {
              name: "Coordinate Bar Text",
              type: "List (max 6)",
              desc: "Items in the HUD coordinate bar at the bottom of the hero.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Formatting Tips</h3>
          <FieldTable
            fields={[
              {
                name: "Accent text",
                type: "Title field",
                desc: "Wrap in single *asterisks* → GET *PAID* TO PLAY → 'PAID' turns gold.",
              },
              {
                name: "Bold text",
                type: "Tagline field",
                desc: "Wrap in **double asterisks** → Earn up to **$18/month** → '$18/month' goes bold.",
              },
            ]}
          />
        </div>

        <Tip>
          Background videos: shorter clips (10–30 sec) loop better. Upload 2–3
          for crossfade variety. Use .webm for smaller file sizes.
        </Tip>
      </section>

      {/* Stats Bar */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>03 — Stats Bar</h2>
        <p className={styles.sectionIntro}>
          A row of big numbers shown right below the hero — key metrics that
          build trust.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show Stats Bar",
              type: "Toggle",
              desc: "Turn the stats bar on/off.",
            },
            {
              name: "Stats",
              type: "List (max 6)",
              desc: "Each stat has a Value (e.g. '$0') and a Label (e.g. 'Required Investment').",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Each stat item</h3>
          <FieldTable
            fields={[
              {
                name: "Value",
                type: "Text",
                required: true,
                desc: "The big number — e.g. '$0', '20+', '$18', 'Millions'.",
              },
              {
                name: "Label",
                type: "Text",
                required: true,
                desc: "What the number represents — e.g. 'Required Investment', 'Years Running'.",
              },
            ]}
          />
        </div>

        <Tip>
          4 is the sweet spot. You can go up to 6 but the bar gets crowded
          beyond that.
        </Tip>
      </section>

      {/* Earnings */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>04 — Earnings</h2>
        <p className={styles.sectionIntro}>
          The earnings breakdown section with a card grid showing exactly what
          players earn.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show Earnings Section",
              type: "Toggle",
              desc: "Turn the earnings section on/off.",
            },
            {
              name: "Section Title",
              type: "Text",
              desc: "Heading text (default: 'Earnings Breakdown').",
            },
            {
              name: "Subtitle",
              type: "Text",
              desc: "One-liner below the title.",
            },
            {
              name: "Earnings Cards",
              type: "List (max 6)",
              desc: "Each card has a Label, Value, USD Equivalent, and Highlight toggle.",
            },
            {
              name: "Footnote",
              type: "Text",
              desc: "Small text below the cards (e.g. '* Combine Howling Mine and Rocktropia...').",
            },
            {
              name: "Earnings CTA",
              type: "Label + URL",
              desc: "Button at the bottom — set the text and link.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Each earnings card</h3>
          <FieldTable
            fields={[
              {
                name: "Label",
                type: "Text",
                required: true,
                desc: "What the card represents — e.g. 'Daily Mission Pay'.",
              },
              {
                name: "Value",
                type: "Text",
                required: true,
                desc: "The PED amount — e.g. '2 PED', '180 PED'.",
              },
              {
                name: "USD Equivalent",
                type: "Text",
                desc: "Optional dollar conversion — e.g. '≈ $0.20 USD'. Leave blank to hide.",
              },
              {
                name: "Highlight?",
                type: "Toggle",
                desc: "Turn on for the card you want to stand out (e.g. the max earning).",
              },
            ]}
          />
        </div>

        <Tip>
          Toggle <strong>Highlight</strong> on one card — the &ldquo;With
          Rocktropia&rdquo; total is ideal. It gets a gold accent border.
        </Tip>
      </section>

      {/* Steps */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>05 — Steps</h2>
        <p className={styles.sectionIntro}>
          The &ldquo;From Zero to Earning&rdquo; step-by-step timeline that
          walks new players through the process.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show Steps Section",
              type: "Toggle",
              desc: "Turn the steps section on/off.",
            },
            {
              name: "Section Title",
              type: "Text",
              desc: "Heading (default: 'From Zero to Earning').",
            },
            {
              name: "Subtitle",
              type: "Text",
              desc: "Optional one-liner below the title (e.g. 'Three simple steps to start earning real money.').",
            },
            {
              name: "Steps",
              type: "List (max 8)",
              desc: "Each step has an Icon, Title, and Description.",
            },
            {
              name: "Steps CTA",
              type: "Label + URL",
              desc: "Button at the bottom.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Each step</h3>
          <FieldTable
            fields={[
              {
                name: "Icon",
                type: "Icon Picker",
                desc: "Choose from a searchable dropdown — e.g. 'shield', 'rocket', 'crosshair', 'banknote'.",
              },
              {
                name: "Title",
                type: "Text",
                required: true,
                desc: "Step name — e.g. 'Create Free Account', 'Catch the Free Shuttle'.",
              },
              {
                name: "Description",
                type: "Text (multiline)",
                required: true,
                desc: "2–3 sentences explaining this step. Keep it skimmable.",
              },
            ]}
          />
        </div>

        <Tip>
          Drag to reorder steps. Pick icons that match the action — shield for
          account creation, rocket for travel, crosshair for gear, banknote for
          earning.
        </Tip>
      </section>

      {/* About */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>06 — About</h2>
        <p className={styles.sectionIntro}>
          The &ldquo;Who Is NEVERDIE?&rdquo; credibility section with photo,
          meta tags, and bio.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show About Section",
              type: "Toggle",
              desc: "Turn the about section on/off.",
            },
            {
              name: "Section Title",
              type: "Text",
              desc: "Heading (default: 'Who Is NEVERDIE?').",
            },
            {
              name: "Person Name",
              type: "Text",
              desc: "Display name (default: 'Jon NEVERDIE Jacobs').",
            },
            {
              name: "Meta Tags",
              type: "List",
              desc: "Small labels below the image — e.g. 'Metaverse Pioneer', 'Guinness Record', 'Est. 2005'.",
            },
            {
              name: "About Image",
              type: "Image",
              desc: "Upload a photo — it renders as a circular headshot. Always add alt text.",
            },
            {
              name: "Bio Paragraphs",
              type: "List of text",
              desc: "Each item = one paragraph. Use **double asterisks** for bold.",
            },
          ]}
        />

        <Tip>
          If no image is uploaded, a default award icon shows instead. Keep the
          bio to 2–3 paragraphs.
        </Tip>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>07 — FAQ</h2>
        <p className={styles.sectionIntro}>
          Accordion-style frequently asked questions. Click a question to expand
          the answer.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show FAQ Section",
              type: "Toggle",
              desc: "Turn the FAQ section on/off.",
            },
            {
              name: "Section Title",
              type: "Text",
              desc: "Heading (default: 'Frequently Asked Questions').",
            },
            {
              name: "FAQ Items",
              type: "List",
              desc: "Each item has a Question and Answer. Both are required.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Each FAQ item</h3>
          <FieldTable
            fields={[
              {
                name: "Question",
                type: "Text",
                required: true,
                desc: "The question visitors will see (e.g. 'Is this really free?').",
              },
              {
                name: "Answer",
                type: "Text (multiline)",
                required: true,
                desc: "The answer that expands when clicked. Plain text only.",
              },
            ]}
          />
        </div>

        <Tip>
          Put the most important questions first — &ldquo;Is this really
          free?&rdquo; should stay #1. Drag to reorder.
        </Tip>
      </section>

      {/* Final CTA */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>08 — Final CTA</h2>
        <p className={styles.sectionIntro}>
          The closing conversion block at the very bottom of the page — one last
          push to sign up.
        </p>

        <FieldTable
          fields={[
            {
              name: "Show Final CTA Section",
              type: "Toggle",
              desc: "Turn the final CTA on/off.",
            },
            {
              name: "Title",
              type: "Text",
              desc: "Use a pipe | to insert a line break. The last line gets accent colour automatically.",
            },
            {
              name: "Body Text",
              type: "Text (multiline)",
              desc: "One paragraph below the title.",
            },
            {
              name: "CTA Button",
              type: "Label + URL",
              desc: "Primary button — e.g. 'Create Free Account →'.",
            },
            {
              name: "Secondary CTA Button",
              type: "Label + URL",
              desc: "Optional second button (e.g. 'Join Discord'). Leave empty to hide.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Title line break example</h3>
          <p className={styles.subDesc}>
            <span className={styles.code}>
              Stop Playing for Free.|Start Getting Paid.
            </span>
            <br />→ Line 1: &ldquo;Stop Playing for Free.&rdquo;
            <br />→ Line 2 (gold accent): &ldquo;Start Getting Paid.&rdquo;
          </p>
        </div>
      </section>

      {/* SEO & Meta */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>09 — Homepage SEO & Meta</h2>
        <p className={styles.sectionIntro}>
          Controls how the homepage appears in Google results and when someone
          shares the link on Discord, Twitter, or Facebook.
        </p>

        <FieldTable
          fields={[
            {
              name: "SEO Title",
              type: "Text",
              desc: "The browser tab text and Google result title. Keep under ~60 characters.",
            },
            {
              name: "SEO Description",
              type: "Text (multiline)",
              desc: "The snippet in Google results. Keep under ~155 characters.",
            },
            {
              name: "SEO Keywords",
              type: "List",
              desc: "Add keywords as individual items (not comma-separated in one field).",
            },
            {
              name: "OG Title",
              type: "Text",
              desc: "What shows when someone shares the link on Discord / Facebook.",
            },
            {
              name: "OG Description",
              type: "Text (multiline)",
              desc: "Snippet under the title in social shares.",
            },
            {
              name: "OG Image",
              type: "Image",
              desc: "Upload a 1200×630 image — this is what shows in link previews.",
            },
            {
              name: "Twitter Title",
              type: "Text",
              desc: "Override for Twitter/X. Leave blank to use OG Title.",
            },
            {
              name: "Twitter Description",
              type: "Text (multiline)",
              desc: "Override for Twitter/X. Leave blank to use OG Description.",
            },
            {
              name: "Twitter @handle",
              type: "Text",
              desc: "Your Twitter handle (default: @NEVERDIE).",
            },
            {
              name: "Canonical URL",
              type: "Text",
              desc: "Leave blank unless you know what this does.",
            },
            {
              name: "Signup Base URL",
              type: "Text",
              desc: "The account creation URL. Don't change unless the signup flow changes.",
            },
          ]}
        />

        <Note>
          Most people only need to fill in SEO Title, SEO Description, and OG
          Image. The rest are optional overrides.
        </Note>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — SETTINGS  (Getting Started + Site Settings)
   ═══════════════════════════════════════════════════════════════════════════ */

function SettingsTab() {
  return (
    <>
      {/* Getting Started */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>01 — Getting Started</h2>
        <p className={styles.sectionIntro}>
          The CMS is powered by <strong>Sanity Studio</strong>, a visual editing
          interface that runs at <span className={styles.code}>/studio</span> on
          the live site. Once you have access, you&apos;ll see a sidebar listing
          all content types.
        </p>

        <ol className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepTitle}>Navigate to the Studio</span>
            Go to your site URL followed by{" "}
            <span className={styles.code}>/studio</span>. Log in with your
            Sanity credentials.
          </li>
          <li className={styles.step}>
            <span className={styles.stepTitle}>Find your content type</span>
            The sidebar has two pinned items at the top:{" "}
            <strong>Homepage</strong> and <strong>Site Settings</strong>. Below
            the divider are News Posts, Guides, Events, Pages, Authors, and
            Categories.
          </li>
          <li className={styles.step}>
            <span className={styles.stepTitle}>Create or edit</span>
            Click any document to edit it, or click the{" "}
            <span className={styles.code}>+</span> button to create new content.
            Changes auto-save and can be published when ready.
          </li>
          <li className={styles.step}>
            <span className={styles.stepTitle}>Publish</span>
            Click the green <strong>Publish</strong> button to make changes
            live. You can also preview before publishing using the presentation
            tool (eye icon in the top-right).
          </li>
        </ol>

        <Tip>
          Everything in the CMS updates immediately on the live site after
          publishing — no builds or deployments needed.
        </Tip>
      </section>

      {/* Site Settings */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>02 — Site Settings</h2>
        <p className={styles.sectionIntro}>
          A single global document that controls the site name, navigation,
          footer, social links, and SEO defaults. This is pinned to the top of
          the Studio sidebar — right below Homepage.
        </p>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>General</h3>
          <FieldTable
            fields={[
              {
                name: "Site Name",
                type: "Text",
                required: true,
                desc: "Shown in the sidebar logo and browser tab title.",
              },
              {
                name: "Short Name",
                type: "Text (max 4)",
                desc: "Abbreviated name for the collapsed sidebar (e.g. 'HM').",
              },
              {
                name: "Tagline",
                type: "Text",
                desc: "Short tagline used in the footer and meta descriptions.",
              },
              {
                name: "Logo",
                type: "Image",
                desc: "Site logo shown in the sidebar header. Supports hotspot/crop.",
              },
              {
                name: "Favicon",
                type: "Image",
                desc: "Browser tab icon. Upload a 16×16 or 32×32 PNG.",
              },
              {
                name: "Placeholder Image",
                type: "Image + Alt",
                desc: "Fallback image for cards and thumbnails when content doesn't have its own. Always add alt text.",
              },
              {
                name: "Discord Invite URL",
                type: "URL",
                desc: "Your primary Discord invite link — used site-wide. e.g. https://discord.gg/NnkPwamsDQ.",
              },
              {
                name: "Hero Overlay Darkness",
                type: "Slider (0–100)",
                desc: "Controls how dark the video overlay is on the homepage hero. Higher = darker = more readable text. Default is 65.",
              },
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Navigation</h3>
          <p className={styles.subDesc}>
            The sidebar navigation links are fully CMS-driven. Add, remove, or
            reorder them here.
          </p>
          <FieldTable
            fields={[
              {
                name: "Label",
                type: "Text",
                required: true,
                desc: "Link text shown in the sidebar.",
              },
              {
                name: "URL",
                type: "Text",
                required: true,
                desc: "Internal path (e.g. /news) or external URL.",
              },
              {
                name: "Icon",
                type: "Dropdown",
                desc: "Choose from a searchable list of Lucide icons with previews.",
              },
            ]}
          />
          <Tip>
            The icon picker shows previews next to each option — just search by
            name or category and select. Drag links to reorder — the order here
            is the order on the site.
          </Tip>
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Footer</h3>
          <FieldTable
            fields={[
              {
                name: "Footer Text",
                type: "Text",
                desc: "Copyright or tagline. Use {year} for the current year.",
              },
              {
                name: "Footer Links",
                type: "List",
                desc: "Each link has a label and URL. E.g. About, Privacy, Studio.",
              },
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Social Links</h3>
          <p className={styles.subDesc}>
            Add your community platforms. These appear as icons in the footer.
          </p>
          <Options
            items={[
              "Discord",
              "YouTube",
              "Twitter",
              "Twitch",
              "GitHub",
              "Instagram",
              "Facebook",
              "Reddit",
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>SEO Defaults</h3>
          <p className={styles.subDesc}>
            Fallback values used when individual pages don&apos;t define their
            own SEO fields.
          </p>
          <FieldTable
            fields={[
              {
                name: "Default SEO Title",
                type: "Text",
                desc: "Fallback <title> when pages don't define their own.",
              },
              {
                name: "Default SEO Description",
                type: "Text (multiline)",
                desc: "Fallback meta description when pages don't define their own.",
              },
              {
                name: "Default OG Image",
                type: "Image",
                desc: "Default social share image (used when pages don't have a cover image).",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — PAGE BUILDER  (Pages, Hero, Page Hero, Stats, Feature Grid,
                           CTA, Rich Text Block, Image Gallery)
   ═══════════════════════════════════════════════════════════════════════════ */

function PageBuilderTab() {
  return (
    <>
      {/* 3. Pages & Page Builder */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>03 — Pages & Page Builder</h2>
        <p className={styles.sectionIntro}>
          Pages are built using a modular <strong>section system</strong>. Each
          page is a stack of configurable sections that you drag, reorder, and
          customise. The URL is generated from the slug (e.g. title
          &ldquo;Showcase&rdquo; → slug &ldquo;showcase&rdquo; → appears at{" "}
          <span className={styles.code}>/showcase</span>).
        </p>

        <FieldTable
          fields={[
            {
              name: "Title",
              type: "Text",
              required: true,
              desc: "Page title, also used for SEO.",
            },
            {
              name: "Slug",
              type: "Auto-generated",
              required: true,
              desc: "URL path — auto-generated from the title. Can be manually edited.",
            },
            {
              name: "Description",
              type: "Text",
              desc: "SEO meta description for this specific page.",
            },
            {
              name: "Sections",
              type: "Section List",
              desc: "Drag-and-drop page builder. Add any combination of the 7 section types below.",
            },
          ]}
        />

        <Note>
          The Showcase page you saw in the demo is a regular Page document with
          sections added through this builder. Any page can use any combination
          of sections.
        </Note>

        <p className={styles.subDesc}>
          The following 7 section types are available in the page builder:
        </p>
        <Options
          items={[
            "🏔 Hero Banner",
            "📄 Page Hero (Compact)",
            "📊 Stats Row",
            "🔲 Feature Grid",
            "📢 CTA Banner",
            "📝 Rich Text Block",
            "🖼 Image Gallery",
          ]}
        />
      </section>

      {/* 4. Hero Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>04 — Hero Section</h2>
        <p className={styles.sectionIntro}>
          A full-width banner with heading, optional subheading, background
          image, and call-to-action button. Ideal for page openers and landing
          sections.
        </p>

        <FieldTable
          fields={[
            {
              name: "Heading",
              type: "Text",
              required: true,
              desc: "Main hero title. Max 120 characters.",
            },
            {
              name: "Subheading",
              type: "Text",
              desc: "Optional tagline or intro text below the heading.",
            },
            {
              name: "Background Image",
              type: "Image",
              desc: "Optional — a dark overlay is applied automatically for readability.",
            },
            {
              name: "CTA Label",
              type: "Text",
              desc: "Button text (e.g. 'Start Mining', 'Join Now').",
            },
            {
              name: "CTA Link",
              type: "URL",
              desc: "Where the button links to. Supports internal (/path) and external URLs.",
            },
            {
              name: "Alignment",
              type: "Radio",
              desc: "Left-aligned or centred text.",
            },
          ]}
        />
        <Options items={["Left", "Center"]} />
      </section>

      {/* 5. Page Hero (Compact) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>05 — Page Hero (Compact)</h2>
        <p className={styles.sectionIntro}>
          A shorter hero for inner pages. Includes an optional breadcrumb label
          above the heading (e.g. &ldquo;// GUIDES&rdquo;).
        </p>

        <FieldTable
          fields={[
            {
              name: "Heading",
              type: "Text",
              required: true,
              desc: "Page title.",
            },
            {
              name: "Subheading",
              type: "Text",
              desc: "Optional tagline below the heading.",
            },
            {
              name: "Breadcrumb",
              type: "Text",
              desc: "Small label above the heading (e.g. '// GUIDES', '// NEWS').",
            },
            {
              name: "Background Image",
              type: "Image",
              desc: "Optional — auto-darkened.",
            },
            {
              name: "Alignment",
              type: "Radio",
              desc: "Center (default) or left.",
            },
          ]}
        />
      </section>

      {/* 6. Stats Row */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>06 — Stats Row</h2>
        <p className={styles.sectionIntro}>
          A row of 1–6 big-number statistics, each with optional trend arrow and
          subtitle. Perfect for KPIs and platform metrics.
        </p>

        <FieldTable
          fields={[
            {
              name: "Heading",
              type: "Text",
              desc: "Optional heading above the stats.",
            },
            {
              name: "Stats (1–6)",
              type: "List",
              required: true,
              desc: "Each stat has a label, value, trend, and subtitle.",
            },
            {
              name: "Accent",
              type: "Toggle",
              desc: "Apply gold accent styling.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Each stat item</h3>
          <FieldTable
            fields={[
              {
                name: "Label",
                type: "Text",
                required: true,
                desc: "Stat name (e.g. 'Active Miners', 'Total Runs').",
              },
              {
                name: "Value",
                type: "Text",
                required: true,
                desc: "The big number or text (e.g. '2,847', '114.7%', '2.4M PED').",
              },
              {
                name: "Trend Direction",
                type: "Radio",
                desc: "Up ↑, Down ↓, Neutral →, or None.",
              },
              {
                name: "Trend Value",
                type: "Text",
                desc: "Shown next to the arrow (e.g. '12%', '+5'). Hidden when direction is 'None'.",
              },
              {
                name: "Subtitle",
                type: "Text",
                desc: "Small text below the value (e.g. 'Last 30 days').",
              },
            ]}
          />
        </div>

        <Tip>
          Set the trend direction to &ldquo;None&rdquo; to hide the arrow
          entirely — useful for stats that don&apos;t have a comparison period.
        </Tip>
      </section>

      {/* 7. Feature Grid */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>07 — Feature Grid</h2>
        <p className={styles.sectionIntro}>
          A responsive grid of 1–12 feature cards, each with an icon or image,
          title, description, and optional link.
        </p>

        <FieldTable
          fields={[
            { name: "Heading", type: "Text", desc: "Section title." },
            {
              name: "Subheading",
              type: "Text",
              desc: "Description below the heading.",
            },
            {
              name: "Features (1–12)",
              type: "List",
              required: true,
              desc: "Each feature becomes a styled card.",
            },
            {
              name: "Columns",
              type: "Number",
              desc: "Auto (default), 2, 3, or 4. Auto adjusts based on screen size.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Each feature item</h3>
          <FieldTable
            fields={[
              {
                name: "Title",
                type: "Text",
                required: true,
                desc: "Card heading.",
              },
              { name: "Description", type: "Text", desc: "Card body text." },
              {
                name: "Icon",
                type: "Text",
                desc: "Lucide icon name (e.g. 'shield', 'pickaxe'). See lucide.dev/icons.",
              },
              {
                name: "Image",
                type: "Image",
                desc: "Optional — takes priority over the icon if both are set.",
              },
              {
                name: "Link",
                type: "URL",
                desc: "Makes the card clickable. Supports internal and external URLs.",
              },
            ]}
          />
        </div>
      </section>

      {/* 8. CTA Banner */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>08 — CTA Banner</h2>
        <p className={styles.sectionIntro}>
          A call-to-action block with heading, body text, and up to two buttons.
          Three visual variants available.
        </p>

        <FieldTable
          fields={[
            {
              name: "Heading",
              type: "Text",
              required: true,
              desc: "CTA title.",
            },
            { name: "Body", type: "Text", desc: "Supporting text." },
            {
              name: "Primary Button",
              type: "Label + URL",
              required: true,
              desc: "Main action button.",
            },
            {
              name: "Secondary Button",
              type: "Label + URL",
              desc: "Optional second button.",
            },
            {
              name: "Variant",
              type: "Radio",
              desc: "Visual style — default, accent (gold glow), or danger (red tint).",
            },
          ]}
        />
        <Options
          items={["Default", "Accent (gold glow)", "Danger (red tint)"]}
        />
      </section>

      {/* 9. Rich Text Block */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>09 — Rich Text Block</h2>
        <p className={styles.sectionIntro}>
          A free-form content section using the full rich text editor. Supports
          headings, images, code blocks, callouts, and more.
        </p>

        <FieldTable
          fields={[
            {
              name: "Heading",
              type: "Text",
              desc: "Optional heading above the text.",
            },
            {
              name: "Body",
              type: "Rich Text",
              required: true,
              desc: "Full rich text editor — see the Editor tab for details.",
            },
            {
              name: "Max Width",
              type: "Radio",
              desc: "Narrow (48rem — ideal for reading), Medium (64rem), or Full Width.",
            },
          ]}
        />
        <Options items={["Narrow (prose)", "Medium", "Full Width"]} />
      </section>

      {/* 10. Image Gallery */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>10 — Image Gallery</h2>
        <p className={styles.sectionIntro}>
          Display 1–20 images in a grid, masonry, or single-column layout.
        </p>

        <FieldTable
          fields={[
            { name: "Heading", type: "Text", desc: "Optional gallery title." },
            {
              name: "Images (1–20)",
              type: "List",
              required: true,
              desc: "Each image has alt text (required) and optional caption.",
            },
            {
              name: "Layout",
              type: "Radio",
              desc: "Grid (auto-fit), Masonry, or Single Column.",
            },
            {
              name: "Columns",
              type: "Number",
              desc: "2, 3 (default), or 4. Only visible in Grid layout.",
            },
          ]}
        />
        <Options items={["Grid", "Masonry", "Single Column"]} />
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — CONTENT  (News Posts, Guides, Map POIs, Authors & Categories)
   ═══════════════════════════════════════════════════════════════════════════ */

function ContentTab() {
  return (
    <>
      {/* 11. News Posts */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>11 — News Posts</h2>
        <p className={styles.sectionIntro}>
          Blog-style articles shown on the{" "}
          <span className={styles.code}>/news</span> page. Each post gets its
          own page at <span className={styles.code}>/news/[slug]</span>.
        </p>

        <FieldTable
          fields={[
            {
              name: "Title",
              type: "Text",
              required: true,
              desc: "Article headline. Max 120 characters.",
            },
            {
              name: "Slug",
              type: "Auto-generated",
              required: true,
              desc: "URL path — auto-generated from title. Don't change after publish.",
            },
            {
              name: "Excerpt",
              type: "Text",
              desc: "Short summary shown in card previews and SEO. 1–2 sentences.",
            },
            {
              name: "Cover Image",
              type: "Image + Alt",
              desc: "Featured image for cards and headers. Always add alt text for accessibility.",
            },
            {
              name: "Author",
              type: "Reference",
              required: true,
              desc: "Who wrote this post. Pick from the Authors list.",
            },
            {
              name: "Categories",
              type: "List (max 5)",
              desc: "Tag with up to 5 categories.",
            },
            {
              name: "Published At",
              type: "Date/Time",
              required: true,
              desc: "Publication date — posts sort newest first.",
            },
            {
              name: "Featured",
              type: "Toggle",
              desc: "Mark as featured for hero/highlight sections.",
            },
            {
              name: "Body",
              type: "Rich Text",
              desc: "Full article content. See the Editor tab for rich text details.",
            },
          ]}
        />

        <Tip>
          Setting a publish date in the future effectively schedules the post —
          it will already be in the CMS but won&apos;t appear prominently until
          that date.
        </Tip>
      </section>

      {/* 12. Guides */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>12 — Guides</h2>
        <p className={styles.sectionIntro}>
          Tutorial-style content shown on the{" "}
          <span className={styles.code}>/guides</span> page, with difficulty
          levels and category sorting.
        </p>

        <FieldTable
          fields={[
            {
              name: "Title",
              type: "Text",
              required: true,
              desc: "Guide title. Max 120 characters.",
            },
            {
              name: "Slug",
              type: "Auto-generated",
              required: true,
              desc: "URL path. Don't change after publish.",
            },
            {
              name: "Excerpt",
              type: "Text",
              desc: "Short summary shown on guide cards.",
            },
            {
              name: "Cover Image",
              type: "Image + Alt",
              desc: "Featured image. Always add alt text.",
            },
            {
              name: "Category",
              type: "Reference",
              required: true,
              desc: "Which category this belongs to (e.g. Mining, Hunting, Trading).",
            },
            {
              name: "Difficulty",
              type: "Radio",
              desc: "Beginner, Intermediate, or Advanced.",
            },
            {
              name: "Sort Order",
              type: "Number",
              desc: "Lower numbers appear first within a category. Default is 0.",
            },
            {
              name: "Published At",
              type: "Date/Time",
              required: true,
              desc: "Publication date.",
            },
            { name: "Body", type: "Rich Text", desc: "Full guide content." },
          ]}
        />
        <Options items={["Beginner", "Intermediate", "Advanced"]} />
      </section>

      {/* 13. Events */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>13 — Events</h2>
        <p className={styles.sectionIntro}>
          In-game events shown on the{" "}
          <span className={styles.code}>/events</span> page. Each event gets its
          own detail page at <span className={styles.code}>/events/[slug]</span>
          .
        </p>

        <FieldTable
          fields={[
            {
              name: "Title",
              type: "Text",
              required: true,
              desc: "Event name. Max 120 characters.",
            },
            {
              name: "Slug",
              type: "Auto-generated",
              required: true,
              desc: "URL path.",
            },
            {
              name: "Excerpt",
              type: "Text",
              desc: "Short summary shown on event cards.",
            },
            {
              name: "Cover Image",
              type: "Image + Alt",
              desc: "Featured image. Always add alt text.",
            },
            {
              name: "Start Date",
              type: "Date/Time",
              desc: "When the event begins.",
            },
            {
              name: "End Date",
              type: "Date/Time",
              desc: "When the event ends.",
            },
            {
              name: "Location",
              type: "Text",
              desc: "In-game location name.",
            },
            {
              name: "Event Type",
              type: "Dropdown",
              desc: "Category of event.",
            },
            {
              name: "Featured",
              type: "Toggle",
              desc: "Promote to featured sections.",
            },
            {
              name: "Body",
              type: "Rich Text",
              desc: "Full event details and instructions.",
            },
          ]}
        />
      </section>

      {/* 14. Map POIs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>14 — Map POIs</h2>
        <p className={styles.sectionIntro}>
          Points of interest on the interactive 3D sector map at{" "}
          <span className={styles.code}>/map</span>. Each POI appears as a
          marker with its name, category colour, and optional icon.
        </p>

        <FieldTable
          fields={[
            {
              name: "Name",
              type: "Text",
              required: true,
              desc: "Display name (e.g. 'Howling Mine SS', 'M-Type Asteroid 7'). Max 80 chars.",
            },
            {
              name: "Category",
              type: "Dropdown",
              required: true,
              desc: "Determines the marker colour and label on the map.",
            },
            {
              name: "Paste Coordinates",
              type: "Special",
              desc: "Paste in-game coords in the format [Space, 78061, 79412, -702, Waypoint] and it auto-fills X/Y/Z.",
            },
            {
              name: "EU Coordinate X",
              type: "Number",
              required: true,
              desc: "In-game X coordinate.",
            },
            {
              name: "EU Coordinate Y",
              type: "Number",
              required: true,
              desc: "In-game Y coordinate.",
            },
            {
              name: "EU Coordinate Z",
              type: "Number",
              required: true,
              desc: "In-game Z (altitude) coordinate.",
            },
            {
              name: "Icon",
              type: "Dropdown",
              desc: "Map marker icon with emoji preview. Leave blank for the category default.",
            },
            {
              name: "Description",
              type: "Text",
              desc: "Optional notes about this POI.",
            },
            {
              name: "PVP Lootable",
              type: "Toggle",
              desc: "Mark if this POI is inside a PVP lootable zone.",
            },
            {
              name: "Show on Map",
              type: "Toggle",
              desc: "Toggle visibility without deleting the POI.",
            },
          ]}
        />

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Category Options</h3>
          <Options
            items={[
              "Space Station",
              "Asteroid (C-Type)",
              "Asteroid (F-Type)",
              "Asteroid (S-Type)",
              "Asteroid (M-Type)",
              "Asteroid (ND)",
              "Asteroid (Scrap)",
              "Landmark",
              "PVP Zone",
              "Safe Zone",
            ]}
          />
        </div>

        <Tip>
          The easiest way to add coordinates: open the game, navigate to the
          location, copy the coordinates from the in-game waypoint, and paste
          them directly into the &ldquo;Paste Coordinates&rdquo; field. It
          accepts the full in-game format including the [Space, ...] wrapper.
        </Tip>
      </section>

      {/* 15. Authors & Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>15 — Authors & Categories</h2>
        <p className={styles.sectionIntro}>
          Supporting content types used by News Posts and Guides.
        </p>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Authors</h3>
          <p className={styles.subDesc}>
            Create author profiles that can be linked to news posts.
          </p>
          <FieldTable
            fields={[
              {
                name: "Name",
                type: "Text",
                required: true,
                desc: "Author display name.",
              },
              {
                name: "Slug",
                type: "Auto-generated",
                required: true,
                desc: "URL-safe identifier.",
              },
              { name: "Avatar", type: "Image", desc: "Profile picture." },
              { name: "Bio", type: "Text", desc: "Short biography." },
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Categories</h3>
          <p className={styles.subDesc}>
            Tags used to organise news posts and guides. Create categories like
            &ldquo;Mining&rdquo;, &ldquo;Trading&rdquo;, &ldquo;Updates&rdquo;,
            etc.
          </p>
          <FieldTable
            fields={[
              {
                name: "Title",
                type: "Text",
                required: true,
                desc: "Category name.",
              },
              {
                name: "Slug",
                type: "Auto-generated",
                required: true,
                desc: "URL-safe identifier.",
              },
              {
                name: "Description",
                type: "Text",
                desc: "Optional description.",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 4 — EDITOR  (Rich Text Editor)
   ═══════════════════════════════════════════════════════════════════════════ */

function EditorTab() {
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>16 — Rich Text Editor</h2>
        <p className={styles.sectionIntro}>
          The rich text editor is used wherever you see a &ldquo;Body&rdquo;
          field — in news posts, guides, and rich text sections. Here&apos;s
          everything it supports:
        </p>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Text Formatting</h3>
          <FieldTable
            fields={[
              {
                name: "Bold",
                type: "Decorator",
                desc: "Select text and click B or Ctrl+B.",
              },
              {
                name: "Italic",
                type: "Decorator",
                desc: "Select text and click I or Ctrl+I.",
              },
              {
                name: "Code",
                type: "Decorator",
                desc: "Inline code highlighting with gold tint.",
              },
              {
                name: "Strikethrough",
                type: "Decorator",
                desc: "Crossed-out text.",
              },
              {
                name: "Link",
                type: "Annotation",
                desc: "Hyperlink with option to open in new tab.",
              },
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Block Styles</h3>
          <p className={styles.subDesc}>
            Use the style dropdown in the toolbar to switch between these:
          </p>
          <FieldTable
            fields={[
              {
                name: "Normal",
                type: "Paragraph",
                desc: "Standard body text.",
              },
              {
                name: "H2",
                type: "Heading",
                desc: "Major section heading — renders with // prefix in gold.",
              },
              {
                name: "H3",
                type: "Heading",
                desc: "Sub-section heading — renders with > prefix in gold.",
              },
              { name: "H4", type: "Heading", desc: "Minor heading." },
              {
                name: "Blockquote",
                type: "Quote",
                desc: "Indented quote with subtle border and background.",
              },
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Lists</h3>
          <p className={styles.subDesc}>
            Bullet lists and numbered lists are both available from the toolbar.
            List markers are styled in gold to match the theme.
          </p>
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Embedded Blocks</h3>
          <p className={styles.subDesc}>
            Click the <span className={styles.code}>+</span> button in the
            editor toolbar to insert these special blocks:
          </p>

          <FieldTable
            fields={[
              {
                name: "Image",
                type: "Block",
                desc: "Upload an image with required alt text and optional caption. Supports hotspot/crop.",
              },
              {
                name: "Code Block",
                type: "Block",
                desc: "Multi-line code with language selector and optional filename header.",
              },
              {
                name: "Callout",
                type: "Block",
                desc: "Highlighted notice box with four tones: Info, Tip, Warning, Alert.",
              },
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Code Block Languages</h3>
          <Options
            items={[
              "JavaScript",
              "TypeScript",
              "HTML",
              "CSS",
              "JSON",
              "Bash",
              "Python",
              "Text",
            ]}
          />
        </div>

        <div className={styles.sub}>
          <h3 className={styles.subTitle}>Callout Tones</h3>
          <p className={styles.subDesc}>
            Each tone renders with a different colour and label:
          </p>
          <FieldTable
            fields={[
              {
                name: "Info",
                type: "Gold",
                desc: "General informational note — labelled [ INFO ].",
              },
              {
                name: "Tip",
                type: "Green",
                desc: "Pro tip or best practice — labelled [ TIP ].",
              },
              {
                name: "Warning",
                type: "Gold",
                desc: "Important caution — labelled [ WARNING ].",
              },
              {
                name: "Danger",
                type: "Red",
                desc: "Critical alert or breaking change — labelled [ ALERT ].",
              },
            ]}
          />
        </div>

        <Note>
          The rich text editor is the same across news posts, guides, and rich
          text page sections — learn it once and it works everywhere.
        </Note>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function CmsGuidePage() {
  const { setSubTabs, activeSubTab, setActiveSubTab } = useTopBar();

  useEffect(() => {
    setSubTabs(SUB_TABS);
    setActiveSubTab("homepage");
    return () => {
      setSubTabs([]);
    };
  }, [setSubTabs, setActiveSubTab]);

  const tab = activeSubTab || "homepage";

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>CMS Guide</h1>
        <p className={styles.heroSub}>
          Everything on this site is powered by Sanity CMS. This guide covers
          every content type, section, and field — so you know exactly
          what&apos;s configurable before you log in to the Studio.
        </p>
      </header>

      {/* Tab Content */}
      {tab === "homepage" && <HomepageTab />}
      {tab === "settings" && <SettingsTab />}
      {tab === "page-builder" && <PageBuilderTab />}
      {tab === "content" && <ContentTab />}
      {tab === "editor" && <EditorTab />}
    </div>
  );
}
