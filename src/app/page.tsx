import type { Metadata } from "next";
import { getClient } from "@/sanity/client";
import { HOMEPAGE_QUERY } from "@/sanity/queries";
import { sanityFetch } from "@/sanity/live";
import { urlFor } from "@/sanity/image";
import { JsonLd, faqPageSchema, organizationSchema } from "@/lib/jsonLd";
import HomePage from "./(home)/HomePage";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getClient(false).fetch(
    HOMEPAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  if (!data) return {};

  const ogImageUrl = data.ogImage
    ? urlFor(data.ogImage).width(1200).height(630).auto("format").url()
    : undefined;

  return {
    title: data.seoTitle ?? undefined,
    description: data.seoDescription ?? undefined,
    keywords: data.seoKeywords ?? undefined,
    openGraph: {
      title: data.ogTitle ?? data.seoTitle ?? undefined,
      description: data.ogDescription ?? data.seoDescription ?? undefined,
      type: "website",
      siteName: "The Howling Mine",
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: data.twitterTitle ?? data.ogTitle ?? data.seoTitle ?? undefined,
      description:
        data.twitterDescription ??
        data.ogDescription ??
        data.seoDescription ??
        undefined,
      ...(data.twitterCreator && { creator: data.twitterCreator }),
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    robots: { index: true, follow: true },
    ...(data.canonicalUrl && { alternates: { canonical: data.canonicalUrl } }),
  };
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const [{ data }, sp] = await Promise.all([
    sanityFetch({ query: HOMEPAGE_QUERY }),
    searchParams,
  ]);

  // Build signup URL with ?ref= if present
  const ref = typeof sp.ref === "string" ? sp.ref : undefined;
  const baseSignup =
    data?.signupBaseUrl ??
    "https://account.entropiauniverse.com/create-account?ref=howlingmine";
  let signupUrl = baseSignup;
  if (ref) {
    const url = new URL(baseSignup);
    url.searchParams.set("ref", ref);
    signupUrl = url.toString();
  }

  /* ── JSON-LD structured data ── */
  const faqs: { question: string; answer: string }[] =
    data?.faqs?.filter(
      (f: { question?: string; answer?: string }) => f.question && f.answer,
    ) ?? [];

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqPageSchema(faqs)} />}
      <JsonLd
        data={organizationSchema({
          name: "The Howling Mine",
          url: "https://thehowlingmine.com",
          description: data?.seoDescription ?? undefined,
        })}
      />
      <HomePage data={data ?? {}} signupUrl={signupUrl} />
    </>
  );
}
