/* ═══════════════════════════════════════════════════════════════════════════
   PoiDetailDrawer — Full-height slide-out panel for selected map POIs
   Shows all CMS fields + live Delta API globals for asteroid types
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  X,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { Badge, Button, Skeleton } from "@/components/ui";
import type { MapPoi } from "./HowlingMineMap";
import styles from "./PoiDetailDrawer.module.css";

/* ── Delta API types ── */
interface TypeStats {
  totalGlobals: number;
  totalPED: number;
  uniqueMiners: number;
  avgGlobal: number;
  highestGlobal: number;
  lowestGlobal: number;
  medianGlobal: number;
  hofCount: number;
  athCount: number;
  globalsPerHour: number;
}

interface RecentGlobal {
  avatar: string;
  variant: string;
  value: number;
  dateTime: string;
  isHof: boolean;
  isAth: boolean;
}

interface TopMiner {
  avatar: string;
  totalPED: number;
  globalCount: number;
  hofCount: number;
  avgGlobal: number;
  highestGlobal: number;
}

interface HourlyBucket {
  bucketIndex: number;
  timestamp: string;
  globalCount: number;
  totalPED: number;
}

interface TypeStatsResponse {
  asteroidType: string;
  stats: TypeStats;
  recentGlobals: RecentGlobal[];
  topMiners: TopMiner[];
  hourlyActivity: HourlyBucket[];
  percentiles: { p50: number; p75: number; p90: number; p95: number; p99: number };
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
  "outlaw-zone": "Outlaw Zone",
  "pvp-zone": "PVP Zone",
  "safe-zone": "Safe Zone",
};

/* ── Helpers ── */
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

/* ── Delta API fetch with cache ── */
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

/* ── Slide variants ── */
const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

/* ── Component ── */
interface PoiDetailDrawerProps {
  poi: MapPoi | null;
  onClose: () => void;
}

