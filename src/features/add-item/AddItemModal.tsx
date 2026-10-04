"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { useWorkspaceStore } from "@/store/workspace.store";

const field =
  "h-11 w-full rounded-lg border border-line bg-canvas px-3 text-base text-body placeholder:text-subtle focus:border-accent focus:outline-none sm:h-10 sm:text-sm";

/** Create a new tool (with URL) or a new folder. */
export function AddItemModal() {
  const open = useWorkspaceStore((s) => s.addModalOpen);
  const setOpen = useWorkspaceStore((s) => s.setAddModalOpen);
  const folders = useWorkspaceStore((s) => s.folders);
  const addTool = useWorkspaceStore((s) => s.addTool);
  const addFolder = useWorkspaceStore((s) => s.addFolder);

  const [mode, setMode] = useState<"tool" | "folder">("tool");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState("");

  const close = () => { setOpen(false); setName(""); setUrl(""); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "folder") addFolder(name.trim());
    else {
      const normalized = /^https?:\/\//.test(url) ? url : `https://${url}`;
      addTool({ name: name.trim(), url: normalized, kind: "tool", folderId: folderId || folders[0]?.id });
    }
    close();
  };

  return (
    <Modal open={open} title="Add to your workspace" onClose={close}>
      <div className="mb-4 flex gap-1 rounded-lg bg-canvas p-1 text-sm">
        {(["tool", "folder"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-md py-1.5 ${mode === m ? "bg-panel text-strong" : "text-muted"}`}
          >
            {m === "tool" ? "AI tool" : "Folder"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input className={field} placeholder={mode === "tool" ? "Tool name" : "Folder name"} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        {mode === "tool" && (
          <>
            <input className={field} placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
            <select className={field} value={folderId || folders[0]?.id} onChange={(e) => setFolderId(e.target.value)}>
              {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </>
        )}
        <button className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-white hover:bg-accent/90 sm:h-10">
          {mode === "tool" ? "Add tool" : "Add folder"}
        </button>
      </form>
    </Modal>
  );
}
