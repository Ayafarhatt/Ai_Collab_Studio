"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";

/** Rehydrates session state and loads the catalog once on the client. */
export function useWorkspaceBootstrap() {
  const ready = useWorkspaceStore((s) => s.catalogReady);
  useEffect(() => {
    void (async () => {
      await useWorkspaceStore.persist.rehydrate();
      await useWorkspaceStore.getState().loadCatalog();
    })();
  }, []);
  return ready;
}
