import { SiteHero } from "@/components/composed";
import { getClient } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import styles from "./page.module.css";

/* ── Fallbacks if Sanity hasn't been configured yet ── */
const FALLBACK_VIDEOS = [
  "/videos/hero-2.webm",
  "/videos/hero-1.webm",
  "/videos/hero-3.webm",
];

export default async function Home() {
  const settings = await getClient(false).fetch(
    SITE_SETTINGS_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  /* Map Sanity file assets → plain URL strings the component expects */
  const videos = settings?.heroVideos?.length
    ? settings.heroVideos.map((v: { asset: { url: string } }) => v.asset.url)
    : FALLBACK_VIDEOS;

  return (
    <div className={styles.page}>
      <SiteHero
        title={settings?.heroTitle ?? "The *Howling* Mine"}
        tagline={
          settings?.heroTagline ??
          "Guides, news, and resources for the Entropia Universe mining community."
        }
        primaryCta={
          settings?.heroPrimaryCta ?? {
            label: "Explore Guides",
            href: "/guides",
          }
        }
        secondaryCta={
          settings?.heroSecondaryCta ?? { label: "Latest News", href: "/news" }
        }
        videos={videos}
      />
    </div>
  );
}
