/**
 * Presentation Tool — Document Resolvers & Location Mapping
 *
 * Tells the Presentation tool:
 *   1. Which Sanity document(s) to load for any given route  (mainDocuments)
 *   2. Where a document can be previewed on the front‑end     (locations)
 */

import {
  defineDocuments,
  defineLocations,
  type DocumentLocationResolverObject,
} from "sanity/presentation";

/* ── Main‑document resolvers ──────────────────────────────────────────── */
// These map URL paths → Sanity documents so the right‑hand panel populates.

const mainDocuments = defineDocuments([
  {
    // CMS pages: /:slug  →  page { slug.current == :slug }
    route: "/:slug",
    filter: `_type == "page" && slug.current == $slug`,
  },
  {
    // Posts: /news/:slug  →  post { slug.current == :slug }
    route: "/news/:slug",
    filter: `_type == "post" && slug.current == $slug`,
  },
  {
    // Guides: /guides/:slug  →  guide { slug.current == :slug }
    route: "/guides/:slug",
    filter: `_type == "guide" && slug.current == $slug`,
  },
  {
    // Events: /events/:slug  →  event { slug.current == :slug }
    route: "/events/:slug",
    filter: `_type == "event" && slug.current == $slug`,
  },
]);

/* ── Location resolvers ───────────────────────────────────────────────── */
// These let editors see "Used on: /showcase" when editing a document.

const pageLocations: DocumentLocationResolverObject = {
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) =>
    doc
      ? {
          locations: [
            {
              title: (doc.title as string) || "Untitled page",
              href: `/${doc.slug as string}`,
            },
          ],
        }
      : undefined,
};

const postLocations: DocumentLocationResolverObject = {
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) =>
    doc
      ? {
          locations: [
            {
              title: (doc.title as string) || "Untitled post",
              href: `/news/${doc.slug as string}`,
            },
          ],
        }
      : undefined,
};

const guideLocations: DocumentLocationResolverObject = {
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) =>
    doc
      ? {
          locations: [
            {
              title: (doc.title as string) || "Untitled guide",
              href: `/guides/${doc.slug as string}`,
            },
          ],
        }
      : undefined,
};

/* ── Combined export ──────────────────────────────────────────────────── */

const eventLocations: DocumentLocationResolverObject = {
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) =>
    doc
      ? {
          locations: [
            {
              title: (doc.title as string) || "Untitled event",
              href: `/events/${doc.slug as string}`,
            },
          ],
        }
      : undefined,
};

export const resolve = {
  mainDocuments,
  locations: {
    page: pageLocations,
    post: postLocations,
    guide: guideLocations,
    event: eventLocations,
  },
};
