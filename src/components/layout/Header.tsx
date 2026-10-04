import { Moon, Plus, Search, Sun } from "lucide-react";
import type { Theme } from "@/hooks/useTheme";
import type { UserProfile } from "@/types";

interface HeaderProps {
  user: UserProfile;
  query: string;
  onQueryChange: (q: string) => void;
  onAddClick: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

/** Pure presentational top bar: logo, universal search, actions, profile. */
export function Header({ user, query, onQueryChange, onAddClick, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-canvas px-5">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent font-bold">A</div>
        <span className="text-lg font-semibold text-strong">AI Collab Studio</span>
      </div>

      <label className="relative mx-auto block w-full max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Global search"
          aria-label="Search folders and tools"
          className="h-10 w-full rounded-lg border border-line bg-panel pl-9 pr-3 text-sm text-body placeholder:text-subtle focus:border-accent focus:outline-none"
        />
      </label>

      <button
        onClick={onAddClick}
        className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 md:flex"
      >
        <Plus size={16} /> Add New AI Tool / Folder
      </button>
      <button
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="rounded-lg p-2 text-muted hover:bg-hover hover:text-strong"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div title={user.name} className="grid h-8 w-8 place-items-center rounded-full bg-slate-700 text-xs font-semibold text-white">
        {user.name.charAt(0).toUpperCase()}
      </div>
    </header>
  );
}
