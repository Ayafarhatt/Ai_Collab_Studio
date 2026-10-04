"use client";

import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Folder as FolderIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useTabs } from "@/hooks/useTabs";
import { useWorkspaceStore } from "@/store/workspace.store";
import { filterCatalog } from "./filterCatalog";

/**
 * Collapsible, searchable folder tree.
 * - Click a tool: open (or focus) its tab.
 * - Drag a tool onto another folder: move it.
 * - Rename/delete tools and folders.
 */
export function Sidebar() {
  const folders = useWorkspaceStore((s) => s.folders);
  const tools = useWorkspaceStore((s) => s.tools);
  const query = useWorkspaceStore((s) => s.searchQuery);
  const moveTool = useWorkspaceStore((s) => s.moveTool);
  const removeTool = useWorkspaceStore((s) => s.removeTool);
  const removeFolder = useWorkspaceStore((s) => s.removeFolder);
  const renameTool = useWorkspaceStore((s) => s.renameTool);
  const renameFolder = useWorkspaceStore((s) => s.renameFolder);
  const { collapsed, expandedFolderIds, toggleSidebar, toggleFolder } = useSidebarState();
  const { tabs, activeTabId, openTool } = useTabs();

  const [dragToolId, setDragToolId] = useState<string | null>(null);
  const [overFolderId, setOverFolderId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => filterCatalog(folders, tools, query), [folders, tools, query]);
  const activeToolId = tabs.find((t) => t.id === activeTabId)?.toolId;
  const searching = query.trim().length > 0;

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

  return (
    <aside
      className={`flex shrink-0 flex-col rounded-xl border border-line bg-panel transition-[width] duration-200 ${
        collapsed ? "w-14" : "w-72"
      }`}
    >
      <button
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="m-2 flex h-8 w-8 items-center justify-center self-end rounded-md text-muted hover:bg-hover hover:text-strong"
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {collapsed ? (
          <ul className="flex flex-col items-center gap-2">
            {tools.map((t) => (
              <li key={t.id}>
                <button onClick={() => openTool(t.id)} title={t.name} className="rounded-md p-1 hover:bg-hover">
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
                    className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-body"
                  >
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <FolderIcon size={16} className="text-subtle" />
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
                        className="flex-1 rounded border border-line bg-surface-2 px-1 py-0.5 text-sm text-body focus:border-accent focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate">{folder.name}</span>
                    )}
                  </button>
                  {editingFolderId !== folder.id && (
                    <div className="flex gap-0.5 opacity-0 focus-visible:opacity-100 group-hover:opacity-100">
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
                        className={`group flex items-center rounded-md ${
                          dragToolId === t.id ? "opacity-40" : ""
                        } ${activeToolId === t.id ? "bg-accent/15" : "hover:bg-hover"}`}
                      >
                        <button
                          onClick={() => openTool(t.id)}
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
                              className="flex-1 rounded border border-line bg-surface-2 px-1 py-0.5 text-sm text-body focus:border-accent focus:outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="truncate">{t.name}</span>
                          )}
                        </button>
                        {editingToolId !== t.id && (
                          <div className="mr-1 flex gap-0.5 opacity-0 focus-visible:opacity-100 group-hover:opacity-100">
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
                                handleRemoveTool(t.id, t.name);
                              }}
                              aria-label={`Remove ${t.name}`}
                              className="rounded p-1 text-subtle hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
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
        {!collapsed && searching && groups.length === 0 && (
          <p className="px-3 py-4 text-sm text-subtle">No folders or tools match “{query}”.</p>
        )}
      </nav>
    </aside>
  );
}
