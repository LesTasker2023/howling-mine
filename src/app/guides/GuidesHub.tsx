"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/image";
import { usePlaceholderImage } from "@/context/PlaceholderImageContext";
import { SearchInput, Select, Badge } from "@/components/ui";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { BadgeVariant } from "@/components/ui/Badge/Badge";
import { BookOpen } from "lucide-react";
import styles from "./page.module.css";

/* ── Types ── */
interface Guide {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  difficulty?: string;
  order?: number;
  publishedAt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
  category?: { title: string; slug: { current: string } };
}

type SortOption = "default" | "newest" | "oldest" | "az" | "za";

/* ── Difficulty display ── */
const DIFF_META: Record<string, { label: string; variant: string }> = {
  beginner: { label: "Beginner", variant: "success" },
  intermediate: { label: "Intermediate", variant: "warning" },
  advanced: { label: "Advanced", variant: "danger" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   GuidesHub — client-side filterable / sortable guide listing
   ═══════════════════════════════════════════════════════════════════════════ */
export default function GuidesHub({ guides }: { guides: Guide[] }) {
  const placeholder = usePlaceholderImage();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");

  /* ── Derive unique categories ── */
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    guides.forEach((g) => {
      if (g.category?.title) cats.add(g.category.title);
    });
    return Array.from(cats).sort();
  }, [guides]);

  /* ── Filter & sort ── */
  const filtered = useMemo(() => {
    let result = [...guides];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.excerpt?.toLowerCase().includes(q) ||
          g.category?.title.toLowerCase().includes(q) ||
          g.difficulty?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((g) => g.category?.title === categoryFilter);
    }

    if (difficultyFilter !== "all") {
      result = result.filter((g) => g.difficulty === difficultyFilter);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "newest": {
          const dA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dB - dA;
        }
        case "oldest": {
          const dA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dA - dB;
        }
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        default:
          return (a.order ?? 0) - (b.order ?? 0);
      }
    });

    return result;
  }, [guides, search, categoryFilter, difficultyFilter, sort]);

  /* ── Empty CMS state ── */
  if (!guides.length) {
    return (
      <div className={styles.empty}>
        <BookOpen size={48} className={styles.emptyIcon} />
        <h1 className={styles.emptyTitle}>No Guides Yet</h1>
        <p className={styles.emptyText}>
          Create your first guide in the Sanity Studio.
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
        <h1 className={styles.title}>Guides</h1>
        <p className={styles.subtitle}>
          {guides.length} guide{guides.length !== 1 ? "s" : ""} — tutorials,
          walkthroughs, and tips
        </p>
      </header>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search guides..."
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
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            options={[
              { label: "All Levels", value: "all" },
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ]}
          />
          <Select
            value={sort}
            onChange={(v) => setSort(v as SortOption)}
            options={[
              { label: "Default Order", value: "default" },
              { label: "Newest First", value: "newest" },
              { label: "Oldest First", value: "oldest" },
              { label: "A → Z", value: "az" },
              { label: "Z → A", value: "za" },
            ]}
          />
        </div>
      </div>

      {/* ── Active filter chip ── */}
      {(search || categoryFilter !== "all" || difficultyFilter !== "all") && (
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
              setDifficultyFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Guide Grid ── */}
      {filtered.length > 0 ? (
        <motion.div
          key={`${categoryFilter}-${difficultyFilter}-${sort}-${search}`}
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {filtered.map((guide) => (
            <motion.div key={guide._id} variants={fadeUp}>
              <Link
                href={`/guides/${guide.slug.current}`}
                className={styles.card}
              >
                {guide.coverImage ? (
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={urlFor(guide.coverImage)
                        .width(600)
                        .height(340)
                        .auto("format")
                        .url()}
                      alt={guide.title}
                      width={600}
                      height={340}
                      className={styles.cardImage}
                    />
                  </div>
                ) : placeholder?.asset ? (
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={urlFor(placeholder)
                        .width(600)
                        .height(340)
                        .auto("format")
                        .url()}
                      alt={guide.title}
                      width={600}
                      height={340}
                      className={styles.cardImage}
                    />
                  </div>
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <BookOpen size={28} />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <div className={styles.cardBadges}>
                    {guide.difficulty && (
                      <Badge
                        variant={
                          (DIFF_META[guide.difficulty]?.variant ??
                            "default") as BadgeVariant
                        }
                        dot
                      >
                        {DIFF_META[guide.difficulty]?.label ?? guide.difficulty}
                      </Badge>
                    )}
                    {guide.category && (
                      <Badge variant="default">{guide.category.title}</Badge>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{guide.title}</h3>
                  {guide.excerpt && (
                    <p className={styles.cardExcerpt}>{guide.excerpt}</p>
                  )}
                  <span className={styles.readMore}>Read guide →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className={styles.noResults}>
          <BookOpen size={36} className={styles.emptyIcon} />
          <p>No guides match your filters.</p>
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setDifficultyFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
