/* ═══════════════════════════════════════════════════════════════════════════
   /api/steam-players — Entropia Universe Steam player data
   Returns current player count + historical chart data (last 30 days).
   ═══════════════════════════════════════════════════════════════════════════ */

import { NextResponse } from "next/server";

const EU_APP_ID = 3642750;
const STEAM_API = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${EU_APP_ID}`;
const CHART_DATA = `https://steamcharts.com/app/${EU_APP_ID}/chart-data.json`;

export async function GET() {
  try {
    const [currentRes, historyRes] = await Promise.all([
      fetch(STEAM_API, { next: { revalidate: 120 } }),
      fetch(CHART_DATA, { next: { revalidate: 3600 } }),
    ]);

    const current = currentRes.ok
      ? ((await currentRes.json()) as { response: { player_count: number } })
          .response.player_count
      : null;

    let history: { date: string; players: number }[] = [];
    if (historyRes.ok) {
      const raw = (await historyRes.json()) as [number, number][];
      // Take last 30 days of data
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      history = raw
        .filter(([ts]) => ts >= cutoff)
        .map(([ts, players]) => ({
          date: new Date(ts).toISOString(),
          players,
        }));
    }

    return NextResponse.json(
      { current, history },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=120, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    console.error("[steam-players]", err);
    return NextResponse.json(
      { error: "Failed to fetch Steam data" },
      { status: 502 },
    );
  }
}
