"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { usePlaceholderImage } from "@/context/PlaceholderImageContext";
import styles from "./HeroSequence.module.css";

/* ═══════════════════════════════════════════════════════════════════════════
   HeroSequence — click-triggered cinematic intro
   ───────────────────────────────────────────────────────────────────────────
   A sci-fi START button sits beside the hero. On click it auto-plays
   through the dissolve into a boot sequence, then waits for a keypress.

   Frame 0 → Hero + START button visible
   Frame 1 → Hero dissolves, particles scatter               (~1.5 s)
   Frame 2 → Boot sequence → target lock → zoom → fade        (auto)
   Frame 3 → Walkthrough step grid (4×2 snake path)           (final)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Boot step definitions ─── */
interface SubLine {
  text: string;
  delay: number;
}

interface BootStepDef {
  id: string;
  label: string;
  doneLabel: string;
  subs: SubLine[];
  processMs: number;
  holdMs: number;
}

const STEPS: BootStepDef[] = [
  {
    id: "init",
    label: "SYSTEM INITIALIZING…",
    doneLabel: "SYSTEM ONLINE",
    subs: [
      { text: "Loading core modules…", delay: 202 },
      { text: "Memory check: 64TB ████████ OK", delay: 504 },
      { text: "Subsystem calibration complete", delay: 806 },
    ],
    processMs: 302,
    holdMs: 202,
  },
  {
    id: "connect",
    label: "ESTABLISHING UPLINK…",
    doneLabel: "CONNECTED",
    subs: [
      { text: "Frequency: 2.442 GHz", delay: 161 },
      { text: "Handshake ░░░▓▓▓███████", delay: 564 },
      { text: "Auth token verified", delay: 1008 },
    ],
    processMs: 302,
    holdMs: 202,
  },
  {
    id: "grid",
    label: "LOADING MINING GRID…",
    doneLabel: "MINING GRID ONLINE",
    subs: [
      { text: "Sector 79228 — depth: 2.4km", delay: 161 },
      { text: "Topographic render in progress…", delay: 504 },
      { text: "Grid calibration locked", delay: 1008 },
    ],
    processMs: 403,
    holdMs: 302,
  },
  {
    id: "scan",
    label: "SCANNING SECTOR…",
    doneLabel: "SCAN COMPLETE",
    subs: [
      { text: "Frequency sweep active…", delay: 202 },
      { text: "Resolving signatures…", delay: 605 },
    ],
    processMs: 1008,
    holdMs: 403,
  },
  {
    id: "target",
    label: "ACQUIRING TARGET…",
    doneLabel: "TARGET LOCKED",
    subs: [
      { text: "Triangulating signal origin…", delay: 202 },
      { text: "Coordinates: 79228.4N 31447.2E", delay: 605 },
    ],
    processMs: 504,
    holdMs: 403,
  },
];

/* POI markers revealed by the scanline — real EU space-map coordinates
   Normalized: x% = 10 + (euX-58000)/32000*80
               y% = 90 - (euY-57000)/25000*80   (Y inverted)            */
const POIS = [
  { id: "rocktropia", label: "ROCKTROPIA", x: 39, y: 15, isTarget: false },
  { id: "mine", label: "THE HOWLING MINE", x: 63, y: 19, isTarget: true },
  { id: "toulan", label: "TOULAN", x: 78, y: 13, isTarget: false },
  { id: "calypso", label: "CALYPSO", x: 11, y: 49, isTarget: false },
  { id: "nextisland", label: "NEXT ISLAND", x: 87, y: 50, isTarget: false },
  { id: "cyrene", label: "CYRENE", x: 18, y: 85, isTarget: false },
  { id: "arkadia", label: "ARKADIA", x: 59, y: 85, isTarget: false },
];

