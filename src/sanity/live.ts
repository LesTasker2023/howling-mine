import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/client";

const serverToken = process.env.SANITY_TOKEN ?? "";
const browserToken = process.env.SANITY_BROWSER_TOKEN ?? "";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "vX",
    stega: { studioUrl: "/studio" },
  }),
  ...(serverToken ? { serverToken } : {}),
  ...(browserToken ? { browserToken } : {}),
});
