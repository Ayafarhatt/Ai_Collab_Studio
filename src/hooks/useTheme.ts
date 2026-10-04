"use client";

import { useCallback, useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "aics:theme";
export type Theme = "light" | "dark";

/** The `dark` class on <html> is the source of truth; subscribe to changes of it. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");
const getServerSnapshot = (): Theme => "dark";

/** Reads/toggles the theme class on <html> and persists the choice. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  return { theme, toggleTheme };
}
