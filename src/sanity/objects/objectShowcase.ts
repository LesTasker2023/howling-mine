import { defineField, defineType } from "sanity";

export const objectShowcaseType = defineType({
  name: "objectShowcase",
  title: "Object Showcase",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      validation: (r) => r.required().min(1),
      of: [
        {
          type: "object",
          name: "showcaseItem",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", media: "image" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare({ title, items }) {
      const count = items?.length ?? 0;
      return {
        title: title || "Object Showcase",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
      };
    },
  },
});
