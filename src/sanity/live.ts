import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/client";

const token = process.env.SANITY_TOKEN ?? "";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "vX",
    stega: { studioUrl: "/studio" },
  }),
  ...(token ? { serverToken: token, browserToken: token } : {}),
});
