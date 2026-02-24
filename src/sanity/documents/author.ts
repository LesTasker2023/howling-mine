import { defineField, defineType } from "sanity";
import { User } from "lucide-react";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: User,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Full display name.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description: "URL-friendly identifier. Auto-generated from name.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      description: "Profile picture shown on bylines and author pages.",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
      description: "Short biography shown alongside authored content.",
    }),
  ],
  orderings: [
    {
      title: "Name A→Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", media: "avatar" },
  },
});
