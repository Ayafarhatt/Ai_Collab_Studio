"use client";

import { useEffect } from "react";
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
 *
 * Phones (< md) get a full-bleed workspace panel plus an off-canvas nav drawer;
 * from md up the sidebar sits beside the panel again. Breakpoints live in CSS so
 * there is no viewport JS to disagree with during hydration.
 */
export function AppShell() {
  const ready = useWorkspaceBootstrap();
  const { theme, toggleTheme } = useTheme();
  const user = useWorkspaceStore((s) => s.user);
  const query = useWorkspaceStore((s) => s.searchQuery);
  const navOpen = useWorkspaceStore((s) => s.navOpen);
  const setQuery = useWorkspaceStore((s) => s.setSearchQuery);
  const setNavOpen = useWorkspaceStore((s) => s.setNavOpen);
  const setAddModalOpen = useWorkspaceStore((s) => s.setAddModalOpen);

  // Escape closes the drawer, matching the modal's dismiss behaviour.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen, setNavOpen]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-body">
      <Header user={user} query={query} onQueryChange={setQuery} onAddClick={() => setAddModalOpen(true)}
        onMenuClick={() => setNavOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {ready ? (
        <div className="relative flex min-h-0 flex-1 md:gap-4 md:p-4">
          <Sidebar />
          {navOpen && (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute inset-0 z-20 bg-black/50 md:hidden"
            />
          )}
          <WorkspacePanel />
        </div>
      ) : (
        <div className="grid flex-1 place-items-center text-sm text-subtle">Loading workspace…</div>
      )}
      <AddItemModal />
    </div>
  );
}
