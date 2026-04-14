/* ═══════════════════════════════════════════════════════════════════════════
   /api/space-mining-stats
   Combines EntropiaCentral endpoints into a rich space-mining payload:
     - /stats/last24h         → aggregate 24h stats + trends
     - /leaderboard/space-mining → top miners
     - /globals (paginated)   → per-asteroid-type breakdown for last 24h
   ═══════════════════════════════════════════════════════════════════════════ */

import { NextResponse } from "next/server";

const EC = "https://api.entropiacentral.com";
const CACHE_MAX_AGE = 300;
const CACHE_SWR = 600;
const PAGE_SIZE = 30;
const MAX_PAGES = 10; // safety cap

/* ── Public types ── */

export interface GlobalEntry {
  avatarName: string;
  globalValue: number;
  depositName: string;
  dateTime: string;
  isHof: boolean;
  isAth: boolean;
}

export interface AsteroidTypeStats {
  type: string; // "C" | "F" | "S" | "M" | "ND"
  count: number;
  totalValue: number;
  avgValue: number;
  hofCount: number;
  recentGlobals: GlobalEntry[];
}

export interface SpaceMinerEntry {
  rank: number;
  rankChange: number;
  avatarName: string;
  globalsCount: number;
  globalsValue: number;
  points: number;
}

export interface SpaceMiningStats {
  /* 24h aggregates */
  count: number;
  totalValue: number;
  averageValue: number;
  globalsPerHour: number;
  pedPerHour: number;

  /* vs previous 24h */
  previousCount: number;
  previousValue: number;
  countChangePercent: number;
  valueChangePercent: number;
  countTrend: "up" | "down" | "neutral";
  valueTrend: "up" | "down" | "neutral";
  countChangeFormatted: string;
  valueChangeFormatted: string;

  /* derived */
  activeMinerCount: number;
  avgValuePerMiner: number;
  favoriteItem: string;

  /* per-type breakdown */
  asteroidTypes: AsteroidTypeStats[];

  /* leaderboard */
  topMiners: SpaceMinerEntry[];
}

/* ── Helpers ── */

function extractType(depositName: string): string {
  const m = depositName.match(/^([A-Z]+)-type/i);
  return m ? m[1].toUpperCase() : "OTHER";
}

/** Fetch all space mining globals from last 24h by paginating until cutoff */
async function fetchLast24hGlobals(): Promise<GlobalEntry[]> {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const all: GlobalEntry[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `${EC}/globals?pageNumber=${page}&pageSize=${PAGE_SIZE}&sortBy=dateTime&sortOrder=desc&type=Space%20Mining`,
      { next: { revalidate: CACHE_MAX_AGE } },
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

    const withinWindow = items.filter(
      (i) => new Date(i.dateTime).getTime() > cutoff,
    );
    all.push(...withinWindow);

    if (withinWindow.length < items.length) break; // hit cutoff
  }

  return all;
}

/** Group globals by asteroid type and compute per-type stats */
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

/* ── Route handler ── */

export async function GET() {
  try {
    const [statsRes, lbRes, globals] = await Promise.all([
      fetch(`${EC}/stats/last24h`, { next: { revalidate: CACHE_MAX_AGE } }),
      fetch(`${EC}/leaderboard/space-mining`, { next: { revalidate: CACHE_MAX_AGE } }),
      fetchLast24hGlobals(),
    ]);

    if (!statsRes.ok) {
      return NextResponse.json(
        { error: `Stats upstream returned ${statsRes.status}` },
        { status: statsRes.status },
      );
    }

    const [statsJson, lbJson] = await Promise.all([
      statsRes.json(),
      lbRes.ok ? lbRes.json() : Promise.resolve({ entries: [], totalEntries: 0 }),
    ]);

    const sm = statsJson.spaceMining;
    if (!sm) {
      return NextResponse.json(
        { error: "spaceMining section missing from upstream" },
        { status: 502 },
      );
    }

    const topMiners: SpaceMinerEntry[] = (lbJson.entries ?? [])
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
    const asteroidTypes = buildTypeStats(globals);

    const stats: SpaceMiningStats = {
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
      asteroidTypes,
      topMiners,
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_SWR}`,
      },
    });
  } catch (err) {
    console.error("[space-mining-stats]", err);
    return NextResponse.json(
      { error: "Failed to fetch space mining stats" },
      { status: 502 },
    );
  }
}
