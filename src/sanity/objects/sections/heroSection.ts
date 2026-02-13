import { defineField, defineType } from "sanity";

export const heroSectionType = defineType({
  name: "heroSection",
  title: "Hero Banner",
  type: "object",
  icon: () => "🏔",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 2,
      description: "Short tagline or intro text below the heading.",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional background image. A dark overlay is applied automatically.",
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Button Label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "Link URL",
          type: "url",
          validation: (r) =>
            r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
        }),
      ],
    }),
    defineField({
      name: "align",
      title: "Text Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "center",
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return { title: `🏔 Hero: ${heading ?? "Untitled"}` };
    },
  },
});
