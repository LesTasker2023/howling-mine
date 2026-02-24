import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";
import { IconPickerInput } from "@/sanity/components/IconPickerInput";
import { NavLinkPreview } from "@/sanity/components/NavLinkPreview";
import { SliderInput } from "@/sanity/components/SliderInput";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "social", title: "Social Links" },
    { name: "seo", title: "SEO Defaults" },
  ],
  fields: [
    /* ── General ── */
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      group: "general",
      validation: (r) => r.required(),
      description: "Shown in the sidebar logo and browser tab.",
    }),
    defineField({
      name: "siteNameShort",
      title: "Short Name",
      type: "string",
      group: "general",
      description:
        "Abbreviated name for collapsed sidebar (e.g. 'HM'). Max 4 chars.",
      validation: (r) => r.max(4),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
      description: "Short tagline used in the footer and meta descriptions.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "general",
      options: { hotspot: true },
      description: "Site logo shown in the sidebar header.",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "general",
      description: "16×16 or 32×32 PNG recommended.",
    }),
    defineField({
      name: "placeholderImage",
      title: "Placeholder Image",
      type: "image",
      group: "general",
      options: { hotspot: true },
      description:
        "Default placeholder image used for cards and thumbnails when no specific image is set.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Accessible description of the placeholder image.",
        }),
      ],
    }),
    defineField({
      name: "discordUrl",
      title: "Discord Invite URL",
      type: "url",
      group: "general",
      description:
        "Primary Discord invite link used site-wide (e.g. https://discord.gg/NnkPwamsDQ).",
      validation: (r) => r.uri({ allowRelative: false, scheme: ["https"] }),
    }),

    /* ── Hero Overlay ── */
    defineField({
      name: "heroOverlayOpacity",
      title: "Hero Overlay Darkness",
      type: "number",
      group: "general",
      description:
        "Controls how dark the video overlay is on the homepage hero. 0 = no darkening, 100 = fully black. Default is 65.",
      validation: (r) => r.min(0).max(100),
      initialValue: 65,
      components: { input: SliderInput },
    }),

    /* ── Navigation ── */
    defineField({
      name: "mainNav",
      title: "Main Navigation",
      type: "array",
      group: "navigation",
      description: "Primary sidebar navigation links.",
      of: [
        {
          type: "object",
          name: "navLink",
          title: "Link",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              validation: (r) => r.required(),
              description: "Internal path (e.g. /news) or external URL.",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Choose a Lucide icon for this nav link.",
              components: { input: IconPickerInput },
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href", icon: "icon" },
          },
          components: {
            preview: NavLinkPreview as any,
          },
        },
      ],
    }),

    /* ── Footer ── */
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      group: "footer",
      description:
        "Copyright / tagline shown in the footer. Use {year} for the current year.",
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          name: "footerLink",
          title: "Link",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),

    /* ── Social ── */
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  "discord",
                  "youtube",
                  "twitter",
                  "twitch",
                  "github",
                  "instagram",
                  "facebook",
                  "reddit",
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),

    /* ── SEO Defaults ── */
    defineField({
      name: "seoTitle",
      title: "Default SEO Title",
      type: "string",
      group: "seo",
      description: "Fallback <title> when pages don't define their own.",
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO Description",
      type: "text",
      rows: 2,
      group: "seo",
      description:
        "Fallback meta description when pages don't define their own.",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      group: "seo",
      description: "Fallback social share image.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
