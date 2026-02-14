import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";
import NewsHub from "./NewsHub";

export const metadata: Metadata = {
  title: "News — The Howling Mine",
  description: "Latest news, updates, and announcements from The Howling Mine.",
};

export default async function NewsPage() {
  let posts = [];
  try {
    posts =
      (await client.fetch(POSTS_QUERY, {}, { next: { revalidate: 60 } })) ?? [];
  } catch {
    /* Sanity not configured yet */
  }

  return <NewsHub posts={posts} />;
}
