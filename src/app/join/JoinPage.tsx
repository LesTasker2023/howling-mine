/**
 * JoinPage — "Get Paid to Play" conversion page.
 *
 * Strategy: Hit them in the face with the money. Lead with earnings,
 * back it up with proof, remove every objection, close hard.
 *
 * Sections:
 *   1.  Hero — "GET PAID TO PLAY", $18/month, video bg
 *   2.  Stats bar — $0 / 20+ years / $18/mo / millions withdrawn
 *   3.  Earnings Breakdown — the money ladder, no ambiguity
 *   4.  How to Start — 4-step timeline + mid-scroll CTA
 *   5.  Who is NEVERDIE? — credibility / social proof
 *   6.  FAQ — 8 questions, every objection killed
 *   7.  Final CTA — "Stop Playing for Free. Start Getting Paid."
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Rocket,
  Crosshair,
  Banknote,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Button, SectionHeader, Panel } from "@/components/ui";
import { staggerContainer, fadeUp, fadeIn } from "@/lib/motion";
import styles from "./page.module.css";

/* ── Constants ── */
const DISCORD_URL = "https://discord.gg/NnkPwamsDQ";

/* ── Animation presets ── */
const heroStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const heroFade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ── Video sources ── */
const HERO_VIDEOS = [
  "/videos/hero-2.webm",
  "/videos/hero-1.webm",
  "/videos/hero-3.webm",
];

/* ── Data ─────────────────────────────────────────────────────────────── */

const TRUST = [
  "Zero startup cost",
  "Free weapons & ammo",
  "Real USD withdrawals",
  "20+ year track record",
];

const STATS = [
  { value: "$0", label: "Required Investment" },
  { value: "20+", label: "Years Running" },
  { value: "$18", label: "Monthly Earnings" },
  { value: "Millions", label: "USD Withdrawn by Players" },
];

const EARNINGS = [
  {
    label: "Daily Mission Pay",
    value: "2 PED",
    usd: "≈ $0.20 USD",
    highlight: false,
  },
  {
    label: "Monthly (30 days)",
    value: "60 PED",
    usd: "≈ $6.00 USD",
    highlight: false,
  },
  {
    label: "With Rocktropia",
    value: "180 PED",
    usd: "≈ $18.00 USD/month",
    highlight: true,
  },
  {
    label: "Your Investment",
    value: "$0",
    usd: "Free weapons & ammo provided",
    highlight: false,
  },
];

const STEPS = [
  {
    icon: Shield,
    title: "Create Free Account",
    desc: "Sign up for Entropia Universe — completely free. Complete the short Setesh tutorial to learn combat, looting, and navigation.",
  },
  {
    icon: Rocket,
    title: "Catch the Free Shuttle",
    desc: "Take the FREE daily shuttle from any major spaceport. You'll land at Howling Mine Space Terminal — that's home base. No cost, no strings.",
  },
  {
    icon: Crosshair,
    title: "Grab Free Gear",
    desc: 'Find "The Employer" NPC inside the terminal. Accept a daily mission — free weapons and ammo included. Walk in, gear up, walk out armed.',
  },
  {
    icon: Banknote,
    title: "Hunt & Cash Out",
    desc: "Clear AI bots using your free gear. Earn 2 PED ($0.20 USD) daily. Withdraw to your bank account anytime. The daily job resets every 24 hours.",
  },
];

