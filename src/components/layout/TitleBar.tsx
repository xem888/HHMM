import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Copy, Minus, Square, X } from "lucide-react";

const appWindow = getCurrentWindow();

const LOGO = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
    <defs>
      <linearGradient id="tb-logo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1bd96a" />
        <stop offset="100%" stopColor="#00af5c" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="3.5" width="9" height="9" rx="2.6" fill="url(#tb-logo)" />
    <rect x="13" y="2.5" width="9" height="9" rx="2.6" fill="url(#tb-logo)" />
    <rect x="2.5" y="14" width="9" height="9" rx="2.6" fill="url(#tb-logo)" />
    <rect x="13" y="14" width="9" height="9" rx="2.6" fill="url(#tb-logo)" />
  </svg>
);

export function TitleBar() {
  const [maximized, setMaximized] = useState(false);
  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const query = () =>
      void appWindow.isMaximized().then((v) => {
        if (!disposed) setMaximized(v);
      });
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(query, 150);
    };
    query();
    const unlisten = appWindow.onResized(refresh);
    return () => {
      disposed = true;
      clearTimeout(timer);
      void unlisten.then((f) => f());
    };
  }, []);

  return (
    <header
      data-tauri-drag-region
      className="flex h-9 shrink-0 select-none items-center justify-between border-b border-border bg-sidebar"
    >
      { }
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 px-3"
      >
        {LOGO}
        <span className="text-xs font-medium text-muted-foreground">
          Human Host Mod Manager
        </span>
      </div>
      { }
      <div className="flex h-full">
        <button
          type="button"
          onClick={() => void appWindow.minimize()}
          className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Minimize"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void appWindow.toggleMaximize()}
          className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={maximized ? "Restore" : "Maximize"}
        >
          {maximized ? (
            <Copy className="h-3 w-3 -scale-x-100" />
          ) : (
            <Square className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => void appWindow.close()}
          className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
