"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { workspaceRepository } from "@/services/workspace.repository";
import { SEED_CATALOG } from "@/services/seed";
import type { Folder, NewToolInput, Tab, Tool, UserProfile } from "@/types";

const uid = () => Math.random().toString(36).slice(2, 10);

interface WorkspaceState {
  /* catalog (persisted through the repository) */
  user: UserProfile;
  folders: Folder[];
  tools: Tool[];
  catalogReady: boolean;

  /* session UI state (persisted via zustand/persist) */
  tabs: Tab[];
  activeTabId: string | null;
  expandedFolderIds: string[];
  sidebarCollapsed: boolean;

  /* transient UI state */
  searchQuery: string;
  addModalOpen: boolean;
  navOpen: boolean;

  loadCatalog: () => Promise<void>;
  openTool: (toolId: string) => void;
  openBlankTab: () => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  toggleFolder: (folderId: string) => void;
  toggleSidebar: () => void;
  setSearchQuery: (q: string) => void;
  setNavOpen: (open: boolean) => void;
  setAddModalOpen: (open: boolean) => void;
  addTool: (input: NewToolInput) => void;
  addFolder: (name: string) => string;
  removeTool: (toolId: string) => void;
  removeFolder: (folderId: string) => void;
  moveTool: (toolId: string, folderId: string) => void;
  renameTool: (toolId: string, name: string) => void;
  renameFolder: (folderId: string, name: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => {
      const persistCatalog = () => {
        const { user, folders, tools } = get();
        void workspaceRepository.save({ user, folders, tools });
      };

      return {
        ...SEED_CATALOG,
        catalogReady: false,
        tabs: [],
        activeTabId: null,
        expandedFolderIds: SEED_CATALOG.folders.map((f) => f.id),
        sidebarCollapsed: false,
        searchQuery: "",
        addModalOpen: false,
        navOpen: false,

        loadCatalog: async () => {
          const snapshot = await workspaceRepository.load();
          set({ ...snapshot, catalogReady: true });
        },

        openTool: (toolId) => {
          const { tabs, tools } = get();
          const existing = tabs.find((t) => t.toolId === toolId);
          if (existing) return set({ activeTabId: existing.id });
          const tool = tools.find((t) => t.id === toolId);
          if (!tool) return;
          const tab: Tab = { id: uid(), toolId, title: tool.name };
          set({ tabs: [...tabs, tab], activeTabId: tab.id });
        },

        openBlankTab: () => {
          const tab: Tab = { id: uid(), toolId: null, title: "New Workspace" };
          set((s) => ({ tabs: [...s.tabs, tab], activeTabId: tab.id }));
        },

        closeTab: (tabId) =>
          set((s) => {
            const idx = s.tabs.findIndex((t) => t.id === tabId);
            if (idx === -1) return s;
            const tabs = s.tabs.filter((t) => t.id !== tabId);
            const activeTabId =
              s.activeTabId === tabId ? (tabs[idx] ?? tabs[idx - 1])?.id ?? null : s.activeTabId;
            return { tabs, activeTabId };
          }),

        setActiveTab: (activeTabId) => set({ activeTabId }),

        toggleFolder: (id) =>
          set((s) => ({
            expandedFolderIds: s.expandedFolderIds.includes(id)
              ? s.expandedFolderIds.filter((f) => f !== id)
              : [...s.expandedFolderIds, id],
          })),

        toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        setNavOpen: (navOpen) => set({ navOpen }),
        setAddModalOpen: (addModalOpen) => set({ addModalOpen }),

        addTool: (input) => {
          const tool: Tool = { id: uid(), accent: "#60a5fa", ...input };
          set((s) => ({
            tools: [...s.tools, tool],
            expandedFolderIds: [...new Set([...s.expandedFolderIds, input.folderId])],
          }));
          persistCatalog();
        },

        removeTool: (toolId) => {
          set((s) => {
            const tabs = s.tabs.filter((t) => t.toolId !== toolId);
            const activeStillOpen = tabs.some((t) => t.id === s.activeTabId);
            return {
              tools: s.tools.filter((t) => t.id !== toolId),
              tabs,
              activeTabId: activeStillOpen ? s.activeTabId : tabs[tabs.length - 1]?.id ?? null,
            };
          });
          persistCatalog();
        },

        removeFolder: (folderId) => {
          set((s) => {
            // Remove tools in the folder (and their tabs)
            const toolsToRemove = s.tools.filter((t) => t.folderId === folderId).map((t) => t.id);
            const tabs = s.tabs.filter((t) => !t.toolId || !toolsToRemove.includes(t.toolId));
            const activeStillOpen = tabs.some((t) => t.id === s.activeTabId);
            return {
              folders: s.folders.filter((f) => f.id !== folderId),
              tools: s.tools.filter((t) => t.folderId !== folderId),
              tabs,
              activeTabId: activeStillOpen ? s.activeTabId : tabs[tabs.length - 1]?.id ?? null,
              expandedFolderIds: s.expandedFolderIds.filter((id) => id !== folderId),
            };
          });
          persistCatalog();
        },

        moveTool: (toolId, folderId) => {
          set((s) => ({
            tools: s.tools.map((t) => (t.id === toolId ? { ...t, folderId } : t)),
            expandedFolderIds: [...new Set([...s.expandedFolderIds, folderId])],
          }));
          persistCatalog();
        },

        renameTool: (toolId, name) => {
          set((s) => ({
            tools: s.tools.map((t) => (t.id === toolId ? { ...t, name } : t)),
            tabs: s.tabs.map((t) => (t.toolId === toolId ? { ...t, title: name } : t)),
          }));
          persistCatalog();
        },

        renameFolder: (folderId, name) => {
          set((s) => ({
            folders: s.folders.map((f) => (f.id === folderId ? { ...f, name } : f)),
          }));
          persistCatalog();
        },

        addFolder: (name) => {
          const folder: Folder = { id: uid(), name };
          set((s) => ({
            folders: [...s.folders, folder],
            expandedFolderIds: [...s.expandedFolderIds, folder.id],
          }));
          persistCatalog();
          return folder.id;
        },
      };
    },
    {
      name: "aics:session:v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // rehydrated manually on the client to avoid SSR mismatch
      partialize: (s) => ({
        tabs: s.tabs,
        activeTabId: s.activeTabId,
        expandedFolderIds: s.expandedFolderIds,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
);
