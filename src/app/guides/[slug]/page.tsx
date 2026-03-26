import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { GUIDE_BY_SLUG_QUERY, GUIDE_SLUGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { getPlaceholderImage } from "@/sanity/getPlaceholderImage";
import { PortableTextBody } from "@/components/ui/PortableTextBody";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, BarChart3 } from "lucide-react";
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
      title: `${guide.title} — Guides — The Howling Mine`,
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

/* ── Portable Text types for heading extraction ── */
interface BodyBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: { text?: string }[];
}

/* ── Extract h2/h3 headings from body for TOC ── */
function extractHeadings(
  body: BodyBlock[],
): { text: string; key: string; level: number }[] {
  if (!body) return [];
  return body
    .filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3"))
    .map((b) => ({
      text: b.children?.map((c) => c.text ?? "").join("") ?? "",
      key: b._key ?? "",
      level: b.style === "h2" ? 2 : 3,
    }));
}

/* ── Reading time estimate ── */
function estimateReadingTime(body: unknown[]): number {
  if (!body) return 1;
  let words = 0;
  for (const b of body) {
    const block = b as { children?: { text?: string }[] };
    if (block.children) {
      for (const child of block.children) {
        words += (child.text ?? "").split(/\s+/).length;
      }
    }
  }
  return Math.max(1, Math.round(words / 230));
}

/* ── Difficulty config ── */
const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/* ── Page ── */
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
  const headings = guide.body ? extractHeadings(guide.body) : [];
  const readingTime = guide.body ? estimateReadingTime(guide.body) : 1;
  const difficultyIndex = DIFFICULTY_LEVELS.indexOf(
    guide.difficulty as (typeof DIFFICULTY_LEVELS)[number],
  );

  return (
    <article className={styles.article}>
      <Link href="/guides" className={styles.back}>
        ← Guides
      </Link>

      {/* ── Header ── */}
      <header className={styles.header}>
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
        {guide.excerpt && <p className={styles.excerpt}>{guide.excerpt}</p>}
        <div className={styles.metaRow}>
          {guide.publishedAt && (
            <span className={styles.metaItem}>
              <Clock size={12} />
              {new Date(guide.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          <span className={styles.metaItem}>
            <BookOpen size={12} />
            {readingTime} min read
          </span>
          {guide.difficulty && (
            <span className={styles.metaItem}>
              <BarChart3 size={12} />
              {DIFFICULTY_LABELS[guide.difficulty] ?? guide.difficulty}
            </span>
          )}
        </div>
      </header>

      {/* ── Cover image ── */}
      {coverImage && (
        <Image
          src={urlFor(coverImage)
            .width(1400)
            .height(580)
            .auto("format")
            .url()}
          alt={guide.coverImage?.alt ?? guide.title}
          width={1400}
          height={580}
          className={styles.cover}
          priority
        />
      )}

      {/* ── Two-column: body + TOC sidebar ── */}
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.tocCard}>
            {/* Difficulty dots */}
            {guide.difficulty && (
              <div className={styles.difficultyBar}>
                <span className={styles.difficultyLabel}>Difficulty</span>
                <div className={styles.difficultyTrack}>
                  {DIFFICULTY_LEVELS.map((level, i) => (
                    <div
                      key={level}
                      className={styles.difficultyDot}
                      data-active={i <= difficultyIndex ? "true" : "false"}
                      data-level={guide.difficulty}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TOC links */}
            {headings.length > 0 && (
              <>
                <h3 className={styles.tocTitle}>Contents</h3>
                <nav className={styles.tocNav}>
                  {headings.map((h) => (
                    <a
                      key={h.key}
                      href={`#${h.key}`}
                      className={
                        h.level === 2 ? styles.tocItem : styles.tocItemSub
                      }
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </>
            )}
          </div>
        </aside>

        {/* Body */}
        <div className={styles.body}>
          {guide.body && <PortableTextBody value={guide.body} />}
        </div>
      </div>
    </article>
  );
}
