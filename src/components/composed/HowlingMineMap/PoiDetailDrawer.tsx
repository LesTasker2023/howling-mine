/* ═══════════════════════════════════════════════════════════════════════════
   PoiDetailDrawer — Full-height slide-out panel for selected map POIs
   Shows all CMS fields + live EntropiaCentral space mining stats for asteroids
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  X,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Badge, Button, Skeleton } from "@/components/ui";
import type { SpaceMiningStats, AsteroidTypeStats } from "@/components/composed/MiningAnalytics";
import type { MapPoi } from "./HowlingMineMap";
import styles from "./PoiDetailDrawer.module.css";

/* ── Map POI category → asteroid type key ── */
const CAT_TO_TYPE: Record<string, string> = {
  "asteroid-c": "C",
  "asteroid-f": "F",
  "asteroid-s": "S",
  "asteroid-m": "M",
  "asteroid-nd": "ND",
};

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

function timeAgoDrawer(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── EntropiaCentral space mining stats fetch (shared cache) ── */
const CACHE_TTL = 5 * 60_000; // 5 min

let statsCache: { data: SpaceMiningStats | null; ts: number } | null = null;

async function fetchSpaceMiningStats(): Promise<SpaceMiningStats | null> {
  if (statsCache && Date.now() - statsCache.ts < CACHE_TTL) return statsCache.data;

  try {
    const res = await fetch("/api/space-mining-stats");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: SpaceMiningStats = await res.json();
    statsCache = { data, ts: Date.now() };
    return data;
  } catch {
    statsCache = { data: null, ts: Date.now() };
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
  const [data, setData] = useState<SpaceMiningStats | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fetchIdRef = useRef(0);

  const isAsteroid = poi?.category.startsWith("asteroid-") ?? false;

  /* Fetch space mining stats when an asteroid POI is opened */
  useEffect(() => {
    if (!poi || !isAsteroid) {
      setData(null);
      setLoaded(false);
      return;
    }
    const id = ++fetchIdRef.current;
    setLoaded(false);
    fetchSpaceMiningStats().then((result) => {
      if (fetchIdRef.current !== id) return;
      setData(result);
      setLoaded(true);
    });
  }, [poi?._id, isAsteroid]);

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

  const asteroidType = poi ? (CAT_TO_TYPE[poi.category] ?? null) : null;
  const typeStats: AsteroidTypeStats | null = asteroidType && data
    ? (data.asteroidTypes ?? []).find((t) => t.type === asteroidType) ?? null
    : null;

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

            {/* ── Space Mining: 24h Stats ── */}
            {isAsteroid && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  {asteroidType ? `${asteroidType}-type` : "Space Mining"} — 24h
                </span>

                {loading ? (
                  <div className={styles.overviewRow}>
                    <Skeleton variant="stat" />
                    <Skeleton variant="stat" />
                    <Skeleton variant="stat" />
                    <Skeleton variant="stat" />
                  </div>
                ) : typeStats ? (
                  <div className={styles.overviewRow}>
                    <div className={styles.overviewStat}>
                      <span className={styles.overviewValue}>{typeStats.count}</span>
                      <span className={styles.overviewLabel}>Globals</span>
                    </div>
                    <div className={styles.overviewStat}>
                      <span className={`${styles.overviewValue} ${styles.overviewAccent}`}>
                        {formatPED(typeStats.totalValue)}
                      </span>
                      <span className={styles.overviewLabel}>PED</span>
                    </div>
                    <div className={styles.overviewStat}>
                      <span className={styles.overviewValue}>{formatPED(typeStats.avgValue)}</span>
                      <span className={styles.overviewLabel}>Avg</span>
                    </div>
                    <div className={styles.overviewStat}>
                      <span className={styles.overviewValue}>{typeStats.hofCount}</span>
                      <span className={styles.overviewLabel}>HoFs</span>
                    </div>
                  </div>
                ) : data ? (
                  <p className={styles.noStats}>No {asteroidType}-type activity in last 24h</p>
                ) : (
                  <p className={styles.noStats}>Stats unavailable</p>
                )}
              </div>
            )}

            {/* ── Type-specific recent globals ── */}
            {isAsteroid && !loading && (typeStats?.recentGlobals?.length ?? 0) > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Recent Globals</span>
                <div className={styles.feedList}>
                  {typeStats!.recentGlobals.slice(0, 5).map((g: import("@/components/composed/MiningAnalytics").GlobalEntry, i: number) => (
                    <div key={i} className={styles.feedItem}>
                      <span className={`${styles.feedValue} ${g.isHof ? styles.feedValueHof : ""}`}>
                        {formatPED(g.globalValue)}
                      </span>
                      <span className={styles.feedAvatar}>{g.avatarName}</span>
                      <span className={styles.feedVariant}>
                        {g.depositName.replace(/^[A-Z]+-type Asteroid /, "")}
                      </span>
                      <span className={styles.feedTime}>{timeAgoDrawer(g.dateTime)}</span>
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
