"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/image";
import { fadeIn } from "@/lib/motion";
import { Button } from "@/components/ui";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  heading: string;
  subheading?: string;
  backgroundImage?: { asset: { _ref: string } };
  cta?: { label?: string; href?: string };
  align?: "left" | "center";
}

export function HeroSection({
  heading,
  subheading,
  backgroundImage,
  cta,
  align = "center",
}: HeroSectionProps) {
  const hasBg = backgroundImage?.asset;

  return (
    <motion.section
      className={`${styles.hero} ${styles[`hero--${align}`]}`}
      data-has-bg={hasBg ? "true" : undefined}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {hasBg && (
        <Image
          src={urlFor(backgroundImage).width(1920).auto("format").url()}
          alt=""
          fill
          priority
          className={styles.bgImage}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.glow} />

      {/* Corner brackets */}
      <div className={styles.cornerTL} />
      <div className={styles.cornerTR} />
      <div className={styles.cornerBL} />
      <div className={styles.cornerBR} />

      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        {subheading && <p className={styles.subheading}>{subheading}</p>}
        {cta?.label && cta?.href && (
          <a href={cta.href} className={styles.ctaLink}>
            <Button variant="primary" size="lg">
              {cta.label}
            </Button>
          </a>
        )}
      </div>
    </motion.section>
  );
}
