/**
 * /join — "Get Paid to Play" conversion landing page.
 *
 * SEO-heavy server component with full metadata, OpenGraph, and
 * JSON-LD schemas (FAQPage, Organization, HowTo).
 *
 * Supports ?ref= query-param for referral tracking:
 *   /join?ref=streamer123
 */

import type { Metadata } from "next";
import JoinPage from "./JoinPage";

const SIGNUP_BASE =
  "https://account.entropiauniverse.com/create-account?ref=howlingmine";

export const metadata: Metadata = {
  title:
    "Get Paid to Play — Join The Howling Mine | Entropia Universe Jobs 2025",
  description:
    "Earn up to $18/month playing Entropia Universe. Free weapons, free ammo, zero deposit required. Real cash withdrawals since 2003. Join The Howling Mine crew and start earning today.",
  keywords: [
    "earn money playing games",
    "games that pay real money",
    "get paid to play games",
    "free games that pay real money",
    "make money gaming",
    "play to earn games",
    "mmo that pays real money",
    "entropia universe jobs",
    "howling mine",
    "entropia universe",
    "neverdie",
    "club neverdie",
    "entropia job broker",
    "real cash economy mmo",
    "free mmo no deposit",
    "withdraw real money mmo",
    "entropia free to play earn",
    "entropia mining",
  ],
  openGraph: {
    title: "Get Paid to Play — Join The Howling Mine",
    description:
      "Earn $18/month with free weapons & ammo. Real cash economy since 2003. Zero deposit required.",
    type: "website",
    siteName: "The Howling Mine",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Paid to Play — The Howling Mine",
    description:
      "Earn $18/month with free weapons & ammo. Real cash economy since 2003.",
    creator: "@JonNEVERDIE",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/join",
  },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JoinRoute({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ref = typeof sp.ref === "string" ? sp.ref : undefined;

  // Build signup URL — override ref if provided
  let signupUrl = SIGNUP_BASE;
  if (ref) {
    const url = new URL(SIGNUP_BASE);
    url.searchParams.set("ref", ref);
    signupUrl = url.toString();
  }

  return <JoinPage signupUrl={signupUrl} />;
}
