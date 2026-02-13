import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) {
  throw new Error(
    "Missing SANITY_TOKEN — required for Live Content API and Visual Editing",
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "vX",
    stega: { studioUrl: "/studio" },
  }),
  serverToken: token,
  browserToken: token,
});
