import { sanityFetch } from "@/sanity/live";
import { GUIDES_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

interface Guide {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  difficulty?: string;
  coverImage?: any;
  category?: { title: string; slug: { current: string } };
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

export default async function GuidesPage() {
  let guides: Guide[] = [];
  try {
    const { data } = await sanityFetch({ query: GUIDES_QUERY });
    guides = data ?? [];
  } catch {
    /* Sanity not configured yet */
  }

  if (!guides.length) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.title}>Guides</h1>
        <p className={styles.emptyText}>
          No guides yet. Create one in the studio.
        </p>
        <Link href="/studio" className={styles.studioLink}>
          Open Studio →
        </Link>
      </div>
    );
  }

  // Group by category
  const grouped = new Map<string, Guide[]>();
  for (const g of guides) {
    const cat = g.category?.title ?? "General";
    const arr = grouped.get(cat) ?? [];
    arr.push(g);
    grouped.set(cat, arr);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Guides</h1>

      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.sectionTitle}>{category}</h2>
          <div className={styles.grid}>
            {items.map((guide) => (
              <Link
                key={guide._id}
                href={`/guides/${guide.slug.current}`}
                className={styles.card}
              >
                {guide.coverImage && (
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
                )}
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    {guide.difficulty && (
                      <span
                        className={styles.difficulty}
                        data-level={
                          DIFFICULTY_COLOR[guide.difficulty] ?? "default"
                        }
                      >
                        {guide.difficulty}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{guide.title}</h3>
                  {guide.excerpt && (
                    <p className={styles.cardExcerpt}>{guide.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
