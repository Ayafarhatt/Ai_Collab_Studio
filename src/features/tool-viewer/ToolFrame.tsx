"use client";

import { ExternalLink, RotateCw } from "lucide-react";
import { useState } from "react";
import type { Tool } from "@/types";

/**
 * Sandboxed iframe wrapper with a small toolbar.
 * NOTE: many AI sites send X-Frame-Options / CSP frame-ancestors headers and
 * will refuse to render here. The browser gives us no reliable way to detect
 * that, so the "Open in new window" fallback is always visible.
 */
export function ToolFrame({ tool }: { tool: Tool }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3 text-xs text-subtle">
        <span className="truncate">{tool.url}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setLoaded(false); setReloadKey((k) => k + 1); }}
            aria-label="Reload"
            className="rounded p-1.5 hover:bg-hover-strong hover:text-strong"
          >
            <RotateCw size={13} />
          </button>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded px-2 py-1.5 hover:bg-hover-strong hover:text-strong"
          >
            <ExternalLink size={13} /> Open in new window
          </a>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-sm text-subtle">
            Loading {tool.name}… If it stays blank or shows “blocked”, install the extension from the /extension folder (see README) or use “Open in new window”.
          </div>
        )}
        <iframe
          key={reloadKey}
          src={tool.url}
          title={tool.name}
          onLoad={() => setLoaded(true)}
          className="h-full w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    </div>
  );
}
