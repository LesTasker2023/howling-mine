/**
 * HomePage — CMS-driven "Get Paid to Play" landing page.
 *
 * Every section is populated from the `homepage` Sanity singleton.
 * All values have hardcoded fallbacks so the page works even when
 * the CMS document hasn't been created yet.
 *
 * Sections:
 *   1.  Hero — headline, video bg, trust badges
 *   2.  Stats bar — key numbers
 *   3.  Earnings Breakdown — the money ladder
 *   4.  How to Start — step timeline + CTA
 *   5.  Who is NEVERDIE? — credibility / social proof
 *   6.  FAQ — accordion
 *   7.  Final CTA — closing conversion block
 */

"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Award } from "lucide-react";
import { dynamicIcon } from "@/lib/dynamicIcon";
import { Button, SectionHeader, Panel } from "@/components/ui";
import { staggerContainer, fadeUp, fadeIn } from "@/lib/motion";
import type { HomepageData } from "@/types/homepage";
import styles from "./HomePage.module.css";

/* ── Animation presets ── */
const heroStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const heroFade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ── Fallback data ── */
const FALLBACK_VIDEOS = [
  "/videos/hero-2.webm",
  "/videos/hero-1.webm",
  "/videos/hero-3.webm",
];

const FALLBACK_TRUST = [
  "Zero startup cost",
  "Free weapons & ammo",
  "Real USD withdrawals",
  "20+ year track record",
];

const FALLBACK_STATS = [
  { _key: "s1", value: "$0", label: "Required Investment" },
  { _key: "s2", value: "20+", label: "Years Running" },
  { _key: "s3", value: "$18", label: "Monthly Earnings" },
  { _key: "s4", value: "Millions", label: "USD Withdrawn by Players" },
];

const FALLBACK_EARNINGS = [
  {
    _key: "e1",
    label: "Daily Mission Pay",
    value: "2 PED",
    usd: "≈ $0.20 USD",
    highlight: false,
  },
  {
    _key: "e2",
    label: "Monthly (30 days)",
    value: "60 PED",
    usd: "≈ $6.00 USD",
    highlight: false,
  },
  {
    _key: "e3",
    label: "With Rocktropia",
    value: "180 PED",
    usd: "≈ $18.00 USD/month",
    highlight: true,
  },
  {
    _key: "e4",
    label: "Your Investment",
    value: "$0",
    usd: "Free weapons & ammo provided",
    highlight: false,
  },
];

const FALLBACK_STEPS = [
  {
    _key: "st1",
    icon: "shield",
    title: "Create Free Account",
    description:
      "Sign up for Entropia Universe — completely free. Complete the short Setesh tutorial to learn combat, looting, and navigation.",
  },
  {
    _key: "st2",
    icon: "rocket",
    title: "Catch the Free Shuttle",
    description:
      "Take the FREE daily shuttle from any major spaceport. You'll land at Howling Mine Space Terminal — that's home base. No cost, no strings.",
  },
  {
    _key: "st3",
    icon: "crosshair",
    title: "Grab Free Gear",
    description:
      'Find "The Employer" NPC inside the terminal. Accept a daily mission — free weapons and ammo included. Walk in, gear up, walk out armed.',
  },
  {
    _key: "st4",
    icon: "banknote",
    title: "Hunt & Cash Out",
    description:
      "Clear AI bots using your free gear. Earn 2 PED ($0.20 USD) daily. Withdraw to your bank account anytime. The daily job resets every 24 hours.",
  },
];

const FALLBACK_FAQS = [
  {
    _key: "f1",
    question: "Is this really free?",
    answer:
      "100% free. No credit card, no hidden fees. Create your avatar, complete the tutorial, take the free shuttle. The Job Broker provides weapons and ammo at zero cost. Many players never deposit a single dollar.",
  },
  {
    _key: "f2",
    question: "Can I actually withdraw real money?",
    answer:
      "Yes. Entropia Universe has processed tens of millions USD in player withdrawals since 2003. PED converts to USD at a fixed 10:1 rate. Withdraw directly to your bank account — this is not a gimmick, it's a 20+ year system.",
  },
  {
    _key: "f3",
    question: "What good is a job that only pays $18/month?",
    answer:
      "You already spend hours watching Netflix or playing games — and you pay for the privilege. At Howling Mine, we flip that model. You get paid to play. The job system supports you while you level up skills and learn the economy. In many countries, $18/month makes a real difference — and as you grow, so do the opportunities.",
  },
  {
    _key: "f4",
    question: "What's the catch?",
    answer:
      "No catch. Entropia Universe is a functioning virtual economy, not a poker table. People spend money for entertainment, to collect rare items, or to enjoy an immersive experience. Some of that value flows to builders, miners, creators — like you. Howling Mine jobs are designed to bring in new players and help them learn the ropes.",
  },
  {
    _key: "f5",
    question: "How do I get to Howling Mine?",
    answer:
      "New players start on Setesh tutorial moon. After learning the basics, take the FREE daily shuttle from any major spaceport. You can also use 6 Teleporter Tokens for instant travel. Note: 150kg weight limit for teleportation.",
  },
  {
    _key: "f6",
    question: "How much time does it take?",
    answer:
      "Daily hunts take about 30 minutes. Play as much or as little as you want — the daily job resets every 24 hours. No grind required.",
  },
  {
    _key: "f7",
    question: "Do I need a good PC?",
    answer:
      "The game runs on most modern PCs. It's a downloadable client (~40GB). If your PC was made in the last 5-6 years, you should be fine. Check the Entropia Universe site for minimum specs.",
  },
];

