import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";
import { GUIDES_QUERY } from "@/sanity/queries";
import GuidesHub from "./GuidesHub";

export const metadata: Metadata = {
  title: "Guides — The Howling Mine",
  description:
    "Tutorials, walkthroughs, and tips for mining in Entropia Universe.",
};

export default async function GuidesPage() {
  let guides = [];
  try {
    const { data } = await sanityFetch({ query: GUIDES_QUERY });
    guides = data ?? [];
  } catch {
    /* Sanity not configured yet */
  }

  return <GuidesHub guides={guides} />;
}
