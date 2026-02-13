import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) {
  throw new Error("Missing SANITY_TOKEN — required for draft mode");
}

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
