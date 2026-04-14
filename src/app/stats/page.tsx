import type { Metadata } from "next";
import {
  MiningAnalytics,
  type SpaceMiningStats,
} from "@/components/composed/MiningAnalytics";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Mining Analytics — The Howling Mine",
  description:
    "Live space mining analytics dashboard — globals, leaderboards, and performance metrics powered by EntropiaCentral.",
};

async function fetchSpaceMiningStats(): Promise<SpaceMiningStats | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/space-mining-stats`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatsPage() {
  const data = await fetchSpaceMiningStats();

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.emptyTitle}>[ No Data ]</h1>
          <p className={styles.emptyDesc}>
            Unable to reach the mining stats API. Try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <MiningAnalytics initialData={data} />
    </div>
  );
}
