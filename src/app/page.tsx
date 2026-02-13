import { SiteHero } from "@/components/composed";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <SiteHero
        title="The *Howling* Mine"
        tagline="Guides, news, and resources for the Entropia Universe mining community."
        primaryCta={{ label: "Explore Guides", href: "/guides" }}
        secondaryCta={{ label: "Latest News", href: "/news" }}
        videos={[
          "/videos/hero-2.webm",
          "/videos/hero-1.webm",
          "/videos/hero-3.webm",
        ]}
      />
    </div>
  );
}
