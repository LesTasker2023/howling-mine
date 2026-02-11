"use client";

import { useMemo } from "react";
import styles from "./Pagination.module.css";

export type PaginationSize = "sm" | "md";

export interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Max page buttons visible (default 7) */
  maxVisible?: number;
  /** Size variant (default: "md") */
  size?: PaginationSize;
  /** Optional className */
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  maxVisible = 7,
  size = "md",
  className = "",
}: PaginationProps) {
  const pages = useMemo(() => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(2, page - half + 1);
    let end = Math.min(totalPages - 1, page + half - 1);

    // Adjust if near edges
    if (page <= half) {
      end = maxVisible - 1;
    } else if (page >= totalPages - half) {
      start = totalPages - maxVisible + 2;
    }

    const result: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

    if (start > 2) result.push("ellipsis-start");
    for (let i = start; i <= end; i++) result.push(i);
    if (end < totalPages - 1) result.push("ellipsis-end");

    result.push(totalPages);
    return result;
  }, [page, totalPages, maxVisible]);

  if (totalPages <= 1) return null;

  const classes = [
    styles.pagination,
    size === "sm" && styles["pagination--sm"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={classes} aria-label="Pagination">
      <button
        className={`${styles.btn} ${styles["btn--arrow"]}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((p) => {
        if (typeof p === "string") {
          return (
            <span key={p} className={styles.ellipsis}>
              …
            </span>
          );
        }
        return (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles["btn--active"] : ""}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        className={`${styles.btn} ${styles["btn--arrow"]}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
