import { defineField, defineType } from "sanity";

/**
 * Reusable CTA (Call-to-Action) link — label + validated URL.
 * Used across homepage CTAs, page builder sections, etc.
 */
export const ctaLinkType = defineType({
  name: "ctaLink",
  title: "CTA Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Button text (e.g. 'Create Free Account →').",
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      description: "Internal path (e.g. /news) or external URL.",
      validation: (r) =>
        r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
    }),
  ],
});
