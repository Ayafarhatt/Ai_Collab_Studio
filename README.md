Plan is settled. Here's what I'll do — README-only changes, no code.

## 1. New "Tech Stack" section (with versions)

Placed right after **Main Idea**, before **How to Run**. Versions taken verbatim from `package.json`:

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack builds) | 16.3.8 |
| UI runtime | React / React DOM | 19.2.8 |
| Language | TypeScript (`.ts` / `.tsx`) | ^5 |
| Styling | Tailwind CSS via `@tailwindcss/postcss` | ^4 |
| State | Zustand + `persist` middleware | ^5.0.15 |
| Icons | lucide-react | ^1.52.0 |
| Linting | ESLint + eslint-config-next | ^9 / 16.3.8 |
| Types | `@types/node`, `@types/react`, `@types/react-dom` | ^20 / ^19 / ^19 |

Plus two short notes that are genuinely non-obvious from the code:
- Tailwind v4 is **CSS-first** — there is no `tailwind.config.js`; the theme lives in `src/app/globals.css` via `@theme inline` + CSS custom properties (`--canvas`, `--panel`, `--surface`, `--accent`, …).
- Theming is the `dark` class on `<html>`, set by a pre-paint inline script so there's no flash.

## 2. "Features" — adjust 3 bullets, add 1

- **Tool Management** → add the touch path: move tools by drag-and-drop *or* the per-row move menu (HTML5 drag doesn't work on touch).
- **Collapsible Sidebar** → describe both states: 56px icon rail on desktop, off-canvas drawer below `md` (768px).
- **NEW Responsive Layout** → drawer + full-bleed workspace on phones, two-pane from `md` up, search drops to its own row, dialogs become bottom sheets, safe-area insets respected, hover-only row actions forced visible on touch.
- **Light/Dark Mode** → unchanged (accurate as written).

## 3. "Project Structure" — file-level tree

Replace the folder-only listing with a real tree that reflects what's on disk today:

```
ai-collab-studio/
├── extension/            # MV3 declarativeNetRequest extension (manifest.json, rules.json)
├── src/
│   ├── app/              # layout.tsx, page.tsx, globals.css  (Tailwind theme lives here)
│   ├── components/
│   │   ├── layout/       # AppShell.tsx, Header.tsx
│   │   └── ui/           # Modal.tsx, ToolBadge.tsx
│   ├── features/
│   │   ├── add-item/     # AddItemModal.tsx
│   │   ├── navigation/   # Sidebar.tsx, filterCatalog.ts
│   │   ├── tool-viewer/  # ToolViewer, ToolControlCard, Launcher, ToolFrame
│   │   └── workspaces/   # WorkspacePanel.tsx, TabBar.tsx
│   ├── hooks/            # useTabs, useTheme, useSidebarState, useMediaQuery,
│   │                     # useWorkspaceBootstrap
│   ├── services/         # seed.ts, workspace.repository.ts
│   ├── store/            # workspace.store.ts (Zustand + persist)
│   └── types/            # index.ts
├── next.config.ts · postcss.config.mjs · eslint.config.mjs · tsconfig.json
└── package.json
```
