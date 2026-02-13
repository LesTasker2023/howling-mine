import { defineField, defineType } from "sanity";

export const richTextSectionType = defineType({
  name: "richTextSection",
  title: "Rich Text Block",
  type: "object",
  icon: () => "📝",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: "Optional heading displayed above the text.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "maxWidth",
      title: "Max Width",
      type: "string",
      options: {
        list: [
          { title: "Narrow (prose — 48rem)", value: "narrow" },
          { title: "Medium (64rem)", value: "medium" },
          { title: "Full Width", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "narrow",
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return { title: `📝 Text: ${heading ?? "Untitled block"}` };
    },
  },
});
