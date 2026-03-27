import { defineField, defineType } from "sanity";

export const holoAccordionType = defineType({
  name: "holoAccordion",
  title: "Holo Accordion",
  type: "object",
  fields: [
    defineField({
      name: "panels",
      title: "Panels",
      type: "array",
      validation: (r) => r.required().min(2),
      of: [
        {
          type: "object",
          name: "holoPanel",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "stats",
              title: "Stats / Details",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "stat",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "value", title: "Value", type: "string" }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "value" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { panels: "panels" },
    prepare({ panels }) {
      const count = panels?.length ?? 0;
      return {
        title: "Holo Accordion",
        subtitle: `${count} panel${count === 1 ? "" : "s"}`,
      };
    },
  },
});
