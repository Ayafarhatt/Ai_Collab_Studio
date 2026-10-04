"use client";

import { useTabs } from "@/hooks/useTabs";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Launcher } from "./Launcher";
import { ToolControlCard } from "./ToolControlCard";

/**
 * Renders EVERY open tab and hides the inactive ones with CSS.
 * Keeping iframe state is no longer needed since we render control cards.
 */
export function ToolViewer() {
  const { tabs, activeTabId } = useTabs();
  const tools = useWorkspaceStore((s) => s.tools);

  if (tabs.length === 0) {
    return (
      <div className="grid flex-1 place-items-center p-8 text-center">
        <div>
          <p className="text-base font-medium text-body">No tools open</p>
          <p className="mt-1 text-sm text-subtle">Choose a tool from the sidebar to open it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1">
      {tabs.map((tab) => {
        const tool = tools.find((t) => t.id === tab.toolId);
        return (
          <div key={tab.id} hidden={tab.id !== activeTabId} className="h-full">
            {!tab.toolId ? (
              <Launcher tabId={tab.id} />
            ) : tool?.url ? (
              <ToolControlCard tool={tool} />
            ) : (
              <div className="grid h-full place-items-center text-sm text-subtle">
                “{tab.title}” has no embedded view yet. Project pages are coming next.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
