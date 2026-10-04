"use client";

import { ExternalLink, Globe } from "lucide-react";
import { useState } from "react";
import type { Tool } from "@/types";

export function ToolControlCard({ tool }: { tool: Tool }) {
  const [notes, setNotes] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(`tool-notes-${tool.id}`) || "";
  });

  const handleNotesChange = (value: string) => {
    setNotes(value);
    localStorage.setItem(`tool-notes-${tool.id}`, value);
  };

  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-lg">
          <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg"
                style={{ backgroundColor: tool.accent }}
                aria-label={`${tool.name} logo`}
              >
                {tool.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-medium text-body sm:text-lg">{tool.name}</h2>
                <p className="mt-1 truncate text-xs text-subtle sm:text-sm" title={tool.url}>{tool.url}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs text-subtle sm:text-sm">
                Opens in a new tab (iframes blocked by security headers)
              </span>
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent/90 sm:h-auto sm:py-2"
            >
              <ExternalLink size={16} className="shrink-0" />
              Open in New Tab
            </a>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-subtle">
                <Globe size={14} />
                Quick Notes
              </div>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add notes about this tool (context, prompts, login info, etc.)"
                className="min-h-[120px] w-full rounded-md border border-line bg-surface-2 px-3 py-2 text-base text-body placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 sm:text-sm"
              />
              <p className="text-xs text-subtle">
                Notes are saved locally for this tool
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}