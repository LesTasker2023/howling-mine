/* ═══════════════════════════════════════════════════════════════════════════
   /api/mining-stats/[period] — Proxy to ProjectDelta space mining stats
   Avoids CORS issues by fetching server-side from thedeltaproject.net
   ═══════════════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";

const DELTA_BASE = "https://www.thedeltaproject.net";
const VALID_PERIODS = ["1h", "3h", "6h", "12h", "24h", "7d", "30d"] as const;

/** Cache durations per period — mirrors ProjectDelta's caching tiers */
const CACHE_TIERS: Record<string, { maxAge: number; swr: number }> = {
  "1h": { maxAge: 30, swr: 60 },
  "3h": { maxAge: 60, swr: 120 },
  "6h": { maxAge: 120, swr: 300 },
  "12h": { maxAge: 180, swr: 360 },
  "24h": { maxAge: 300, swr: 600 },
  "7d": { maxAge: 600, swr: 900 },
  "30d": { maxAge: 900, swr: 1800 },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ period: string }> },
) {
  const { period } = await params;

  if (!VALID_PERIODS.includes(period as (typeof VALID_PERIODS)[number])) {
    return NextResponse.json(
      { error: `Invalid period. Use: ${VALID_PERIODS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${DELTA_BASE}/api/mining-stats/${period}`, {
      next: { revalidate: CACHE_TIERS[period]?.maxAge ?? 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const tier = CACHE_TIERS[period] ?? { maxAge: 300, swr: 600 };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${tier.maxAge}, stale-while-revalidate=${tier.swr}`,
      },
    });
  } catch (err) {
    console.error("[mining-stats proxy]", err);
    return NextResponse.json(
      { error: "Failed to fetch mining stats" },
      { status: 502 },
    );
  }
}
