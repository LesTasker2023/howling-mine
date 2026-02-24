/**
 * Shared JSON-LD structured data helpers.
 *
 * Usage: <JsonLd data={faqPageSchema(faqs)} />
 */

interface FaqItem {
  question: string;
  answer: string;
}

/** schema.org FAQPage — for the homepage FAQ section */
export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** schema.org Organization — site-level branding */
export function organizationSchema(opts: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: opts.name,
    url: opts.url,
    ...(opts.logo && { logo: opts.logo }),
    ...(opts.description && { description: opts.description }),
    ...(opts.sameAs?.length && { sameAs: opts.sameAs }),
  };
}

/** schema.org Article / NewsArticle — for news posts */
export function articleSchema(opts: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: opts.title,
    ...(opts.description && { description: opts.description }),
    url: opts.url,
    ...(opts.image && { image: opts.image }),
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.authorName && {
      author: { "@type": "Person", name: opts.authorName },
    }),
  };
}

/** schema.org Event — for game events */
export function eventSchema(opts: {
  name: string;
  description?: string;
  url: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    url: opts.url,
    startDate: opts.startDate,
    ...(opts.endDate && { endDate: opts.endDate }),
    ...(opts.image && { image: opts.image }),
    location: opts.location
      ? {
          "@type": "VirtualLocation",
          name: opts.location,
        }
      : {
          "@type": "VirtualLocation",
          name: "Entropia Universe",
        },
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "The Howling Mine",
      url: "https://thehowlingmine.com",
    },
  };
}

/**
 * Render a JSON-LD script tag.
 * Use in server components: <JsonLd data={schema} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
