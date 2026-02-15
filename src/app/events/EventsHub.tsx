"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/image";
import { usePlaceholderImage } from "@/context/PlaceholderImageContext";
import { SearchInput, Select, Badge } from "@/components/ui";
import { EventCalendar } from "@/components/ui/EventCalendar";
import { staggerContainer, fadeUp } from "@/lib/motion";
import {
  CalendarDays,
  MapPin,
  Clock,
  Pickaxe,
  Users,
  Swords,
  Crosshair,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";
import styles from "./page.module.css";

/* ── Types ── */
interface GameEvent {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType?: string;
  featured?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
}

type ViewMode = "list" | "calendar";
type TimeFilter = "upcoming" | "past" | "all";

/* ── Helpers ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
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
  const e = end ? new Date(end).getTime() : s + 86400000; // default 1 day
  if (now < s) return "upcoming";
  if (now <= e) return "live";
  return "past";
}

const EVENT_TYPE_META: Record<
  string,
  { label: string; icon: React.ReactNode; variant: string }
> = {
  "mining-run": {
    label: "Mining Run",
    icon: <Pickaxe size={12} />,
    variant: "primary",
  },
  community: {
    label: "Community",
    icon: <Users size={12} />,
    variant: "accent",
  },
  pvp: {
    label: "PvP",
    icon: <Swords size={12} />,
    variant: "danger",
  },
  hunting: {
    label: "Hunting",
    icon: <Crosshair size={12} />,
    variant: "warning",
  },
  trading: {
    label: "Trading",
    icon: <ArrowLeftRight size={12} />,
    variant: "success",
  },
  special: {
    label: "Special",
    icon: <Sparkles size={12} />,
    variant: "accent",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   EventsHub — client-side filterable event listing with calendar view
   ═══════════════════════════════════════════════════════════════════════════ */
export default function EventsHub({ events }: { events: GameEvent[] }) {
  const placeholder = usePlaceholderImage();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /* ── Derive unique event types ── */
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach((e) => {
      if (e.eventType) types.add(e.eventType);
    });
    return Array.from(types).sort();
  }, [events]);

  /* ── Filter & sort ── */
  const filtered = useMemo(() => {
    let result = [...events];

    // Time filter
    if (timeFilter !== "all") {
      result = result.filter((e) => {
        const status = getEventStatus(e.startDate, e.endDate);
        if (timeFilter === "upcoming")
          return status === "upcoming" || status === "live";
        return status === "past";
      });
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.excerpt?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((e) => e.eventType === typeFilter);
    }

    // Calendar date filter
    if (selectedDate && viewMode === "calendar") {
      result = result.filter((e) => {
        const start = new Date(e.startDate);
        const end = e.endDate ? new Date(e.endDate) : undefined;
        const sd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
        const ss = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
        );
        if (!end) return sd.getTime() === ss.getTime();
        const se = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        return sd >= ss && sd <= se;
      });
    }

    // Sort: upcoming first, then by date
    result.sort((a, b) => {
      const aStatus = getEventStatus(a.startDate, a.endDate);
      const bStatus = getEventStatus(b.startDate, b.endDate);
      // Live events first
      if (aStatus === "live" && bStatus !== "live") return -1;
      if (bStatus === "live" && aStatus !== "live") return 1;
      // Featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Date
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    return result;
  }, [events, search, typeFilter, timeFilter, selectedDate, viewMode]);

  /* ── Empty CMS state ── */
  if (!events.length) {
    return (
      <div className={styles.empty}>
        <CalendarDays size={48} className={styles.emptyIcon} />
        <h1 className={styles.emptyTitle}>No Events Yet</h1>
        <p className={styles.emptyText}>
          Create your first event in the Sanity Studio.
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
        <h1 className={styles.title}>Events</h1>
        <p className={styles.subtitle}>
          {events.length} event{events.length !== 1 ? "s" : ""} — in-game
          activities and community gatherings
        </p>
      </header>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search events..."
          />
        </div>
        <div className={styles.filters}>
          <Select
            value={timeFilter}
            onChange={(v) => setTimeFilter(v as TimeFilter)}
            options={[
              { label: "Upcoming", value: "upcoming" },
              { label: "Past Events", value: "past" },
              { label: "All Events", value: "all" },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: "All Types", value: "all" },
              ...allTypes.map((t) => ({
                label: EVENT_TYPE_META[t]?.label ?? t,
                value: t,
              })),
            ]}
          />
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
              onClick={() => {
                setViewMode("list");
                setSelectedDate(null);
              }}
              aria-label="List view"
            >
              LIST
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === "calendar" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("calendar")}
              aria-label="Calendar view"
            >
              CAL
            </button>
          </div>
        </div>
      </div>

      {/* ── Active filter chip ── */}
      {(search || typeFilter !== "all" || selectedDate) && (
        <div className={styles.activeFilters}>
          <span className={styles.resultCount}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search && (
              <>
                {" "}
                for &ldquo;<strong>{search}</strong>&rdquo;
              </>
            )}
            {selectedDate && (
              <>
                {" "}
                on{" "}
                <strong>
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </strong>
              </>
            )}
          </span>
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearch("");
              setTypeFilter("all");
              setSelectedDate(null);
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Layout: Calendar sidebar + cards ── */}
      <div
        className={
          viewMode === "calendar" ? styles.calendarLayout : styles.listLayout
        }
      >
        {/* Calendar sidebar */}
        {viewMode === "calendar" && (
          <aside className={styles.calendarSidebar}>
            <EventCalendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={(d) =>
                setSelectedDate((prev) =>
                  prev &&
                  prev.getFullYear() === d.getFullYear() &&
                  prev.getMonth() === d.getMonth() &&
                  prev.getDate() === d.getDate()
                    ? null
                    : d,
                )
              }
            />
          </aside>
        )}

        {/* Event cards */}
        {filtered.length > 0 ? (
          <motion.div
            className={styles.grid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {filtered.map((event) => {
              const status = getEventStatus(event.startDate, event.endDate);
              const meta = event.eventType
                ? EVENT_TYPE_META[event.eventType]
                : null;

              return (
                <motion.div key={event._id} variants={fadeUp}>
                  <Link
                    href={`/events/${event.slug.current}`}
                    className={`${styles.card} ${status === "live" ? styles.cardLive : ""} ${status === "past" ? styles.cardPast : ""}`}
                  >
                    {/* Image */}
                    {event.coverImage ? (
                      <div className={styles.cardImageWrap}>
                        <Image
                          src={urlFor(event.coverImage)
                            .width(600)
                            .height(340)
                            .auto("format")
                            .url()}
                          alt={event.title}
                          width={600}
                          height={340}
                          className={styles.cardImage}
                        />
                        {status === "live" && (
                          <span className={styles.liveBadge}>
                            <span className={styles.liveDot} /> LIVE
                          </span>
                        )}
                      </div>
                    ) : placeholder?.asset ? (
                      <div className={styles.cardImageWrap}>
                        <Image
                          src={urlFor(placeholder)
                            .width(600)
                            .height(340)
                            .auto("format")
                            .url()}
                          alt={event.title}
                          width={600}
                          height={340}
                          className={styles.cardImage}
                        />
                        {status === "live" && (
                          <span className={styles.liveBadge}>
                            <span className={styles.liveDot} /> LIVE
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className={styles.cardImagePlaceholder}>
                        <CalendarDays size={28} />
                        {status === "live" && (
                          <span className={styles.liveBadge}>
                            <span className={styles.liveDot} /> LIVE
                          </span>
                        )}
                      </div>
                    )}

                    {/* Body */}
                    <div className={styles.cardBody}>
                      {/* Tags */}
                      <div className={styles.tags}>
                        {meta && (
                          <Badge
                            variant={
                              meta.variant as
                                | "primary"
                                | "accent"
                                | "danger"
                                | "warning"
                                | "success"
                                | "default"
                            }
                          >
                            {meta.icon} {meta.label}
                          </Badge>
                        )}
                        {event.featured && (
                          <Badge variant="accent" glow>
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className={styles.cardTitle}>{event.title}</h2>

                      {/* Excerpt */}
                      {event.excerpt && (
                        <p className={styles.cardExcerpt}>{event.excerpt}</p>
                      )}

                      {/* Meta row */}
                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <Clock size={12} />
                          <span>
                            {formatDateRange(event.startDate, event.endDate)}
                          </span>
                        </div>
                        {event.startDate && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaTime}>
                              {formatTime(event.startDate)}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className={styles.metaItem}>
                            <MapPin size={12} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className={styles.noResults}>
            <CalendarDays size={36} className={styles.emptyIcon} />
            <p>No events match your filters.</p>
            <button
              className={styles.clearBtn}
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setSelectedDate(null);
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
