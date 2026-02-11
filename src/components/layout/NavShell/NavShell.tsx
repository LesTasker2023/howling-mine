"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Swords,
  Shield,
  Hammer,
  Gem,
  BookOpen,
  Globe,
  Map,
  Settings,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useTopBar } from "@/context/TopBarContext";
import styles from "./NavShell.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_TOP: NavItem[] = [
  { label: "Weapons", href: "/weapons", icon: <Swords size={20} /> },
  { label: "Armor", href: "/armor", icon: <Shield size={20} /> },
  { label: "Blueprints", href: "/blueprints", icon: <Hammer size={20} /> },
  { label: "Materials", href: "/materials", icon: <Gem size={20} /> },
];

const NAV_BOTTOM: NavItem[] = [
  { label: "Guides", href: "/guides", icon: <BookOpen size={20} /> },
  { label: "Planets", href: "/planets", icon: <Globe size={20} /> },
  { label: "Maps", href: "/maps", icon: <Map size={20} /> },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nav-expanded");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

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
  } = useTopBar();

  // Auth placeholder — will be replaced when auth provider is wired
  const isLoggedIn = false;

  const handleAuth = () => {
    if (isLoggedIn) {
      // Logout — wire to auth provider
    } else {
      // Login — wire to auth provider
    }
  };

  return (
    <div
      className={styles.shell}
      data-expanded={expanded}
      data-has-subbar={subTabs.length > 0}
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
        <Link href="/" className={styles.logo} data-expanded={expanded}>
          <Image
            src="/icon.webp"
            alt="The Howling Mine"
            width={24}
            height={24}
            priority
          />
          <span className={styles.logoLabel}>The Howling Mine</span>
        </Link>

        {/* Icon nav */}
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            {NAV_TOP.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
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
          <div className={styles.navGroup}>
            {NAV_BOTTOM.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
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
            title={!expanded ? (isLoggedIn ? "Log out" : "Log in") : undefined}
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
          {tabs.length > 0 ? (
            tabs.map((tab) =>
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
            )
          ) : (
            <span className={styles.tab} data-active="true">
              Overview
            </span>
          )}
        </div>
      </header>

      {/* Sub-bar: moons & areas for the active planet */}
      {subTabs.length > 0 && (
        <div className={styles.subbar}>
          <div className={styles.subTabs}>
            {subTabs.map((tab) =>
              tab.href ? (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={styles.subTab}
                  data-active={activeSubTab === tab.key}
                >
                  {tab.label}
                </Link>
              ) : (
                <button
                  key={tab.key}
                  className={styles.subTab}
                  data-active={activeSubTab === tab.key}
                  onClick={() => setActiveSubTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main className={styles.content}>{children}</main>

      {/* Settings drawer */}
      <Drawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
        side="right"
        width="md"
      >
        <p
          style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}
        >
          Settings panel content coming soon.
        </p>
      </Drawer>
    </div>
  );
}
