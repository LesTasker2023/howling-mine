"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface TopBarTab {
  key: string;
  label: string;
  /** If set, the tab renders as a Next.js `<Link>` instead of a `<button>`. */
  href?: string;
  /** Optional accent color (hex string, e.g. "#66ddff"). */
  color?: string;
}

export interface TopBarContextValue {
  tabs: TopBarTab[];
  activeTab: string;
  subTabs: TopBarTab[];
  activeSubTab: string;
  /** Multi-select mode: set of active subtab keys (empty = all active). */
  activeSubTabs: Set<string>;
  /** When true, subtabs behave as multi-select toggles. */
  subTabMultiSelect: boolean;
  setTabs: (tabs: TopBarTab[]) => void;
  setActiveTab: (key: string) => void;
  setSubTabs: (tabs: TopBarTab[]) => void;
  setActiveSubTab: (key: string) => void;
  setActiveSubTabs: (keys: Set<string>) => void;
  /** Toggle a single key in/out of the multi-select set. */
  toggleSubTab: (key: string) => void;
  setSubTabMultiSelect: (multi: boolean) => void;
}

const EMPTY_SET = new Set<string>();

const TopBarContext = createContext<TopBarContextValue>({
  tabs: [],
  activeTab: "",
  subTabs: [],
  activeSubTab: "",
  activeSubTabs: EMPTY_SET,
  subTabMultiSelect: false,
  setTabs: () => {},
  setActiveTab: () => {},
  setSubTabs: () => {},
  setActiveSubTab: () => {},
  setActiveSubTabs: () => {},
  toggleSubTab: () => {},
  setSubTabMultiSelect: () => {},
});

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabsState] = useState<TopBarTab[]>([]);
  const [activeTab, setActiveTabState] = useState("");
  const [subTabs, setSubTabsState] = useState<TopBarTab[]>([]);
  const [activeSubTab, setActiveSubTabState] = useState("");
  const [activeSubTabs, setActiveSubTabsState] = useState<Set<string>>(
    new Set(),
  );
  const [subTabMultiSelect, setSubTabMultiSelectState] = useState(false);

  const setTabs = useCallback((newTabs: TopBarTab[]) => {
    setTabsState(newTabs);
    if (newTabs.length > 0) {
      setActiveTabState((prev) => {
        const exists = newTabs.some((t) => t.key === prev);
        return exists ? prev : newTabs[0].key;
      });
    }
  }, []);

  const setActiveTab = useCallback((key: string) => {
    setActiveTabState(key);
  }, []);

  const setSubTabs = useCallback((newTabs: TopBarTab[]) => {
    setSubTabsState(newTabs);
    if (newTabs.length > 0) {
      setActiveSubTabState((prev) => {
        const exists = newTabs.some((t) => t.key === prev);
        return exists ? prev : "";
      });
    } else {
      setActiveSubTabState("");
    }
  }, []);

  const setActiveSubTab = useCallback((key: string) => {
    setActiveSubTabState(key);
  }, []);

  const setActiveSubTabs = useCallback((keys: Set<string>) => {
    setActiveSubTabsState(keys);
  }, []);

  const toggleSubTab = useCallback((key: string) => {
    setActiveSubTabsState((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const setSubTabMultiSelect = useCallback((multi: boolean) => {
    setSubTabMultiSelectState(multi);
    if (!multi) setActiveSubTabsState(new Set());
  }, []);

  return (
    <TopBarContext.Provider
      value={{
        tabs,
        activeTab,
        subTabs,
        activeSubTab,
        activeSubTabs,
        subTabMultiSelect,
        setTabs,
        setActiveTab,
        setSubTabs,
        setActiveSubTab,
        setActiveSubTabs,
        toggleSubTab,
        setSubTabMultiSelect,
      }}
    >
      {children}
    </TopBarContext.Provider>
  );
}

export function useTopBar() {
  return useContext(TopBarContext);
}
