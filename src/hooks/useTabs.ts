"use client";

import { useWorkspaceStore } from "@/store/workspace.store";

/** Tab-related state + actions, decoupled from the store shape. */
export function useTabs() {
  const tabs = useWorkspaceStore((s) => s.tabs);
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const closeTab = useWorkspaceStore((s) => s.closeTab);
  const openBlankTab = useWorkspaceStore((s) => s.openBlankTab);
  const openTool = useWorkspaceStore((s) => s.openTool);
  return { tabs, activeTabId, setActiveTab, closeTab, openBlankTab, openTool };
}
