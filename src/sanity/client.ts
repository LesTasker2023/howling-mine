import { createClient } from "next-sanity";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "u2kuytve";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN for published content — fast reads
});

/** Preview client — no CDN, sees drafts */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

/** Use previewClient when draftMode is active, otherwise normal client */
export function getClient(preview = false) {
  return preview ? previewClient : client;
}
