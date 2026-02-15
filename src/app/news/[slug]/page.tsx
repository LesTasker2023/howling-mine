import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { getPlaceholderImage } from "@/sanity/getPlaceholderImage";
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

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/news" className={styles.back}>
          ← News
        </Link>
        {post.categories?.length ? (
          <div className={styles.tags}>
            {post.categories.map((c: any) => (
              <span key={c.slug.current} className={styles.tag}>
                {c.title}
              </span>
            ))}
          </div>
        ) : null}
        <h1 className={styles.title}>{post.title}</h1>
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
      </header>

      {coverImage && (
        <Image
          src={urlFor(coverImage).width(1200).height(630).auto("format").url()}
          alt={post.title}
          width={1200}
          height={630}
          className={styles.cover}
          priority
        />
      )}

      <div className={styles.body}>
        <PortableTextBody value={post.body} />
      </div>
    </article>
  );
}
