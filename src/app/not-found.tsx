import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.heading}>Signal Lost</h1>
        <p className={styles.message}>
          The coordinates you entered don&apos;t match any known location in the
          sector. The page may have been moved or no longer exists.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Return to Base
          </Link>
          <Link href="/guides" className={styles.secondary}>
            Browse Guides
          </Link>
        </div>
      </div>
    </div>
  );
}
