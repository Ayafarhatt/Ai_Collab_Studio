"use client";

import { ToolBadge } from "@/components/ui/ToolBadge";
import { useTabs } from "@/hooks/useTabs";
import { useWorkspaceStore } from "@/store/workspace.store";

/** Content of a blank "New Workspace" tab: pick a tool to open. */
export function Launcher({ tabId }: { tabId: string }) {
  const tools = useWorkspaceStore((s) => s.tools);
  const { closeTab, openTool } = useTabs();

  return (
    <div className="h-full overflow-y-auto overscroll-contain p-4 sm:p-8">
      <h2 className="mb-1 text-base font-semibold text-strong sm:text-lg">Open a tool</h2>
      <p className="mb-4 text-sm text-subtle sm:mb-6">Pick something to open in its own tab.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => { openTool(t.id); closeTab(tabId); }}
            className="flex min-w-0 items-center gap-3 rounded-lg border border-line bg-canvas/50 px-3 py-3 text-left text-sm text-body hover:border-accent/60 hover:text-strong sm:px-4"
          >
            <ToolBadge name={t.name} accent={t.accent} size={28} />
            <span className="truncate">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
