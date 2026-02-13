/* ═══════════════════════════════════════════════════════════════════════════
   MiningAnalytics — 5-tab analytics dashboard
   Fetches live data from ProjectDelta's space mining stats API.
   Uses: Panel, StatBlock, SectionHeader, Badge, SegmentedBar,
         DataTable, HudBarChart, HudLineChart, HudPieChart, DialGauge
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useState, useMemo, useCallback, useTransition, useEffect } from "react";
import {
  Trophy,
  Gem,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import { useTopBar } from "@/context/TopBarContext";
import {
  Panel,
  StatBlock,
  SectionHeader,
  Badge,
  SegmentedBar,
  DataTable,
  type Column,
} from "@/components/ui";
import {
  HudBarChart,
  HudLineChart,
  HudPieChart,
  DialGauge,
} from "@/components/ui/charts";
import styles from "./MiningAnalytics.module.css";

/* ══════════════════════════════════════════════════════════════════════════
   API TYPES — matches ProjectDelta /api/mining-stats/[period] response
   ══════════════════════════════════════════════════════════════════════════ */

export interface TimeSeriesEntry {
  timestamp: string;
  bucketIndex: number;
  globalCount: number;
  minerCount: number;
  totalPED: number;
  hofCount: number;
}

export interface HeatmapCell {
  hour: number;
  day: number;
  count: number;
  totalPED: number;
}

export interface HourlyEntry {
  hour: number;
  count: number;
  totalPED: number;
  avgPED: number;
}

export interface DayOfWeekEntry {
  day: number;
  dayName: string;
  count: number;
  totalPED: number;
  avgPED: number;
}

export interface ValueBucket {
  label: string;
  count: number;
}

export interface MinerDepositBreakdown {
  depositName: string;
  globalCount: number;
  totalPED: number;
  avgGlobal: number;
  highestGlobal: number;
}

export interface MinerRecentGlobal {
  depositName: string;
  globalValue: number;
  dateTime: string;
  isHof: boolean;
  isAth: boolean;
}

export interface TopMiner {
  avatar: string;
  isTeam: boolean;
  totalPED: number;
  globalCount: number;
  hofCount: number;
  avgGlobal: number;
  highestGlobal: number;
  lowestGlobal: number;
  uniqueDeposits: number;
  depositBreakdown: MinerDepositBreakdown[];
  recentGlobals: MinerRecentGlobal[];
}

export interface AsteroidRecentGlobal {
  avatar: string;
  value: number;
  dateTime: string;
  isHof: boolean;
}

export interface TopAsteroid {
  asteroidName: string;
  depositName: string;
  totalPED: number;
  globalCount: number;
  hofCount: number;
  avgGlobal: number;
  highestGlobal: number;
  lowestGlobal: number;
  uniqueMiners: number;
  recentGlobals: AsteroidRecentGlobal[];
}

export interface RecentGlobal {
  avatar: string;
  depositName: string;
  globalValue: number;
  dateTime: string;
  isHof: boolean;
  isAth: boolean;
}

export interface SpaceMiningStats {
  period: string;
  hours: number;
  stats: {
    totalGlobals: number;
    totalPED: number;
    uniqueMiners: number;
    uniqueAsteroids: number;
    avgGlobal: number;
    highestGlobal: number;
    medianGlobal: number;
    hofCount: number;
    globalsPerHour: number;
    generatedAt: string;
  };
  percentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  topMiners: TopMiner[];
  topAsteroids: TopAsteroid[];
  recentGlobals: RecentGlobal[];
  timeActivity: {
    timeSeriesData: TimeSeriesEntry[];
  };
  heatmap: HeatmapCell[];
  hourlyDistribution: HourlyEntry[];
  dayOfWeekDistribution: DayOfWeekEntry[];
  valueDistribution: ValueBucket[];
  topStreaks: unknown[];
  records: {
    highest: {
      value: number;
      avatar: string;
      dateTime: string;
      asteroid: string;
    };
    totalHoFs: number;
    totalATHs: number;
  };
  metadata: {
    generatedAt: string;
    dataSource: string;
    latestTimestamp: string | null;
  };
}

