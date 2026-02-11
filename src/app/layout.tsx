import type { Metadata } from "next";
import { NavShell } from "@/components/layout";
import { TopBarProvider } from "@/context/TopBarContext";
import { ThemeProvider } from "@/context/ThemeContext";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TopBarProvider>
            <NavShell>{children}</NavShell>
          </TopBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