const FAQS = [
  {
    q: "Is this really free?",
    a: "100% free. No credit card, no hidden fees. Create your avatar, complete the tutorial, take the free shuttle. The Job Broker provides weapons and ammo at zero cost. Many players never deposit a single dollar.",
  },
  {
    q: "Can I actually withdraw real money?",
    a: "Yes. Entropia Universe has processed tens of millions USD in player withdrawals since 2003. PED converts to USD at a fixed 10:1 rate. Withdraw directly to your bank account — this is not a gimmick, it's a 20+ year system.",
  },
  {
    q: "What good is a job that only pays $18/month?",
    a: "You already spend hours watching Netflix or playing games — and you pay for the privilege. At Howling Mine, we flip that model. You get paid to play. The job system supports you while you level up skills and learn the economy. In many countries, $18/month makes a real difference — and as you grow, so do the opportunities.",
  },
  {
    q: "What's the catch?",
    a: "No catch. Entropia Universe is a functioning virtual economy, not a poker table. People spend money for entertainment, to collect rare items, or to enjoy an immersive experience. Some of that value flows to builders, miners, creators — like you. Howling Mine jobs are designed to bring in new players and help them learn the ropes.",
  },
  {
    q: "How do I get to Howling Mine?",
    a: "New players start on Setesh tutorial moon. After learning the basics, take the FREE daily shuttle from any major spaceport. You can also use 6 Teleporter Tokens for instant travel. Note: 150kg weight limit for teleportation.",
  },
  {
    q: "How much time does it take?",
    a: "Daily hunts take about 30 minutes. Play as much or as little as you want — the daily job resets every 24 hours. No grind required.",
  },
  {
    q: "Do I need a good PC?",
    a: "The game runs on most modern PCs. It's a downloadable client (~40GB). If your PC was made in the last 5-6 years, you should be fine. Check the Entropia Universe site for minimum specs.",
  },
  {
    q: "Can I do more than just hunt?",
    a: "Absolutely. Mining, crafting, trading, exploring — the universe is massive. Howling Mine is home to rare M-Type asteroids with Scottium, and there are ships, resources, and opportunities far beyond the daily job. The job system is your starting point, not your ceiling.",
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
            <span>REAL CASH · REAL ECONOMY · SINCE 2003</span>
          </motion.div>

          <motion.h1 className={styles.title} variants={heroFade}>
            GET <span className={styles.titleAccent}>PAID</span> TO PLAY
          </motion.h1>

          <motion.p className={styles.tagline} variants={heroFade}>
            Earn up to <strong>$18/month</strong> with free weapons, free ammo,
            and a real community behind you. The in-game currency converts to{" "}
            <strong>real dollars</strong> — withdraw to your bank account
            whenever you want.
            <span className={styles.cursor} />
          </motion.p>

          <motion.div className={styles.noCreditCard} variants={heroFade}>
            :: $0 Deposit — Start Right Now
          </motion.div>

          <motion.div className={styles.heroCtas} variants={heroFade}>
            <a href={signupUrl} className={styles.ctaLink}>
              <Button variant="primary" size="lg">
                Create Free Account →
              </Button>
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaLink}
            >
              <Button variant="secondary" size="lg">
                Join Discord
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

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <motion.section
        className={styles.statsBar}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-20px" }}
      >
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </motion.section>

      {/* ═══════════════════ EARNINGS BREAKDOWN ═══════════════════ */}
      <motion.section
        className={styles.section}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="Earnings Breakdown" size="lg" />
        <p className={styles.earningsSubtitle}>
          The Job System pays you to play. Here&apos;s exactly what you earn —
          no fine print.
        </p>

        <motion.div
          className={styles.earningsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {EARNINGS.map((item) => (
            <motion.div
              key={item.label}
              className={`${styles.earningsCard} ${item.highlight ? styles.earningsHighlight : ""}`}
              variants={fadeUp}
            >
              <span className={styles.earningsLabel}>{item.label}</span>
              <span className={styles.earningsValue}>{item.value}</span>
              <span className={styles.earningsUsd}>{item.usd}</span>
            </motion.div>
          ))}
        </motion.div>

        <p className={styles.earningsNote}>
          * Combine Howling Mine and Rocktropia jobs for maximum earnings.
          Withdraw directly to your bank account.
        </p>

        <div className={styles.sectionCta}>
          <a href={signupUrl} className={styles.ctaLink}>
            <Button variant="primary" size="lg">
              Start Earning Free →
            </Button>
          </a>
        </div>
      </motion.section>

      {/* ═══════════════════ HOW TO START ═══════════════════ */}
      <motion.section
        className={styles.section}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="From Zero to Earning" size="lg" />
        <p className={styles.stepsSubtitle}>
          Four steps. Under an hour. No money required.
        </p>

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

      {/* ═══════════════════ WHO IS NEVERDIE? ═══════════════════ */}
      <motion.section
        className={styles.aboutSection}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <div className={styles.aboutOuter}>
          <SectionHeader title="Who Is NEVERDIE?" size="lg" />

          <Panel variant="accent" size="lg" noAnimation>
            <div className={styles.aboutInner}>
              <div className={styles.aboutIconCol}>
                <div className={styles.aboutIcon}>
                  <Award size={32} strokeWidth={1.5} />
                </div>
                <div className={styles.aboutMeta}>
                  <span className={styles.aboutMetaTag}>Metaverse Pioneer</span>
                  <span className={styles.aboutMetaTag}>Guinness Record</span>
                  <span className={styles.aboutMetaTag}>Est. 2005</span>
                </div>
              </div>

              <div className={styles.aboutContent}>
                <p className={styles.aboutText}>
                  <strong>Jon NEVERDIE Jacobs</strong> is a Metaverse pioneer
                  and <strong>Guinness World Record holder</strong>. He founded{" "}
                  <strong>Club NEVERDIE</strong> (2005),{" "}
                  <strong>Planet Rocktropia</strong> (2010), and{" "}
                  <strong>The Howling Mine</strong> (2025) — all inside Entropia
                  Universe.
                </p>
                <p className={styles.aboutText}>
                  After discovering rare minerals at Howling Mine that enabled
                  interplanetary teleportation, NEVERDIE created the{" "}
                  <strong>Job System</strong> — so new players could enter the
                  economy and start earning from day one, completely free.
                </p>
              </div>
            </div>
          </Panel>
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
        <SectionHeader title="Frequently Asked Questions" />

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
              <h2 className={styles.finalCtaTitle}>
                Stop Playing for Free.
                <br />
                <span className={styles.titleAccent}>Start Getting Paid.</span>
              </h2>
              <p className={styles.finalCtaBody}>
                No deposit. No credit card. Real money, your bank account. Join
                thousands of players already earning in Entropia Universe.
              </p>
            </div>
            <div className={styles.finalCtaActions}>
              <a href={signupUrl} className={styles.ctaLink}>
                <Button variant="primary" size="lg">
                  Create Free Account →
                </Button>
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaLink}
              >
                <Button variant="secondary" size="lg">
                  Join Our Discord
                </Button>
              </a>
            </div>
          </div>
        </Panel>
      </motion.section>
    </div>
  );
}
