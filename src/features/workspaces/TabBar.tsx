"use client";

import { Plus, X } from "lucide-react";
import { useTabs } from "@/hooks/useTabs";

/** Browser-style tab strip. Scrolls horizontally when tabs overflow. */
export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, openBlankTab } = useTabs();

  return (
    <div role="tablist" className="flex items-end gap-1 overflow-x-auto overscroll-x-contain border-b border-line px-2 pt-2">
      {tabs.map((tab) => {
        const active = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={active}
            className={`group flex max-w-40 shrink-0 items-center gap-1 rounded-t-lg border border-b-2 px-2 py-2 text-sm sm:max-w-56 sm:gap-2 sm:px-3 ${
              active
                ? "border-line border-b-accent bg-canvas/60 text-strong"
                : "border-transparent text-muted hover:bg-hover hover:text-body"
            }`}
          >
            <button onClick={() => setActiveTab(tab.id)} className="truncate">
              {tab.title}
            </button>
            <button
              onClick={() => closeTab(tab.id)}
              aria-label={`Close ${tab.title}`}
              className="shrink-0 rounded p-1 text-subtle hover:bg-hover-strong hover:text-strong"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      <button
        onClick={openBlankTab}
        className="mb-1 flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-muted hover:bg-hover hover:text-strong sm:px-3 sm:py-1.5"
      >
        <Plus size={14} className="shrink-0" /> <span className="hidden sm:inline">New Workspace</span>
      </button>
    </div>
  );
}
