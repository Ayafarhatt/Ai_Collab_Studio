import type { Metadata } from "next";
import "./globals.css";
import { THEME_STORAGE_KEY } from "@/hooks/useTheme";

export const metadata: Metadata = {
  title: "AI Collab Studio",
  description: "One workspace for all your AI tools.",
};

/** Runs before first paint so the saved theme never flashes. Defaults to dark. */
const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
