import { SiteHero } from "@/components/composed";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <SiteHero
        status="Alpha v0.1"
        title="The *Howling* Mine"
        subtitle="Deep-space mining intelligence. Real-time loot tracking, economy analytics, and survival guides for Entropia Universe."
        primaryCta={{ label: "Explore Guides", href: "/guides" }}
        secondaryCta={{ label: "Latest News", href: "/news" }}
      />
    </div>
  );
}
