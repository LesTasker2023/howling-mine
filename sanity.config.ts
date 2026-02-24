"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureResolver } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schema } from "@/sanity/schema";
import { resolve } from "@/sanity/presentation/resolve";
import { howlingMineTheme } from "@/sanity/studioTheme";
import { StudioLogo, StudioLoading } from "@/sanity/studioComponents";
import {
  Home,
  Settings,
  Newspaper,
  BookOpen,
  Calendar,
  FileText,
  User,
  Tag,
  MapPin,
} from "lucide-react";
import "./src/sanity/studio.css";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/* ── Custom desk structure — pin singletons to the top ── */
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Homepage — singleton
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .icon(Home)
        .child(
          S.document()
            .schemaType("homepage")
            .documentId("homepage")
            .title("Homepage"),
        ),
      // Site Settings — singleton (always one doc)
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(Settings)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.divider(),
      // Then all other document types (excluding singletons)
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "homepage"].includes(item.getId() ?? ""),
      ),
    ]);

export default defineConfig({
  name: "the-howling-mine",
  title: "The Howling Mine",

  projectId,
  dataset,
  basePath: "/studio",

  theme: howlingMineTheme,

  studio: {
    components: {
      logo: StudioLogo,
      loading: StudioLoading,
    },
  },

  /* Force dark mode (matches the site) */
  form: {
    image: {
      directUploads: true,
    },
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve,
    }),
    visionTool({ defaultApiVersion: "2025-01-01" }),
  ],

  schema,
});
