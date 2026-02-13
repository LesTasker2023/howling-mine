import type { Metadata } from "next";
import {
  MiningAnalytics,
  type SpaceMiningStats,
} from "@/components/composed/MiningAnalytics";
import styles from "./page.module.css";

const DELTA_API = "https://www.thedeltaproject.net";
const DEFAULT_PERIOD = "24h";
const VALID_PERIODS = ["1h", "3h", "6h", "12h", "24h", "7d", "30d"];

export const metadata: Metadata = {
  title: "Mining Analytics — The Howling Mine",
  description:
    "Live space mining analytics dashboard — globals, leaderboards, asteroid breakdowns, and performance metrics powered by The Delta Project.",
};

async function fetchMiningStats(
  period: string,
): Promise<SpaceMiningStats | null> {
  try {
    const res = await fetch(`${DELTA_API}/api/mining-stats/${period}`, {
      next: { revalidate: period === "1h" ? 30 : 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = typeof sp?.period === "string" ? sp.period : DEFAULT_PERIOD;
  const period = VALID_PERIODS.includes(raw) ? raw : DEFAULT_PERIOD;

  const data = await fetchMiningStats(period);

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
      <MiningAnalytics initialData={data} initialPeriod={period} />
    </div>
  );
}
