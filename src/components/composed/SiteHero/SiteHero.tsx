import Link from "next/link";
import { Button } from "@/components/ui";
import styles from "./SiteHero.module.css";

interface SiteHeroProps {
  /** Status badge text (e.g. "Alpha v0.1") */
  status?: string;
  /** Main title — wrap key word in * for accent color (e.g. "The *Howling* Mine") */
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/**
 * Render the title, splitting `*word*` segments into accent-colored spans.
 */
function renderTitle(raw: string) {
  const parts = raw.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={i} className={styles.titleAccent}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

export function SiteHero({
  status,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: SiteHeroProps) {
  return (
    <section className={styles.hero}>
      {/* Decorations */}
      <div className={styles.gridCanvas} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className={styles.scanLine} aria-hidden />
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerTR} aria-hidden />
      <div className={styles.cornerBL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />

      {/* Content */}
      <div className={styles.content}>
        {status && (
          <div className={styles.statusLine}>
            <span className={styles.statusDot} />
            {status}
          </div>
        )}

        <h1 className={styles.title}>{renderTitle(title)}</h1>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {(primaryCta || secondaryCta) && (
          <div className={styles.actions}>
            {primaryCta && (
              <Link href={primaryCta.href}>
                <Button variant="primary" size="lg">
                  {primaryCta.label}
                </Button>
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <Button variant="ghost" size="lg">
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className={styles.bottomLine} aria-hidden />
    </section>
  );
}
