"use client";

import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Folder as FolderIcon,
  FolderInput,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useTabs } from "@/hooks/useTabs";
import { useTheme } from "@/hooks/useTheme";
import { useWorkspaceStore } from "@/store/workspace.store";
import { filterCatalog } from "./filterCatalog";

/**
 * Collapsible, searchable folder tree.
 * - Click a tool: open (or focus) its tab.
 * - Drag a tool onto another folder: move it (pointer devices only).
 * - Rename/delete tools and folders, or move a tool from its row menu (touch).
 *
 * Below `md` it is an off-canvas drawer over the workspace panel instead of a
 * sibling column, so phones keep the full width for the tool view.
 */
export function Sidebar() {
  const folders = useWorkspaceStore((s) => s.folders);
  const tools = useWorkspaceStore((s) => s.tools);
  const query = useWorkspaceStore((s) => s.searchQuery);
  const navOpen = useWorkspaceStore((s) => s.navOpen);
  const setNavOpen = useWorkspaceStore((s) => s.setNavOpen);
  const moveTool = useWorkspaceStore((s) => s.moveTool);
  const removeTool = useWorkspaceStore((s) => s.removeTool);
  const removeFolder = useWorkspaceStore((s) => s.removeFolder);
  const renameTool = useWorkspaceStore((s) => s.renameTool);
  const renameFolder = useWorkspaceStore((s) => s.renameFolder);
  const { collapsed, expandedFolderIds, toggleSidebar, toggleFolder } = useSidebarState();
  const { tabs, activeTabId, openTool } = useTabs();
  const { theme, toggleTheme } = useTheme();

  const [dragToolId, setDragToolId] = useState<string | null>(null);
  const [overFolderId, setOverFolderId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [movingToolId, setMovingToolId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => filterCatalog(folders, tools, query), [folders, tools, query]);
  const activeToolId = tabs.find((t) => t.id === activeTabId)?.toolId;
  const searching = query.trim().length > 0;

  /*
   * The icon rail only makes sense next to the workspace panel. Below `md` the
   * sidebar is a drawer that already hides the panel, so a collapsed preference
   * (persisted from a desktop session) would leave a 288px drawer full of bare
   * icons with no visible way to expand it. Ignore the preference there.
   */
  const isWide = useMediaQuery("(min-width: 48rem)");
  const railMode = isWide && collapsed;

  const handleRemoveTool = (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from your workspace?`)) removeTool(id);
  };

  const handleRemoveFolder = (id: string, name: string) => {
    if (window.confirm(`Delete folder "${name}"? This will also remove all tools in it.`)) removeFolder(id);
  };

  const startEditFolder = (folder: { id: string; name: string }) => {
    setEditingFolderId(folder.id);
    setEditValue(folder.name);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const startEditTool = (tool: { id: string; name: string }) => {
    setEditingToolId(tool.id);
    setEditValue(tool.name);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (editingFolderId && editValue.trim()) {
      renameFolder(editingFolderId, editValue.trim());
    }
    if (editingToolId && editValue.trim()) {
      renameTool(editingToolId, editValue.trim());
    }
    setEditingFolderId(null);
    setEditingToolId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingFolderId(null);
    setEditingToolId(null);
    setEditValue("");
  };

  /** Opens a tool and gets the drawer out of the way on phones. */
  const handleOpenTool = (toolId: string) => {
    openTool(toolId);
    setNavOpen(false);
  };

  return (
    <aside
      id="app-sidebar"
      aria-label="Workspace folders"
      className={`absolute inset-y-0 left-0 z-30 flex max-w-[85vw] shrink-0 flex-col border-line bg-panel transition-[width,transform,visibility] duration-200 md:relative md:z-auto md:max-w-none md:translate-x-0 ${
        navOpen ? "visible translate-x-0" : "invisible -translate-x-full md:visible"
      } ${collapsed ? "w-72 md:w-14" : "w-72"} border-r md:rounded-xl md:border`}
    >
      <button
        onClick={() => setNavOpen(false)}
        aria-label="Close navigation"
        className="m-2 flex h-8 w-8 shrink-0 items-center justify-center self-end rounded-md text-muted hover:bg-hover hover:text-strong md:hidden"
      >
        <X size={16} />
      </button>
      <button
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="m-2 hidden h-8 w-8 shrink-0 items-center justify-center self-end rounded-md text-muted hover:bg-hover hover:text-strong md:flex"
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-2 pb-3">
        {railMode ? (
          <ul className="flex flex-col items-center gap-2">
            {tools.map((t) => (
              <li key={t.id}>
                <button onClick={() => handleOpenTool(t.id)} title={t.name} className="rounded-md p-1 hover:bg-hover">
                  <ToolBadge name={t.name} accent={t.accent} size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          groups.map(({ folder, tools: items }) => {
            const open = searching || expandedFolderIds.includes(folder.id);
            const isDropTarget = dragToolId !== null && overFolderId === folder.id;
            return (
              <section
                key={folder.id}
                className={`mb-1 rounded-lg ${isDropTarget ? "bg-accent/10 ring-1 ring-accent" : ""}`}
                onDragOver={(e) => {
                  if (!dragToolId) return;
                  e.preventDefault(); // required to allow dropping
                  e.dataTransfer.dropEffect = "move";
                  if (overFolderId !== folder.id) setOverFolderId(folder.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverFolderId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const tool = tools.find((t) => t.id === dragToolId);
                  if (tool && tool.folderId !== folder.id) moveTool(tool.id, folder.id);
                  setDragToolId(null);
                  setOverFolderId(null);
                }}
              >
                <div className="group flex w-full items-center rounded-md px-2 py-2 hover:bg-hover">
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    aria-expanded={open}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-medium text-body"
                  >
                    {open ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
                    <FolderIcon size={16} className="shrink-0 text-subtle" />
                    {editingFolderId === folder.id ? (
                      <input
                        ref={editInputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="min-w-0 flex-1 rounded border border-line bg-surface-2 px-1 py-0.5 text-sm text-body focus:border-accent focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate">{folder.name}</span>
                    )}
                  </button>
                  {editingFolderId !== folder.id && (
                    <div className="reveal-on-hover flex shrink-0 gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditFolder(folder);
                        }}
                        aria-label={`Rename ${folder.name}`}
                        className="rounded p-1 text-subtle hover:text-body"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFolder(folder.id, folder.name);
                        }}
                        aria-label={`Delete ${folder.name}`}
                        className="rounded p-1 text-subtle hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
                {open && (
                  <ul className="ml-4 border-l border-line pl-2">
                    {items.map((t) => (
                      <li
                        key={t.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", t.id);
                          setDragToolId(t.id);
                        }}
                        onDragEnd={() => { setDragToolId(null); setOverFolderId(null); }}
                        className={`group rounded-md ${
                          dragToolId === t.id ? "opacity-40" : ""
                        } ${activeToolId === t.id ? "bg-accent/15" : "hover:bg-hover"}`}
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() => handleOpenTool(t.id)}
                            className={`flex min-w-0 flex-1 cursor-grab items-center gap-2.5 px-2 py-1.5 text-left text-sm ${
                              activeToolId === t.id ? "text-strong" : "text-muted group-hover:text-body"
                            }`}
                          >
                            <ToolBadge name={t.name} accent={t.accent} />
                            {editingToolId === t.id ? (
                              <input
                                ref={editInputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitEdit();
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="min-w-0 flex-1 rounded border border-line bg-surface-2 px-1 py-0.5 text-sm text-body focus:border-accent focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="truncate">{t.name}</span>
                            )}
                          </button>
                          {editingToolId !== t.id && (
                            <div className="reveal-on-hover mr-1 flex shrink-0 gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditTool(t);
                                }}
                                aria-label={`Rename ${t.name}`}
                                className="rounded p-1 text-subtle hover:text-body"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMovingToolId(movingToolId === t.id ? null : t.id);
                                }}
                                aria-label={`Move ${t.name} to another folder`}
                                aria-expanded={movingToolId === t.id}
                                className="rounded p-1 text-subtle hover:text-body"
                              >
                                <FolderInput size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTool(t.id, t.name);
                                }}
                                aria-label={`Remove ${t.name}`}
                                className="rounded p-1 text-subtle hover:text-red-500"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        {movingToolId === t.id && (
                          <div className="mb-1 ml-4 rounded-md border border-line bg-surface-2 p-1.5">
                            <p className="px-1 pb-1 text-xs text-subtle">Move “{t.name}” to</p>
                            {folders.map((f) => (
                              <button
                                key={f.id}
                                disabled={f.id === t.folderId}
                                onClick={() => {
                                  moveTool(t.id, f.id);
                                  setMovingToolId(null);
                                }}
                                className="block w-full truncate rounded px-2 py-1.5 text-left text-sm text-body hover:bg-hover disabled:text-subtle"
                              >
                                {f.name}
                                {f.id === t.folderId && " (current)"}
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                    {items.length === 0 && (
                      <li className="px-2 py-1.5 text-xs text-subtle">
                        {dragToolId ? "Drop here" : "Empty folder"}
                      </li>
                    )}
                  </ul>
                )}
              </section>
            );
          })
        )}
        {!railMode && searching && groups.length === 0 && (
          <p className="px-3 py-4 text-sm text-subtle">No folders or tools match “{query}”.</p>
        )}
      </nav>

      {/* Theme toggle lives here so the header stays free of secondary actions. */}
      <div className="shrink-0 border-t border-line p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted hover:bg-hover hover:text-strong ${
            railMode ? "justify-center" : ""
          }`}
        >
          {theme === "dark" ? (
            <Sun size={16} className="shrink-0" />
          ) : (
            <Moon size={16} className="shrink-0" />
          )}
          {!railMode && <span className="truncate">{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
        </button>
      </div>
    </aside>
  );
}
