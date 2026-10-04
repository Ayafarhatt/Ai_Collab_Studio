# AI Collab Studio - README

## Main Idea

AI Collab Studio is a local-first dashboard for organizing and accessing your AI tools in one place. Instead of juggling multiple tabs for Claude, ChatGPT, Gemini, and other AI tools, this app provides a unified workspace with folder organization, browser-style tabs, and a sleek dark/light theme interface.

The app is designed to work locally with no external backend - all your data stays in localStorage.

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Folder Organization**: Create, rename, and delete folders to organize your AI tools
- **Tool Management**: Add, rename, delete, and move tools between folders with drag-and-drop
- **Smart Search**: Global search to quickly find folders and tools
- **Browser-style Tabs**: Open multiple tools simultaneously with tabs that preserve state when switching
- **Tool Control Cards**: Since many AI sites block iframe embedding (via `X-Frame-Options`/CSP), each tool opens as a beautiful control card with "Open in New Tab" and local quick notes
- **Light/Dark Mode**: Toggle theme with persistence across sessions
- **Collapsible Sidebar**: Expand/collapse sidebar for more workspace room
- **Local-First**: All data stored in localStorage, no external backend required

## Project Structure

```
src/
├── components/
│   ├── layout/      # Header, AppShell components
│   └── ui/          # Reusable UI components (ToolBadge, etc.)
├── features/
│   ├── add-item/    # Add new tools/folders modal
│   ├── navigation/  # Sidebar with folder tree
│   ├── tool-viewer/ # Tool control cards and viewer
│   └── workspaces/  # Tab bar and workspace panel
├── hooks/           # Custom React hooks (useTabs, useTheme, etc.)
├── services/        # Data layer (seed data, repository)
├── store/           # Zustand state management
└── types/           # TypeScript type definitions
```
