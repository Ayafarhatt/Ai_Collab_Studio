import type { CatalogSnapshot } from "@/types";

/** Initial mock catalog. Replace with DB data later. */
export const SEED_CATALOG: CatalogSnapshot = {
  user: { id: "u1", name: "You" },
  folders: [
    { id: "dev", name: "Development Hub" },
    { id: "research", name: "Research & Knowledge" },
    { id: "media", name: "Media Generation" },
    { id: "projects", name: "Projects" },
  ],
  tools: [
    { id: "claude", name: "Claude", kind: "tool", folderId: "dev", url: "https://claude.ai", accent: "#d97757" },
    { id: "chatgpt", name: "ChatGPT", kind: "tool", folderId: "dev", url: "https://chatgpt.com", accent: "#10a37f" },
    { id: "gemini", name: "Gemini", kind: "tool", folderId: "dev", url: "https://gemini.google.com", accent: "#6d8cff" },
    { id: "copilot", name: "GitHub Copilot", kind: "tool", folderId: "dev", url: "https://github.com/copilot", accent: "#a78bfa" },
    { id: "notebooklm", name: "NotebookLM", kind: "tool", folderId: "research", url: "https://notebooklm.google.com", accent: "#2dd4bf" },
    { id: "perplexity", name: "Perplexity AI", kind: "tool", folderId: "research", url: "https://www.perplexity.ai", accent: "#22d3ee" },
    { id: "midjourney", name: "Midjourney", kind: "tool", folderId: "media", url: "https://www.midjourney.com", accent: "#f472b6" },
    { id: "elevenlabs", name: "ElevenLabs (Audio)", kind: "tool", folderId: "media", url: "https://elevenlabs.io", accent: "#f87171" },
    { id: "pika", name: "Pika Labs (Video)", kind: "tool", folderId: "media", url: "https://pika.art", accent: "#facc15" },
    { id: "q4", name: "Q4 Marketing Plan", kind: "project", folderId: "projects", accent: "#94a3b8" },
    { id: "refactor", name: "Code Refactor Project", kind: "project", folderId: "projects", accent: "#94a3b8" },
  ],
};
