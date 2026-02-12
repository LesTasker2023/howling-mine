import { defineField, defineType } from "sanity";

export const codeBlockType = defineType({
  name: "codeBlock",
  title: "Code Block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "JSON", value: "json" },
          { title: "Bash", value: "bash" },
          { title: "Python", value: "python" },
          { title: "Plain Text", value: "text" },
        ],
      },
      initialValue: "typescript",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
      description: "Optional — shown above the code block.",
    }),
  ],
  preview: {
    select: { language: "language", filename: "filename" },
    prepare({ language, filename }) {
      return {
        title: filename ?? "Code Block",
        subtitle: language ?? "",
      };
    },
  },
});
