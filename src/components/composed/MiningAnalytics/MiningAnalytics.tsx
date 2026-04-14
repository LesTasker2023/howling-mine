/* ═══════════════════════════════════════════════════════════════════════════
   MiningAnalytics — Space mining dashboard powered by EntropiaCentral
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Panel,
  StatBlock,
  SectionHeader,
  DataTable,
  type Column,
} from "@/components/ui";
import { DialGauge } from "@/components/ui/charts";
import { SteamPopulation } from "@/components/composed/SteamPopulation";
import { useTopBar } from "@/context/TopBarContext";
import styles from "./MiningAnalytics.module.css";

/* ── Asteroid type colours ── */
const TYPE_COLORS: Record<string, string> = {
  C:  "#60a5fa", // blue
  F:  "#f97316", // orange
  S:  "#a3e635", // lime
  M:  "#e879f9", // fuchsia
  ND: "#facc15", // yellow
};

/* ── Types ── */

export interface GlobalEntry {
  avatarName: string;
  globalValue: number;
  depositName: string;
  dateTime: string;
  isHof: boolean;
  isAth: boolean;
}

export interface AsteroidTypeStats {
  type: string;
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
  count: number;
  totalValue: number;
  averageValue: number;
  globalsPerHour: number;
  pedPerHour: number;
  previousCount: number;
  previousValue: number;
  countChangePercent: number;
  valueChangePercent: number;
  countTrend: "up" | "down" | "neutral";
  valueTrend: "up" | "down" | "neutral";
  countChangeFormatted: string;
  valueChangeFormatted: string;
  activeMinerCount: number;
  avgValuePerMiner: number;
  favoriteItem: string;
  asteroidTypes: AsteroidTypeStats[];
  topMiners: SpaceMinerEntry[];
}

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
  return `${hrs}h ago`;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp size={12} className={styles.trendUp} />;
  if (trend === "down") return <TrendingDown size={12} className={styles.trendDown} />;
  return <Minus size={12} className={styles.trendNeutral} />;
}

function RankChange({ change }: { change: number }) {
  if (change > 0) return <span className={styles.rankUp}>▲{change}</span>;
  if (change < 0) return <span className={styles.rankDown}>▼{Math.abs(change)}</span>;
  return <span className={styles.rankNeutral}>—</span>;
}

/* ── Props ── */

export interface MiningAnalyticsProps {
  initialData: SpaceMiningStats;
}

/* ── Component ── */

