import { defineField, defineType } from "sanity";

export const videoEmbedType = defineType({
  name: "videoEmbed",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "YouTube or Vimeo URL",
      validation: (r) =>
        r.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { url: "url", caption: "caption" },
    prepare({ url, caption }) {
      return {
        title: "Video",
        subtitle: caption || url || "",
      };
    },
  },
});
