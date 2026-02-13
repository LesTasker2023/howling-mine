import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";
import { POSTS_QUERY } from "@/sanity/queries";
import NewsHub from "./NewsHub";

export const metadata: Metadata = {
  title: "News — The Howling Mine",
  description: "Latest news, updates, and announcements from The Howling Mine.",
};

export default async function NewsPage() {
  let posts = [];
  try {
    const { data } = await sanityFetch({ query: POSTS_QUERY });
    posts = data ?? [];
  } catch {
    /* Sanity not configured yet */
  }

  return <NewsHub posts={posts} />;
}
