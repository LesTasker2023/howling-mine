import { defineField, defineType } from "sanity";

export const imageGallerySectionType = defineType({
  name: "imageGallerySection",
  title: "Image Gallery",
  type: "object",
  icon: () => "🖼",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "object",
          name: "galleryImage",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { alt: "alt", media: "image" },
            prepare({ alt, media }) {
              return { title: alt ?? "Image", media };
            },
          },
        },
      ],
      validation: (r) => r.min(1).max(20),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid (auto-fit)", value: "grid" },
          { title: "Masonry", value: "masonry" },
          { title: "Single Column", value: "single" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "columns",
      title: "Column Count",
      type: "number",
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
      initialValue: 3,
      hidden: ({ parent }) => parent?.layout !== "grid",
    }),
  ],
  preview: {
    select: { heading: "heading", images: "images" },
    prepare({ heading, images }) {
      const count = images?.length ?? 0;
      return {
        title: `🖼 Gallery: ${heading ?? `${count} image${count !== 1 ? "s" : ""}`}`,
      };
    },
  },
});
