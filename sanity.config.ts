"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "@/sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "the-howling-mine",
  title: "The Howling Mine",

  projectId,
  dataset,
  basePath: "/studio",

  plugins: [structureTool(), visionTool({ defaultApiVersion: "2025-01-01" })],

  schema,
});
