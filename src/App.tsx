import { useEffect, useRef } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import { TitleBar } from "@/components/layout/TitleBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { confirm } from "@/store/useConfirm";
import { hasUnsaved } from "@/lib/unsaved";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "react-i18next";
import { call, CMD } from "@/lib/ipc";
import { checkForUpdate } from "@/lib/updater";
import { DURATION, EASING } from "@/lib/motion";
import Dashboard from "@/pages/Dashboard";
import MyMods from "@/pages/MyMods";
import ConfigEditor from "@/pages/ConfigEditor";
import Profiles from "@/pages/Profiles";
import Settings from "@/pages/Settings";

const routeOrder = ["/dashboard", "/mods", "/config", "/profiles", "/settings"];

function TitleBarFallback() {
  const w = getCurrentWindow();
  return (
    <header
      data-tauri-drag-region
      className="flex h-9 shrink-0 select-none items-center justify-end border-b border-border bg-sidebar"
    >
      <button
        type="button"
        onClick={() => void w.minimize()}
        className="h-full w-11 text-muted-foreground hover:bg-accent"
        aria-label="Minimize"
      >
        –
      </button>
      <button
        type="button"
        onClick={() => void w.close()}
        className="h-full w-11 text-muted-foreground hover:bg-red-500 hover:text-white"
        aria-label="Close"
      >
        ×
      </button>
    </header>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  const currentIndex = Math.max(0, routeOrder.indexOf(location.pathname));
  const prevIndex = useRef(currentIndex);
  const direction = currentIndex - prevIndex.current;
  useEffect(() => {
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (dir: number) => ({
          opacity: 0,
          x: dir === 0 ? 0 : dir > 0 ? 24 : -24,
        }),
        animate: { opacity: 1, x: 0 },
        exit: (dir: number) => ({
          opacity: 0,
          x: dir === 0 ? 0 : dir > 0 ? -24 : 24,
        }),
      };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        className="h-full"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: DURATION.base, ease: EASING.enter }}
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mods" element={<MyMods />} />
          <Route path="/config" element={<ConfigEditor />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const init = useGameStore((s) => s.init);
  const theme = useAppStore((s) => s.theme);
  const lang = useAppStore((s) => s.lang);
  const { t } = useTranslation("common");
  useEffect(() => {
    void init();
    const id = setInterval(() => {
      if (document.hidden) return;
      void useGameStore.getState().refreshGameRunning();
    }, 4000);
    const onVisible = () => {
      if (!document.hidden) void useGameStore.getState().refreshGameRunning();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [init]);

  useEffect(() => {
    const w = getCurrentWindow();
    const unlistenP = w.onCloseRequested(async (e) => {
      e.preventDefault();
      if (useAppStore.getState().minimizeToTray) {
        void w.hide();
        return;
      }
      if (hasUnsaved()) {
        const go = await confirm({
          title: t("unsaved.title"),
          description: t("unsaved.description"),
          confirmText: t("discard"),
          kind: "warning",
        });
        if (!go) return;
      }
      call(CMD.quitApp).catch((e) => console.warn("quit_app failed:", e));
    });
    return () => {
      void unlistenP.then((f) => f());
    };
  }, [t]);

  useEffect(() => {
    call(CMD.updateTrayLang, {
      show: t("trayShow"),
      quit: t("trayQuit"),
    }).catch((e) => console.warn("update_tray_lang failed:", e));
  }, [lang, t]);

  useEffect(() => {
    void checkForUpdate(false);
  }, []);

  return (
    <HashRouter>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
        { }
        <ErrorBoundary fallback={<TitleBarFallback />}>
          <TitleBar />
        </ErrorBoundary>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
          { }
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
          </main>
        </div>
      </div>
      { }
      <Toaster richColors closeButton position="bottom-right" theme={theme} />
      <ConfirmDialog />
    </HashRouter>
  );
}
