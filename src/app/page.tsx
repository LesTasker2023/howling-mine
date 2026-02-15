import { SiteHero, HeroSequence } from "@/components/composed";
import { getClient } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import styles from "./page.module.css";

/* ── Fallbacks if Sanity hasn't been configured yet ── */
const FALLBACK_VIDEOS = [
  "/videos/hero-2.webm",
  "/videos/hero-1.webm",
  "/videos/hero-3.webm",
];

/* ── Temp fallback walkthrough steps (delete once CMS is populated) ── */
const FALLBACK_WALKTHROUGH = [
  {
    title: "Create Account",
    subtitle: "Sign up at entropia.com and download the client",
    href: "https://www.entropia.com",
    placeholderSrc: "/images/planets/calypso.png",
  },
  {
    title: "Create Avatar",
    subtitle: "Choose your look and enter the universe",
    href: "/guides/getting-started",
    placeholderSrc: "/images/planets/calypso.png",
  },
  {
    title: "Finish Tutorial",
    subtitle: "Complete the introductory missions on Calypso",
    href: "/guides/getting-started",
    placeholderSrc: "/images/planets/calypso.png",
  },
  {
    title: "Join The Society",
    subtitle: "Find us in-game and apply to join",
    href: "/join",
    placeholderSrc: "/images/planets/rocktropia.png",
  },
  {
    title: "Choose a Path",
    subtitle: "Mining, hunting, crafting — pick your profession",
    href: "/guides",
    placeholderSrc: "/images/planets/arkadia.png",
  },
  {
    title: "Gear Up",
    subtitle: "Get your starter equipment and learn the basics",
    href: "/guides/mining-101",
    placeholderSrc: "/images/planets/cyrene.png",
  },
  {
    title: "Find a Claim",
    subtitle: "Head out into the field and drop your first probe",
    href: "/guides/mining-101",
    placeholderSrc: "/images/planets/next-island.png",
  },
  {
    title: "Start Mining",
    subtitle: "Extract resources and begin your journey",
    href: "/map",
    placeholderSrc: "/images/planets/toulan.png",
  },
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
      <HeroSequence
        walkthroughSteps={
          settings?.heroWalkthrough?.length
            ? settings.heroWalkthrough
            : FALLBACK_WALKTHROUGH
        }
        placeholderImage={settings?.placeholderImage}
      >
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
            settings?.heroSecondaryCta ?? {
              label: "Latest News",
              href: "/news",
            }
          }
          videos={videos}
        />
      </HeroSequence>
    </div>
  );
}
