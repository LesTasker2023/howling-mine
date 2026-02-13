"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui";
import styles from "./SiteHero.module.css";

interface SiteHeroProps {
  /** Main title — wrap key word in * for accent + glitch effect */
  title: string;
  /** Tagline displayed with terminal-style typing cursor */
  tagline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Array of video paths for the background */
  videos?: string[];
}

/* ── Stagger orchestration ── */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const slideUp: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeScale: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Render the title, splitting `*word*` segments into glitch-animated accent spans.
 */
function renderTitle(raw: string) {
  const parts = raw.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={i} className={styles.titleAccent}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

export function SiteHero({
  title,
  tagline,
  primaryCta,
  secondaryCta,
  videos = [],
}: SiteHeroProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const transitioningRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const hasVideos = videos.length > 0;

  useEffect(() => setMounted(true), []);

  /* Fade to black → advance → snap back in */
  const triggerTransition = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    setVisible(false);
    timerRef.current = setTimeout(() => {
      if (videos.length > 1) {
        setActiveIdx((prev) => (prev + 1) % videos.length);
      } else {
        const vid = videoRef.current;
        if (vid) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
        transitioningRef.current = false;
        setTimeout(() => setVisible(true), 100);
      }
    }, 800);
  }, [videos.length]);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || transitioningRef.current) return;
    const remaining = vid.duration - vid.currentTime;
    if (isFinite(remaining) && remaining < 1.0) triggerTransition();
  }, [triggerTransition]);

  useEffect(() => {
    if (!hasVideos) return;
    transitioningRef.current = false;
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.play().catch(() => {});
    setTimeout(() => setVisible(true), 0);
  }, [activeIdx, hasVideos]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (videos.length < 2) return;
    const nextIdx = (activeIdx + 1) % videos.length;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = videos[nextIdx];
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [activeIdx, videos]);

  return (
    <section className={styles.hero}>
      {/* ── Video background ── */}
      {hasVideos && <div className={styles.videoBackdrop} aria-hidden />}
      {hasVideos && (
        <div
          className={`${styles.videoBg} ${visible ? styles.videoVisible : ""}`}
        >
          <video
            ref={videoRef}
            className={styles.video}
            src={videos[activeIdx]}
            muted
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={triggerTransition}
          />
        </div>
      )}

      {/* ── Overlays ── */}
      <div className={styles.noiseOverlay} aria-hidden />
      <div className={styles.scanLines} aria-hidden />
      <div className={styles.vignetteOverlay} aria-hidden />
      <div className={styles.glow} aria-hidden />

      {/* ── HUD corners ── */}
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerTR} aria-hidden />
      <div className={styles.cornerBL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />

      {/* ── HUD side readout ── */}
      <div className={styles.sideReadout} aria-hidden>
        <span>SYS:ONLINE</span>
        <span>SEC:HOWLING</span>
        <span>DEPTH:2.4KM</span>
        <span>SIGNAL:██▓░</span>
      </div>

      {/* ── Tactical Overview HUD (disabled for now) ──
      <motion.div
        className={styles.tacPanel}
        aria-hidden
        initial={{ opacity: 0, x: 30 }}
        animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
      >
        <div className={styles.miniMap}>
          <div className={styles.mapGrid} />
          <div className={styles.mapHeader}>SECTOR MAP — HOWLING MINE</div>
          <div className={styles.mapRing} />
          <div className={`${styles.mapPoint} ${styles.mp1}`} />
          <div className={`${styles.mapPoint} ${styles.mp2}`} />
          <div className={`${styles.mapPoint} ${styles.mp3}`} />
          <div className={`${styles.mapPoint} ${styles.mp4}`} />
          <div className={`${styles.mapPoint} ${styles.mp5}`} />
          <span className={`${styles.mapLabel} ${styles.ml1}`}>YOU</span>
          <span className={`${styles.mapLabel} ${styles.ml2}`}>STATION</span>
        </div>
        <div className={styles.tacRow}>
          <div className={styles.tacBox}>
            <div className={styles.tacBoxTitle}>Threat Level</div>
            <div className={styles.threatMeter}>
              <div className={`${styles.threatSeg} ${styles.threatActive}`} />
              <div className={`${styles.threatSeg} ${styles.threatActive}`} />
              <div className={`${styles.threatSeg} ${styles.threatActive}`} />
              <div className={`${styles.threatSeg} ${styles.threatActive} ${styles.threatHigh}`} />
              <div className={styles.threatSeg} />
            </div>
            <div className={styles.threatVal}>HIGH</div>
          </div>
          <div className={styles.tacBox}>
            <div className={styles.tacBoxTitle}>Signal</div>
            <div className={styles.sigWave}>
              <svg viewBox="0 0 120 24" preserveAspectRatio="none">
                <path d="M0,12 Q10,2 20,12 Q30,22 40,12 Q50,2 60,12 Q70,22 80,12 Q90,2 100,12 Q110,22 120,12" />
              </svg>
            </div>
          </div>
        </div>
        <div className={styles.tacStats}>
          <div className={styles.tacStat}>
            <div className={styles.tacStatVal}>79228</div>
            <div className={styles.tacStatLabel}>X</div>
          </div>
          <div className={styles.tacStat}>
            <div className={styles.tacStatVal}>79228</div>
            <div className={styles.tacStatLabel}>Y</div>
          </div>
          <div className={styles.tacStat}>
            <div className={styles.tacStatVal}>25</div>
            <div className={styles.tacStatLabel}>Z</div>
          </div>
          <div className={styles.tacStat}>
            <div className={styles.tacStatVal}>2.4</div>
            <div className={styles.tacStatLabel}>KM</div>
          </div>
        </div>
        <div className={styles.tacDivider} />
        <div className={styles.tacStatusRows}>
          <div className={styles.tacStatusRow}>
            <span className={styles.tacStatusLabel}>Mining</span>
            <span className={styles.tacStatusValue}>Ore / Enmatter</span>
          </div>
          <div className={styles.tacStatusRow}>
            <span className={styles.tacStatusLabel}>Mobs</span>
            <span className={styles.tacStatusValue}>Cosmic Horrors</span>
          </div>
          <div className={styles.tacStatusRow}>
            <span className={styles.tacStatusLabel}>Status</span>
            <span className={`${styles.tacStatusValue} ${styles.tacLive}`}>
              <span className={styles.tacLiveDot} /> Active
            </span>
          </div>
        </div>
      </motion.div>
      ── */}

      {/* ── Content ── */}
      <motion.div
        className={styles.content}
        variants={stagger}
        initial="hidden"
        animate={mounted ? "show" : "hidden"}
      >
        {/* Eyebrow */}
        <motion.div className={styles.eyebrow} variants={slideUp}>
          <span>DEEP-SPACE MINING INTELLIGENCE</span>
        </motion.div>

        {/* Title */}
        <motion.h1 className={styles.title} variants={slideUp}>
          {renderTitle(title)}
        </motion.h1>

        {/* Tagline */}
        {tagline && (
          <motion.p className={styles.tagline} variants={slideUp}>
            {tagline}
            <span className={styles.cursor} />
          </motion.p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <motion.div className={styles.actions} variants={fadeScale}>
            {primaryCta && (
              <Link href={primaryCta.href} className={styles.ctaLink}>
                <Button variant="primary" size="lg">
                  {primaryCta.label}
                </Button>
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className={styles.ctaLink}>
                <Button variant="ghost" size="lg">
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        {/* Bottom coordinates */}
        <motion.div className={styles.coordBar} variants={slideUp}>
          <span>X:79228</span>
          <span className={styles.coordDivider}>|</span>
          <span>Y:79228</span>
          <span className={styles.coordDivider}>|</span>
          <span>Z:25</span>
          <span className={styles.coordDivider}>|</span>
          <span>HOWLING MINE SECTOR</span>
        </motion.div>
      </motion.div>

      {/* ── Bottom line ── */}
      <div className={styles.bottomLine} aria-hidden />

      {hasVideos && (
        <span className={styles.footageDisclaimer}>
          Not actual game footage
        </span>
      )}
    </section>
  );
}
