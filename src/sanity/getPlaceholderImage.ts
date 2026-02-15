import { client } from "@/sanity/client";
import { groq } from "next-sanity";

const PLACEHOLDER_QUERY = groq`
  *[_type == "siteSettings"][0].placeholderImage {
    asset->{ _id, url },
    alt,
    hotspot,
    crop
  }
`;

/** Cached fetch of the site-wide placeholder image for server components. */
export async function getPlaceholderImage() {
  try {
    return await client.fetch(
      PLACEHOLDER_QUERY,
      {},
      { next: { revalidate: 3600 } },
    );
  } catch {
    return null;
  }
}
