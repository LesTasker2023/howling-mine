"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/image";
import { SearchInput, Select, Badge } from "@/components/ui";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { Newspaper, Star } from "lucide-react";
import styles from "./page.module.css";

/* ── Types ── */
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  featured?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author?: { name: string; avatar?: any };
  categories?: { title: string; slug: { current: string } }[];
}

type SortOption = "newest" | "oldest" | "featured";

/* ── Helpers ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   NewsHub — client-side filterable / sortable news listing
   ═══════════════════════════════════════════════════════════════════════════ */
export default function NewsHub({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  /* ── Derive unique categories ── */
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => p.categories?.forEach((c) => cats.add(c.title)));
    return Array.from(cats).sort();
  }, [posts]);

  /* ── Filter & sort ── */
  const filtered = useMemo(() => {
    let result = [...posts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.author?.name.toLowerCase().includes(q) ||
          p.categories?.some((c) => c.title.toLowerCase().includes(q)),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) =>
        p.categories?.some((c) => c.title === categoryFilter),
      );
    }

    result.sort((a, b) => {
      if (sort === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      const dA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return sort === "oldest" ? dA - dB : dB - dA;
    });

    return result;
  }, [posts, search, categoryFilter, sort]);

  /* ── Featured post (only on default view) ── */
  const featuredPost =
    !search && categoryFilter === "all" && sort === "newest"
      ? filtered.find((p) => p.featured)
      : null;

  const regularPosts = featuredPost
    ? filtered.filter((p) => p._id !== featuredPost._id)
    : filtered;

  /* ── Empty CMS state ── */
  if (!posts.length) {
    return (
      <div className={styles.empty}>
        <Newspaper size={48} className={styles.emptyIcon} />
        <h1 className={styles.emptyTitle}>No Posts Yet</h1>
        <p className={styles.emptyText}>
          Create your first news post in the Sanity Studio.
        </p>
        <Link href="/studio" className={styles.studioLink}>
          Open Studio →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <header className={styles.header}>
        <h1 className={styles.title}>News</h1>
        <p className={styles.subtitle}>
          {posts.length} post{posts.length !== 1 ? "s" : ""} — latest updates
          and announcements
        </p>
      </header>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search posts..."
          />
        </div>
        <div className={styles.filters}>
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: "All Categories", value: "all" },
              ...allCategories.map((c) => ({ label: c, value: c })),
            ]}
          />
          <Select
            value={sort}
            onChange={(v) => setSort(v as SortOption)}
            options={[
              { label: "Newest First", value: "newest" },
              { label: "Oldest First", value: "oldest" },
              { label: "Featured First", value: "featured" },
            ]}
          />
        </div>
      </div>

      {/* ── Active filter chip ── */}
      {(search || categoryFilter !== "all") && (
        <div className={styles.activeFilters}>
          <span className={styles.resultCount}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search && (
              <>
                {" "}
                for &ldquo;<strong>{search}</strong>&rdquo;
              </>
            )}
          </span>
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Featured Hero Card ── */}
      {featuredPost && (
        <Link
          href={`/news/${featuredPost.slug.current}`}
          className={styles.featuredCard}
        >
          {featuredPost.coverImage && (
            <div className={styles.featuredImageWrap}>
              <Image
                src={urlFor(featuredPost.coverImage)
                  .width(1200)
                  .height(500)
                  .auto("format")
                  .url()}
                alt={featuredPost.title}
                width={1200}
                height={500}
                className={styles.featuredImg}
              />
              <div className={styles.featuredOverlay} />
            </div>
          )}
          <div className={styles.featuredBody}>
            <div className={styles.featuredMeta}>
              <Badge variant="accent" glow>
                Featured
              </Badge>
              {featuredPost.categories?.map((c) => (
                <Badge key={c.slug.current} variant="default">
                  {c.title}
                </Badge>
              ))}
            </div>
            <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
            {featuredPost.excerpt && (
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
            )}
            <div className={styles.featuredFooter}>
              {featuredPost.author?.name && (
                <span className={styles.authorName}>
                  {featuredPost.author.name}
                </span>
              )}
              {featuredPost.publishedAt && (
                <time className={styles.date}>
                  {formatDate(featuredPost.publishedAt)}
                </time>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* ── Post Grid ── */}
      {regularPosts.length > 0 ? (
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {regularPosts.map((post) => (
            <motion.div key={post._id} variants={fadeUp}>
              <Link href={`/news/${post.slug.current}`} className={styles.card}>
                {post.coverImage ? (
                  <div className={styles.cardImageWrap}>
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
                    {post.featured && (
                      <span className={styles.starBadge}>
                        <Star size={12} />
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <Newspaper size={28} />
                  </div>
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
                    {post.author?.name && (
                      <span className={styles.authorName}>
                        {post.author.name}
                      </span>
                    )}
                    {post.publishedAt && (
                      <time className={styles.date}>
                        {formatDate(post.publishedAt)}
                      </time>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className={styles.noResults}>
          <Newspaper size={36} className={styles.emptyIcon} />
          <p>No posts match your filters.</p>
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
