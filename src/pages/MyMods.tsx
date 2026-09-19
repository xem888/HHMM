import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { open } from "@tauri-apps/plugin-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  RefreshCw,
  Settings2,
  FolderOpen,
  FolderInput,
  PackageOpen,
  PackageSearch,
  AlertTriangle,
  Blocks,
  ArrowUpDown,
  Download,
  DownloadCloud,
  ArrowUpCircle,
  Trash2,
  User,
  Clock,
  CalendarPlus,
  HardDrive,
  FileCode,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { cn, errMsg } from "@/lib/utils";
import { listContainer, listItem } from "@/lib/motion";
import { useGameStore } from "@/store/useGameStore";
import { useInstallPaths } from "@/lib/use-install-paths";
import { confirm } from "@/store/useConfirm";
import type { ManagedMod } from "@/lib/types";

type Filter = "all" | "notInstalled" | "enabled" | "updatable";
type SortKey = "name" | "nameDesc" | "newest" | "largest";

function formatSize(bytes: number): string {
  if (!bytes || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MyMods() {
  const { t, i18n } = useTranslation("mods");
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const loading = useGameStore((s) => s.loading);
  const error = useGameStore((s) => s.error);
  const managed = useGameStore((s) => s.managed);
  const gameRunning = useGameStore((s) => s.gameRunning);
  const toggleMod = useGameStore((s) => s.toggleMod);
  const installOne = useGameStore((s) => s.installOne);
  const uninstallOne = useGameStore((s) => s.uninstallOne);
  const refreshMods = useGameStore((s) => s.refreshMods);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [refreshing, setRefreshing] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const relativeTime = useCallback(
    (mtime: number): string => {
      if (!mtime) return t("meta.unknownTime");
      const diffSec = Date.now() / 1000 - mtime;
      if (diffSec < 60) return t("time.justNow");
      const min = Math.floor(diffSec / 60);
      if (min < 60) return t("time.minutesAgo", { count: min });
      const hour = Math.floor(min / 60);
      if (hour < 24) return t("time.hoursAgo", { count: hour });
      const day = Math.floor(hour / 24);
      return t("time.daysAgo", { count: day });
    },
    [t],
  );

  const absoluteDate = useCallback(
    (sec: number): string =>
      new Date(sec * 1000).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [i18n.language],
  );

  const installPaths = useInstallPaths();

  const browse = useCallback(async () => {
    try {
      const sel = await open({
        multiple: true,
        filters: [{ name: "Mod", extensions: ["dll", "zip"] }],
      });
      if (!sel) return;
      await installPaths(Array.isArray(sel) ? sel : [sel]);
    } catch (err) {
      const msg = errMsg(err);
      toast.error(t("toast.installFailed", { name: "" }), { description: msg });
    }
  }, [installPaths, t]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshMods();
    } catch (err) {
      const msg = errMsg(err);
      toast.error(t("error.title"), { description: msg });
    } finally {
      setRefreshing(false);
    }
  }, [refreshMods, t]);

  const onToggle = useCallback(
    async (m: ManagedMod, next: boolean) => {
      setBusyKey(m.key);
      try {
        await toggleMod(m.id, next);
        toast.success(
          next
            ? t("toast.enabled", { name: m.displayName })
            : t("toast.disabled", { name: m.displayName }),
          { duration: 1500 },
        );
      } catch (err) {
        const msg = errMsg(err);
        toast.error(t("toast.toggleFailed", { name: m.displayName }), {
          description: msg,
        });
      } finally {
        setBusyKey(null);
      }
    },
    [toggleMod, t],
  );

  const onInstallOrUpdate = useCallback(
    async (m: ManagedMod, isUpdate: boolean) => {
      if (m.source.kind !== "workshop") return;
      setBusyKey(m.key);
      const tid = toast.loading(
        isUpdate ? t("toast.updating") : t("toast.installingOne"),
      );
      try {
        await installOne(m.source.itemId, m.state === "disabled");
        toast.success(
          isUpdate
            ? t("toast.updated", { name: m.displayName })
            : t("toast.installedOne", { name: m.displayName }),
          { id: tid, duration: 1500 },
        );
      } catch (err) {
        const msg = errMsg(err);
        toast.error(
          isUpdate
            ? t("toast.updateFailed", { name: m.displayName })
            : t("toast.installFailed", { name: m.displayName }),
          { id: tid, description: msg },
        );
      } finally {
        setBusyKey(null);
      }
    },
    [installOne, t],
  );

  const onUninstall = useCallback(
    async (m: ManagedMod) => {
      const local = m.source.kind === "local";
      const go = await confirm({
        title: t("uninstallConfirm.title", { name: m.displayName }),
        description: t(local ? "uninstallConfirm.local" : "uninstallConfirm.workshop"),
        confirmText: t("action.uninstall"),
        kind: local ? "danger" : "warning",
      });
      if (!go) return;
      setBusyKey(m.key);
      const tid = toast.loading(t("toast.uninstalling"));
      try {
        await uninstallOne(m.id);
        toast.success(t("toast.uninstalled", { name: m.displayName }), {
          id: tid,
          duration: 1500,
        });
      } catch (err) {
        const msg = errMsg(err);
        toast.error(t("toast.uninstallFailed", { name: m.displayName }), {
          id: tid,
          description: msg,
        });
      } finally {
        setBusyKey(null);
      }
    },
    [uninstallOne, t],
  );

  const handleGlow = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const glow = row.querySelector<HTMLElement>("[data-glow]");
    if (!glow) return;
    const r = row.getBoundingClientRect();
    glow.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
  }, []);

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const filtered = managed.filter((m) => {
      if (
        kw &&
        !m.displayName.toLowerCase().includes(kw) &&
        !m.dllName.toLowerCase().includes(kw)
      )
        return false;
      if (filter === "notInstalled" && m.state !== "notInstalled") return false;
      if (filter === "enabled" && m.state !== "enabled") return false;
      if (filter === "updatable" && !m.updatable) return false;
      return true;
    });
    const lang = i18n.language;
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "nameDesc":
          return b.displayName.localeCompare(a.displayName, lang);
        case "newest":
          return b.mtime - a.mtime;
        case "largest":
          return b.size - a.size;
        case "name":
        default:
          return a.displayName.localeCompare(b.displayName, lang);
      }
    });
  }, [managed, q, filter, sortBy, i18n.language]);

  const counts = useMemo(() => {
    let notInstalled = 0;
    let enabled = 0;
    let updatable = 0;
    for (const m of managed) {
      if (m.state === "notInstalled") notInstalled++;
      if (m.state === "enabled") enabled++;
      if (m.updatable) updatable++;
    }
    return { all: managed.length, notInstalled, enabled, updatable };
  }, [managed]);

  const bigList = list.length > 100;

  const filters: Filter[] = ["all", "notInstalled", "enabled", "updatable"];
  const filterLabel: Record<Filter, string> = {
    all: t("filter.all"),
    notInstalled: t("filter.notInstalled"),
    enabled: t("filter.enabled"),
    updatable: t("filter.updatable"),
  };

  const browseBtn = (
    <Button variant="outline" onClick={() => void browse()}>
      <FolderOpen className="h-4 w-4" />
      {t("common:browse")}
    </Button>
  );

  return (
    <div className="flex h-full flex-col p-8">
      <PageHeader
        title={t("title")}
        count={counts.all}
        actions={
          <div className="flex gap-2">
            { }
            <Button
              variant="outline"
              onClick={() => void browse()}
              className="group hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              <FolderInput className="h-4 w-4 transition-transform group-hover:scale-110" />
              {t("import")}
            </Button>
            <Button
              variant="outline"
              onClick={() => void onRefresh()}
              loading={refreshing}
              className="group hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              {!refreshing && (
                <RefreshCw className="h-4 w-4 motion-safe:[animation:spin_3s_linear_infinite] group-hover:[animation-duration:2s]" />
              )}
              {t("common:refresh")}
            </Button>
          </div>
        }
      />

      { }
      {gameRunning && (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t("common:gameRunningBanner")}</span>
        </div>
      )}

      { }
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={cn(
                "hover:scale-105",
                filter !== f &&
                  "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
              )}
            >
              {filterLabel[f]}
              <span
                className={cn(
                  "ml-1 rounded px-1 text-[11px] tabular-nums",
                  filter === f
                    ? "bg-primary-foreground/20"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {counts[f]}
              </span>
            </Button>
          ))}
        </div>

        { }
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger className="h-9 w-auto gap-1.5">
            <ArrowUpDown className="h-4 w-4 shrink-0 opacity-60" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("sort.name")}</SelectItem>
            <SelectItem value="nameDesc">{t("sort.nameDesc")}</SelectItem>
            <SelectItem value="newest">{t("sort.newest")}</SelectItem>
            <SelectItem value="largest">{t("sort.largest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      { }
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
        <FolderInput className="h-4 w-4 shrink-0 text-primary" />
        <span>{t("dropTip")}</span>
      </div>

      { }
      <div
        className="mt-4 flex-1 overflow-y-auto rounded-xl p-0.5"
      >
        {loading && managed.length === 0 ? (
          <div className="space-y-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5"
              >
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="flex flex-col items-center gap-3 border-destructive/40 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">
                {t("error.title")}
              </p>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                {t("error.description")}
              </p>
              <p className="mx-auto max-w-md break-words pt-1 text-xs text-destructive/80">
                {error}
              </p>
            </div>
            { }
            <Button
              variant="outline"
              onClick={() => void onRefresh()}
              loading={refreshing}
            >
              {!refreshing && <RefreshCw className="h-4 w-4" />}
              {t("common:retry")}
            </Button>
          </Card>
        ) : managed.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title={t("empty.none.title")}
            description={t("empty.none.description")}
            action={browseBtn}
          />
        ) : list.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title={t("empty.noResults.title")}
            description={t("empty.noResults.description")}
          />
        ) : (
          <motion.div
            className="space-y-1.5"
            variants={bigList ? undefined : listContainer}
            initial={bigList ? false : "hidden"}
            animate={bigList ? undefined : "show"}
          >
            {list.map((m) => {
              const isLocal = m.source.kind === "local";
              const enabled = m.state === "enabled";
              const busy = busyKey === m.key;
              return (
                <motion.div
                  key={m.key}
                  variants={bigList ? undefined : listItem}
                  className={
                    bigList
                      ? "[content-visibility:auto] [contain-intrinsic-size:auto_64px]"
                      : undefined
                  }
                >
                  { }
                  <div
                    onMouseMove={reduce ? undefined : handleGlow}
                    className={cn(
                      "group relative isolate flex transform-gpu items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out hover:-translate-y-0.5",
                      enabled && "border-l-2 border-l-primary",
                    )}
                  >
                    { }
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-20 rounded-xl opacity-0 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-primary/35 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    { }
                    {!reduce && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <span
                          data-glow
                          className="absolute -left-32 -top-32 h-64 w-64 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(0,175,92,0.12), transparent 70%)",
                          }}
                        />
                      </span>
                    )}
                    { }
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color] duration-300 ease-out group-hover:scale-110",
                        enabled &&
                          "border-primary/30 bg-primary/15 text-primary group-hover:bg-primary/25",
                        m.state === "disabled" &&
                          "border-transparent bg-muted text-muted-foreground opacity-50 grayscale",
                        m.state === "notInstalled" &&
                          "border-dashed border-sky-400/50 bg-sky-500/10 text-sky-500",
                      )}
                    >
                      {m.state === "notInstalled" ? (
                        <DownloadCloud className="h-5 w-5" />
                      ) : (
                        <Blocks className="h-5 w-5" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "min-w-0 flex-1",
                        m.state === "disabled" && "opacity-60",
                      )}
                    >
                      { }
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium transition-colors duration-300 group-hover:text-primary">
                          {m.displayName}
                        </span>
                        {m.state === "notInstalled" && (
                          <Badge variant="muted">
                            {t("status.notInstalled")}
                          </Badge>
                        )}
                        {m.updatable && (
                          <Badge variant="warn">{t("status.canUpdate")}</Badge>
                        )}
                        {isLocal && (
                          <Badge variant="muted">{t("source.local")}</Badge>
                        )}
                      </div>
                      { }
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        {m.author && (
                          <span
                            className="inline-flex min-w-0 items-center gap-1"
                            title={t("meta.author")}
                          >
                            <User className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            <span className="truncate">{m.author}</span>
                          </span>
                        )}
                        <span
                          className="inline-flex items-center gap-1"
                          title={t("meta.updatedAt")}
                        >
                          <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          {relativeTime(m.timeUpdated ?? m.mtime)}
                        </span>
                        {m.timeCreated != null && (
                          <span
                            className="inline-flex items-center gap-1 tabular-nums"
                            title={t("meta.publishedAt")}
                          >
                            <CalendarPlus className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            {absoluteDate(m.timeCreated)}
                          </span>
                        )}
                        {m.state !== "notInstalled" && (
                          <span
                            className="inline-flex items-center gap-1 tabular-nums"
                            title={t("meta.size")}
                          >
                            <HardDrive className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            {formatSize(m.size)}
                          </span>
                        )}
                        <span
                          className="inline-flex min-w-0 items-center gap-1 opacity-70"
                          title={t("meta.file")}
                        >
                          <FileCode className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          <span className="truncate">{m.dllName}</span>
                        </span>
                      </div>
                    </div>

                    { }
                    {m.state === "notInstalled" ? (
                      <Button
                        size="sm"
                        loading={busy}
                        disabled={gameRunning || busy}
                        onClick={() => void onInstallOrUpdate(m, false)}
                        className="hover:scale-105"
                      >
                        {!busy && <Download className="h-4 w-4" />}
                        {t("action.install")}
                      </Button>
                    ) : (
                      <>
                        {m.updatable && (
                          <Button
                            size="sm"
                            variant="outline"
                            loading={busy}
                            disabled={gameRunning || busy}
                            onClick={() => void onInstallOrUpdate(m, true)}
                            className="border-warning/50 text-warning hover:scale-105 hover:border-warning hover:bg-warning/10 hover:text-warning"
                          >
                            {!busy && <ArrowUpCircle className="h-4 w-4" />}
                            {t("action.update")}
                          </Button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/config", { state: { openCfg: m.id } })
                          }
                          title={t("action.openConfig")}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary active:scale-95"
                        >
                          <Settings2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void onUninstall(m)}
                          disabled={gameRunning || busy}
                          title={t("action.uninstall")}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-destructive/10 hover:text-destructive active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Switch
                          checked={enabled}
                          disabled={gameRunning || busy}
                          onCheckedChange={(v) => void onToggle(m, v)}
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
