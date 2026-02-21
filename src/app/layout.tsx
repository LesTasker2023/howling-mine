import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Analytics } from "@vercel/analytics/next";
import { NavShellServer } from "@/components/layout";
import { TopBarProvider } from "@/context/TopBarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SanityLive } from "@/sanity/live";
import "@/styles/globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thehowlingmine.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Howling Mine — Entropia Universe",
    template: "%s | The Howling Mine",
  },
  description:
    "Your new-player guide and resource hub for Entropia Universe mining, crafting, and getting started.",
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
    siteName: "The Howling Mine",
    title: "The Howling Mine — Entropia Universe",
    description:
      "Your new-player guide and resource hub for Entropia Universe mining, crafting, and getting started.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Howling Mine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Howling Mine — Entropia Universe",
    description:
      "Your new-player guide and resource hub for Entropia Universe mining, crafting, and getting started.",
    images: ["/og-image.png"],
  },
};

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
            <VisualEditing />
          </>
        )}
        <Analytics />
      </body>
    </html>
  );
}
