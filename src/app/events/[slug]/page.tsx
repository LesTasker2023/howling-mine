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

  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

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
        <Link href="/events" className={styles.back}>
          ← Events
        </Link>

        {/* ── Hero with cover image ── */}
        {coverImage && (
          <div className={styles.heroWrap}>
            <Image
              src={urlFor(coverImage)
                .width(1600)
                .height(700)
                .auto("format")
                .url()}
              alt={event.coverImage?.alt ?? event.title}
              width={1600}
              height={700}
              className={styles.heroImage}
              priority
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
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
              {event.excerpt && (
                <p className={styles.excerpt}>{event.excerpt}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Two-column: body + info sidebar ── */}
        <div className={styles.layout}>
          {/* Main body */}
          <div className={styles.main}>
            {event.body && (
              <div className={styles.body}>
                <PortableTextBody value={event.body} />
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <aside className={styles.sidebar}>
            {/* Date & time card */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoLabel}>
                <CalendarDays size={14} />
                Date &amp; Time
              </h3>
              {startDate && (
                <div className={styles.infoValue}>
                  {formatDateRange(event.startDate, event.endDate)}
                </div>
              )}
              {startDate && (
                <div className={styles.infoDetail}>
                  {formatTime(event.startDate)}
                  {endDate && ` — ${formatTime(event.endDate)}`}
                </div>
              )}

              {/* Countdown for upcoming events */}
              {status === "upcoming" && startDate && (
                <div className={styles.countdown}>
                  <CountdownDisplay target={startDate} />
                </div>
              )}
            </div>

            {/* Location card */}
            {event.location && (
              <div className={styles.infoCard}>
                <h3 className={styles.infoLabel}>
                  <MapPin size={14} />
                  Location
                </h3>
                <div className={styles.infoValue}>{event.location}</div>
              </div>
            )}

            {/* Event type */}
            {typeLabel && (
              <div className={styles.infoCard}>
                <h3 className={styles.infoLabel}>Event Type</h3>
                <div className={styles.infoValue}>{typeLabel}</div>
              </div>
            )}

            {/* Status indicator */}
            <div className={styles.statusCard} data-status={status}>
              {status === "live" && "● This event is happening now"}
              {status === "upcoming" && "Upcoming event"}
              {status === "past" && "This event has ended"}
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

/* ── Static countdown (renders server-side snapshot) ── */
function CountdownDisplay({ target }: { target: Date }) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return (
    <div className={styles.countdownGrid}>
      <div className={styles.countdownUnit}>
        <span className={styles.countdownNumber}>{days}</span>
        <span className={styles.countdownLabel}>days</span>
      </div>
      <div className={styles.countdownUnit}>
        <span className={styles.countdownNumber}>{hours}</span>
        <span className={styles.countdownLabel}>hrs</span>
      </div>
      <div className={styles.countdownUnit}>
        <span className={styles.countdownNumber}>{minutes}</span>
        <span className={styles.countdownLabel}>min</span>
      </div>
    </div>
  );
}
