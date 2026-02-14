import { client } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/types/siteSettings";
import { NavShell } from "./NavShell";

/**
 * Server wrapper that fetches site settings from Sanity
 * and passes them into the client-side NavShell.
 */
export async function NavShellServer({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings = {};
  try {
    settings =
      (await client.fetch(
        SITE_SETTINGS_QUERY,
        {},
        { next: { revalidate: 60 } },
      )) ?? {};
  } catch {
    // Sanity not configured yet — fall back to defaults
  }

  return <NavShell settings={settings}>{children}</NavShell>;
}
