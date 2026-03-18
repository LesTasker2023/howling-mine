import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { GUIDE_BY_SLUG_QUERY, GUIDE_SLUGS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { getPlaceholderImage } from "@/sanity/getPlaceholderImage";
import { PortableTextBody } from "@/components/ui/PortableTextBody";
import { SplitHero } from "@/components/composed/SplitHero/SplitHero";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const guide = await client.fetch(GUIDE_BY_SLUG_QUERY, { slug });
    if (!guide) return {};
    return {
      title: guide.title,
      description: guide.excerpt ?? undefined,
      openGraph: {
        title: guide.title,
        description: guide.excerpt ?? undefined,
        type: "article",
        ...(guide.coverImage
          ? {
              images: [
                {
                  url: urlFor(guide.coverImage)
                    .width(1200)
                    .height(630)
                    .auto("format")
                    .url(),
                  width: 1200,
                  height: 630,
                },
              ],
            }
          : {}),
      },
    };
  } catch {
    return {};
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

  const coverImage = guide.coverImage ?? (await getPlaceholderImage());
  const coverImageUrl = urlFor(coverImage).width(1920).height(1080).auto("format").url();
  const siteSettings = await client.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 30 } });
  const overlayOpacity = (siteSettings?.siteBgOverlayOpacity ?? 70) / 100;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <img
          src={coverImageUrl}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlayOpacity})` }} />
      </div>
      <article className={styles.article}>
      <SplitHero
        imageSrc={urlFor(coverImage).width(900).height(675).auto("format").url()}
        imageAlt={guide.title}
        topBar={
          <>
            <Link href="/guides" className={styles.back}>← Guides</Link>
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
          </>
        }
        textTop={
          <>
            <h1 className={styles.title}>{guide.title}</h1>
            {guide.excerpt && <p className={styles.excerpt}>{guide.excerpt}</p>}
          </>
        }
        textBottom={
          guide.publishedAt ? (
            <time className={styles.date}>
              {new Date(guide.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : undefined
        }
      />

      <div className={styles.body}>
        <PortableTextBody value={guide.body} />
      </div>
    </article>
    </>
  );
}
