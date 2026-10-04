import type { Folder, Tool } from "@/types";

export interface FolderWithTools {
  folder: Folder;
  tools: Tool[];
}

/** Groups tools by folder and applies the search query (folder or tool name). */
export function filterCatalog(folders: Folder[], tools: Tool[], query: string): FolderWithTools[] {
  const q = query.trim().toLowerCase();
  return folders
    .map((folder) => {
      const inFolder = tools.filter((t) => t.folderId === folder.id);
      const folderMatches = folder.name.toLowerCase().includes(q);
      const matched = q && !folderMatches ? inFolder.filter((t) => t.name.toLowerCase().includes(q)) : inFolder;
      return { folder, tools: matched };
    })
    .filter((g) => !q || g.tools.length > 0 || g.folder.name.toLowerCase().includes(q));
}
