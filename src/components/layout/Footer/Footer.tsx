import Link from "next/link";
import type { FooterLink, SocialLink } from "@/types/siteSettings";
import { dynamicIcon } from "@/lib/dynamicIcon";
import styles from "./Footer.module.css";

/** Map platform name → Lucide icon name */
const SOCIAL_ICONS: Record<string, string> = {
  discord: "message-circle",
  youtube: "youtube",
  twitter: "twitter",
  twitch: "twitch",
  github: "github",
  instagram: "instagram",
  facebook: "facebook",
  reddit: "hash",
};

interface FooterProps {
  text?: string;
  links?: FooterLink[];
  socials?: SocialLink[];
}

export function Footer({ text, links, socials }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright = text
    ? text.replace("{year}", String(year))
    : `© ${year} The Howling Mine. All rights reserved.`;

  const hasLinks = links && links.length > 0;
  const hasSocials = socials && socials.length > 0;

  return (
    <footer className={styles.footer}>
      {(hasLinks || hasSocials) && (
        <div className={styles.topRow}>
          {hasLinks && (
            <ul className={styles.linkList}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {hasSocials && (
            <div className={styles.socials}>
              {socials.map((s) => {
                const iconName = SOCIAL_ICONS[s.platform] ?? "link";
                const Icon = dynamicIcon(iconName);
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    title={s.platform}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
