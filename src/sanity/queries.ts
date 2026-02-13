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
    sections[] {
      _type,
      _key,
      // heroSection + pageHeroSection
      heading,
      subheading,
      backgroundImage,
      breadcrumb,
      cta,
      align,
      // statsRowSection
      stats[] { label, value, trendDirection, trendValue, subtitle },
      accent,
      // featureGridSection
      features[] { title, description, icon, image, href },
      columns,
      // ctaSection
      body,
      primaryAction,
      secondaryAction,
      variant,
      // richTextSection
      "richBody": body,
      maxWidth,
      // imageGallerySection
      images[] { image, alt, caption },
      layout
    }
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

/* ─── Map POIs ─── */
export const MAP_POIS_QUERY = groq`
  *[_type == "mapPoi" && visible == true] | order(category asc, name asc) {
    _id,
    name,
    category,
    euX,
    euY,
    euZ,
    icon,
    description,
    pvpLootable
  }
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    siteNameShort,
    tagline,
    logo,
    favicon,
    heroOverlayOpacity,
    mainNav[] { label, href, icon },
    footerText,
    footerLinks[] { label, href },
    socialLinks[] { platform, url },
    seoTitle,
    seoDescription,
    ogImage
  }
`;
