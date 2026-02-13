"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import { PortableTextBody } from "@/components/ui/PortableTextBody/PortableTextBody";
import { fadeIn } from "@/lib/motion";
import styles from "./RichTextSection.module.css";

interface RichTextSectionProps {
  heading?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  richBody: any;
  maxWidth?: "narrow" | "medium" | "full";
}

export function RichTextSection({
  heading,
  richBody,
  maxWidth = "narrow",
}: RichTextSectionProps) {
  return (
    <motion.section
      className={`${styles.section} ${styles[`section--${maxWidth}`]}`}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {heading && <SectionHeader title={heading} />}
      <div className={styles.body}>
        <PortableTextBody value={richBody} />
      </div>
    </motion.section>
  );
}
