import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { PAGE_BY_SLUG_QUERY, PAGE_SLUGS_QUERY } from "@/sanity/queries";
import { PortableTextBody } from "@/components/ui/PortableTextBody/PortableTextBody";
import styles from "./page.module.css";

/* ── Known app routes that must NOT be caught by this dynamic segment ── */
const RESERVED_SLUGS = new Set(["news", "guides", "studio"]);

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(PAGE_SLUGS_QUERY);
    return slugs
      .filter((s) => !RESERVED_SLUGS.has(s))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};

  try {
    const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug });
    if (!page) return {};
    return {
      title: page.title,
      description: page.description ?? undefined,
    };
  } catch {
    return {};
  }
}

export const revalidate = 60;

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;

  /* Let Next.js static routes win — if someone somehow lands here for a
     reserved path, send them to the real 404.                            */
  if (RESERVED_SLUGS.has(slug)) notFound();

  try {
    const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug });
    if (!page) notFound();

    return (
      <article className={styles.article}>
        <h1 className={styles.title}>{page.title}</h1>
        <PortableTextBody value={page.body} />
      </article>
    );
  } catch {
    notFound();
  }
}