export function PoiDetailDrawer({ poi, onClose }: PoiDetailDrawerProps) {
  const [data, setData] = useState<TypeStatsResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fetchIdRef = useRef(0);

  const isAsteroid = poi?.category.startsWith("asteroid-") ?? false;

  /* Fetch globals when POI changes */
  useEffect(() => {
    if (!poi || !isAsteroid) {
      setData(null);
      setLoaded(false);
      return;
    }
    const id = ++fetchIdRef.current;
    setLoaded(false);
    fetchTypeStats(poi.category).then((result) => {
      if (fetchIdRef.current !== id) return;
      setData(result);
      setLoaded(true);
    });
  }, [poi?._id, poi?.category, isAsteroid]);

  /* Escape key */
  useEffect(() => {
    if (!poi) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [poi, onClose]);

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
    if (!poi) return;
    const txt = `/wp [Space, ${poi.euX}, ${poi.euY}, ${poi.euZ}, ${poi.name}]`;
    copyValue("wp", txt);
  }, [poi, copyValue]);

  const loading = isAsteroid && !loaded;
  const stats = data?.stats ?? null;
  const recentGlobals = data?.recentGlobals ?? [];
  const topMiners = data?.topMiners ?? [];
  const hourly = data?.hourlyActivity ?? [];
  const maxHourlyPED = Math.max(...hourly.map((h) => h.totalPED), 1);

  return (
    <AnimatePresence>
      {poi && (
        <motion.div
          key="poi-drawer"
          className={styles.drawer}
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Header ── */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <span className={styles.name}>{poi.name}</span>
              <div className={styles.categoryRow}>
                <Badge variant="primary">
                  {CAT_LABELS[poi.category] ?? poi.category}
                </Badge>
                {poi.pvpLootable && (
                  <Badge variant="danger" dot glow>
                    <ShieldAlert size={10} /> PVP
                  </Badge>
                )}
              </div>
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

          {/* ── Scrollable body ── */}
          <div className={styles.body}>
            {/* POI Image */}
            {poi.image?.asset?.url && (
              <div className={styles.poiImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={poi.image.asset.url} alt={poi.name} />
              </div>
            )}

            {/* Description */}
            {poi.description && (
              <p className={styles.description}>{poi.description}</p>
            )}

            {/* ── Coordinates + Waypoint ── */}
            <div className={styles.coordBar}>
              <div className={styles.coordChip}>
                <span className={styles.coordAxis}>X</span>
                <span className={styles.coordVal}>{poi.euX}</span>
              </div>
              <div className={styles.coordChip}>
                <span className={styles.coordAxis}>Y</span>
                <span className={styles.coordVal}>{poi.euY}</span>
              </div>
              <div className={styles.coordChip}>
                <span className={styles.coordAxis}>Z</span>
                <span className={styles.coordVal}>{poi.euZ}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
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

            {/* ── Globals: Activity Chart (directly under waypoint) ── */}
            {isAsteroid && !loading && hourly.length > 0 && (
              <div className={styles.activityWrap}>
                <span className={styles.sectionLabel}>
                  <Clock size={10} /> 24h Activity
                </span>
                <div className={styles.activityChart}>
                  {hourly.map((h) => (
                    <div
                      key={h.bucketIndex}
                      className={styles.activityBar}
                      style={{
                        height: `${Math.max((h.totalPED / maxHourlyPED) * 100, 2)}%`,
                      }}
                      title={`${new Date(h.timestamp).getUTCHours()}:00 UTC — ${h.globalCount} globals, ${formatPED(h.totalPED)} PED`}
                    />
                  ))}
                </div>
                <div className={styles.activityAxis}>
                  {hourly
                    .filter((_, i) => i % 6 === 0)
                    .map((h) => (
                      <span key={h.bucketIndex}>
                        {new Date(h.timestamp).getUTCHours()}:00
                      </span>
                    ))}
                  <span>Now</span>
                </div>
              </div>
            )}

            {/* ── Globals: 24h Overview (slimline row) ── */}
            {isAsteroid && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>24h Overview</span>

                {loading ? (
                  <div className={styles.overviewRow}>
                    <Skeleton variant="stat" />
                    <Skeleton variant="stat" />
                    <Skeleton variant="stat" />
                    <Skeleton variant="stat" />
                  </div>
                ) : stats ? (
                  <div className={styles.overviewRow}>
                    <div className={styles.overviewStat}>
                      <span className={styles.overviewValue}>{stats.totalGlobals}</span>
                      <span className={styles.overviewLabel}>Globals</span>
                    </div>
                    <div className={styles.overviewStat}>
                      <span className={`${styles.overviewValue} ${styles.overviewAccent}`}>
                        {formatPED(stats.totalPED)}
                      </span>
                      <span className={styles.overviewLabel}>PED</span>
                    </div>
                    <div className={styles.overviewStat}>
                      <span className={styles.overviewValue}>{stats.hofCount}</span>
                      <span className={styles.overviewLabel}>HoFs</span>
                    </div>
                    <div className={styles.overviewStat}>
                      <span className={styles.overviewValue}>{stats.uniqueMiners}</span>
                      <span className={styles.overviewLabel}>Miners</span>
                    </div>
                  </div>
                ) : (
                  <p className={styles.noStats}>No globals in the last 24h</p>
                )}
              </div>
            )}

            {/* ── Globals: Top Miners ── */}
            {isAsteroid && !loading && topMiners.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Top Miners</span>
                <div className={styles.minerList}>
                  {topMiners.slice(0, 5).map((m, i) => (
                    <div key={i} className={styles.minerItem}>
                      <span className={styles.minerRank}>{i + 1}</span>
                      <span className={styles.minerName}>{m.avatar}</span>
                      <span className={styles.minerCount}>
                        {m.globalCount}g
                      </span>
                      <span className={styles.minerPed}>
                        {formatPED(m.totalPED)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Globals: Last 5 ── */}
            {isAsteroid && !loading && recentGlobals.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Recent Globals</span>
                <div className={styles.feedList}>
                  {recentGlobals.slice(0, 5).map((g, i) => (
                    <div key={i} className={styles.feedItem}>
                      <span
                        className={`${styles.feedValue} ${g.isHof ? styles.feedValueHof : ""}`}
                      >
                        {formatPED(g.value)}
                      </span>
                      <span className={styles.feedAvatar}>{g.avatar}</span>
                      <span className={styles.feedVariant}>
                        {g.variant.replace(/^[A-Z]-type Asteroid /, "")}
                      </span>
                      <span className={styles.feedTime}>
                        {timeAgo(g.dateTime)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
