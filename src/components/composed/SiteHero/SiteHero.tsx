"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { fadeIn } from "@/lib/motion";
import styles from "./SiteHero.module.css";

interface SiteHeroProps {
  /** Status badge text (e.g. "Alpha v0.1") */
  status?: string;
  /** Main title — wrap key word in * for accent color (e.g. "The *Howling* Mine") */
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Array of video paths for the background. Cycles with fade-to-black transitions. */
  videos?: string[];
}

/**
 * Render the title, splitting `*word*` segments into accent-colored spans.
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
  status,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  videos = [],
}: SiteHeroProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const transitioningRef = useRef(false);

  const hasVideos = videos.length > 0;

  /* Fade to black → advance (or restart) → fade back in */
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

  /* Use timeupdate to detect near-end — more reliable than onEnded for WebM */
  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || transitioningRef.current) return;
    const remaining = vid.duration - vid.currentTime;
    if (isFinite(remaining) && remaining < 1.0) {
      triggerTransition();
    }
  }, [triggerTransition]);

  /* When idx changes, load + play the new clip and fade back in */
  useEffect(() => {
    if (!hasVideos) return;
    transitioningRef.current = false;
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.play().catch(() => {});
    setTimeout(() => setVisible(true), 0);
  }, [activeIdx, hasVideos]);

  /* Cleanup timer on unmount */
  useEffect(() => () => clearTimeout(timerRef.current), []);

  /* Preload the next video in the sequence so transitions are instant */
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
    <motion.section
      className={styles.hero}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Video background */}
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

      {/* Decorations */}
      <div className={styles.glow} aria-hidden />
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerTR} aria-hidden />
      <div className={styles.cornerBL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />

      {/* Content */}
      <div className={styles.content}>
        {status && (
          <div className={styles.statusLine}>
            <span className={styles.statusDot} />
            {status}
          </div>
        )}

        <h1 className={styles.title}>{renderTitle(title)}</h1>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {(primaryCta || secondaryCta) && (
          <div className={styles.actions}>
            {primaryCta && (
              <Link href={primaryCta.href}>
                <Button variant="primary" size="lg">
                  {primaryCta.label}
                </Button>
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <Button variant="ghost" size="lg">
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {hasVideos && (
        <span className={styles.footageDisclaimer}>
          Not actual game footage
        </span>
      )}

      <div className={styles.bottomLine} aria-hidden />
    </motion.section>
  );
}
