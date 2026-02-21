"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import {
  Settings,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Newspaper,
  BookOpen,
  CalendarDays,
  Map,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { dynamicIcon } from "@/lib/dynamicIcon";
import { Drawer } from "@/components/ui/Drawer";
import { Footer } from "@/components/layout/Footer";
import { useTopBar } from "@/context/TopBarContext";
import type { SiteSettings } from "@/types/siteSettings";
import styles from "./NavShell.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/* Fallback nav when CMS hasn't been configured yet */
const DEFAULT_NAV: NavItem[] = [
  { label: "News", href: "/news", icon: <Newspaper size={20} /> },
  { label: "Guides", href: "/guides", icon: <BookOpen size={20} /> },
  { label: "Events", href: "/events", icon: <CalendarDays size={20} /> },
  { label: "Join", href: "/join", icon: <UserPlus size={20} /> },
];

interface NavShellProps {
  children: React.ReactNode;
  settings?: SiteSettings;
}

export function NavShell({ children, settings = {} }: NavShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expanded, setExpanded] = useState(true); // SSR-safe default

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem("nav-expanded");
    if (stored !== null) setExpanded(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("nav-expanded", String(expanded));
  }, [expanded]);
  const {
    tabs,
    activeTab,
    setActiveTab,
    subTabs,
    activeSubTab,
    setActiveSubTab,
    activeSubTabs,
    subTabMultiSelect,
    toggleSubTab,
  } = useTopBar();

  // Auth placeholder — will be replaced when auth provider is wired
  const isLoggedIn = false;

  /* Derive nav items from CMS settings (or use hardcoded defaults) */
  const navItems = useMemo<NavItem[]>(() => {
    const HIDDEN = ["/cms-guide", "/design-system"];
    if (!settings.mainNav?.length) return DEFAULT_NAV;
    return settings.mainNav
      .filter((link) => !HIDDEN.includes(link.href))
      .map((link) => {
        const Icon = link.icon ? dynamicIcon(link.icon) : dynamicIcon("box");
        return { label: link.label, href: link.href, icon: <Icon size={20} /> };
      });
  }, [settings.mainNav]);

  const siteName = settings.siteName ?? "Howling Mine";
  const siteNameShort = settings.siteNameShort ?? "HM";

  const handleAuth = () => {
    if (isLoggedIn) {
      // Logout — wire to auth provider
    } else {
      // Login — wire to auth provider
    }
  };

  // On /studio routes, skip NavShell chrome entirely — let Sanity own the page
  const isStudio = pathname.startsWith("/studio");
  if (isStudio) {
    return <>{children}</>;
  }

  // Derive page title from pathname for the always-visible first tab
  const pageTitle = (() => {
    if (pathname === "/") return "Welcome";
    const seg = pathname.split("/").filter(Boolean)[0];
    if (seg === "map") return "Sector Map";
    // Take the first segment, capitalize it
    return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
  })();

  return (
    <>
      <Analytics />
      <div
        className={styles.shell}
        data-expanded={expanded}
        data-has-subbar={subTabs.length > 0}
        style={
          {
            "--hero-overlay-brightness": `${1 - (settings.heroOverlayOpacity ?? 65) / 100}`,
          } as React.CSSProperties
        }
      >
        {/* Mobile toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={styles.sidebar}
          data-open={mobileOpen}
          data-expanded={expanded}
        >
          {/* Logo */}
          <Link
            href="/"
            className={styles.logo}
            data-expanded={expanded}
            onClick={() => window.dispatchEvent(new CustomEvent("hero:reset"))}
          >
            <Image
              src="/images/hm-logo.webp"
              alt=""
              width={24}
              height={20}
              className={styles.logoIcon}
              priority
            />
            <span className={styles.logoLabel}>{siteName}</span>
          </Link>

          {/* Icon nav */}
          <nav className={styles.nav}>
            <div className={styles.navGroup}>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.navItem}
                    data-active={isActive}
                    title={!expanded ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.icon}
                    <span className={styles.navLabel}>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className={styles.navSpacer} />

            {/* Bottom nav group */}
            <div className={styles.navGroup}>
              <Link
                href="/map"
                className={styles.navItem}
                data-active={
                  pathname === "/map" || pathname.startsWith("/map/")
                }
                title={!expanded ? "Sector Map" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Map size={20} />
                <span className={styles.navLabel}>Sector Map</span>
              </Link>
              <Link
                href="/stats"
                className={styles.navItem}
                data-active={
                  pathname === "/stats" || pathname.startsWith("/stats/")
                }
                title={!expanded ? "Stats" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <BarChart3 size={20} />
                <span className={styles.navLabel}>Stats</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className={styles.sidebarFooter}>
            <button
              className={styles.navItem}
              data-active={settingsOpen}
              title={!expanded ? "Settings" : undefined}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={20} />
              <span className={styles.navLabel}>Settings</span>
            </button>
            <button
              className={styles.navItem}
              title={
                !expanded ? (isLoggedIn ? "Log out" : "Log in") : undefined
              }
              onClick={handleAuth}
            >
              {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
              <span className={styles.navLabel}>
                {isLoggedIn ? "Log out" : "Log in"}
              </span>
            </button>
          </div>

          {/* Expand / Collapse toggle — overhangs right edge */}
          <button
            className={styles.expandToggle}
            onClick={() => setExpanded((e) => !e)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </aside>

        {/* Top bar  tabs centered */}
        <header className={styles.topbar}>
          <div className={styles.tabs}>
            {/* Page title — only when no context tabs are registered */}
            {tabs.length === 0 && (
              <span className={styles.tab} data-active={true}>
                {pageTitle}
              </span>
            )}
            {/* Extra context tabs from the page */}
            {tabs.map((tab) =>
              tab.href ? (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={styles.tab}
                  data-active={activeTab === tab.key}
                >
                  {tab.label}
                </Link>
              ) : (
                <button
                  key={tab.key}
                  className={styles.tab}
                  data-active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ),
            )}
          </div>
        </header>

        {/* Sub-bar: moons & areas for the active planet */}
        {subTabs.length > 0 && (
          <div className={styles.subbar}>
            <div className={styles.subTabs}>
              {subTabs.map((tab) => {
                /* Multi-select: active when set is empty (all) or key is in set */
                const isActive = subTabMultiSelect
                  ? activeSubTabs.size === 0 || activeSubTabs.has(tab.key)
                  : activeSubTab === tab.key;

                const accentStyle =
                  subTabMultiSelect && isActive && tab.color
                    ? { borderBottomColor: tab.color, color: tab.color }
                    : undefined;

                return tab.href ? (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={styles.subTab}
                    data-active={isActive}
                    style={accentStyle}
                  >
                    {tab.label}
                  </Link>
                ) : (
                  <button
                    key={tab.key}
                    className={styles.subTab}
                    data-active={isActive}
                    style={accentStyle}
                    onClick={() =>
                      subTabMultiSelect
                        ? toggleSubTab(tab.key)
                        : setActiveSubTab(tab.key)
                    }
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <main className={styles.content}>
          {children}
          <Footer
            text={settings.footerText}
            links={settings.footerLinks}
            socials={settings.socialLinks}
          />
        </main>

        {/* Settings drawer */}
        <Drawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          title="Settings"
          side="right"
          width="md"
        >
          <p
            style={{
              color: "rgba(var(--color-primary-rgb), 0.4)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "1rem 0",
            }}
          >
            User settings coming soon.
          </p>
        </Drawer>
      </div>
    </>
  );
}
