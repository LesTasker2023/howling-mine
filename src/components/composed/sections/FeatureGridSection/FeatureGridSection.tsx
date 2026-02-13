"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/image";
import { Card, SectionHeader } from "@/components/ui";
import { fadeIn, staggerContainer, fadeUp } from "@/lib/motion";
import { dynamicIcon } from "./iconMap";
import styles from "./FeatureGridSection.module.css";

interface Feature {
  title: string;
  description?: string;
  icon?: string;
  image?: { asset: { _ref: string } };
  href?: string;
}

interface FeatureGridSectionProps {
  heading?: string;
  subheading?: string;
  features: Feature[];
  columns?: number; // 0 = auto
}

export function FeatureGridSection({
  heading,
  subheading,
  features,
  columns = 0,
}: FeatureGridSectionProps) {
  const gridStyle =
    columns > 0
      ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
      : { gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" };

  return (
    <motion.section
      className={styles.section}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {heading && <SectionHeader title={heading} />}
      {subheading && <p className={styles.subheading}>{subheading}</p>}
      <motion.div
        className={styles.grid}
        style={gridStyle}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {features.map((feature, i) => {
          const hasImage = feature.image?.asset;
          const IconComponent = feature.icon ? dynamicIcon(feature.icon) : null;

          const inner = (
            <>
              {hasImage && (
                <div className={styles.imageWrap}>
                  <Image
                    src={urlFor(feature.image!).width(600).auto("format").url()}
                    alt={feature.title}
                    width={600}
                    height={340}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk3KFb5gAAAABJRU5ErkJggg=="
                    className={styles.featureImage}
                  />
                </div>
              )}
              <div className={styles.body}>
                {!hasImage && IconComponent && (
                  <IconComponent className={styles.icon} size={28} />
                )}
                <h3 className={styles.title}>{feature.title}</h3>
                {feature.description && (
                  <p className={styles.desc}>{feature.description}</p>
                )}
              </div>
            </>
          );

          return (
            <motion.div key={i} variants={fadeUp}>
              <Card
                variant={feature.href ? "interactive" : "default"}
                onClick={
                  feature.href
                    ? () => {
                        window.location.href = feature.href!;
                      }
                    : undefined
                }
              >
                {inner}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
