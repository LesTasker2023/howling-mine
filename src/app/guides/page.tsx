import type { Metadata } from "next";
import { client } from "@/sanity/client";
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
    guides =
      (await client.fetch(GUIDES_QUERY, {}, { next: { revalidate: 60 } })) ??
      [];
  } catch {
    /* Sanity not configured yet */
  }

  return <GuidesHub guides={guides} />;
}
