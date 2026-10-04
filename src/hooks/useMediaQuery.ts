"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe `window.matchMedia` subscription.
 *
 * Returns `false` for the server render and the hydration render, then the real
 * value on the next commit, so the markup React hydrates always matches what it
 * rendered on the server. Only use it where CSS alone cannot decide the layout —
 * prefer breakpoints in class names, which need no JavaScript at all.
 *
 * `md` in Tailwind v4 is 48rem; keep these widths in sync with globals.css usage.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
