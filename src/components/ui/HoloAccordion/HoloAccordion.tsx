"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import styles from "./HoloAccordion.module.css";

interface Stat {
  label?: string;
  value?: string;
}

interface Panel {
  _key?: string;
  title: string;
  subtitle?: string;
  image?: { asset?: { _ref: string } };
  description?: string;
  stats?: Stat[];
}

interface HoloAccordionProps {
  panels: Panel[];
}

export function HoloAccordion({ panels }: HoloAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.accordion}>
      {panels.map((panel, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={panel._key ?? i}
            className={styles.panel}
            data-active={isActive}
          >
            {/* Collapsed tab */}
            <button
              type="button"
              className={styles.tab}
              onClick={() => setActiveIndex(i)}
              aria-expanded={isActive}
            >
              <span className={styles.tabIndex}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.tabLabel}>{panel.title}</span>
            </button>

            {/* Expanded content */}
            <div className={styles.content}>
              <div className={styles.contentInner}>
                <div className={styles.header}>
                  {panel.image?.asset && (
                    <Image
                      src={urlFor(panel.image).width(360).height(360).auto("format").url()}
                      alt={panel.title}
                      width={360}
                      height={360}
                      className={styles.image}
                    />
                  )}
                  <div className={styles.titles}>
                    <h3 className={styles.title}>{panel.title}</h3>
                    {panel.subtitle && (
                      <p className={styles.subtitle}>{panel.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className={styles.body}>
                  {panel.description && (
                    <p className={styles.description}>{panel.description}</p>
                  )}

                  {panel.stats && panel.stats.length > 0 && (
                    <dl className={styles.stats}>
                      {panel.stats.map((stat, si) => (
                        <div key={si} className={styles.stat}>
                          <dt className={styles.statLabel}>{stat.label}</dt>
                          <dd className={styles.statValue}>{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