export function MiningAnalytics({ initialData }: MiningAnalyticsProps) {
  const [data, setData] = useState<SpaceMiningStats>(initialData);
  const [loading, setLoading] = useState(false);
  const { setSubTabs, activeSubTab, setActiveSubTab } = useTopBar();

  /* Push asteroid type sub-tabs into NavShell */
  useEffect(() => {
    const tabs = [
      { key: "all", label: "All" },
      ...(data.asteroidTypes ?? []).map((t) => ({
        key: t.type,
        label: `${t.type}-type`,
        color: TYPE_COLORS[t.type],
      })),
    ];
    setSubTabs(tabs);
    if (!activeSubTab) setActiveSubTab("all");
    return () => setSubTabs([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.asteroidTypes, setSubTabs]);

  /* Refresh in the background every 5 min */
  useEffect(() => {
    const id = setInterval(() => {
      setLoading(true);
      fetch("/api/space-mining-stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => { if (json) setData(json); })
        .finally(() => setLoading(false));
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const selectedType = activeSubTab && activeSubTab !== "all" ? activeSubTab : null;

  const activeTypeStats = useMemo(
    () => selectedType
      ? (data.asteroidTypes ?? []).find((t) => t.type === selectedType) ?? null
      : null,
    [selectedType, data.asteroidTypes],
  );

  const minerColumns: Column<SpaceMinerEntry>[] = [
    {
      key: "rank",
      label: "Rank",
      render: (r: SpaceMinerEntry) => (
        <span className={styles.rankCell}>
          #{r.rank} <RankChange change={r.rankChange} />
        </span>
      ),
    },
    { key: "avatarName", label: "Avatar" },
    {
      key: "globalsCount",
      label: "Globals",
      render: (r: SpaceMinerEntry) => r.globalsCount.toLocaleString(),
    },
    {
      key: "globalsValue",
      label: "Value (PED)",
      render: (r: SpaceMinerEntry) => <span className={styles.pedValue}>{pedShort(r.globalsValue)}</span>,
    },
    {
      key: "points",
      label: "Points",
      render: (r: SpaceMinerEntry) => r.points.toLocaleString(),
    },
  ];

  const typeColor = selectedType ? (TYPE_COLORS[selectedType] ?? undefined) : undefined;

  return (
    <div className={`${styles.dashboard} ${loading ? styles.refreshing : ""}`}>

      {/* Steam Population */}
      <SteamPopulation />

      {/* ── All view — aggregate stats ── */}
      {!selectedType && (
        <>
          <Panel size="md">
            <SectionHeader title="Space Mining — Last 24h" accent />
            <div className={styles.statRows}>
              <div className={styles.statRow}>
                <StatBlock
                  label="Total Globals"
                  value={data.count.toLocaleString()}
                  sub={`${data.globalsPerHour.toFixed(1)}/hr`}
                />
                <StatBlock
                  label="Total PED"
                  value={ped(data.totalValue)}
                  accent
                  sub={`${pedShort(data.pedPerHour)}/hr`}
                />
                <StatBlock label="Avg Global" value={ped(data.averageValue)} />
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statRow}>
                <StatBlock
                  label="Active Miners"
                  value={data.activeMinerCount.toLocaleString()}
                  sub="on leaderboard"
                />
                <StatBlock
                  label="Avg / Miner"
                  value={ped(data.avgValuePerMiner)}
                  sub="PED this period"
                />
                <StatBlock label="Hot Asteroid" value={data.favoriteItem || "—"} />
              </div>
            </div>
          </Panel>

          <Panel size="md">
            <SectionHeader title="vs Previous 24h" accent />
            <div className={styles.trendRow}>
              <div className={styles.trendCard}>
                <span className={styles.trendLabel}>Globals</span>
                <div className={styles.trendMain}>
                  <TrendIcon trend={data.countTrend} />
                  <span className={`${styles.trendPct} ${
                    data.countTrend === "up" ? styles.trendUp :
                    data.countTrend === "down" ? styles.trendDown : styles.trendNeutral
                  }`}>{data.countChangeFormatted}</span>
                </div>
                <span className={styles.trendSub}>
                  {data.count.toLocaleString()} vs {data.previousCount.toLocaleString()}
                </span>
              </div>
              <div className={styles.trendCard}>
                <span className={styles.trendLabel}>PED Value</span>
                <div className={styles.trendMain}>
                  <TrendIcon trend={data.valueTrend} />
                  <span className={`${styles.trendPct} ${
                    data.valueTrend === "up" ? styles.trendUp :
                    data.valueTrend === "down" ? styles.trendDown : styles.trendNeutral
                  }`}>{data.valueChangeFormatted}</span>
                </div>
                <span className={styles.trendSub}>
                  {pedShort(data.totalValue)} vs {pedShort(data.previousValue)} PED
                </span>
              </div>
              <DialGauge
                value={data.globalsPerHour}
                max={Math.max(data.globalsPerHour * 2, 20)}
                label="Globals / hr"
                displayValue={data.globalsPerHour.toFixed(1)}
                hint={`${data.count} total`}
                size={100}
              />
              <DialGauge
                value={data.pedPerHour}
                max={Math.max(data.pedPerHour * 2, 1000)}
                label="PED / hr"
                displayValue={pedShort(data.pedPerHour)}
                hint={`${pedShort(data.totalValue)} total`}
                size={100}
              />
              <DialGauge
                value={data.averageValue}
                max={Math.max(data.averageValue * 3, 500)}
                label="Avg Global"
                displayValue={pedShort(data.averageValue)}
                hint={`${data.activeMinerCount} miners`}
                size={100}
              />
            </div>
          </Panel>

          {/* Type overview cards */}
          {(data.asteroidTypes ?? []).length > 0 && (
            <Panel size="md">
              <SectionHeader title="By Asteroid Type" accent />
              <div className={styles.typeSummaryGrid}>
                {data.asteroidTypes.map((t) => (
                  <button
                    key={t.type}
                    className={styles.typeSummaryCard}
                    style={{ "--type-color": TYPE_COLORS[t.type] ?? "var(--text-accent)" } as React.CSSProperties}
                    onClick={() => setActiveSubTab(t.type)}
                  >
                    <span className={styles.typeSummaryName}>{t.type}-type</span>
                    <span className={styles.typeSummaryGlobals}>{t.count} globals</span>
                    <span className={styles.typeSummaryPed}>{pedShort(t.totalValue)} PED</span>
                    <span className={styles.typeSummaryAvg}>avg {pedShort(t.avgValue)}</span>
                    {t.hofCount > 0 && (
                      <span className={styles.typeSummaryHof}>{t.hofCount} HoF</span>
                    )}
                  </button>
                ))}
              </div>
            </Panel>
          )}
        </>
      )}

      {/* ── Type view — per-asteroid-type stats ── */}
      {selectedType && activeTypeStats && (
        <Panel size="md">
          <SectionHeader
            title={`${selectedType}-type Asteroid — Last 24h`}
            accent
          />
          <div className={styles.typeAccentBar} style={{ background: typeColor }} />
          <div className={styles.statRows}>
            <div className={styles.statRow}>
              <StatBlock label="Globals" value={activeTypeStats.count.toLocaleString()} />
              <StatBlock label="Total PED" value={ped(activeTypeStats.totalValue)} accent />
              <StatBlock label="Avg Global" value={ped(activeTypeStats.avgValue)} />
              <StatBlock label="HoFs" value={activeTypeStats.hofCount.toLocaleString()} />
            </div>
          </div>

          {activeTypeStats.recentGlobals.length > 0 && (
            <>
              <div className={styles.statDivider} />
              <span className={styles.perfLabel}>Recent Globals</span>
              <div className={styles.feedList}>
                {activeTypeStats.recentGlobals.map((g, i) => (
                  <div key={i} className={styles.feedItem}>
                    <span className={`${styles.feedValue} ${g.isHof ? styles.feedValueHof : ""}`}>
                      {pedShort(g.globalValue)} PED
                    </span>
                    <span className={styles.feedName}>{g.avatarName}</span>
                    <span className={styles.feedDeposit}>{g.depositName}</span>
                    <span className={styles.feedTime}>{timeAgo(g.dateTime)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      )}

      {selectedType && !activeTypeStats && (
        <Panel size="md">
          <SectionHeader title={`${selectedType}-type Asteroid — Last 24h`} accent />
          <p className={styles.empty}>No {selectedType}-type activity in the last 24h.</p>
        </Panel>
      )}

      {/* ── Top Miners (always visible) ── */}
      {data.topMiners.length > 0 && (
        <Panel size="md">
          <SectionHeader title="Top Space Miners" accent />
          <DataTable
            columns={minerColumns as Column<unknown>[]}
            data={data.topMiners}
            keyField="avatarName"
          />
        </Panel>
      )}
    </div>
  );
}