const FALLBACK_ABOUT_PARAGRAPHS = [
  "**Jon NEVERDIE Jacobs** is a Metaverse pioneer and **Guinness World Record holder**. He founded **Club NEVERDIE** (2005), **Planet Rocktropia** (2010), and **The Howling Mine** (2025) — all inside Entropia Universe.",
  "After discovering rare minerals at Howling Mine that enabled interplanetary teleportation, NEVERDIE created the **Job System** — so new players could enter the economy and start earning from day one.",
];

const SIGNUP_BASE =
  "https://account.entropiauniverse.com/create-account?ref=howlingmine";

/* ── Markdown-ish bold helper ── */
function renderBold(text: string) {
  // Splits on **bold** and returns React nodes
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

/* ── Title accent helper — wraps *word* in accent span ── */
function renderTitleAccent(text: string) {
  const parts = text.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={styles.titleAccent}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════════════════ */

interface HomePageProps {
  data: HomepageData;
  signupUrl?: string;
}

export default function HomePage({ data, signupUrl }: HomePageProps) {
  /* Detect client mount without triggering lint warnings */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const baseSignup = data.signupBaseUrl ?? SIGNUP_BASE;
  const ctaUrl = signupUrl ?? baseSignup;

  /* Derived data with fallbacks */
  const heroEyebrow =
    data.heroEyebrow ?? "REAL CASH · REAL ECONOMY · SINCE 2003";
  const heroTitle = data.heroTitle ?? "GET *PAID* TO PLAY";
  const heroTagline =
    data.heroTagline ??
    "Earn up to **$18/month** with free weapons, free ammo, and a real community behind you. The in-game currency converts to **real dollars** — withdraw to your bank account whenever you want.";
  const heroDepositLine =
    data.heroDepositLine ?? "$0 Deposit — Start Right Now";
  const heroCta = data.heroCta ?? {
    label: "Create Free Account →",
    href: ctaUrl,
  };
  const trustBadges = data.heroTrustBadges?.length
    ? data.heroTrustBadges
    : FALLBACK_TRUST;
  const heroCoords = data.heroCoords?.length
    ? data.heroCoords
    : ["X:79228", "Y:79228", "Z:25", "HOWLING MINE"];

  const videos = data.heroVideos?.length
    ? data.heroVideos.map((v) => v.asset.url)
    : FALLBACK_VIDEOS;

  const stats = data.stats?.length ? data.stats : FALLBACK_STATS;
  const earningsTitle = data.earningsTitle ?? "Earnings Breakdown";
  const earningsSubtitle =
    data.earningsSubtitle ??
    "The Job System pays you to play. Here's exactly what you earn.";
  const earningsItems = data.earningsItems?.length
    ? data.earningsItems
    : FALLBACK_EARNINGS;
  const earningsNote =
    data.earningsNote ??
    "* Combine Howling Mine and Rocktropia jobs for maximum earnings. Withdraw directly to your bank account.";
  const earningsCta = data.earningsCta ?? {
    label: "Start Earning →",
    href: ctaUrl,
  };

  const stepsTitle = data.stepsTitle ?? "From Zero to Earning";
  const steps = data.steps?.length ? data.steps : FALLBACK_STEPS;
  const stepsCta = data.stepsCta ?? { label: "Get Started →", href: ctaUrl };

  const aboutTitle = data.aboutTitle ?? "Who Is NEVERDIE?";
  const aboutMetaTags = data.aboutMetaTags?.length
    ? data.aboutMetaTags
    : ["Metaverse Pioneer", "Guinness Record", "Est. 2005"];
  const aboutParagraphs = data.aboutParagraphs?.length
    ? data.aboutParagraphs
    : FALLBACK_ABOUT_PARAGRAPHS;

  const faqTitle = data.faqTitle ?? "Frequently Asked Questions";
  const faqs = data.faqs?.length ? data.faqs : FALLBACK_FAQS;

  const finalCtaTitleRaw =
    data.finalCtaTitle ?? "Stop Playing for Free.|Start Getting Paid.";
  const finalCtaBody =
    data.finalCtaBody ??
    "No deposit. No credit card. Real money, your bank account. Join thousands of players already earning in Entropia Universe.";
  const finalCtaButton = data.finalCtaButton ?? {
    label: "Create Free Account →",
    href: ctaUrl,
  };

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
      setActiveIdx((prev) => (prev + 1) % videos.length);
    }, 800);
  }, [videos.length]);

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
            src={videos[activeIdx]}
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

        {/* Content */}
        <motion.div
          className={styles.heroContent}
          variants={heroStagger}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
        >
          <motion.div className={styles.eyebrow} variants={heroFade}>
            <span>{heroEyebrow}</span>
          </motion.div>

          <motion.h1 className={styles.title} variants={heroFade}>
            {renderTitleAccent(heroTitle)}
          </motion.h1>

          <motion.p className={styles.tagline} variants={heroFade}>
            {renderBold(heroTagline)}
            <span className={styles.cursor} />
          </motion.p>

          <motion.div className={styles.noCreditCard} variants={heroFade}>
            {heroDepositLine}
          </motion.div>

          <motion.div className={styles.heroCtas} variants={heroFade}>
            <a href={heroCta.href ?? ctaUrl} className={styles.ctaLink}>
              <Button variant="primary" size="lg">
                {heroCta.label ?? "Create Free Account →"}
              </Button>
            </a>
          </motion.div>

          <motion.div className={styles.trustRow} variants={heroFade}>
            {trustBadges.map((item) => (
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
          {heroCoords.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className={styles.coordDiv}>|</span>}
              {item}
            </span>
          ))}
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
        {stats.map((stat) => (
          <div key={stat._key ?? stat.label} className={styles.stat}>
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
        <SectionHeader title={earningsTitle} size="lg" />
        <p className={styles.earningsSubtitle}>{earningsSubtitle}</p>

        <motion.div
          className={styles.earningsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {earningsItems.map((item) => (
            <motion.div
              key={item._key ?? item.label}
              className={`${styles.earningsCard} ${item.highlight ? styles.earningsHighlight : ""}`}
              variants={fadeUp}
            >
              <span className={styles.earningsLabel}>{item.label}</span>
              <span className={styles.earningsValue}>{item.value}</span>
              {item.usd && (
                <span className={styles.earningsUsd}>{item.usd}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <p className={styles.earningsNote}>{earningsNote}</p>

        <div className={styles.sectionCta}>
          <a href={earningsCta.href ?? ctaUrl} className={styles.ctaLink}>
            <Button variant="primary" size="lg">
              {earningsCta.label ?? "Start Earning →"}
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
        <SectionHeader title={stepsTitle} size="lg" />

        <motion.div
          className={styles.stepsTimeline}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {steps.map((step, i) => {
            const StepIcon = dynamicIcon(step.icon ?? "box");
            return (
              <motion.div
                key={step._key ?? step.title}
                className={styles.stepRow}
                variants={fadeUp}
              >
                <div className={styles.stepIndicator}>
                  <div className={styles.stepDot} />
                  {i < steps.length - 1 && <div className={styles.stepLine} />}
                </div>
                <div className={styles.stepCard}>
                  <Panel variant="default" size="md" noAnimation>
                    <div className={styles.stepInner}>
                      <div className={styles.stepHeader}>
                        <div className={styles.stepNumber}>{i + 1}</div>
                        <StepIcon
                          size={20}
                          className={styles.stepIcon}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepDesc}>{step.description}</p>
                    </div>
                  </Panel>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className={styles.sectionCta}>
          <a href={stepsCta.href ?? ctaUrl} className={styles.ctaLink}>
            <Button variant="primary" size="lg">
              {stepsCta.label ?? "Get Started →"}
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
          <SectionHeader title={aboutTitle} size="lg" />

          <Panel variant="accent" size="lg" noAnimation>
            <div className={styles.aboutInner}>
              <div className={styles.aboutIconCol}>
                <div className={styles.aboutIcon}>
                  <Award size={32} strokeWidth={1.5} />
                </div>
                <div className={styles.aboutMeta}>
                  {aboutMetaTags.map((tag) => (
                    <span key={tag} className={styles.aboutMetaTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.aboutContent}>
                {aboutParagraphs.map((p, i) => (
                  <p key={i} className={styles.aboutText}>
                    {renderBold(p)}
                  </p>
                ))}
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
        <SectionHeader title={faqTitle} />

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq._key ?? faq.question} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{faq.question}</summary>
              <p className={styles.faqAnswer}>{faq.answer}</p>
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
                {finalCtaTitleRaw.split("|").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {i === finalCtaTitleRaw.split("|").length - 1 ? (
                      <span className={styles.titleAccent}>{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h2>
              <p className={styles.finalCtaBody}>{finalCtaBody}</p>
            </div>
            <div className={styles.finalCtaActions}>
              <a
                href={finalCtaButton.href ?? ctaUrl}
                className={styles.ctaLink}
              >
                <Button variant="primary" size="lg">
                  {finalCtaButton.label ?? "Create Free Account →"}
                </Button>
              </a>
            </div>
          </div>
        </Panel>
      </motion.section>
    </div>
  );
}
