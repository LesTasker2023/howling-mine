"use client";

import { Panel, Button, SectionHeader } from "@/components/ui";
import type { PanelVariant } from "@/components/ui";
import styles from "./CtaSection.module.css";

interface CtaSectionProps {
  heading: string;
  body?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label?: string; href?: string };
  variant?: "default" | "accent" | "danger";
}

export function CtaSection({
  heading,
  body,
  primaryAction,
  secondaryAction,
  variant = "default",
}: CtaSectionProps) {
  const panelVariant: PanelVariant =
    variant === "accent"
      ? "accent"
      : variant === "danger"
        ? "accent"
        : "default";

  return (
    <section className={styles.section} data-variant={variant}>
      <Panel variant={panelVariant} size="lg">
        <div className={styles.inner}>
          <div className={styles.text}>
            <SectionHeader title={heading} accent={variant === "accent"} />
            {body && <p className={styles.body}>{body}</p>}
          </div>
          <div className={styles.actions}>
            {primaryAction?.label && primaryAction?.href && (
              <a href={primaryAction.href} className={styles.link}>
                <Button variant="primary" size="lg">
                  {primaryAction.label}
                </Button>
              </a>
            )}
            {secondaryAction?.label && secondaryAction?.href && (
              <a href={secondaryAction.href} className={styles.link}>
                <Button variant="secondary" size="lg">
                  {secondaryAction.label}
                </Button>
              </a>
            )}
          </div>
        </div>
      </Panel>
    </section>
  );
}
