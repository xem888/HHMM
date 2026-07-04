import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  animate,
  useMotionValueEvent,
} from "framer-motion";
import {
  Gamepad2,
  Boxes,
  Download,
  DownloadCloud,
  RefreshCw,
  AlertTriangle,
  Info,
  X,
  Package,
  ArrowUpCircle,
  Power,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import BorderGlow from "@/components/ui/border-glow";
import { useIsDark } from "@/lib/use-is-dark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { useGameStore, countByState } from "@/store/useGameStore";
import { on, EVT } from "@/lib/ipc";
import { DURATION, EASING, listContainer, listItem } from "@/lib/motion";
import { cn, errMsg } from "@/lib/utils";
import type { DeployProgress, SyncResult } from "@/lib/types";

function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(mv, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: DURATION.base,
      ease: EASING.standard,
    });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <>{reduce ? value : display}</>;
}

const GREEN_COLORS = ["#1bd96a", "#34d399", "#00af5c"];
const TONES = {
  green: {
    chip: "border-primary/30 bg-primary/15 text-primary group-hover:bg-primary/25",
    num: "text-foreground group-hover:text-primary",
    glowColor: "145 71% 48%",
    colors: GREEN_COLORS,
    borderHover: "hover:border-primary/55",
  },
  amber: {
    chip: "border-warning/30 bg-warning/15 text-warning group-hover:bg-warning/25",
    num: "text-warning",
    glowColor: "40 90% 60%",
    colors: ["#fbbf24", "#f59e0b", "#fcd34d"],
    borderHover: "hover:border-warning/55",
  },
  sky: {
    chip: "border-sky-500/30 bg-sky-500/15 text-sky-500 group-hover:bg-sky-500/25",
    num: "text-sky-500",
    glowColor: "205 90% 55%",
    colors: ["#38bdf8", "#0ea5e9", "#7dd3fc"],
    borderHover: "hover:border-sky-500/55",
  },
};

