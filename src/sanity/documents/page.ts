import { defineField, defineType, defineArrayMember } from "sanity";
import { FileText } from "lucide-react";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: FileText,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
      description: "URL path, e.g. 'about' → /about",
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "SEO description for this page.",
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      description:
        "Build the page by adding sections. Each section maps to a custom component.",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "pageHeroSection" }),
        defineArrayMember({ type: "statsRowSection" }),
        defineArrayMember({ type: "featureGridSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "richTextSection" }),
        defineArrayMember({ type: "imageGallerySection" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: `/${slug ?? ""}` };
    },
  },
});
