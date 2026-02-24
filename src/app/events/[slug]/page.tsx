import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { EVENT_BY_SLUG_QUERY, EVENT_SLUGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { getPlaceholderImage } from "@/sanity/getPlaceholderImage";
import { PortableTextBody } from "@/components/ui/PortableTextBody";
import { JsonLd, eventSchema } from "@/lib/jsonLd";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import styles from "./page.module.css";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

/* ── Static params ── */
export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(EVENT_SLUGS_QUERY);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

/* ── Metadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await client.fetch(EVENT_BY_SLUG_QUERY, { slug });
    if (!event) return {};
    return {
      title: `${event.title} — Events — The Howling Mine`,
      description: event.excerpt ?? undefined,
      openGraph: {
        title: event.title,
        description: event.excerpt ?? undefined,
        type: "article",
        ...(event.coverImage
          ? {
              images: [
                {
                  url: urlFor(event.coverImage)
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

/* ── Helpers ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function formatDateRange(start: string, end?: string) {
  const s = formatDate(start);
  if (!end) return s;
  const e = formatDate(end);
  return s === e ? s : `${s} — ${e}`;
}

function getEventStatus(
  start: string,
  end?: string,
): "upcoming" | "live" | "past" {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : s + 86400000;
  if (now < s) return "upcoming";
  if (now <= e) return "live";
  return "past";
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  "mining-run": "Mining Run",
  community: "Community",
  pvp: "PvP",
  hunting: "Hunting",
  trading: "Trading",
  special: "Special",
};

/* ── Page ── */
export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  let event;
  try {
    event = await client.fetch(EVENT_BY_SLUG_QUERY, { slug });
  } catch {
    notFound();
  }
  if (!event) notFound();

  const coverImage = event.coverImage ?? (await getPlaceholderImage());
  const status = getEventStatus(event.startDate, event.endDate);
  const typeLabel = event.eventType
    ? (EVENT_TYPE_LABELS[event.eventType] ?? event.eventType)
    : null;

  return (
    <>
      <JsonLd
        data={eventSchema({
          name: event.title,
          description: event.excerpt ?? undefined,
          url: `https://thehowlingmine.com/events/${slug}`,
          startDate: event.startDate,
          endDate: event.endDate ?? undefined,
          location: event.location ?? undefined,
          image: event.coverImage
            ? urlFor(event.coverImage)
                .width(1200)
                .height(630)
                .auto("format")
                .url()
            : undefined,
        })}
      />
      <article className={styles.article}>
        <header className={styles.header}>
          <Link href="/events" className={styles.back}>
            ← Events
          </Link>

          {/* Badges row */}
          <div className={styles.badges}>
            {status === "live" && (
              <span className={`${styles.badge} ${styles.badgeLive}`}>
                ● LIVE NOW
              </span>
            )}
            {typeLabel && <span className={styles.badge}>{typeLabel}</span>}
            {event.featured && <span className={styles.badge}>Featured</span>}
          </div>

          <h1 className={styles.title}>{event.title}</h1>

          {/* Meta row */}
          <div className={styles.meta}>
            {event.startDate && (
              <span className={styles.metaItem}>
                <CalendarDays size={12} />
                {formatDateRange(event.startDate, event.endDate)}
              </span>
            )}
            {event.startDate && (
              <span className={styles.metaItem}>
                {formatTime(event.startDate)}
              </span>
            )}
            {event.location && (
              <span className={styles.metaItem}>
                <MapPin size={12} />
                {event.location}
              </span>
            )}
          </div>
        </header>

        {coverImage && (
          <Image
            src={urlFor(coverImage)
              .width(1200)
              .height(630)
              .auto("format")
              .url()}
            alt={event.coverImage?.alt ?? event.title}
            width={1200}
            height={630}
            className={styles.cover}
            priority
          />
        )}

        {event.body && (
          <div className={styles.body}>
            <PortableTextBody value={event.body} />
          </div>
        )}
      </article>
    </>
  );
}
