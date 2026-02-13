import { defineField, defineType } from "sanity";

export const ctaSectionType = defineType({
  name: "ctaSection",
  title: "CTA Banner",
  type: "object",
  icon: () => "📢",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "primaryAction",
      title: "Primary Button",
      type: "object",
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
          type: "url",
          validation: (r) =>
            r
              .required()
              .uri({
                allowRelative: true,
                scheme: ["http", "https", "mailto"],
              }),
        }),
      ],
    }),
    defineField({
      name: "secondaryAction",
      title: "Secondary Button (optional)",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "URL",
          type: "url",
          validation: (r) =>
            r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
        }),
      ],
    }),
    defineField({
      name: "variant",
      title: "Visual Style",
      type: "string",
      options: {
        list: [
          { title: "Default (surface)", value: "default" },
          { title: "Accent (glow border)", value: "accent" },
          { title: "Danger (red tint)", value: "danger" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return { title: `📢 CTA: ${heading ?? "Untitled"}` };
    },
  },
});
