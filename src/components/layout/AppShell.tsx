"use client";

import { Header } from "@/components/layout/Header";
import { AddItemModal } from "@/features/add-item/AddItemModal";
import { Sidebar } from "@/features/navigation/Sidebar";
import { WorkspacePanel } from "@/features/workspaces/WorkspacePanel";
import { useTheme } from "@/hooks/useTheme";
import { useWorkspaceBootstrap } from "@/hooks/useWorkspaceBootstrap";
import { useWorkspaceStore } from "@/store/workspace.store";

/**
 * Main layout. Wires store state into the pure Header and composes
 * Sidebar + WorkspacePanel. This is the only place that knows the full page shape.
 */
export function AppShell() {
  const ready = useWorkspaceBootstrap();
  const { theme, toggleTheme } = useTheme();
  const user = useWorkspaceStore((s) => s.user);
  const query = useWorkspaceStore((s) => s.searchQuery);
  const setQuery = useWorkspaceStore((s) => s.setSearchQuery);
  const setAddModalOpen = useWorkspaceStore((s) => s.setAddModalOpen);

  return (
    <div className="flex h-dvh flex-col bg-canvas text-body">
      <Header user={user} query={query} onQueryChange={setQuery} onAddClick={() => setAddModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {ready ? (
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <Sidebar />
          <WorkspacePanel />
        </div>
      ) : (
        <div className="grid flex-1 place-items-center text-sm text-subtle">Loading workspace…</div>
      )}
      <AddItemModal />
    </div>
  );
}
