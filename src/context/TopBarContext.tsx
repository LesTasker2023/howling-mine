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
}

export interface TopBarContextValue {
  tabs: TopBarTab[];
  activeTab: string;
  subTabs: TopBarTab[];
  activeSubTab: string;
  setTabs: (tabs: TopBarTab[]) => void;
  setActiveTab: (key: string) => void;
  setSubTabs: (tabs: TopBarTab[]) => void;
  setActiveSubTab: (key: string) => void;
}

const TopBarContext = createContext<TopBarContextValue>({
  tabs: [],
  activeTab: "",
  subTabs: [],
  activeSubTab: "",
  setTabs: () => {},
  setActiveTab: () => {},
  setSubTabs: () => {},
  setActiveSubTab: () => {},
});

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabsState] = useState<TopBarTab[]>([]);
  const [activeTab, setActiveTabState] = useState("");
  const [subTabs, setSubTabsState] = useState<TopBarTab[]>([]);
  const [activeSubTab, setActiveSubTabState] = useState("");

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

  return (
    <TopBarContext.Provider
      value={{
        tabs,
        activeTab,
        subTabs,
        activeSubTab,
        setTabs,
        setActiveTab,
        setSubTabs,
        setActiveSubTab,
      }}
    >
      {children}
    </TopBarContext.Provider>
  );
}

export function useTopBar() {
  return useContext(TopBarContext);
}