const SCANLINE_DURATION = 2; /* seconds — POI reveal delays derived from this */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface WalkthroughStep {
  title: string;
  subtitle?: string;
  href?: string;
  placeholderSrc?: string;
  image?: {
    asset: { _id: string; url: string };
    alt?: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
}

interface HeroSequenceProps {
  children: ReactNode;
  walkthroughSteps?: WalkthroughStep[];
  placeholderImage?: {
    asset: { _id: string; url: string };
    alt?: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
}

/* ═══════════ BOOT SEQUENCE ═══════════ */
type StepState = {
  active: boolean;
  subVis: boolean[];
  done: boolean;
  collapsed: boolean;
};

function BootSequence({
  onReady,
  onHudReveal,
}: {
  onReady: () => void;
  onHudReveal: () => void;
}) {
  const [steps, setSteps] = useState<StepState[]>(
    STEPS.map((s) => ({
      active: false,
      subVis: s.subs.map(() => false),
      done: false,
      collapsed: false,
    })),
  );
  const [showGrid, setShowGrid] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [zooming, setZooming] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const upStep = useCallback(
    (si: number, patch: Partial<StepState>) =>
      setSteps((prev) =>
        prev.map((s, i) => (i === si ? { ...s, ...patch } : s)),
      ),
    [],
  );

  const upSub = useCallback(
    (si: number, li: number) =>
      setSteps((prev) =>
        prev.map((s, i) => {
          if (i !== si) return s;
          const sv = [...s.subVis];
          sv[li] = true;
          return { ...s, subVis: sv };
        }),
      ),
    [],
  );

  /* Schedule all boot timers on mount */
  useEffect(() => {
    const T = timersRef.current;
    let t = 200;

    for (let si = 0; si < STEPS.length; si++) {
      const step = STEPS[si];
      const start = t;

      /* Activate step (show main label) */
      T.push(setTimeout(() => upStep(si, { active: true }), start));

      /* Fire visuals at step activation */
      if (step.id === "grid")
        T.push(setTimeout(() => setShowGrid(true), start));
      if (step.id === "scan")
        T.push(setTimeout(() => setShowScan(true), start));

      /* Show sub-lines at individual delays */
      for (let li = 0; li < step.subs.length; li++) {
        T.push(setTimeout(() => upSub(si, li), start + step.subs[li].delay));
      }

      /* Complete step */
      const lastDelay = step.subs[step.subs.length - 1].delay;
      const doneAt = start + lastDelay + step.processMs;
      T.push(
        setTimeout(() => {
          upStep(si, { done: true });
          if (step.id === "connect") onHudReveal();
          if (step.id === "target") setShowTarget(true);
        }, doneAt),
      );

      /* Collapse sub-lines */
      T.push(setTimeout(() => upStep(si, { collapsed: true }), doneAt + 250));

      t = doneAt + step.holdMs;
    }

    /* After target lock → zoom → fade → done */
    T.push(setTimeout(() => setZooming(true), t + 400));
    T.push(setTimeout(() => setFadingOut(true), t + 1800));
    T.push(setTimeout(() => onReady(), t + 2600));

    return () => T.forEach(clearTimeout);
  }, [onHudReveal, onReady, upStep, upSub]);

  return (
    <motion.div
      className={`${styles.bootContainer} ${fadingOut ? styles.bootFadingOut : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Visual overlay (grid, scanline, POIs, target lock) ── */}
      <div
        className={`${styles.bootZoomWrap} ${zooming ? styles.bootZooming : ""}`}
      >
        {showGrid && <div className={styles.miningGrid} />}
        {showScan && <div className={styles.scanline} />}

        <div className={styles.bootVisuals}>
          {showScan &&
            POIS.map((poi) => (
              <div
                key={poi.id}
                className={`${styles.poi} ${showTarget && poi.isTarget ? styles.poiTarget : ""}`}
                style={{
                  left: `${poi.x}%`,
                  top: `${poi.y}%`,
                  animationDelay: `${(poi.y / 100) * SCANLINE_DURATION}s`,
                }}
              >
                <span className={styles.poiDot} />
                <span className={styles.poiLabel}>{poi.label}</span>
              </div>
            ))}

          {showTarget &&
            (() => {
              const t = POIS.find((p) => p.isTarget);
              if (!t) return null;
              return (
                <div
                  className={styles.targetLock}
                  style={{ left: `${t.x}%`, top: `${t.y}%` }}
                >
                  <span
                    className={`${styles.targetBracket} ${styles.tBracketTL}`}
                  />
                  <span
                    className={`${styles.targetBracket} ${styles.tBracketTR}`}
                  />
                  <span
                    className={`${styles.targetBracket} ${styles.tBracketBL}`}
                  />
                  <span
                    className={`${styles.targetBracket} ${styles.tBracketBR}`}
                  />
                  <span className={styles.targetPing} />
                </div>
              );
            })()}
        </div>
      </div>

      {/* ── Terminal readout ── */}
      <div
        className={`${styles.bootTerminal} ${zooming || fadingOut ? styles.bootTerminalHide : ""}`}
      >
        {STEPS.map((step, si) => {
          const s = steps[si];
          if (!s.active) return null;
          return (
            <div key={step.id} className={styles.bootStep}>
              <div
                className={`${styles.bootLine} ${styles.bootLineVisible} ${s.done ? styles.bootLineDone : ""}`}
              >
                <span className={styles.bootPrompt}>&gt;</span>
                <span>{s.done ? step.doneLabel : step.label}</span>
                {s.done && <span className={styles.bootCheck}>✓</span>}
              </div>
              {!s.collapsed &&
                step.subs.map((sub, li) =>
                  s.subVis[li] ? (
                    <div
                      key={li}
                      className={`${styles.bootSub} ${s.done ? styles.bootSubCollapse : ""}`}
                    >
                      <span className={styles.bootSubIndent}>└</span>
                      <span>{sub.text}</span>
                    </div>
                  ) : null,
                )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════ STEP GRID — 4×2 walkthrough cards ═══════════ */

/*  Visual order follows a snake path:
    1 → 2 → 3 → 4
    8 ← 7 ← 6 ← 5                                            */
const SNAKE_ORDER = [0, 1, 2, 3, 7, 6, 5, 4]; /* visual slot → data index */

function StepGrid({
  steps,
  placeholderImage,
}: {
  steps: WalkthroughStep[];
  placeholderImage?: HeroSequenceProps["placeholderImage"];
}) {
  return (
    <motion.div
      className={styles.stepGrid}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <div className={styles.stepGridInner}>
        {SNAKE_ORDER.map((dataIdx, slot) => {
          const step = steps[dataIdx];
          if (!step) return <div key={slot} className={styles.stepCardEmpty} />;

          const stepNum = dataIdx + 1;
          const isTopRow = slot < 4;

          /* Arrow logic for snake path:
             Top row (slots 0-2): right arrow between cards
             Slot 3 (step 4): down arrow to step 5
             Bottom row (slots 5-7): left arrow between cards
             Slot 4 (step 8): no arrow — end of chain */
          const showRightArrow = isTopRow && slot < 3;
          const showDownArrow = slot === 3;
          const showLeftArrow = !isTopRow && slot > 4;

          const card = (
            <motion.div
              key={slot}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: dataIdx * 0.1,
                ease: EASE_OUT,
              }}
            >
              {step.href ? (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stepCardLink}
                >
                  <StepCardContent
                    step={step}
                    stepNum={stepNum}
                    placeholderImage={placeholderImage}
                  />
                </a>
              ) : (
                <div className={styles.stepCardLink}>
                  <StepCardContent
                    step={step}
                    stepNum={stepNum}
                    placeholderImage={placeholderImage}
                  />
                </div>
              )}

              {showRightArrow && (
                <span
                  className={`${styles.stepArrow} ${styles.stepArrowRight}`}
                  aria-hidden
                >
                  {"\u203A"}
                </span>
              )}

              {showDownArrow && (
                <span
                  className={`${styles.stepArrow} ${styles.stepArrowDown}`}
                  aria-hidden
                >
                  {"\u203A"}
                </span>
              )}

              {showLeftArrow && (
                <span
                  className={`${styles.stepArrow} ${styles.stepArrowLeft}`}
                  aria-hidden
                >
                  {"\u2039"}
                </span>
              )}
            </motion.div>
          );

          return card;
        })}
      </div>
    </motion.div>
  );
}

function StepCardContent({
  step,
  stepNum,
  placeholderImage,
}: {
  step: WalkthroughStep;
  stepNum: number;
  placeholderImage?: HeroSequenceProps["placeholderImage"];
}) {
  const ctxPlaceholder = usePlaceholderImage();
  const fallback = placeholderImage ?? ctxPlaceholder;

  const imgSrc = step.image?.asset
    ? urlFor(step.image).width(400).height(200).auto("format").url()
    : step.placeholderSrc
      ? step.placeholderSrc
      : fallback?.asset
        ? urlFor(fallback).width(400).height(200).auto("format").url()
        : null;

  const imgAlt = step.image?.alt || step.title;

  return (
    <>
      {imgSrc && (
        <div className={styles.stepCardImage}>
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={400}
            height={200}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.stepCardBody}>
        <span className={styles.stepNumber}>
          {String(stepNum).padStart(2, "0")}
        </span>
        <h3 className={styles.stepTitle}>Step {stepNum}</h3>
        {step.subtitle && (
          <p className={styles.stepSubtitle}>{step.subtitle}</p>
        )}
      </div>
    </>
  );
}

/* ═══════════ START BUTTON ═══════════ */
function StartButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      className={styles.startBtn}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] },
      }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(8px) brightness(1.5)",
        transition: { duration: 0.5, ease: [0.4, 0, 0, 1] },
      }}
      aria-label="Start cinematic experience"
    >
      ENGAGE
    </motion.button>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export function HeroSequence({
  children,
  walkthroughSteps = [],
  placeholderImage,
}: HeroSequenceProps) {
  const [frame, setFrame] = useState(0);
  const [hudRevealed, setHudRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();

  /* Reset to frame 0 on route change OR when the Home logo is clicked */
  const prevPath = useRef(pathname);
  useLayoutEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      clearTimeout(timerRef.current);
      setFrame(0);
      setHudRevealed(false);
    }
  }, [pathname]);

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current);
      setFrame(0);
      setHudRevealed(false);
    };
    window.addEventListener("hero:reset", reset);
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("hero:reset", reset);
    };
  }, []);

  /* Lock scrolling keys (space, arrows, pgup/pgdn) while sequence is active */
  useEffect(() => {
    if (frame === 0 || frame >= 3) return; /* lock during frames 1-2 */
    const BLOCKED = new Set([
      "Space",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
    ]);
    const block = (e: KeyboardEvent) => {
      if (BLOCKED.has(e.code)) e.preventDefault();
    };
    window.addEventListener("keydown", block, { passive: false });
    return () => window.removeEventListener("keydown", block);
  }, [frame]);

  /* START button clicked — dissolve hero then show boot */
  const launch = useCallback(() => {
    if (frame !== 0) return;
    setFrame(1);
    timerRef.current = setTimeout(() => setFrame(2), 750);
  }, [frame]);

  /* Boot sequence completed → auto-transition */
  const handleBootDone = useCallback(() => {
    setFrame(3);
  }, []);

  const handleHudReveal = useCallback(() => {
    setHudRevealed(true);
  }, []);

  return (
    <div className={styles.heroContainer}>
      {/* ── Always-visible background ── */}
      <div className={styles.blackBg} aria-hidden />

      {/* ── Frame 0: CMS Hero ── */}
      <div
        className={`${styles.heroLayer} ${frame >= 1 ? styles.heroHidden : ""}`}
      >
        {children}
      </div>

      {/* ── START button (frame 0 only) ── */}
      <AnimatePresence>
        {frame === 0 && <StartButton key="start" onClick={launch} />}
      </AnimatePresence>

      {/* ── Blackout + warp ── */}
      <div
        className={`${styles.blackout} ${
          frame >= 1 ? styles.blackoutVisible : ""
        }`}
        aria-hidden
      />
      <div
        className={`${styles.warpStreaks} ${
          frame === 1 ? styles.warpActive : ""
        }`}
        aria-hidden
      />

      {/* ── Persistent HUD (revealed by boot connect step) ── */}
      <div
        className={`${styles.hudLayer} ${hudRevealed ? styles.hudRevealed : ""}`}
        aria-hidden
      >
        <div className={styles.hudCornerTL} />
        <div className={styles.hudCornerTR} />
        <div className={styles.hudCornerBL} />
        <div className={styles.hudCornerBR} />
        <div className={styles.hudReadout}>
          <span>SYS:ONLINE</span>
          <span>SEC:HOWLING</span>
          <span>DEPTH:2.4KM</span>
          <span>SIGNAL:██▓░</span>
        </div>
        <div className={styles.hudBottomLine} />
      </div>

      {/* ── Boot sequence (stays until keypress) ── */}
      <AnimatePresence>
        {frame === 2 && (
          <BootSequence
            key="boot"
            onReady={handleBootDone}
            onHudReveal={handleHudReveal}
          />
        )}
      </AnimatePresence>

      {/* ── Frame 3: Walkthrough step grid ── */}
      <AnimatePresence>
        {frame === 3 && walkthroughSteps.length > 0 && (
          <StepGrid
            key="steps"
            steps={walkthroughSteps}
            placeholderImage={placeholderImage}
          />
        )}
      </AnimatePresence>

      {/* ── Persistent overlays ── */}
      <div className={styles.noiseOverlay} aria-hidden />
      <div className={styles.scanLines} aria-hidden />
      <div className={styles.vignette} aria-hidden />
    </div>
  );
}
