"use client";

import { Plus, X } from "lucide-react";
import { useTabs } from "@/hooks/useTabs";

/** Browser-style tab strip. Scrolls horizontally when tabs overflow. */
export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, openBlankTab } = useTabs();

  return (
    <div role="tablist" className="flex items-end gap-1 overflow-x-auto border-b border-line px-2 pt-2">
      {tabs.map((tab) => {
        const active = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={active}
            className={`group flex max-w-56 shrink-0 items-center gap-2 rounded-t-lg border border-b-2 px-3 py-2 text-sm ${
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
              className="rounded p-0.5 text-subtle hover:bg-hover-strong hover:text-strong"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      <button
        onClick={openBlankTab}
        className="mb-1 flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-hover hover:text-strong"
      >
        <Plus size={14} /> New Workspace
      </button>
    </div>
  );
}
