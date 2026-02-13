import { defineField, defineType } from "sanity";

export const featureGridSectionType = defineType({
  name: "featureGridSection",
  title: "Feature Grid",
  type: "object",
  icon: () => "🔲",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Section Subheading",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          name: "feature",
          fields: [
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
            }),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description:
                'Lucide icon name (e.g. "shield", "sword", "pickaxe", "target"). See lucide.dev/icons for options.',
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              description:
                "Optional image — takes priority over icon if both are set.",
            }),
            defineField({
              name: "href",
              title: "Link URL",
              type: "url",
              validation: (r) =>
                r.uri({ allowRelative: true, scheme: ["http", "https"] }),
              description: "Makes the card clickable/navigable.",
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title ?? "Untitled Feature" };
            },
          },
        },
      ],
      validation: (r) => r.min(1).max(12),
    }),
    defineField({
      name: "columns",
      title: "Column Count",
      type: "number",
      options: {
        list: [
          { title: "Auto (responsive)", value: 0 },
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
      initialValue: 0,
      description:
        "Auto adjusts based on screen size. Override for fixed layouts.",
    }),
  ],
  preview: {
    select: { heading: "heading", features: "features" },
    prepare({ heading, features }) {
      const count = features?.length ?? 0;
      return {
        title: `🔲 Grid: ${heading ?? `${count} feature${count !== 1 ? "s" : ""}`}`,
      };
    },
  },
});
