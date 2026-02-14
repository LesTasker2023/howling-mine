import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
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
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on event cards.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "startDate",
      title: "Start Date & Time",
      type: "datetime",
      validation: (r) => r.required(),
      description: "When the event begins (UTC).",
    }),
    defineField({
      name: "endDate",
      title: "End Date & Time",
      type: "datetime",
      description:
        "When the event ends (UTC). Leave blank for single-day events.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'In-game location, e.g. "Howling Mine", "Calypso Gateway".',
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Mining Run", value: "mining-run" },
          { title: "Community Meetup", value: "community" },
          { title: "PvP Tournament", value: "pvp" },
          { title: "Hunting Party", value: "hunting" },
          { title: "Trading Event", value: "trading" },
          { title: "Special / Seasonal", value: "special" },
        ],
      },
      initialValue: "mining-run",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Highlight this event at the top of the events page.",
    }),
    defineField({
      name: "body",
      title: "Details",
      type: "richText",
    }),
  ],
  orderings: [
    {
      title: "Start Date (soonest first)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Start Date (latest first)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      startDate: "startDate",
      eventType: "eventType",
      media: "coverImage",
    },
    prepare({ title, startDate, eventType, media }) {
      const d = startDate
        ? new Date(startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date";
      const typeLabel = eventType
        ? eventType
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
        : "";
      return {
        title,
        subtitle: `${typeLabel} · ${d}`,
        media,
      };
    },
  },
});
