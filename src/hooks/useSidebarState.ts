"use client";

import { useWorkspaceStore } from "@/store/workspace.store";

export function useSidebarState() {
  const collapsed = useWorkspaceStore((s) => s.sidebarCollapsed);
  const expandedFolderIds = useWorkspaceStore((s) => s.expandedFolderIds);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const toggleFolder = useWorkspaceStore((s) => s.toggleFolder);
  return { collapsed, expandedFolderIds, toggleSidebar, toggleFolder };
}
