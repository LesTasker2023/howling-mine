import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { getPlaceholderImage } from "@/sanity/getPlaceholderImage";
import { PortableTextBody } from "@/components/ui/PortableTextBody";
import { SplitHero } from "@/components/composed/SplitHero/SplitHero";
import { JsonLd, articleSchema } from "@/lib/jsonLd";
import Link from "next/link";
import styles from "./page.module.css";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(POST_SLUGS_QUERY);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
    if (!post) return {};
    return {
      title: post.title,
      description: post.excerpt ?? undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt ?? undefined,
        type: "article",
        ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
        ...(post.coverImage
          ? {
              images: [
                {
                  url: urlFor(post.coverImage)
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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
  } catch {
    notFound();
  }
  if (!post) notFound();

  const coverImage = post.coverImage ?? (await getPlaceholderImage());
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
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt ?? undefined,
          url: `https://thehowlingmine.com/news/${slug}`,
          image: post.coverImage
            ? urlFor(post.coverImage)
                .width(1200)
                .height(630)
                .auto("format")
                .url()
            : undefined,
          datePublished: post.publishedAt ?? undefined,
          authorName: post.author?.name ?? undefined,
        })}
      />
      <article className={styles.article}>
        <SplitHero
          imageSrc={urlFor(coverImage).width(900).height(675).auto("format").url()}
          imageAlt={post.title}
          topBar={
            <>
              <Link href="/news" className={styles.back}>← News</Link>
              {post.categories?.length ? (
                <div className={styles.tags}>
                  {post.categories.map((c: any) => (
                    <span key={c.slug.current} className={styles.tag}>{c.title}</span>
                  ))}
                </div>
              ) : null}
            </>
          }
          textTop={
            <>
              <h1 className={styles.title}>{post.title}</h1>
              {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
            </>
          }
          textBottom={
            <div className={styles.meta}>
              {post.author?.name && <span>{post.author.name}</span>}
              {post.publishedAt && (
                <time>
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>
          }
        />

        <div className={styles.body}>
          <PortableTextBody value={post.body} />
        </div>
      </article>
    </>
  );
}
