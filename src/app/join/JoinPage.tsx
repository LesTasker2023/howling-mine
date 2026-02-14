/**
 * JoinPage — "Join the Crew" community conversion page.
 *
 * Strategy: Lead with adventure & community, not money. The earnings
 * are a supporting detail, not the headline. Discord is the primary
 * soft-conversion; EU account creation is the hard conversion.
 *
 * Sections:
 *   1. Hero — adventure hook, video bg, Discord + signup CTAs
 *   2. What is The Howling Mine? — context for cold visitors
 *   3. What You Get — 3 focused cards (gear, community, earnings)
 *   4. How to Start — 4-step timeline
 *   5. FAQ — 4 questions, no defensive posturing
 *   6. Final CTA — Discord + Account, side-by-side
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Rocket,
  Crosshair,
  Banknote,
  CheckCircle2,
  Swords,
  Users,
  Wallet,
} from "lucide-react";
import { Button, SectionHeader, Panel, Card } from "@/components/ui";
import { staggerContainer, fadeUp, fadeIn } from "@/lib/motion";
import styles from "./page.module.css";

/* ── Constants ── */
const DISCORD_URL = "https://discord.gg/howlingmine"; // TODO: replace with real invite

/* ── Animation presets ── */
const heroStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};
const heroFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

/* ── Video sources ── */
const HERO_VIDEOS = [
  "/videos/hero-2.webm",
  "/videos/hero-1.webm",
  "/videos/hero-3.webm",
];

/* ── Data ─────────────────────────────────────────────────────────────── */

const TRUST = [
  "100% free to start",
  "20+ year-old economy",
  "Real USD withdrawals",
  "Active Discord crew",
];

const FEATURES = [
  {
    icon: Swords,
    title: "Free Gear to Start",
    desc: "The Job Broker provides weapons, ammo, and daily missions — everything you need, on the house. No deposit, no credit card, no catch.",
  },
  {
    icon: Users,
    title: "A Crew That Has Your Back",
    desc: "Experienced miners and hunters on Discord ready to show you the ropes. Group runs, mentorship, and a community that actually wants you to succeed.",
  },
  {
    icon: Wallet,
    title: "Earn Real Money",
    desc: "The in-game currency (PED) converts to USD at a fixed 10:1 rate. Withdraw to your bank account. Players have been doing this since 2003 — it's not a gimmick.",
  },
];

const STEPS = [
  {
    icon: Shield,
    title: "Create Free Account",
    desc: "Sign up for Entropia Universe. Complete the tutorial on Setesh to learn the basics and grab starter gear.",
    guide: "/guides/mining-101",
  },
  {
    icon: Rocket,
    title: "Travel to Howling Mine",
    desc: "Take the free daily shuttle from any spaceport. You'll land at Howling Mine Space Terminal \u2014 that's home base.",
    guide: "/guides/space-navigation",
  },
  {
    icon: Crosshair,
    title: "Talk to the Job Broker",
    desc: 'Find "The Employer" NPC inside the terminal. Accept a daily mission — free weapons and ammo included.',
  },
  {
    icon: Banknote,
    title: "Hunt, Earn, Grow",
    desc: "Complete hunts, earn PED, level up your skills. The daily job is just the start — mining, crafting, and trading open up from here.",
  },
];

const FAQS = [
  {
    q: "Do I need to spend money?",
    a: "No. You can play entirely for free. The Job Broker provides weapons and ammo at no cost. Many players never deposit a single dollar.",
  },
  {
    q: "Can I actually withdraw real money?",
    a: "Yes. Entropia Universe has a real cash economy running since 2003. PED converts to USD at a fixed 10:1 rate. Withdraw directly to your bank account — tens of millions have been withdrawn by players over the years.",
  },
  {
    q: "How do I get to Howling Mine?",
    a: "After completing the tutorial, take the free daily shuttle from any major spaceport. You can also use 6 Teleporter Tokens for instant travel.",
  },
  {
    q: "How much time does it take?",
    a: "Daily hunts take about 30 minutes. Play as much or as little as you want — the daily job resets every 24 hours. No grind required.",
  },
];

/* ── Component ────────────────────────────────────────────────────────── */

