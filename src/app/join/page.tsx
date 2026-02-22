/**
 * /join — redirects to homepage (which now serves the landing page).
 *
 * Preserves ?ref= query-param so referral tracking still works:
 *   /join?ref=streamer123 → /?ref=streamer123
 */

import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JoinRoute({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ref = typeof sp.ref === "string" ? sp.ref : undefined;
  redirect(ref ? `/?ref=${encodeURIComponent(ref)}` : "/");
}
