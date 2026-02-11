"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import styles from "./DataTable.module.css";

export interface Column<T> {
  /** Property key on the row object */
  key: string;
  /** Column header label */
  label: string;
  /** Allow sorting on this column (default: true) */
  sortable?: boolean;
  /** Fixed column width (CSS value) */
  width?: string;
  /** Custom cell renderer */
  render?: (row: T) => React.ReactNode;
}

type SortDir = "asc" | "desc";

export interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Row data array */
  data: T[];
  /** Unique key field on each row */
  keyField: keyof T;
  /** Enable column sorting (default: true) */
  sortable?: boolean;
  /** Alternate row striping (default: false) */
  striped?: boolean;
  /** Compact row height (default: false) */
  compact?: boolean;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Message when data is empty (default: "No data available") */
  emptyMessage?: string;
  /** Optional className */
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  sortable = true,
  striped = false,
  compact = false,
  onRowClick,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortCol];
      const bVal = (b as Record<string, unknown>)[sortCol];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir]);

  const wrapperClasses = [
    styles.wrapper,
    compact && styles["wrapper--compact"],
    striped && styles["wrapper--striped"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isSortable = sortable && col.sortable !== false;
                const isActive = sortCol === col.key;

                return (
                  <th
                    key={col.key}
                    className={`${styles.th} ${isSortable ? styles.thSortable : ""} ${isActive ? styles.thActive : ""}`}
                    style={{ width: col.width }}
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className={styles.thContent}>
                      {col.label}
                      {isSortable && (
                        <span className={styles.sortIcon}>
                          {isActive ? (
                            sortDir === "asc" ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <ChevronsUpDown size={12} />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className={styles.empty} colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr
                  key={String(
                    (row as Record<string, unknown>)[keyField as string],
                  )}
                  className={`${styles.row} ${onRowClick ? styles.rowClickable : ""}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      {col.render
                        ? col.render(row)
                        : (((row as Record<string, unknown>)[
                            col.key
                          ] as React.ReactNode) ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
