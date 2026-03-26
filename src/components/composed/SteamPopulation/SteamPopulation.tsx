/* ═══════════════════════════════════════════════════════════════════════════
   SteamPopulation — Live player count + 30-day historical chart
   Fetches from /api/steam-players (proxied Steam API + SteamCharts).
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Panel, StatBlock, SectionHeader } from "@/components/ui";
import { HudLineChart } from "@/components/ui/charts";
import styles from "./SteamPopulation.module.css";

interface SteamData {
  current: number | null;
  history: { date: string; players: number }[];
}

export function SteamPopulation() {
  const [data, setData] = useState<SteamData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let stale = false;

    async function load() {
      try {
        const res = await fetch("/api/steam-players");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: SteamData = await res.json();
        if (!stale) setData(json);
      } catch {
        if (!stale) setError(true);
      }
    }

    load();

    // Refresh current count every 2 minutes
    const interval = setInterval(load, 120_000);
    return () => {
      stale = true;
      clearInterval(interval);
    };
  }, []);

  if (error || !data) {
    if (error) return null; // Silently hide if Steam data unavailable
    return (
      <Panel size="md">
        <SectionHeader title="Steam Population" accent />
        <div className={styles.loading}>Loading Steam data…</div>
      </Panel>
    );
  }

  // Build chart data — sample to ~60 points max for readability
  const history = data.history;
  const step = Math.max(1, Math.floor(history.length / 60));
  const chartData = history
    .filter((_, i) => i % step === 0 || i === history.length - 1)
    .map((entry) => ({
      name: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      players: entry.players,
    }));

  // Stats from history
  const players = history.map((h) => h.players);
  const peak = Math.max(...players);
  const low = Math.min(...players);
  const avg = Math.round(players.reduce((a, b) => a + b, 0) / players.length);

  return (
    <Panel size="md">
      <SectionHeader title="Steam Population" accent />

      <div className={styles.header}>
        <div className={styles.liveCount}>
          <Users size={18} className={styles.liveIcon} />
          <span className={styles.liveValue}>
            {data.current?.toLocaleString() ?? "—"}
          </span>
          <span className={styles.liveLabel}>online now</span>
          <span className={styles.liveDot} />
        </div>

        <div className={styles.miniStats}>
          <StatBlock label="30d Peak" value={peak.toLocaleString()} size="sm" />
          <StatBlock label="30d Low" value={low.toLocaleString()} size="sm" />
          <StatBlock
            label="30d Avg"
            value={avg.toLocaleString()}
            size="sm"
          />
        </div>
      </div>

      {chartData.length > 1 && (
        <HudLineChart
          data={chartData}
          series={[
            {
              dataKey: "players",
              label: "Players Online",
              color: "#22d3ee",
            },
          ]}
          height={220}
        />
      )}
    </Panel>
  );
}
