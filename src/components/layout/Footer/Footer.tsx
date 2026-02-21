import styles from "./Footer.module.css";

interface FooterProps {
  text?: string;
}

export function Footer({ text }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright = text
    ? text.replace("{year}", String(year))
    : `© ${year} The Howling Mine. All rights reserved.`;

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
