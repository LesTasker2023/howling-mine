import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import {
  POST_SLUGS_QUERY,
  GUIDE_SLUGS_QUERY,
  PAGE_SLUGS_QUERY,
} from "@/sanity/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thehowlingmine.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Static routes ── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/news`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/events`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/map`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/join`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/stats`, changeFrequency: "daily", priority: 0.5 },
  ];

  /* ── Dynamic CMS routes ── */
  let postSlugs: string[] = [];
  let guideSlugs: string[] = [];
  let pageSlugs: string[] = [];

  try {
    [postSlugs, guideSlugs, pageSlugs] = await Promise.all([
      client.fetch(POST_SLUGS_QUERY),
      client.fetch(GUIDE_SLUGS_QUERY),
      client.fetch(PAGE_SLUGS_QUERY),
    ]);
  } catch {
    // Sanity not configured — return static routes only
  }

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...guideRoutes, ...pageRoutes];
}
