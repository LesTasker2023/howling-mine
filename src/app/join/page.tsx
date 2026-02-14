/**
 * /join — Marketing & Signup page
 *
 * Conversion-focused landing page.  Supports ?ref= query-param:
 *   /join?ref=streamer123
 * The ref is forwarded to the Entropia Universe account-creation URL.
 */

import type { Metadata } from "next";
import JoinPage from "./JoinPage";

const SIGNUP_BASE =
  "https://account.entropiauniverse.com/create-account?ref=howlingmine";

export const metadata: Metadata = {
  title: "Join the Crew — The Howling Mine",
  description:
    "Join The Howling Mine community in Entropia Universe. Free gear, experienced mentors, and a real cash economy. No deposit required.",
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
