import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  /** Display text */
  label: string;
  /** Navigation URL — omit for current page */
  href?: string;
}

export interface BreadcrumbProps {
  /** Breadcrumb segments — last item renders as current page */
  items: BreadcrumbItem[];
  /** Separator character (default "›") */
  separator?: string;
  /** Optional className */
  className?: string;
}

export function Breadcrumb({
  items,
  separator = "›",
  className = "",
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  const classes = [styles.breadcrumb, className].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className={styles.item}>
              {i > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={`${styles.link} ${isLast ? styles["link--current"] : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
