import { sanityFetch } from "@/sanity/live";
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
    const { data } = await sanityFetch({
      query: SITE_SETTINGS_QUERY,
      stega: false,
    });
    settings = data ?? {};
  } catch {
    // Sanity not configured yet — fall back to defaults
  }

  return <NavShell settings={settings}>{children}</NavShell>;
}
