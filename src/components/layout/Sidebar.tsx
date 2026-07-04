import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  SlidersHorizontal,
  Layers,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Play,
  Loader2,
} from "lucide-react";
import { cn, errMsg } from "@/lib/utils";
import { ClickSpark } from "@/components/ui/click-spark";
import { SPRING_BOUNCY } from "@/lib/motion";
import { call, CMD } from "@/lib/ipc";
import { useAppVersion } from "@/lib/use-app-version";
import { hasUnsaved } from "@/lib/unsaved";
import { confirm } from "@/store/useConfirm";
import { useAppStore } from "@/store/useAppStore";
import { useGameStore } from "@/store/useGameStore";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/mods", icon: Package, key: "mods" },
  { to: "/config", icon: SlidersHorizontal, key: "config" },
  { to: "/profiles", icon: Layers, key: "profiles" },
  { to: "/settings", icon: SettingsIcon, key: "settings" },
];

async function waitForGameRunning(
  timeoutMs: number,
  intervalMs: number,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    try {
      if (await call<boolean>(CMD.isGameRunning)) return true;
    } catch {
    }
  }
  return false;
}

export function Sidebar() {
  const { t } = useTranslation("nav");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useAppStore();
  const isDark = theme !== "light";
  const reduce = useReducedMotion();
  const appVersion = useAppVersion();
  const gameRunning = useGameStore((s) => s.gameRunning);
  const [launching, setLaunching] = useState(false);

  async function launch() {
    if (launching || gameRunning) return;
    setLaunching(true);
    const id = toast.loading(t("dashboard:launch.starting"));
    try {
      await call(CMD.launchGame);
      const started = await waitForGameRunning(40000, 2000);
      if (started) {
        toast.success(t("dashboard:launch.started"), { id });
      } else {
        toast.info(t("dashboard:launch.slow"), { id });
      }
    } catch (e) {
      const msg = errMsg(e);
      toast.error(t("dashboard:launch.failed"), { id, description: msg });
    } finally {
      setLaunching(false);
    }
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      { }
      <div className="flex items-center gap-2.5 px-5 py-5">
        { }
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 drop-shadow-[0_2px_6px_rgba(0,175,92,0.35)]"
          fill="none"
          aria-label="HHMM"
        >
          <defs>
            <linearGradient id="hhmm-logo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1bd96a" />
              <stop offset="100%" stopColor="#00af5c" />
            </linearGradient>
          </defs>
          <rect x="2.5" y="3.5" width="9" height="9" rx="2.6" fill="url(#hhmm-logo)" />
          <rect x="13" y="2.5" width="9" height="9" rx="2.6" fill="url(#hhmm-logo)" />
          <rect x="2.5" y="14" width="9" height="9" rx="2.6" fill="url(#hhmm-logo)" />
          <rect x="13" y="14" width="9" height="9" rx="2.6" fill="url(#hhmm-logo)" />
        </svg>
        <span className="brand-shine text-lg font-bold tracking-tight">HHMM</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={(e) => {
              if (!hasUnsaved() || it.to === location.pathname) return;
              e.preventDefault();
              void (async () => {
                const go = await confirm({
                  title: tc("unsaved.title"),
                  description: tc("unsaved.description"),
                  confirmText: tc("discard"),
                  kind: "warning",
                });
                if (go) navigate(it.to);
              })();
            }}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-lg py-2 pl-4 pr-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                { }
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary"
                    transition={reduce ? { duration: 0 } : SPRING_BOUNCY}
                  >
                    <span className="absolute inset-0 rounded-full bg-primary opacity-60 blur-[5px]" />
                  </motion.span>
                )}
                { }
                <it.icon
                  className={cn(
                    "relative z-10 h-4 w-4 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:translate-x-0.5",
                  )}
                />
                <span className="relative z-10">{t(it.key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      { }
      <div className="px-3 pb-1">
        {gameRunning ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary">
            <motion.span
              className="h-2 w-2 rounded-full bg-primary"
              animate={
                reduce ? undefined : { opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
            />
            {t("dashboard:gameRunning")}
          </div>
        ) : (
          <div className="relative">
            { }
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-xl bg-[#1bd96a] blur-lg"
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <ClickSpark color="#ffffff" count={10} radius={22} className="w-full">
            <motion.button
              type="button"
              onClick={() => void launch()}
              disabled={launching}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-[#1bd96a] to-[#00af5c] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(0,175,92,0.35)] disabled:opacity-60"
            >
              { }
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  initial={{ x: "-160%", skewX: -12 }}
                  animate={{ x: "520%", skewX: -12 }}
                  transition={{
                    duration: 1.15,
                    repeat: Infinity,
                    repeatDelay: 2.4,
                    ease: "easeInOut",
                  }}
                />
              )}
              { }
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              {launching ? (
                <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
              ) : (
                <Play className="relative z-10 h-4 w-4 fill-current" />
              )}
              <span className="relative z-10 tracking-wide">
                {launching ? t("dashboard:launching") : t("dashboard:launchGame")}
              </span>
            </motion.button>
            </ClickSpark>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {isDark ? t("theme.toLight") : t("theme.toDark")}
        </button>
        { }
        {appVersion && (
          <p className="px-3 pt-2 text-xs text-muted-foreground">
            v{appVersion}
          </p>
        )}
      </div>
    </aside>
  );
}
