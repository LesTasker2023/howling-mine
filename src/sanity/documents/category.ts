import { defineField, defineType } from "sanity";
import { Tag } from "lucide-react";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: Tag,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
