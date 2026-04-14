import type { Metadata } from "next";
import {
  MiningAnalytics,
  type SpaceMiningStats,
  type AsteroidTypeStats,
  type GlobalEntry,
} from "@/components/composed/MiningAnalytics";
import styles from "./page.module.css";

const EC = "https://api.entropiacentral.com";
const PAGE_SIZE = 30;
const MAX_PAGES = 10;

const EC_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

export const metadata: Metadata = {
  title: "Mining Analytics — The Howling Mine",
  description:
    "Live space mining analytics dashboard — globals, leaderboards, and performance metrics powered by EntropiaCentral.",
};

function extractType(depositName: string): string {
  const m = depositName.match(/^([A-Z]+)-type/i);
  return m ? m[1].toUpperCase() : "OTHER";
}

async function fetchLast24hGlobals(): Promise<GlobalEntry[]> {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const all: GlobalEntry[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const res = await fetch(
        `${EC}/globals?pageNumber=${page}&pageSize=${PAGE_SIZE}&sortBy=dateTime&sortOrder=desc&type=Space%20Mining`,
        { headers: EC_HEADERS, next: { revalidate: 300 } },
      );
      if (!res.ok) break;
      const json = await res.json();
      const items: GlobalEntry[] = (json.items ?? []).map((i: Record<string, unknown>) => ({
        avatarName: i.avatarName as string,
        globalValue: i.globalValue as number,
        depositName: i.depositName as string,
        dateTime: i.dateTime as string,
        isHof: i.isHof as boolean,
        isAth: i.isAth as boolean,
      }));
      if (!items.length) break;
      const within = items.filter((i) => new Date(i.dateTime).getTime() > cutoff);
      all.push(...within);
      if (within.length < items.length) break;
    } catch {
      break;
    }
  }

  return all;
}

function buildTypeStats(globals: GlobalEntry[]): AsteroidTypeStats[] {
  const map = new Map<string, AsteroidTypeStats>();
  for (const g of globals) {
    const type = extractType(g.depositName);
    if (!map.has(type)) {
      map.set(type, { type, count: 0, totalValue: 0, avgValue: 0, hofCount: 0, recentGlobals: [] });
    }
    const s = map.get(type)!;
    s.count++;
    s.totalValue += g.globalValue;
    if (g.isHof) s.hofCount++;
    if (s.recentGlobals.length < 10) s.recentGlobals.push(g);
  }
  for (const s of map.values()) {
    s.avgValue = s.count > 0 ? s.totalValue / s.count : 0;
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

async function fetchSpaceMiningStats(): Promise<SpaceMiningStats | null> {
  try {
    const [statsRes, lbRes, globals] = await Promise.all([
      fetch(`${EC}/stats/last24h`, { next: { revalidate: 300 } }),
      fetch(`${EC}/leaderboard/space-mining`, { next: { revalidate: 300 } }),
      fetchLast24hGlobals(),
    ]);

    if (!statsRes.ok) return null;

    const [statsJson, lbJson] = await Promise.all([
      statsRes.json(),
      lbRes.ok ? lbRes.json() : Promise.resolve({ entries: [], totalEntries: 0 }),
    ]);

    const sm = statsJson.spaceMining;
    if (!sm) return null;

    const topMiners = (lbJson.entries ?? [])
      .filter((e: Record<string, number | string>) => (e.spaceMiningGlobalsCount as number) > 0)
      .slice(0, 20)
      .map((e: Record<string, number | string>) => ({
        rank: e.spaceMiningRank as number,
        rankChange: e.spaceMiningRankChange as number,
        avatarName: e.avatarName as string,
        globalsCount: e.spaceMiningGlobalsCount as number,
        globalsValue: e.spaceMiningGlobalsValue as number,
        points: e.spaceMiningPoints as number,
      }));

    const activeMinerCount: number = lbJson.totalEntries ?? 0;

    return {
      count: sm.count,
      totalValue: sm.totalValue,
      averageValue: sm.averageValue,
      globalsPerHour: sm.count / 24,
      pedPerHour: sm.totalValue / 24,
      previousCount: sm.trend?.previousCount ?? 0,
      previousValue: sm.trend?.previousValue ?? 0,
      countChangePercent: sm.trend?.countChangePercent ?? 0,
      valueChangePercent: sm.trend?.valueChangePercent ?? 0,
      countTrend: sm.trend?.countTrend ?? "neutral",
      valueTrend: sm.trend?.valueTrend ?? "neutral",
      countChangeFormatted: sm.countChangeFormatted ?? "0%",
      valueChangeFormatted: sm.valueChangeFormatted ?? "0%",
      activeMinerCount,
      avgValuePerMiner: activeMinerCount > 0 ? sm.totalValue / activeMinerCount : 0,
      favoriteItem: sm.favoriteItem ?? "",
      asteroidTypes: buildTypeStats(globals),
      topMiners,
    };
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