export interface MiningAnalyticsProps {
  initialData: SpaceMiningStats;
  initialPeriod: string;
}

/* ── Periods ── */

const PERIODS = [
  { key: "1h", label: "1H" },
  { key: "3h", label: "3H" },
  { key: "6h", label: "6H" },
  { key: "12h", label: "12H" },
  { key: "24h", label: "24H" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
];

/* ── Tabs ── */

type Tab = "overview" | "time" | "miners" | "asteroids" | "feed";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "time", label: "Time Analysis" },
  { key: "miners", label: "Miners" },
  { key: "asteroids", label: "Asteroids" },
  { key: "feed", label: "Live Feed" },
];

/* ── Helpers ── */

function ped(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " PED";
}

function pedShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "m";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function periodLabel(period: string): string {
  const map: Record<string, string> = {
    "1h": "Last Hour",
    "3h": "Last 3 Hours",
    "6h": "Last 6 Hours",
    "12h": "Last 12 Hours",
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
  };
  return map[period] ?? period;
}

const RANK_COLORS = ["#eab308", "#94a3b8", "#cd7f32"];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function MiningAnalytics({
  initialData,
  initialPeriod,
}: MiningAnalyticsProps) {
  const { setTabs, activeTab, setActiveTab, setSubTabs, activeSubTab, setActiveSubTab } =
    useTopBar();
  const [data, setData] = useState<SpaceMiningStats>(initialData);
  const [period, setPeriod] = useState(initialPeriod);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  /* Push tabs + period selector into NavShell on mount */
  useEffect(() => {
    setTabs(
      TABS.map((t) => ({ key: t.key, label: t.label })),
    );
    setSubTabs(
      PERIODS.map((p) => ({ key: p.key, label: p.label })),
    );
    // Default active tab
    setActiveTab("overview");
    setActiveSubTab(initialPeriod);

    return () => {
      setTabs([]);
      setSubTabs([]);
    };
  }, [setTabs, setSubTabs, setActiveTab, setActiveSubTab, initialPeriod]);

  /* Map activeSubTab → period fetching */
  useEffect(() => {
    if (!activeSubTab || activeSubTab === period) return;
    setPeriod(activeSubTab);
    setLoading(true);

    startTransition(() => {
      fetch(`/api/mining-stats/${activeSubTab}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json: SpaceMiningStats) => {
          setData(json);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch mining stats:", err);
          setLoading(false);
        });
    });
  }, [activeSubTab, period, startTransition]);

  const tab = (activeTab || "overview") as Tab;
  const isLoading = loading || isPending;

  return (
    <div className={styles.dashboard}>
      {/* ── Content ── */}
      <div
        className={`${styles.content} ${isLoading ? styles.contentLoading : ""}`}
      >
        {tab === "overview" && <OverviewTab data={data} />}
        {tab === "time" && <TimeTab data={data} />}
        {tab === "miners" && <MinersTab data={data} />}
        {tab === "asteroids" && <AsteroidsTab data={data} />}
        {tab === "feed" && <FeedTab data={data} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════════════════════════ */

function OverviewTab({ data }: { data: SpaceMiningStats }) {
  const { stats, records, percentiles, topMiners, topAsteroids } = data;
  const hofRate =
    stats.totalGlobals > 0
      ? (stats.hofCount / stats.totalGlobals) * 100
      : 0;

  return (
    <div className={styles.tabContent}>
      {/* ═══ PANEL 1 — Key Metrics ═══ */}
      <Panel size="md">
        <SectionHeader title="Key Metrics" accent />
        <div className={styles.statRows}>
          <div className={styles.statRow}>
            <StatBlock
              label="Total Globals"
              value={stats.totalGlobals.toLocaleString()}
              sub={`${stats.globalsPerHour.toFixed(1)}/hr`}
            />
            <StatBlock
              label="Total PED"
              value={ped(stats.totalPED)}
              accent
            />
            <StatBlock
              label="Active Miners"
              value={stats.uniqueMiners}
              sub="in sector"
            />
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statRow}>
            <StatBlock
              label="Asteroids Hit"
              value={stats.uniqueAsteroids}
              sub={`${data.topAsteroids.length} types tracked`}
            />
            <StatBlock
              label="Avg Global"
              value={ped(stats.avgGlobal)}
              sub={`highest: ${ped(stats.highestGlobal)}`}
            />
            <StatBlock
              label="Hall of Fames"
              value={stats.hofCount}
              sub={`${hofRate.toFixed(1)}% rate`}
            />
          </div>
        </div>
      </Panel>

      {/* ═══ PANEL 2 — Records & Performance ═══ */}
      <Panel size="md">
        <SectionHeader title="Records & Performance" accent />

        {/* Records row */}
        <div className={styles.recordsInline}>
          {records?.highest && (
            <div className={styles.biggestHit}>
              <Crown size={20} className={styles.recordIcon} />
              <div className={styles.biggestHitInfo}>
                <span className={styles.recordLabel}>BIGGEST HIT</span>
                <span className={styles.recordValue}>
                  {ped(records.highest.value)}
                </span>
                <span className={styles.recordSub}>
                  {records.highest.avatar} — {records.highest.asteroid}
                </span>
              </div>
            </div>
          )}
          <div className={styles.recordStats}>
            <StatBlock
              label="Total HoFs"
              value={records?.totalHoFs ?? stats.hofCount}
              size="sm"
            />
            <StatBlock
              label="ATHs"
              value={records?.totalATHs ?? 0}
              accent={(records?.totalATHs ?? 0) > 0}
              size="sm"
            />
            <StatBlock
              label="Median"
              value={ped(stats.medianGlobal)}
              size="sm"
            />
          </div>
        </div>

        <div className={styles.statDivider} />

        {/* Percentiles + Gauges side by side */}
        <div className={styles.perfRow}>
          {/* Percentiles */}
          {percentiles && (
            <div className={styles.percentiles}>
              <span className={styles.perfLabel}>Percentiles</span>
              <div className={styles.percGrid}>
                <div className={styles.percItem}>
                  <span className={styles.percKey}>P50</span>
                  <span className={styles.percVal}>{pedShort(percentiles.p50)}</span>
                </div>
                <div className={styles.percItem}>
                  <span className={styles.percKey}>P75</span>
                  <span className={styles.percVal}>{pedShort(percentiles.p75)}</span>
                </div>
                <div className={styles.percItem}>
                  <span className={styles.percKey}>P90</span>
                  <span className={styles.percVal}>{pedShort(percentiles.p90)}</span>
                </div>
                <div className={styles.percItem}>
                  <span className={styles.percKey}>P95</span>
                  <span className={styles.percVal}>{pedShort(percentiles.p95)}</span>
                </div>
                <div className={`${styles.percItem} ${styles.percHighlight}`}>
                  <span className={styles.percKey}>P99</span>
                  <span className={styles.percVal}>{pedShort(percentiles.p99)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Gauges */}
            <DialGauge
              value={stats.globalsPerHour}
              max={Math.max(stats.globalsPerHour * 2, 20)}
              label="Globals / Hour"
              displayValue={stats.globalsPerHour.toFixed(1)}
              hint={`${stats.totalGlobals} total`}
              size={100}
            />
            <DialGauge
              value={hofRate}
              max={100}
              label="HoF Rate"
              displayValue={`${hofRate.toFixed(1)}%`}
              hint={`${stats.hofCount} HoFs`}
              size={100}
            />
            <DialGauge
              value={stats.avgGlobal}
              max={Math.max(stats.highestGlobal, stats.avgGlobal * 3)}
              label="Avg Global"
              displayValue={pedShort(stats.avgGlobal)}
              hint={`median: ${pedShort(stats.medianGlobal)}`}
              size={100}
            />
        </div>
      </Panel>

      {/* ═══ PANEL 3 — Activity & Leaderboards ═══ */}
      <Panel size="md">
        <SectionHeader title="Activity & Leaderboards" accent />

        {/* Activity timeline */}
        {data.timeActivity?.timeSeriesData?.length > 0 && (
          <HudLineChart
            data={data.timeActivity.timeSeriesData.map((e) => ({
              name: new Date(e.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              ped: Math.round(e.totalPED),
              globals: e.globalCount,
            }))}
            series={[
              { dataKey: "ped", label: "PED Value", color: "#eab308", yAxisId: "left" },
              { dataKey: "globals", label: "Globals", color: "#22c55e", yAxisId: "right" },
            ]}
            height={240}
          />
        )}

        {/* Leaderboards side by side */}
        <div className={styles.splitRow}>
          {topMiners && topMiners.length > 0 && (
            <div>
              <span className={styles.perfLabel}>Top Miners</span>
              {topMiners.slice(0, 5).map((m, i) => (
                <div key={m.avatar} className={styles.quickListItem}>
                  <span
                    className={styles.rank}
                    style={{ color: RANK_COLORS[i] ?? "#a8a29e" }}
                  >
                    #{i + 1}
                  </span>
                  <span className={styles.quickName}>{m.avatar}</span>
                  <span className={styles.quickValue}>
                    {pedShort(m.totalPED)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {topAsteroids && topAsteroids.length > 0 && (
            <div>
              <span className={styles.perfLabel}>Top Asteroids</span>
              {topAsteroids.slice(0, 5).map((a, i) => (
                <div key={a.asteroidName} className={styles.quickListItem}>
                  <span
                    className={styles.rank}
                    style={{ color: RANK_COLORS[i] ?? "#a8a29e" }}
                  >
                    #{i + 1}
                  </span>
                  <span className={styles.quickName}>{a.asteroidName}</span>
                  <span className={styles.quickValue}>
                    {pedShort(a.totalPED)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIME ANALYSIS TAB — 2 panels
   ═══════════════════════════════════════════════════════════════════════════ */

function TimeTab({ data }: { data: SpaceMiningStats }) {
  const hourlyChartData = useMemo(
    () =>
      (data.hourlyDistribution ?? []).map((h) => ({
        name: `${String(h.hour).padStart(2, "0")}:00`,
        globals: h.count,
        ped: Math.round(h.totalPED),
      })),
    [data.hourlyDistribution],
  );

  const dowChartData = useMemo(
    () =>
      (data.dayOfWeekDistribution ?? []).map((d) => ({
        name: d.dayName.slice(0, 3),
        globals: d.count,
        ped: Math.round(d.totalPED),
      })),
    [data.dayOfWeekDistribution],
  );

  const timelineChartData = useMemo(
    () =>
      (data.timeActivity?.timeSeriesData ?? []).map((e) => ({
        name: new Date(e.timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        globals: e.globalCount,
        miners: e.minerCount,
        ped: Math.round(e.totalPED),
      })),
    [data.timeActivity],
  );

  /* Find best hour & day */
  const bestHour = useMemo(() => {
    if (!data.hourlyDistribution?.length) return null;
    return data.hourlyDistribution.reduce((best, cur) =>
      cur.count > best.count ? cur : best,
    );
  }, [data.hourlyDistribution]);

  const bestDay = useMemo(() => {
    if (!data.dayOfWeekDistribution?.length) return null;
    return data.dayOfWeekDistribution.reduce((best, cur) =>
      cur.count > best.count ? cur : best,
    );
  }, [data.dayOfWeekDistribution]);

  return (
    <div className={styles.tabContent}>
      {/* ═══ PANEL 1 — Peak Times & Distribution ═══ */}
      <Panel size="md">
        <SectionHeader title="When to Mine" accent />

        {/* Peak stats inline */}
        {(bestHour || bestDay) && (
          <div className={styles.peakRow}>
            {bestHour && (
              <StatBlock
                label="Best Hour (UTC)"
                value={`${String(bestHour.hour).padStart(2, "0")}:00`}
                sub={`${bestHour.count} globals · ${pedShort(bestHour.totalPED)} PED`}
                accent
              />
            )}
            {bestDay && (
              <StatBlock
                label="Best Day"
                value={bestDay.dayName}
                sub={`${bestDay.count} globals · ${pedShort(bestDay.totalPED)} PED`}
                accent
              />
            )}
          </div>
        )}

        {/* Hourly + Day of Week side by side */}
        {(hourlyChartData.length > 0 || dowChartData.length > 0) && (
          <div className={styles.chartPair}>
            {hourlyChartData.length > 0 && (
              <div className={styles.chartPairItem}>
                <HudBarChart
                  data={hourlyChartData}
                  series={[
                    { dataKey: "globals", label: "Globals", color: "#eab308" },
                  ]}
                  title="Hourly Distribution"
                  height={200}
                />
              </div>
            )}
            {dowChartData.length > 0 && (
              <div className={styles.chartPairItem}>
                <HudBarChart
                  data={dowChartData}
                  series={[
                    { dataKey: "globals", label: "Globals", color: "#3b82f6" },
                  ]}
                  title="Day of Week"
                  height={200}
                />
              </div>
            )}
          </div>
        )}
      </Panel>

      {/* ═══ PANEL 2 — Value Distribution & Timeline ═══ */}
      <Panel size="md">
        <SectionHeader title="Activity Breakdown" accent />

        {data.valueDistribution && data.valueDistribution.length > 0 && (
          <HudBarChart
            data={data.valueDistribution.map((v) => ({
              name: v.label,
              count: v.count,
            }))}
            series={[{ dataKey: "count", label: "Count", color: "#a855f7" }]}
            title="Value Distribution"
            height={200}
          />
        )}

        {timelineChartData.length > 0 && (
          <HudBarChart
            data={timelineChartData}
            series={[
              { dataKey: "miners", label: "Miners", color: "#3b82f6" },
              { dataKey: "globals", label: "Globals", color: "#eab308" },
            ]}
            title="Activity Timeline"
            height={220}
          />
        )}
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MINERS TAB — 2 panels
   ═══════════════════════════════════════════════════════════════════════════ */

function MinersTab({ data }: { data: SpaceMiningStats }) {
  const miners = useMemo(() => data.topMiners ?? [], [data.topMiners]);

  const columns: Column<TopMiner>[] = useMemo(
    () => [
      {
        key: "rank",
        label: "#",
        width: "50px",
        sortable: false,
        render: (_row: TopMiner) => {
          const idx = miners.indexOf(_row);
          return (
            <span
              className={styles.rank}
              style={{ color: RANK_COLORS[idx] ?? "#a8a29e" }}
            >
              {idx + 1}
            </span>
          );
        },
      },
      { key: "avatar", label: "Miner" },
      {
        key: "totalPED",
        label: "Total PED",
        render: (r: TopMiner) => (
          <span className={styles.pedValue}>{ped(r.totalPED)}</span>
        ),
      },
      { key: "globalCount", label: "Globals" },
      {
        key: "hofCount",
        label: "HoFs",
        render: (r: TopMiner) =>
          r.hofCount > 0 ? (
            <Badge variant="warning" glow>
              {r.hofCount}
            </Badge>
          ) : (
            "0"
          ),
      },
      {
        key: "avgGlobal",
        label: "Avg PED",
        render: (r: TopMiner) => pedShort(r.avgGlobal),
      },
      {
        key: "highestGlobal",
        label: "Highest",
        render: (r: TopMiner) => pedShort(r.highestGlobal),
      },
    ],
    [miners],
  );

  return (
    <div className={styles.tabContent}>
      {/* ═══ PANEL 1 — Summary & Share ═══ */}
      <Panel size="md">
        <SectionHeader title={`Active Miners (${miners.length})`} accent />

        <div className={styles.statRows}>
          <div className={styles.statRow}>
            <StatBlock
              label="Total Miners"
              value={data.stats.uniqueMiners}
            />
            <StatBlock
              label="Top Earner"
              value={miners[0]?.avatar ?? "—"}
              sub={miners[0] ? ped(miners[0].totalPED) : undefined}
            />
            <StatBlock
              label="Avg PED / Miner"
              value={pedShort(
                data.stats.totalPED /
                  Math.max(data.stats.uniqueMiners, 1),
              )}
            />
          </div>
        </div>

        {miners.length > 0 && (
          <>
            <div className={styles.statDivider} />
            <span className={styles.perfLabel}>PED Share</span>
            {miners.slice(0, 8).map((m) => (
              <SegmentedBar
                key={m.avatar}
                label={m.avatar}
                value={Math.min(
                  (m.totalPED / Math.max(data.stats.totalPED, 1)) * 100,
                  100,
                )}
                variant="accent"
                size="sm"
              />
            ))}
          </>
        )}
      </Panel>

      {/* ═══ PANEL 2 — Leaderboard Table ═══ */}
      {miners.length > 0 && (
        <Panel size="md">
          <SectionHeader title="Leaderboard" accent />
          <DataTable
            columns={columns}
            data={miners}
            keyField="avatar"
            striped
            compact
          />
        </Panel>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ASTEROIDS TAB — 2 panels
   ═══════════════════════════════════════════════════════════════════════════ */

function AsteroidsTab({ data }: { data: SpaceMiningStats }) {
  const asteroids = useMemo(() => data.topAsteroids ?? [], [data.topAsteroids]);

  /* Group by type prefix (C-type, M-type, S-type, etc.) for a cleaner pie */
  const typePieData = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const a of asteroids) {
      const prefix = a.asteroidName.match(/^[A-Z]-type/i)?.[0] ?? a.asteroidName;
      groups[prefix] = (groups[prefix] ?? 0) + a.totalPED;
    }
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [asteroids]);

  const columns: Column<TopAsteroid>[] = useMemo(
    () => [
      {
        key: "rank",
        label: "#",
        width: "50px",
        sortable: false,
        render: (_row: TopAsteroid) => {
          const idx = asteroids.indexOf(_row);
          return (
            <span
              className={styles.rank}
              style={{ color: RANK_COLORS[idx] ?? "#a8a29e" }}
            >
              {idx + 1}
            </span>
          );
        },
      },
      { key: "asteroidName", label: "Asteroid" },
      {
        key: "totalPED",
        label: "Total PED",
        render: (r: TopAsteroid) => (
          <span className={styles.pedValue}>{ped(r.totalPED)}</span>
        ),
      },
      { key: "globalCount", label: "Globals" },
      { key: "uniqueMiners", label: "Miners" },
      {
        key: "avgGlobal",
        label: "Avg PED",
        render: (r: TopAsteroid) => pedShort(r.avgGlobal),
      },
      {
        key: "hofCount",
        label: "HoFs",
        render: (r: TopAsteroid) =>
          r.hofCount > 0 ? (
            <Badge variant="warning" glow>
              {r.hofCount}
            </Badge>
          ) : (
            "0"
          ),
      },
    ],
    [asteroids],
  );

  return (
    <div className={styles.tabContent}>
      {/* ═══ PANEL 1 — Breakdown by Type + Top Performers ═══ */}
      <Panel size="md">
        <SectionHeader title={`Asteroid Types (${asteroids.length})`} accent />

        <div className={styles.asteroidSummary}>
          {/* Pie chart — grouped by type prefix, no legend (too many items) */}
          {typePieData.length > 0 && (
            <div className={styles.asteroidPie}>
              <HudPieChart
                data={typePieData}
                title="PED by Type"
                innerRadius={50}
                outerRadius={90}
                height={240}
                showLegend={false}
              />
            </div>
          )}

          {/* Top 6 performers inline */}
          <div className={styles.asteroidTopList}>
            <span className={styles.perfLabel}>Top Performers</span>
            {asteroids.slice(0, 6).map((a, i) => (
              <div key={a.asteroidName} className={styles.quickListItem}>
                <span
                  className={styles.rank}
                  style={{ color: RANK_COLORS[i] ?? "#a8a29e" }}
                >
                  #{i + 1}
                </span>
                <span className={styles.quickName}>{a.asteroidName}</span>
                <span className={styles.quickValue}>
                  {pedShort(a.totalPED)}
                </span>
                <span className={styles.quickSub}>
                  {a.globalCount}g · {a.uniqueMiners}m
                </span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* ═══ PANEL 2 — Full Leaderboard Table ═══ */}
      {asteroids.length > 0 && (
        <Panel size="md">
          <SectionHeader title="All Asteroids" accent />
          <DataTable
            columns={columns}
            data={asteroids}
            keyField="asteroidName"
            striped
            compact
          />
        </Panel>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE FEED TAB — 1 panel
   ═══════════════════════════════════════════════════════════════════════════ */

function FeedTab({ data }: { data: SpaceMiningStats }) {
  const [filter, setFilter] = useState<"all" | "hof">("all");
  const globals = data.recentGlobals ?? [];
  const filtered = filter === "all" ? globals : globals.filter((g) => g.isHof);

  return (
    <div className={styles.tabContent}>
      <Panel size="md">
        <div className={styles.feedHeader}>
          <SectionHeader title={`Recent Globals (${globals.length})`} accent />
          <div className={styles.feedFilters}>
            <button
              className={`${styles.feedFilterBtn} ${filter === "all" ? styles.feedFilterActive : ""}`}
              onClick={() => setFilter("all")}
            >
              <Zap size={14} /> All
            </button>
            <button
              className={`${styles.feedFilterBtn} ${filter === "hof" ? styles.feedFilterActive : ""}`}
              onClick={() => setFilter("hof")}
            >
              <Trophy size={14} /> HoF Only
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>No globals recorded yet.</p>
        ) : (
          <div className={styles.feedList}>
            {filtered.map((g, i) => (
              <div key={`${g.avatar}-${i}`} className={styles.feedItem}>
                <div className={styles.feedIcon}>
                  {g.isHof ? (
                    <Trophy size={16} className={styles.feedHofIcon} />
                  ) : g.isAth ? (
                    <Crown size={16} className={styles.feedHofIcon} />
                  ) : (
                    <Gem size={16} className={styles.feedGemIcon} />
                  )}
                </div>
                <div className={styles.feedInfo}>
                  <span className={styles.feedMiner}>
                    {g.avatar}
                    {g.isHof && (
                      <Badge variant="warning" glow>
                        HoF
                      </Badge>
                    )}
                    {g.isAth && (
                      <Badge variant="danger" glow>
                        ATH
                      </Badge>
                    )}
                  </span>
                  <span className={styles.feedAsteroid}>
                    <Star size={12} /> {g.depositName}
                  </span>
                </div>
                <div className={styles.feedRight}>
                  <span className={styles.feedValue}>
                    {ped(g.globalValue)}
                  </span>
                  {g.dateTime && (
                    <span className={styles.feedTime}>
                      {timeAgo(g.dateTime)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
