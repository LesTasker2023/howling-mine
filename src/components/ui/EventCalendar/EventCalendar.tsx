"use client";

import { useMemo, useState } from "react";
import styles from "./EventCalendar.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Types ── */
interface CalendarEvent {
  _id: string;
  title: string;
  slug: { current: string };
  startDate: string;
  endDate?: string;
  eventType?: string;
  featured?: boolean;
}

interface EventCalendarProps {
  events: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date | null;
}

/* ── Helpers ── */
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWithinRange(date: Date, start: Date, end?: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  if (!end) return d.getTime() === s.getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return d >= s && d <= e;
}

/* ═══════════════════════════════════════════════════════════════════════════
   EventCalendar — Sci-fi / HUD-style month calendar
   ═══════════════════════════════════════════════════════════════════════════ */
export function EventCalendar({
  events,
  onSelectDate,
  selectedDate,
}: EventCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  /* Build the 6-week grid */
  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    // Monday-based: 0=Mon … 6=Sun
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];

    // Leading blanks
    for (let i = 0; i < startOffset; i++) cells.push(null);
    // Days
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    // Trailing blanks to fill last row
    while (cells.length % 7 !== 0) cells.push(null);

    // Chunk into weeks
    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [year, month]);

  /* Map dates → event counts */
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((ev) => {
      const start = new Date(ev.startDate);
      const end = ev.endDate ? new Date(ev.endDate) : undefined;

      // For each day in the visible month, check if this event overlaps
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        if (isWithinRange(date, start, end)) {
          const key = date.toISOString().slice(0, 10);
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(ev);
        }
      }
    });
    return map;
  }, [events, year, month]);

  return (
    <div className={styles.calendar}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.navBtn}
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className={styles.monthLabel}>
          <span className={styles.monthName}>{MONTH_NAMES[month]}</span>
          <span className={styles.yearLabel}>{year}</span>
        </div>
        <button
          className={styles.navBtn}
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Scan line decoration */}
      <div className={styles.scanLine} aria-hidden />

      {/* Day headers */}
      <div className={styles.dayHeaders}>
        {DAY_LABELS.map((d) => (
          <div key={d} className={styles.dayHeader}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {weeks.map((week, wi) =>
          week.map((date, di) => {
            if (!date) {
              return <div key={`${wi}-${di}`} className={styles.cellEmpty} />;
            }

            const key = date.toISOString().slice(0, 10);
            const dayEvents = eventsByDate.get(key) || [];
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate
              ? isSameDay(date, selectedDate)
              : false;
            const hasEvents = dayEvents.length > 0;
            const hasFeatured = dayEvents.some((e) => e.featured);

            return (
              <button
                key={key}
                className={[
                  styles.cell,
                  isToday ? styles.cellToday : "",
                  isSelected ? styles.cellSelected : "",
                  hasEvents ? styles.cellHasEvent : "",
                  hasFeatured ? styles.cellFeatured : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelectDate?.(date)}
                aria-label={`${date.getDate()} ${MONTH_NAMES[month]} ${year}${hasEvents ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}`}
              >
                <span className={styles.cellDay}>{date.getDate()}</span>
                {hasEvents && (
                  <span className={styles.cellDots}>
                    {dayEvents.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className={[
                          styles.dot,
                          ev.featured ? styles.dotFeatured : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>

      {/* Footer status */}
      <div className={styles.footer}>
        <span className={styles.footerDot} />
        <span>
          {
            events.filter(
              (e) =>
                new Date(e.startDate).getMonth() === month &&
                new Date(e.startDate).getFullYear() === year,
            ).length
          }{" "}
          EVENT
          {events.filter(
            (e) =>
              new Date(e.startDate).getMonth() === month &&
              new Date(e.startDate).getFullYear() === year,
          ).length !== 1
            ? "S"
            : ""}{" "}
          THIS MONTH
        </span>
      </div>
    </div>
  );
}
