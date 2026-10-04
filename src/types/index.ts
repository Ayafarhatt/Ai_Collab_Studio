/** Domain types. Flat + id-referenced so they map 1:1 to future Prisma models. */

export type ToolKind = "tool" | "project";

export interface Folder {
  id: string;
  name: string;
}

export interface Tool {
  id: string;
  name: string;
  kind: ToolKind;
  folderId: string;
  /** Embed URL. Projects may omit it (they open an internal view). */
  url?: string;
  /** Hex colour used for the tool's badge. */
  accent: string;
}

export interface Tab {
  id: string;
  /** null = blank "New Workspace" launcher tab. */
  toolId: string | null;
  title: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
}

/** Everything the repository persists (the "server-side" data). */
export interface CatalogSnapshot {
  user: UserProfile;
  folders: Folder[];
  tools: Tool[];
}

export type NewToolInput = Pick<Tool, "name" | "url" | "folderId" | "kind">;
