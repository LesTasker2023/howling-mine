import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { NavShellServer } from "@/components/layout";
import { TopBarProvider } from "@/context/TopBarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SanityLive } from "@/sanity/live";
import "@/styles/globals.css";

export const metadata: Metadata = {
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
    icon: "/icon.webp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TopBarProvider>
            <NavShellServer>{children}</NavShellServer>
          </TopBarProvider>
        </ThemeProvider>
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
