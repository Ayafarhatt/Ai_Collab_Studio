import { Menu, Moon, Plus, Search, Sun } from "lucide-react";
import type { Theme } from "@/hooks/useTheme";
import type { UserProfile } from "@/types";

interface HeaderProps {
  user: UserProfile;
  query: string;
  onQueryChange: (q: string) => void;
  onAddClick: () => void;
  onMenuClick: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

/**
 * Pure presentational top bar: menu, logo, search, actions, profile.
 * Phones get an icon-only logo, a menu button and a second full-width search row
 * so nothing is squeezed; the label of the add button collapses to its icon.
 */
export function Header({ user, query, onQueryChange, onAddClick, onMenuClick, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="z-30 shrink-0 border-b border-line bg-canvas">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 md:h-16 md:gap-4 md:px-5">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-controls="app-sidebar"
          className="-ml-1 rounded-lg p-2 text-muted hover:bg-hover hover:text-strong md:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 font-bold text-accent">A</div>
          <span className="hidden truncate text-lg font-semibold text-strong sm:inline">AI Collab Studio</span>
        </div>

        <SearchField className="mx-auto hidden w-full max-w-xl md:block" value={query} onChange={onQueryChange} />

        <button
          onClick={onAddClick}
          aria-label="Add new AI tool or folder"
          className="ml-auto flex shrink-0 items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90 md:ml-0 md:px-4"
        >
          <Plus size={16} />
          <span className="hidden md:inline">Add New AI Tool / Folder</span>
        </button>
        <button
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="shrink-0 rounded-lg p-2 text-muted hover:bg-hover hover:text-strong"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div
          title={user.name}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-semibold text-white"
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="px-3 pb-2 md:hidden">
        <SearchField value={query} onChange={onQueryChange} />
      </div>
    </header>
  );
}

interface SearchFieldProps {
  className?: string;
  value: string;
  onChange: (q: string) => void;
}

/** Universal search input. Rendered twice: inline from md up, on its own row below. */
function SearchField({ className, value, onChange }: SearchFieldProps) {
  return (
    <label className={`relative block ${className ?? ""}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Global search"
        aria-label="Search folders and tools"
        className="h-10 w-full rounded-lg border border-line bg-panel pl-9 pr-3 text-base text-body placeholder:text-subtle focus:border-accent focus:outline-none md:text-sm"
      />
    </label>
  );
}
