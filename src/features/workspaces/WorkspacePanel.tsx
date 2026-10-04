import { TabBar } from "./TabBar";
import { ToolViewer } from "@/features/tool-viewer/ToolViewer";

/** Right-hand panel: tab strip on top, embedded views below. */
export function WorkspacePanel() {
  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-panel md:rounded-xl md:border md:border-line">
      <TabBar />
      <ToolViewer />
    </main>
  );
}
