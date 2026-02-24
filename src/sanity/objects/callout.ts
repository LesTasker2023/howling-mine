import { defineField, defineType } from "sanity";

export const calloutType = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Tip", value: "tip" },
          { title: "Warning", value: "warning" },
          { title: "Danger", value: "danger" },
        ],
        layout: "radio",
      },
      initialValue: "info",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { tone: "tone", body: "body" },
    prepare({ tone, body }) {
      const emoji: Record<string, string> = {
        info: "ℹ️",
        tip: "💡",
        warning: "⚠️",
        danger: "🔴",
      };
      return {
        title: `${emoji[tone] ?? "ℹ️"} Callout`,
        subtitle: body?.slice(0, 80) ?? "",
      };
    },
  },
});
