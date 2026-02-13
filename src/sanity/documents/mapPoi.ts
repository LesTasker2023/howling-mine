import { defineField, defineType } from "sanity";

export const mapPoiType = defineType({
  name: "mapPoi",
  title: "Map POI",
  type: "document",
  icon: () => "📍",
  description: "A point of interest on the Howling Mine area map.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required().max(80),
      description:
        'Display name (e.g. "Howling Mine SS", "M-Type Asteroid 7").',
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Space Station", value: "station" },
          { title: "Asteroid (C-Type)", value: "asteroid-c" },
          { title: "Asteroid (F-Type)", value: "asteroid-f" },
          { title: "Asteroid (S-Type)", value: "asteroid-s" },
          { title: "Asteroid (M-Type)", value: "asteroid-m" },
          { title: "Asteroid (ND)", value: "asteroid-nd" },
          { title: "Landmark", value: "landmark" },
          { title: "PVP Zone", value: "pvp-zone" },
          { title: "Safe Zone", value: "safe-zone" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "euX",
      title: "EU Coordinate X",
      type: "number",
      validation: (r) => r.required(),
      description: "In-game X coordinate.",
    }),
    defineField({
      name: "euY",
      title: "EU Coordinate Y",
      type: "number",
      validation: (r) => r.required(),
      description: "In-game Y coordinate.",
    }),
    defineField({
      name: "euZ",
      title: "EU Coordinate Z",
      type: "number",
      validation: (r) => r.required(),
      description: "In-game Z (altitude) coordinate.",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        'Lucide icon name (e.g. "satellite", "circle-dot", "diamond"). Leave blank for category default.',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional notes about this POI.",
    }),
    defineField({
      name: "pvpLootable",
      title: "PVP Lootable",
      type: "boolean",
      initialValue: false,
      description: "Is this POI inside a PVP lootable zone?",
    }),
    defineField({
      name: "visible",
      title: "Show on Map",
      type: "boolean",
      initialValue: true,
      description: "Toggle visibility on the map without deleting.",
    }),
  ],
  orderings: [
    {
      title: "Category",
      name: "categoryAsc",
      by: [
        { field: "category", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "category", pvp: "pvpLootable" },
    prepare({ title, subtitle, pvp }) {
      const badge = pvp ? " ⚠️ PVP" : "";
      return { title, subtitle: `${subtitle}${badge}` };
    },
  },
});
