/* ═══════════════════════════════════════════════════════════════════════════
   PageHero — Compact CMS-driven hero for inner pages
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/image";
import { fadeIn } from "@/lib/motion";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  heading: string;
  subheading?: string;
  backgroundImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  breadcrumb?: string;
  align?: "left" | "center";
}

export function PageHero({
  heading,
  subheading,
  backgroundImage,
  breadcrumb,
  align = "center",
}: PageHeroProps) {
  const hasBg = !!backgroundImage?.asset?._ref;
  const alignClass =
    align === "left" ? styles["hero--left"] : styles["hero--center"];

  return (
    <motion.section
      className={`${styles.hero} ${alignClass}`}
      data-has-bg={hasBg || undefined}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Background image */}
      {hasBg && (
        <Image
          src={urlFor(backgroundImage!).width(1400).quality(75).url()}
          alt={backgroundImage?.alt ?? heading}
          fill
          priority
          className={styles.bgImage}
        />
      )}

      {/* Darkening overlay (only visible with bg) */}
      <div className={styles.overlay} />

      {/* Subtle grid texture */}
      <div className={styles.gridTexture} />

      {/* Corner brackets */}
      <div className={styles.cornerTL} />
      <div className={styles.cornerTR} />
      <div className={styles.cornerBL} />
      <div className={styles.cornerBR} />

      {/* Content */}
      <div className={styles.content}>
        {breadcrumb && <span className={styles.breadcrumb}>{breadcrumb}</span>}
        <h1 className={styles.heading}>{heading}</h1>
        {subheading && <p className={styles.subheading}>{subheading}</p>}
      </div>

      {/* Bottom golden accent line */}
      <div className={styles.bottomAccent} />
    </motion.section>
  );
}
