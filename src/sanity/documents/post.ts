import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export const postType = defineType({
  name: "post",
  title: "News Post",
  type: "document",
  icon: Newspaper,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Headline for this news post.",
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
      description: "Short summary shown in cards and SEO descriptions.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: "Featured image shown on cards and article headers.",
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
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      description: "Who wrote this post.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description: "Tag this post with relevant categories.",
      validation: (r) => r.max(5),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Publication date. Required for proper sorting.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this post in featured/hero sections.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richText",
    }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
      date: "publishedAt",
    },
    prepare({ title, author, media, date }) {
      const d = date ? new Date(date).toLocaleDateString() : "Draft";
      return { title, subtitle: `${author ?? "Unknown"} · ${d}`, media };
    },
  },
});
