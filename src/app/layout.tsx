import type { Metadata } from "next";
import { draftMode } from "next/headers";
import SanityVisualEditing from "@/components/SanityVisualEditing";
import { NavShellServer } from "@/components/layout";
import { TopBarProvider } from "@/context/TopBarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SanityLive } from "@/sanity/live";
import { getClient } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import "@/styles/globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thehowlingmine.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClient(false).fetch(
    SITE_SETTINGS_QUERY,
    {},
    { next: { revalidate: 300 } },
  );

  const siteName = settings?.siteName ?? "The Howling Mine";
  const seoTitle = settings?.seoTitle ?? `${siteName} — Entropia Universe`;
  const seoDesc =
    settings?.seoDescription ??
    "Your new-player guide and resource hub for Entropia Universe mining, crafting, and getting started.";

  const ogImageUrl = settings?.ogImage
    ? urlFor(settings.ogImage).width(1200).height(630).auto("format").url()
    : "/og-image.png";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seoTitle,
      template: `%s | ${siteName}`,
    },
    description: seoDesc,
    keywords: [
      "Entropia Universe",
      "The Howling Mine",
      "mining",
      "new player guide",
      "crafting",
      "resources",
    ],
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.webp", sizes: "192x192", type: "image/webp" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      siteName,
      title: seoTitle,
      description: seoDesc,
      url: SITE_URL,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: [ogImageUrl],
    },
  };
}

// Blocking script to apply cached theme CSS vars before first paint (eliminates FOUC)
const THEME_INIT_SCRIPT = `(function(){try{var c=JSON.parse(localStorage.getItem("hm-theme-css"));if(c){var s=document.documentElement.style;for(var k in c){if(k==="data-theme"){document.documentElement.dataset.theme=c[k];document.documentElement.style.colorScheme=c[k]}else{s.setProperty(k,c[k])}}}}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TopBarProvider>
            <NavShellServer>{children}</NavShellServer>
          </TopBarProvider>
        </ThemeProvider>
        {(await draftMode()).isEnabled && (
          <>
            <SanityLive />
            <SanityVisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
