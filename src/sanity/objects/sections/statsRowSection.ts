import { defineField, defineType } from "sanity";

export const statsRowSectionType = defineType({
  name: "statsRowSection",
  title: "Stats Row",
  type: "object",
  icon: () => "📊",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: "Optional heading above the stats row.",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          name: "stat",
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
              description: "The big number or text, e.g. '1,247' or '99.8%'",
            }),
            defineField({
              name: "trendDirection",
              title: "Trend Direction",
              type: "string",
              options: {
                list: [
                  { title: "Up ↑", value: "up" },
                  { title: "Down ↓", value: "down" },
                  { title: "Neutral →", value: "neutral" },
                  { title: "None", value: "none" },
                ],
                layout: "radio",
              },
              initialValue: "none",
            }),
            defineField({
              name: "trendValue",
              title: "Trend Value",
              type: "string",
              description: "e.g. '12%' or '+5'. Shown next to the trend arrow.",
              hidden: ({ parent }) => parent?.trendDirection === "none",
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
              description: "Small text below the value.",
            }),
          ],
          preview: {
            select: { label: "label", value: "value" },
            prepare({ label, value }) {
              return { title: `${label}: ${value}` };
            },
          },
        },
      ],
      validation: (r) => r.min(1).max(6),
    }),
    defineField({
      name: "accent",
      title: "Use Accent Color",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { heading: "heading", stats: "stats" },
    prepare({ heading, stats }) {
      const count = stats?.length ?? 0;
      return {
        title: `📊 Stats: ${heading ?? `${count} stat${count !== 1 ? "s" : ""}`}`,
      };
    },
  },
});
