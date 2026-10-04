"use client";

import { ToolBadge } from "@/components/ui/ToolBadge";
import { useTabs } from "@/hooks/useTabs";
import { useWorkspaceStore } from "@/store/workspace.store";

/** Content of a blank "New Workspace" tab: pick a tool to open. */
export function Launcher({ tabId }: { tabId: string }) {
  const tools = useWorkspaceStore((s) => s.tools);
  const { closeTab, openTool } = useTabs();

  return (
    <div className="p-8">
      <h2 className="mb-1 text-lg font-semibold text-strong">Open a tool</h2>
      <p className="mb-6 text-sm text-subtle">Pick something to open in its own tab.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => { openTool(t.id); closeTab(tabId); }}
            className="flex items-center gap-3 rounded-lg border border-line bg-canvas/50 px-4 py-3 text-left text-sm text-body hover:border-accent/60 hover:text-strong"
          >
            <ToolBadge name={t.name} accent={t.accent} size={28} />
            <span className="truncate">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
