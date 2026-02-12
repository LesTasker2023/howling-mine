import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { GUIDE_BY_SLUG_QUERY, GUIDE_SLUGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableTextBody } from "@/components/ui/PortableTextBody";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(GUIDE_SLUGS_QUERY);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  let guide;
  try {
    guide = await client.fetch(GUIDE_BY_SLUG_QUERY, { slug });
  } catch {
    notFound();
  }
  if (!guide) notFound();

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/guides" className={styles.back}>
          ← Guides
        </Link>
        <div className={styles.headerRow}>
          {guide.category?.title && (
            <span className={styles.category}>{guide.category.title}</span>
          )}
          {guide.difficulty && (
            <span className={styles.difficulty} data-level={guide.difficulty}>
              {guide.difficulty}
            </span>
          )}
        </div>
        <h1 className={styles.title}>{guide.title}</h1>
        {guide.publishedAt && (
          <time className={styles.date}>
            {new Date(guide.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        )}
      </header>

      {guide.coverImage && (
        <Image
          src={urlFor(guide.coverImage)
            .width(1200)
            .height(630)
            .auto("format")
            .url()}
          alt={guide.title}
          width={1200}
          height={630}
          className={styles.cover}
          priority
        />
      )}

      <div className={styles.body}>
        <PortableTextBody value={guide.body} />
      </div>
    </article>
  );
}