function GlowCard({
  children,
  className = "",
  contentClassName = "",
  glowColor = "145 71% 48%",
  colors = GREEN_COLORS,
  hoverShadow = "hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.10)]",
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  glowColor?: string;
  colors?: string[];
  hoverShadow?: string;
}) {
  const isDark = useIsDark();
  if (isDark) {
    return (
      <BorderGlow
        glowColor={glowColor}
        colors={colors}
        glowRadius={20}
        className={cn("group", className)}
      >
        <div className={cn("min-w-0", contentClassName)}>{children}</div>
      </BorderGlow>
    );
  }
  return (
    <Card
      className={cn(
        "group transition-shadow duration-300",
        hoverShadow,
        className,
        contentClassName,
      )}
    >
      {children}
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone: toneKey = "green",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: "green" | "amber" | "sky";
}) {
  const reduce = useReducedMotion();

  const tone = TONES[toneKey];

  const isDark = useIsDark();

  const inner = (
    <div className="flex items-center gap-3 p-5">
      { }
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-[transform,background-color] duration-300 group-hover:scale-105",
          tone.chip,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      { }
      <div className="min-w-0 flex-1">
        <div className="break-words text-[11px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
          {label}
        </div>
        <div
          className={cn(
            "mt-1 text-2xl font-bold leading-none tabular-nums transition-colors duration-300",
            tone.num,
          )}
        >
          <CountUp value={value} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={listItem}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: DURATION.fast, ease: EASING.standard }}
      className="h-full"
    >
      { }
      {isDark ? (
        <BorderGlow
          glowColor={tone.glowColor}
          colors={tone.colors}
          className="group h-full"
        >
          {inner}
        </BorderGlow>
      ) : (
        <Card
          className={cn(
            "group relative h-full transition-[box-shadow,border-color] duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.10)]",
            tone.borderHover,
          )}
        >
          {inner}
        </Card>
      )}
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation("dashboard");
  const reduce = useReducedMotion();
  const loading = useGameStore((s) => s.loading);
  const game = useGameStore((s) => s.game);
  const bepinex = useGameStore((s) => s.bepinex);
  const managed = useGameStore((s) => s.managed);
  const gameRunning = useGameStore((s) => s.gameRunning);
  const error = useGameStore((s) => s.error);
  const refresh = useGameStore((s) => s.refresh);
  const updateInstalled = useGameStore((s) => s.updateInstalled);
  const installAll = useGameStore((s) => s.installAll);
  const deployBepinex = useGameStore((s) => s.deployBepinex);
  const fixHideManager = useGameStore((s) => s.fixHideManager);

  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [installingAll, setInstallingAll] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [fixingHm, setFixingHm] = useState(false);

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refresh();
    } catch (e: unknown) {
      const msg = errMsg(e);
      toast.error(t("error.title"), { description: msg });
    } finally {
      setRefreshing(false);
    }
  }
  const [errorDismissed, setErrorDismissed] = useState(false);
  useEffect(() => {
    setErrorDismissed(false);
  }, [error]);

  const hideManager = bepinex?.installed ? bepinex.hideManager : null;
  const [hmDismissed, setHmDismissed] = useState(false);
  useEffect(() => {
    setHmDismissed(false);
  }, [hideManager]);

  async function handleFixHideManager() {
    if (fixingHm) return;
    setFixingHm(true);
    try {
      await fixHideManager();
      toast.success(t("hideManager.fixed"));
    } catch (e: unknown) {
      toast.error(t("hideManager.fixFailed"), { description: errMsg(e) });
    } finally {
      setFixingHm(false);
    }
  }

  const {
    installed: installedCount,
    installable,
    updatable,
    enabled: enabledCount,
  } = countByState(managed);

  const hoverLift = reduce ? undefined : { y: -2 };

  async function runBatch(
    busy: boolean,
    setBusy: (b: boolean) => void,
    run: () => Promise<SyncResult | null>,
  ) {
    if (busy) return;
    setBusy(true);
    const id = toast.loading(t("sync.inProgress"));
    try {
      const result: SyncResult | null = await run();
      if (!result) {
        toast.info(t("sync.nothing"), { id });
        return;
      }
      const ok = result.succeeded.length;
      const failed = result.failed.length;
      if (failed === 0) {
        toast.success(t("sync.success", { count: ok }), { id });
      } else if (ok === 0) {
        toast.error(t("sync.failedAll"), {
          id,
          description: result.failed.map((f) => f.dllName).join(", "),
        });
      } else {
        toast.warning(t("sync.partial", { ok, failed }), {
          id,
          description: result.failed.map((f) => f.dllName).join(", "),
        });
      }
    } catch (e: unknown) {
      const msg = errMsg(e);
      toast.error(t("sync.failedAll"), { id, description: msg });
    } finally {
      setBusy(false);
    }
  }

  const deployToastId = useRef<string | number | null>(null);

  async function handleDeploy() {
    if (deploying) return;
    setDeploying(true);
    const id = toast.loading(t("deploy.inProgress"));
    deployToastId.current = id;
    const unlistenPromise = on<DeployProgress>(
      EVT.bepinexDeployProgress,
      (evt) => {
        if (deployToastId.current == null) return;
        const { phase, percent } = evt.payload;
        const phaseLabel = t(`deploy.phase.${phase}`, { defaultValue: phase });
        toast.loading(
          t("deploy.progress", {
            phase: phaseLabel,
            percent: Math.round(percent * 100),
          }),
          { id },
        );
      },
    );
    try {
      await deployBepinex();
      deployToastId.current = null;
      toast.success(t("deploy.success"), { id });
    } catch (e: unknown) {
      deployToastId.current = null;
      const msg = errMsg(e);
      toast.error(t("deploy.failed"), { id, description: msg });
    } finally {
      const unlisten = await unlistenPromise;
      unlisten();
      setDeploying(false);
    }
  }

  if (loading && !bepinex) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className="space-y-6 p-8"
      variants={listContainer}
      initial="hidden"
      animate="show"
    >
      { }
      <PageHeader
        title={t("title")}
        actions={
          <Button
            variant="outline"
            onClick={() => void handleRefresh()}
            loading={refreshing}
            className="group hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            {!refreshing && (
              <RefreshCw className="h-4 w-4 motion-safe:[animation:spin_3s_linear_infinite] group-hover:[animation-duration:2s]" />
            )}
            {t("common:refresh")}
          </Button>
        }
      />

      { }
      {gameRunning && (
        <motion.div variants={listItem}>
          <div className="flex items-center gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{t("common:gameRunningBanner")}</span>
          </div>
        </motion.div>
      )}

      { }
      {bepinex?.compat === "incompatible" && (
        <motion.div variants={listItem}>
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium">{t("bepinexCompat.incompatible.title")}</span>
              <span className="ml-1 text-destructive/90">
                {t("bepinexCompat.incompatible.desc", { version: bepinex.version ?? "" })}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      {bepinex?.compat === "below" && (
        <motion.div variants={listItem}>
          <div className="flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium">{t("bepinexCompat.below.title")}</span>
              <span className="ml-1 text-warning/90">
                {t("bepinexCompat.below.desc", { version: bepinex.version ?? "" })}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      {bepinex?.compat === "above" && (
        <motion.div variants={listItem}>
          <div className="flex items-start gap-2.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-sm text-sky-600 dark:text-sky-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium">{t("bepinexCompat.above.title")}</span>
              <span className="ml-1 opacity-90">
                {t("bepinexCompat.above.desc", { version: bepinex.version ?? "" })}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      { }
      {(hideManager === "disabled" || hideManager === "missingFile") &&
        !hmDismissed && (
          <motion.div variants={listItem}>
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium">{t("hideManager.title")}</span>
                <span className="ml-1 text-destructive/90">
                  {hideManager === "missingFile"
                    ? t("hideManager.descMissing")
                    : t("hideManager.desc")}
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => void handleFixHideManager()}
                loading={fixingHm}
                disabled={gameRunning}
                className="shrink-0"
              >
                {t("hideManager.fix")}
              </Button>
              <button
                type="button"
                onClick={() => setHmDismissed(true)}
                className="shrink-0 rounded-md p-1 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={t("common:close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

      { }
      {error && !errorDismissed && (
        <motion.div variants={listItem}>
          <Card className="border-destructive/40 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-destructive">
                  {t("error.title")}
                </div>
                <div className="mt-0.5 break-words text-xs text-destructive/80">
                  {error}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorDismissed(true)}
                className="shrink-0 rounded-md p-1 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={t("common:close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      { }
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.div
          variants={listItem}
          whileHover={hoverLift}
          transition={{ duration: DURATION.fast, ease: EASING.standard }}
          className="h-full"
        >
          <GlowCard className="h-full" contentClassName="p-5">
            <div className="flex items-start gap-3">
              <Gamepad2 className="mt-0.5 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t("gameStatus")}</span>
                  {game?.installed ? (
                    <Badge>{t("detected")}</Badge>
                  ) : (
                    <Badge variant="danger">{t("notDetected")}</Badge>
                  )}
                </div>
                <div
                  className="mt-1 truncate text-xs text-muted-foreground"
                  title={game?.root ?? ""}
                >
                  {game?.root ?? t("notSet")}
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div
          variants={listItem}
          whileHover={hoverLift}
          transition={{ duration: DURATION.fast, ease: EASING.standard }}
          className="h-full"
        >
          <GlowCard className="h-full" contentClassName="p-5">
            <div className="flex items-start gap-3">
              <Boxes className="mt-0.5 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t("bepinexStatus")}</span>
                  {bepinex?.installed ? (
                    <Badge>{bepinex.version ?? t("detected")}</Badge>
                  ) : game?.installed ? (
                    <Badge variant="danger">{t("notDetected")}</Badge>
                  ) : (
                    <Badge variant="muted">{t("notSet")}</Badge>
                  )}
                </div>
                {bepinex?.installed && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    winhttp {bepinex.hasWinhttp ? "✓" : "✕"}
                  </div>
                )}
                {bepinex && !bepinex.installed && (
                  <Button
                    size="sm"
                    className="mt-2"
                    loading={deploying}
                    disabled={gameRunning}
                    onClick={() => void handleDeploy()}
                  >
                    {!deploying && <Download className="h-4 w-4" />}
                    {t("deployBepinex")}
                  </Button>
                )}
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      { }
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label={t("stats.installed")}
          value={installedCount}
        />
        <StatCard
          icon={DownloadCloud}
          label={t("stats.canInstall")}
          value={installable}
          tone={installable > 0 ? "sky" : "green"}
        />
        <StatCard
          icon={ArrowUpCircle}
          label={t("stats.canUpdate")}
          value={updatable}
          tone={updatable > 0 ? "amber" : "green"}
        />
        <StatCard icon={Power} label={t("stats.enabled")} value={enabledCount} />
      </div>

      { }
      <motion.div
        variants={listItem}
        whileHover={hoverLift}
        transition={{ duration: DURATION.fast, ease: EASING.standard }}
      >
        <GlowCard contentClassName="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="min-w-0 space-y-0.5">
            <div className="font-semibold">{t("modActions")}</div>
            <div className="text-sm text-muted-foreground">
              {updatable === 0
                ? t("allUpToDate")
                : t("updatable", { count: updatable })}
              {installable > 0 && ` · ${t("installable", { count: installable })}`}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            { }
            <Button
              variant="outline"
              loading={installingAll}
              onClick={() =>
                void runBatch(installingAll, setInstallingAll, installAll)
              }
              disabled={installable === 0 || gameRunning}
              className="border-sky-500/50 text-sky-600 hover:scale-[1.03] hover:border-sky-500 hover:bg-sky-500/5 hover:text-sky-600 dark:text-sky-400"
            >
              {!installingAll && <Download className="h-4 w-4" />}
              {t("installAll")}
              {installable > 0 ? ` (${installable})` : ""}
            </Button>
            { }
            <Button
              loading={updating}
              onClick={() =>
                void runBatch(updating, setUpdating, updateInstalled)
              }
              disabled={updatable === 0 || gameRunning}
            >
              {!updating && <RefreshCw className="h-4 w-4" />}
              {t("syncAll")}
              {updatable > 0 ? ` (${updatable})` : ""}
            </Button>
          </div>
        </GlowCard>
      </motion.div>

    </motion.div>
  );
}

