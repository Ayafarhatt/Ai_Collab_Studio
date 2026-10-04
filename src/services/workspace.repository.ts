import type { CatalogSnapshot } from "@/types";
import { SEED_CATALOG } from "./seed";

/**
 * Persistence boundary for the catalog (folders, tools, user).
 * Swap LocalStorageRepository for a Prisma/REST-backed class later;
 * nothing else in the app needs to change.
 */
export interface WorkspaceRepository {
  load(): Promise<CatalogSnapshot>;
  save(snapshot: CatalogSnapshot): Promise<void>;
}

const KEY = "aics:catalog:v1";

class LocalStorageRepository implements WorkspaceRepository {
  async load(): Promise<CatalogSnapshot> {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as CatalogSnapshot) : SEED_CATALOG;
    } catch {
      return SEED_CATALOG;
    }
  }

  async save(snapshot: CatalogSnapshot): Promise<void> {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(snapshot));
    } catch {
      /* storage full or unavailable: fail silently for now */
    }
  }
}

export const workspaceRepository: WorkspaceRepository = new LocalStorageRepository();
