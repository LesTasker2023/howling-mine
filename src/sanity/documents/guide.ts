import { defineField, defineType } from "sanity";
import { BookOpen } from "lucide-react";

export const guideType = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Guide title shown in listings and header.",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "URL-friendly identifier. Auto-generated from title.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on guide cards.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: "Featured image for this guide.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Accessible description of the image.",
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "Which guide category this belongs to (e.g. Mining, Hunting, Trading).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
        layout: "radio",
      },
      initialValue: "beginner",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first within a category.",
      initialValue: 0,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Publication date for this guide.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richText",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      difficulty: "difficulty",
      media: "coverImage",
    },
    prepare({ title, category, difficulty, media }) {
      const badge = difficulty ? `[${difficulty}]` : "";
      return {
        title,
        subtitle: `${category ?? "Uncategorised"} ${badge}`,
        media,
      };
    },
  },
});
