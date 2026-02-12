import { groq } from "next-sanity";

/* ─── Posts ─── */
export const POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featured,
    coverImage,
    author->{ name, slug, avatar },
    categories[]->{ title, slug }
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featured,
    coverImage,
    author->{ name, slug, avatar, bio },
    categories[]->{ title, slug },
    body
  }
`;

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

/* ─── Pages ─── */
export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    body
  }
`;

export const PAGE_SLUGS_QUERY = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`;

/* ─── Guides ─── */
export const GUIDES_QUERY = groq`
  *[_type == "guide"] | order(order asc) {
    _id,
    title,
    slug,
    excerpt,
    difficulty,
    order,
    publishedAt,
    coverImage,
    category->{ title, slug }
  }
`;

export const GUIDE_BY_SLUG_QUERY = groq`
  *[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    difficulty,
    publishedAt,
    coverImage,
    category->{ title, slug },
    body
  }
`;

export const GUIDE_SLUGS_QUERY = groq`
  *[_type == "guide" && defined(slug.current)].slug.current
`;
