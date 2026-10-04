# AI Collab Studio

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

- Folders and tools in a collapsible sidebar (search, drag a tool onto another folder to move it, hover a tool and click the trash icon to remove it)
- Browser-style tabs that keep their state when you switch
- Light / dark mode (toggle in the header, remembered between visits)

## Making sites embeddable (extension)

Most AI sites forbid being shown inside an iframe (`ERR_BLOCKED_BY_RESPONSE`).
The `extension/` folder is a tiny Chromium extension that removes those headers
**only for frames loaded by localhost** (i.e. this dashboard).

1. Open `opera://extensions` (Chrome: `chrome://extensions`, Edge: `edge://extensions`)
2. Turn on **Developer mode**
3. Click **Load unpacked** and select the `extension` folder
4. Reload http://localhost:3000

Known limits:
- It removes the framed site's Content-Security-Policy while it is inside your dashboard.
  Fine for personal use, but only keep it enabled while you use the app.
- Logins can still fail inside iframes: browsers treat localhost and claude.ai as
  different sites and may not send the site's login cookies (SameSite / third-party cookie rules).
  If that happens, use "Open in new window", or move the app into Electron/Tauri
  (native webviews are not subject to these rules).

## Structure

- `src/components`: pure UI (Header, Modal, AppShell)
- `src/features`: navigation, workspaces, tool-viewer, add-item
- `src/store`: Zustand state
- `src/services`: seed data + repository (swap for Prisma later)
- `src/hooks`, `src/types`
