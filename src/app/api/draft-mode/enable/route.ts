import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) throw new Error("SANITY_TOKEN is not set — draft mode will not work");

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