export default function JoinPage({ signupUrl }: { signupUrl: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ── Video crossfade ── */
  const [activeIdx, setActiveIdx] = useState(0);
  const [videoVisible, setVideoVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const transRef = useRef(false);

  const triggerTransition = useCallback(() => {
    if (transRef.current) return;
    transRef.current = true;
    setVideoVisible(false);
    timerRef.current = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 800);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || transRef.current) return;
    const remaining = vid.duration - vid.currentTime;
    if (isFinite(remaining) && remaining < 1.0) triggerTransition();
  }, [triggerTransition]);

  useEffect(() => {
    transRef.current = false;
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.play().catch(() => {});
    setTimeout(() => setVideoVisible(true), 0);
  }, [activeIdx]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    const nextIdx = (activeIdx + 1) % HERO_VIDEOS.length;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = HERO_VIDEOS[nextIdx];
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [activeIdx]);

  return (
    <div className={styles.page}>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className={styles.hero}>
        {/* Video background */}
        <div className={styles.videoBackdrop} aria-hidden />
        <div
          className={`${styles.videoBg} ${videoVisible ? styles.videoVisible : ""}`}
        >
          <video
            ref={videoRef}
            className={styles.video}
            src={HERO_VIDEOS[activeIdx]}
            muted
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={triggerTransition}
          />
        </div>

        {/* Overlays */}
        <div className={styles.heroNoise} />
        <div className={styles.heroCrt} />
        <div className={styles.heroVignette} />
        <div className={styles.heroGlow} />

        {/* Corner brackets */}
        <div className={`${styles.corner} ${styles.cornerTL}`} />
        <div className={`${styles.corner} ${styles.cornerTR}`} />
        <div className={`${styles.corner} ${styles.cornerBL}`} />
        <div className={`${styles.corner} ${styles.cornerBR}`} />

        {/* Side readout */}
        <div className={styles.sideReadout} aria-hidden>
          <span>SYS:ONLINE</span>
          <span>SEC:HOWLING</span>
          <span>CREW:ACTIVE</span>
          <span>SIGNAL:██▓░</span>
        </div>

        {/* Content */}
        <motion.div
          className={styles.heroContent}
          variants={heroStagger}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
        >
          <motion.div className={styles.eyebrow} variants={heroFade}>
            <span>DEEP-SPACE EMPLOYMENT PROGRAM</span>
          </motion.div>

          <motion.h1 className={styles.title} variants={heroFade}>
            JOIN THE <span className={styles.titleAccent}>CREW</span>
          </motion.h1>

          <motion.p className={styles.tagline} variants={heroFade}>
            A real sci-fi universe with a real economy. We give you the gear,
            show you the ropes, and you <strong>earn real money</strong> while
            you play.
            <span className={styles.cursor} />
          </motion.p>

          <motion.div className={styles.noCreditCard} variants={heroFade}>
            :: Free to Play — No Deposit Required
          </motion.div>

          <motion.div className={styles.heroCtas} variants={heroFade}>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaLink}
            >
              <Button variant="primary" size="lg">
                Join Discord
              </Button>
            </a>
            <a href={signupUrl} className={styles.ctaLink}>
              <Button variant="secondary" size="lg">
                Create Game Account →
              </Button>
            </a>
          </motion.div>

          <motion.div className={styles.trustRow} variants={heroFade}>
            {TRUST.map((item) => (
              <span key={item} className={styles.trustItem}>
                <CheckCircle2 size={14} className={styles.trustIcon} />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Coordinate bar */}
        <motion.div
          className={styles.coordBar}
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <span>X:79228</span>
          <span className={styles.coordDiv}>|</span>
          <span>Y:79228</span>
          <span className={styles.coordDiv}>|</span>
          <span>Z:25</span>
          <span className={styles.coordDiv}>|</span>
          <span>HOWLING MINE SECTOR</span>
        </motion.div>

        <div className={styles.heroBottomLine} aria-hidden />
      </section>

      {/* ═══════════════════ WHAT IS THE HOWLING MINE? ═══════════════════ */}
      <motion.section
        className={styles.introSection}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <div className={styles.introInner}>
          <SectionHeader title="What Is The Howling Mine?" size="lg" />
          <p className={styles.introText}>
            Entropia Universe is a massive sci-fi MMO with a{" "}
            <strong>real cash economy</strong> — running since 2003. The in-game
            currency converts to real dollars. The Howling Mine is a player-run
            community within that universe: we organize hunts, mining runs, and
            help new players get started without spending a cent.
          </p>
        </div>
      </motion.section>

      {/* ═══════════════════ WHAT YOU GET ═══════════════════ */}
      <motion.section
        className={styles.section}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="What You Get" size="lg" />

        <motion.div
          className={styles.featureGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {FEATURES.map((feat) => (
            <motion.div key={feat.title} variants={fadeUp}>
              <Card variant="default">
                <div className={styles.featureInner}>
                  <feat.icon
                    size={28}
                    className={styles.featureIcon}
                    strokeWidth={1.5}
                  />
                  <h3 className={styles.featureTitle}>{feat.title}</h3>
                  <p className={styles.featureDesc}>{feat.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ═══════════════════ HOW TO START ═══════════════════ */}
      <motion.section
        className={styles.section}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="How to Start" size="lg" />

        <motion.div
          className={styles.stepsTimeline}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className={styles.stepRow}
              variants={fadeUp}
            >
              <div className={styles.stepIndicator}>
                <div className={styles.stepDot} />
                {i < STEPS.length - 1 && <div className={styles.stepLine} />}
              </div>
              <div className={styles.stepCard}>
                <Panel variant="default" size="md" noAnimation>
                  <div className={styles.stepInner}>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>{i + 1}</div>
                      <step.icon
                        size={20}
                        className={styles.stepIcon}
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                    {step.guide && (
                      <Link href={step.guide} className={styles.stepGuideLink}>
                        View Guide →
                      </Link>
                    )}
                  </div>
                </Panel>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.sectionCta}>
          <a href={signupUrl} className={styles.ctaLink}>
            <Button variant="primary" size="lg">
              Create Free Account →
            </Button>
          </a>
        </div>
      </motion.section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <motion.section
        className={styles.section}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="Questions" />

        <div className={styles.faqList}>
          {FAQS.map((faq) => (
            <details key={faq.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{faq.q}</summary>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <motion.section
        className={styles.finalCta}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <Panel variant="accent" size="lg">
          <div className={styles.finalCtaInner}>
            <div className={styles.finalCtaText}>
              <SectionHeader title="Ready?" accent />
              <p className={styles.finalCtaBody}>
                Jump into Discord and say hello — the crew will take it from
                there. Or create your game account and we&apos;ll see you at the
                terminal.
              </p>
            </div>
            <div className={styles.finalCtaActions}>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaLink}
              >
                <Button variant="primary" size="lg">
                  Join Discord
                </Button>
              </a>
              <a href={signupUrl} className={styles.ctaLink}>
                <Button variant="secondary" size="lg">
                  Create Game Account →
                </Button>
              </a>
            </div>
          </div>
        </Panel>
      </motion.section>
    </div>
  );
}
