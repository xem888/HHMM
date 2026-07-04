import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  FolderOpen,
  Moon,
  Palette,
  ScrollText,
  Settings2,
  Sun,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogViewer } from "@/components/LogViewer";
import { useAppStore, type Theme } from "@/store/useAppStore";
import { useGameStore } from "@/store/useGameStore";
import { call, on, CMD, EVT } from "@/lib/ipc";
import { checkForUpdate } from "@/lib/updater";
import { useAppVersion } from "@/lib/use-app-version";
import { DURATION, EASING, SPRING } from "@/lib/motion";
import { errMsg } from "@/lib/utils";
import type { DeployProgress } from "@/lib/types";

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex min-w-0 items-center gap-2">{children}</div>
    </div>
  );
}

function ThemeToggle() {
  const { t } = useTranslation("settings");
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const reduce = useReducedMotion();

  const options: { k: Theme; label: string; icon: typeof Sun }[] = [
    { k: "light", label: t("theme.light"), icon: Sun },
    { k: "dark", label: t("theme.dark"), icon: Moon },
  ];

  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1">
      {options.map((o) => {
        const active = theme === o.k;
        const Icon = o.icon;
        return (
          <button
            key={o.k}
            type="button"
            onClick={() => setTheme(o.k)}
            className="relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="settings-theme-pill"
                className="absolute inset-0 rounded-md bg-primary shadow-sm"
                transition={reduce ? { duration: 0 } : SPRING}
              />
            )}
            <span
              className={`relative z-10 inline-flex items-center gap-1.5 ${
                active ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const { t } = useTranslation("settings");
  const game = useGameStore((s) => s.game);
  const bepinex = useGameStore((s) => s.bepinex);
  const loading = useGameStore((s) => s.loading);
  const error = useGameStore((s) => s.error);
  const deployBepinex = useGameStore((s) => s.deployBepinex);
  const init = useGameStore((s) => s.init);
  const minimizeToTray = useAppStore((s) => s.minimizeToTray);
  const setMinimizeToTray = useAppStore((s) => s.setMinimizeToTray);
  const reduce = useReducedMotion();
  const appVersion = useAppVersion();

  const [pickingGame, setPickingGame] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const deployToastId = useRef<string | number | null>(null);
  useEffect(() => {
    const unlisten = on<DeployProgress>(EVT.bepinexDeployProgress, (e) => {
      const id = deployToastId.current;
      if (id == null) return;
      const percent = Math.round(e.payload.percent * 100);
      const phaseLabel = t(`dashboard:deploy.phase.${e.payload.phase}`, {
        defaultValue: e.payload.phase,
      });
      toast.loading(
        t("toast.deployPhase", { phase: phaseLabel, percent }),
        { id },
      );
    });
    return () => {
      void unlisten.then((f) => f());
    };
  }, [t]);

  async function pickGame() {
    const dir = await open({ directory: true });
    if (typeof dir !== "string") return;
    setPickingGame(true);
    try {
      await call(CMD.setGamePathManual, { root: dir });
      await init();
      toast.success(t("toast.gamePathSet"));
    } catch (e: unknown) {
      toast.error(t("toast.gamePathFailed"), {
        description: errMsg(e),
      });
    } finally {
      setPickingGame(false);
    }
  }

  async function redeploy() {
    setDeploying(true);
    const id = toast.loading(t("toast.deploying"));
    deployToastId.current = id;
    try {
      await deployBepinex();
      toast.success(t("toast.deployDone"), { id });
    } catch (e: unknown) {
      toast.error(t("toast.deployFailed"), {
        id,
        description: errMsg(e),
      });
    } finally {
      deployToastId.current = null;
      setDeploying(false);
    }
  }

  if (loading && !game && !bepinex) {
    return (
      <div className="space-y-6 p-8">
        <PageHeader title={t("title")} />
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-5 h-3.5 w-56" />
            <Skeleton className="mb-3 h-9 w-full" />
            <Skeleton className="h-9 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-8">
        <PageHeader title={t("title")} />
        <Card className="border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-medium text-destructive">{t("error.title")}</p>
              <p className="break-words text-sm text-muted-foreground">
                {error}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                variant="outline"
                loading={loading}
                onClick={() => void init()}
              >
                {t("common:retry")}
              </Button>
              <Button
                size="sm"
                loading={pickingGame}
                onClick={() => void pickGame()}
              >
                {t("environment.setManually")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const cardMotion = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: DURATION.base,
      ease: EASING.enter,
      delay: reduce ? 0 : i * 0.05,
    },
  });

  return (
    <div className="space-y-6 p-8">
      <PageHeader title={t("title")} />

      { }
      <motion.div {...cardMotion(0)}>
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              {t("appearance.title")}
            </CardTitle>
            <CardDescription>{t("appearance.description")}</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            <Row label={t("appearance.theme")}>
              <ThemeToggle />
            </Row>
            <Row label={t("appearance.language")}>
              <LanguageSwitcher className="w-44" />
            </Row>
            <Row
              label={
                <span className="flex flex-col gap-0.5">
                  {t("appearance.minimizeToTray")}
                  <span className="text-xs font-normal text-muted-foreground">
                    {t("appearance.minimizeToTrayHint")}
                  </span>
                </span>
              }
            >
              <Switch
                checked={minimizeToTray}
                onCheckedChange={setMinimizeToTray}
              />
            </Row>
          </CardContent>
        </Card>
      </motion.div>

      { }
      <motion.div {...cardMotion(1)}>
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              {t("environment.title")}
            </CardTitle>
            <CardDescription>{t("environment.description")}</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            <Row label={t("environment.gamePath")}>
              <span
                className="max-w-md truncate text-xs text-muted-foreground"
                title={game?.root ?? ""}
              >
                {game?.root ?? t("environment.gamePathEmpty")}
              </span>
              {game?.root && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (game?.root) void openPath(game.root);
                  }}
                  className="group/open hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  <FolderOpen className="h-4 w-4 transition-transform duration-300 group-hover/open:scale-110" />
                  {t("environment.openFolder")}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                loading={pickingGame}
                onClick={() => void pickGame()}
                className="hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                {t("environment.setManually")}
              </Button>
            </Row>
            <Row label={t("environment.bepinexStatus")}>
              {bepinex?.installed ? (
                <Badge variant="default">
                  {bepinex.version ?? t("common:enabled")}
                </Badge>
              ) : (
                <Badge variant="muted">{t("environment.notDetected")}</Badge>
              )}
              {game?.root && bepinex?.installed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (game?.root) void openPath(`${game.root}\\BepInEx`);
                  }}
                  className="group/open hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  <FolderOpen className="h-4 w-4 transition-transform duration-300 group-hover/open:scale-110" />
                  {t("environment.openFolder")}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                loading={deploying}
                onClick={() => void redeploy()}
                className="hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                {t("environment.redeploy")}
              </Button>
            </Row>
            { }
            <Row
              label={
                <span className="flex flex-col gap-0.5">
                  {t("environment.logs")}
                  <span className="text-xs font-normal text-muted-foreground">
                    {t("environment.logsHint")}
                  </span>
                </span>
              }
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLogOpen(true)}
                className="group/open hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <ScrollText className="h-4 w-4 transition-transform duration-300 group-hover/open:scale-110" />
                {t("environment.openLogs")}
              </Button>
            </Row>
          </CardContent>
        </Card>
      </motion.div>

      { }
      <motion.div {...cardMotion(2)}>
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle>{t("about.title")}</CardTitle>
            <CardDescription>{t("about.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("about.appName")}</p>
              <p className="text-sm text-muted-foreground">
                {t("about.tagline")}
              </p>
            </div>
            <div className="divide-y divide-border">
              <Row label={t("about.version")}>
                <span className="text-xs text-muted-foreground">
                  {appVersion ? `v${appVersion}` : "—"}
                </span>
              </Row>
              <Row label={t("about.checkUpdate")}>
                <Button
                  size="sm"
                  variant="outline"
                  loading={checkingUpdate}
                  onClick={async () => {
                    setCheckingUpdate(true);
                    await checkForUpdate(true);
                    setCheckingUpdate(false);
                  }}
                >
                  {t("about.checkUpdate")}
                </Button>
              </Row>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <LogViewer open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
