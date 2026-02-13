/* ═══════════════════════════════════════════════════════════════════════════
   AsteroidStatsCard — Bitesize stats overlay for a selected map POI
   Shows live globals data from the Delta API + copy waypoint
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, ShieldAlert, Clock } from "lucide-react";
import { Panel, Badge, StatBlock, Button, Skeleton } from "@/components/ui";
import type { MapPoi } from "./HowlingMineMap";
import styles from "./AsteroidStatsCard.module.css";

/* ── Types matching the per-type Delta API response ── */
interface TypeStats {
  totalGlobals: number;
  totalPED: number;
  uniqueMiners: number;
  avgGlobal: number;
  highestGlobal: number;
  lowestGlobal: number;
  hofCount: number;
}

interface RecentGlobal {
  avatar: string;
  variant: string;
  value: number;
  dateTime: string;
  isHof: boolean;
}

interface TypeStatsResponse {
  asteroidType: string;
  stats: TypeStats;
  recentGlobals: RecentGlobal[];
}

/* ── Category labels ── */
const CAT_LABELS: Record<string, string> = {
  station: "Station",
  "asteroid-c": "C-Type",
  "asteroid-f": "F-Type",
  "asteroid-s": "S-Type",
  "asteroid-m": "M-Type",
  "asteroid-nd": "ND-Type",
  "asteroid-scrap": "Scrap",
  landmark: "Landmark",
  "pvp-zone": "PVP Zone",
  "safe-zone": "Safe Zone",
};

function formatCoord(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatPED(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(0);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── API ── */
const DELTA_API = "https://www.thedeltaproject.net";
const CACHE_TTL = 60_000;

const API_TYPE: Record<string, string> = {
  "asteroid-c": "C",
  "asteroid-f": "F",
  "asteroid-s": "S",
  "asteroid-m": "M",
  "asteroid-nd": "ND",
};

const statsCache = new Map<
  string,
  { data: TypeStatsResponse | null; ts: number }
>();

async function fetchTypeStats(
  category: string,
): Promise<TypeStatsResponse | null> {
  const cached = statsCache.get(category);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const apiType = API_TYPE[category];
  if (!apiType) {
    statsCache.set(category, { data: null, ts: Date.now() });
    return null;
  }

  try {
    const res = await fetch(
      `${DELTA_API}/api/mining-stats/asteroid/${apiType}?period=24h`,
    );
    if (!res.ok) throw new Error("API error");
    const json: TypeStatsResponse = await res.json();

    if (!json.stats || json.stats.totalGlobals === 0) {
      statsCache.set(category, { data: null, ts: Date.now() });
      return null;
    }

    statsCache.set(category, { data: json, ts: Date.now() });
    return json;
  } catch {
    statsCache.set(category, { data: null, ts: Date.now() });
    return null;
  }
}

/* ── Component ── */
interface AsteroidStatsCardProps {
  poi: MapPoi;
  onClose: () => void;
}

export function AsteroidStatsCard({ poi, onClose }: AsteroidStatsCardProps) {
  const [data, setData] = useState<TypeStatsResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fetchIdRef = useRef(0);

  const isAsteroid = poi.category.startsWith("asteroid-");

  useEffect(() => {
    if (!isAsteroid) return;
    const id = ++fetchIdRef.current;
    fetchTypeStats(poi.category).then((result) => {
      if (fetchIdRef.current !== id) return;
      setData(result);
      setLoaded(true);
    });
  }, [poi.category, isAsteroid]);

  const loading = isAsteroid && !loaded;
  const stats = data?.stats ?? null;
  const latestGlobal = data?.recentGlobals?.[0] ?? null;

  const copyValue = useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  const copyWaypoint = useCallback(() => {
    const txt = `/wp [${poi.name}, ${formatCoord(poi.euX)}, ${formatCoord(poi.euY)}, ${formatCoord(poi.euZ)}]`;
    copyValue("wp", txt);
  }, [poi, copyValue]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={poi._id}
        className={styles.overlay}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Panel variant="default" size="sm" noAnimation>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <span className={styles.name}>{poi.name}</span>
              <Badge variant="primary">
                {CAT_LABELS[poi.category] ?? poi.category}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={onClose}
              aria-label="Close"
            >
              <X size={14} />
            </Button>
          </div>

          {/* PVP Badge */}
          {poi.pvpLootable && (
            <Badge variant="danger" dot glow>
              <ShieldAlert size={10} /> PVP Lootable
            </Badge>
          )}

          {/* Description (non-asteroids) */}
          {poi.description && !isAsteroid && (
            <p className={styles.desc}>{poi.description}</p>
          )}

          {/* Stats — asteroids only */}
          {isAsteroid && (
            <div className={styles.statsSection}>
              <span className={styles.periodLabel}>
                <Clock size={10} /> Last 24h
              </span>
              {loading ? (
                <div className={styles.statsGrid}>
                  <Skeleton variant="stat" />
                  <Skeleton variant="stat" />
                  <Skeleton variant="stat" />
                  <Skeleton variant="stat" />
                </div>
              ) : stats ? (
                <>
                  <div className={styles.statsGrid}>
                    <StatBlock
                      label="Globals"
                      value={stats.totalGlobals}
                      size="sm"
                    />
                    <StatBlock
                      label="Total PED"
                      value={formatPED(stats.totalPED)}
                      size="sm"
                      accent
                    />
                    <StatBlock label="HoFs" value={stats.hofCount} size="sm" />
                    <StatBlock
                      label="Miners"
                      value={stats.uniqueMiners}
                      size="sm"
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className={styles.quickStats}>
                    <span>
                      Avg <strong>{formatPED(stats.avgGlobal)}</strong>
                    </span>
                    <span className={styles.divider}>|</span>
                    <span>
                      High <strong>{formatPED(stats.highestGlobal)}</strong>
                    </span>
                    <span className={styles.divider}>|</span>
                    <span>
                      Low <strong>{formatPED(stats.lowestGlobal)}</strong>
                    </span>
                  </div>

                  {/* Latest Global */}
                  {latestGlobal && (
                    <div className={styles.latestGlobal}>
                      <Badge
                        variant={latestGlobal.isHof ? "warning" : "default"}
                      >
                        {formatPED(latestGlobal.value)} PED
                      </Badge>
                      <span className={styles.latestAvatar}>
                        {latestGlobal.avatar}
                      </span>
                      <span className={styles.latestTime}>
                        {timeAgo(latestGlobal.dateTime)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className={styles.noStats}>No globals in the last 24h</p>
              )}
            </div>
          )}

          {/* Coordinates */}
          <div className={styles.coords}>
            {(
              [
                ["X", poi.euX],
                ["Y", poi.euY],
                ["Z", poi.euZ],
              ] as [string, number][]
            ).map(([axis, val]) => (
              <div key={axis} className={styles.coordChip}>
                <span className={styles.coordAxis}>{axis}</span>
                <span className={styles.coordVal}>{formatCoord(val)}</span>
              </div>
            ))}
          </div>

          {/* Copy Waypoint */}
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={copyWaypoint}
          >
            {copiedField === "wp" ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Waypoint
              </>
            )}
          </Button>
        </Panel>
      </motion.div>
    </AnimatePresence>
  );
}
