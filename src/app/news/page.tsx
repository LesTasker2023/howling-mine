import { sanityFetch } from "@/sanity/live";
import { POSTS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  featured?: boolean;
  coverImage?: any;
  author?: { name: string };
  categories?: { title: string; slug: { current: string } }[];
}

export default async function NewsPage() {
  let posts: Post[] = [];
  try {
    const { data } = await sanityFetch({ query: POSTS_QUERY });
    posts = data ?? [];
  } catch {
    /* Sanity not configured yet */
  }

  if (!posts.length) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.title}>News</h1>
        <p className={styles.emptyText}>
          No posts yet. Create one in the studio.
        </p>
        <Link href="/studio" className={styles.studioLink}>
          Open Studio →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>News</h1>
      <div className={styles.grid}>
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/news/${post.slug.current}`}
            className={styles.card}
          >
            {post.coverImage && (
              <Image
                src={urlFor(post.coverImage)
                  .width(600)
                  .height(340)
                  .auto("format")
                  .url()}
                alt={post.title}
                width={600}
                height={340}
                className={styles.cardImage}
              />
            )}
            <div className={styles.cardBody}>
              {post.categories?.length ? (
                <div className={styles.tags}>
                  {post.categories.map((c) => (
                    <span key={c.slug.current} className={styles.tag}>
                      {c.title}
                    </span>
                  ))}
                </div>
              ) : null}
              <h2 className={styles.cardTitle}>{post.title}</h2>
              {post.excerpt && (
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
              )}
              <div className={styles.cardMeta}>
                {post.author?.name && <span>{post.author.name}</span>}
                {post.publishedAt && (
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
