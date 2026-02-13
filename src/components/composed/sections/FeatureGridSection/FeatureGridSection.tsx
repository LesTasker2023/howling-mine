"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { Card, SectionHeader } from "@/components/ui";
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
    <section className={styles.section}>
      {heading && <SectionHeader title={heading} />}
      {subheading && <p className={styles.subheading}>{subheading}</p>}
      <div className={styles.grid} style={gridStyle}>
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
            <Card
              key={i}
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
          );
        })}
      </div>
    </section>
  );
}
