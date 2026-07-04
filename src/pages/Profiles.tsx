import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { confirm } from "@/store/useConfirm";
import { toast } from "sonner";
import { Layers, Plus, Play, Trash2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { call, CMD } from "@/lib/ipc";
import type { ApplyResult, BepInExStatus, ProfileMeta } from "@/lib/types";
import { listContainer, listItem } from "@/lib/motion";
import { useGameStore } from "@/store/useGameStore";
import { cn, errMsg } from "@/lib/utils";

export default function Profiles() {
  const { t } = useTranslation("profiles");
  const refreshMods = useGameStore((s) => s.refreshMods);
  const fixHideManager = useGameStore((s) => s.fixHideManager);

  const [profiles, setProfiles] = useState<ProfileMeta[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = async () => {
    setLoadError(null);
    try {
      const list = await call<ProfileMeta[]>(CMD.listProfiles);
      setProfiles(list);
    } catch (e) {
      setLoadError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    const trimmed = name.trim();
    if (!trimmed || creating) return;
    setCreating(true);
    try {
      const meta = await call<ProfileMeta>(CMD.createProfile, { name: trimmed });
      setName("");
      await load();
      toast.success(t("toast.created", { name: meta.name }));
    } catch (e) {
      toast.error(t("toast.createFailed"), { description: errMsg(e) });
    } finally {
      setCreating(false);
    }
  }

  async function apply(p: ProfileMeta) {
    if (pendingId) return;
    if (
      !(await confirm({
        title: t("applyConfirm"),
        description: t("applyConfirmDesc"),
        confirmText: t("common:apply"),
        kind: "warning",
      }))
    )
      return;
    setPendingId(p.id);
    let applied = false;
    try {
      const res = await call<ApplyResult>(CMD.applyProfile, { id: p.id });
      applied = true;
      if (res.failed.length > 0) {
        toast.warning(
          t("toast.appliedPartial", { name: p.name, count: res.failed.length }),
          {
            description:
              res.failed
                .map((f) => `${f.dllName}: ${f.reason}`)
                .join("\n") +
              "\n\n" +
              t("toast.backupHint"),
          },
        );
      } else {
        toast.success(t("toast.applied", { name: p.name }));
      }
    } catch (e) {
      toast.error(t("toast.applyFailed"), { description: errMsg(e) });
    } finally {
      setPendingId(null);
    }
    if (!applied) return;
    try {
      await refreshMods();
    } catch (e) {
      console.warn("refresh after profile apply failed:", e);
    }
    try {
      const bep = await call<BepInExStatus>(CMD.detectBepinex);
      useGameStore.setState({ bepinex: bep });
      if (bep.installed && bep.hideManager !== null && bep.hideManager !== "ok") {
        toast.warning(t("toast.hideManagerWarn"), {
          action: {
            label: t("dashboard:hideManager.fix"),
            onClick: () => {
              void fixHideManager()
                .then(() => toast.success(t("dashboard:hideManager.fixed")))
                .catch((err) =>
                  toast.error(t("dashboard:hideManager.fixFailed"), {
                    description: errMsg(err),
                  }),
                );
            },
          },
        });
      }
    } catch {
    }
  }

  async function del(p: ProfileMeta) {
    if (pendingId) return;
    if (
      !(await confirm({
        title: t("deleteConfirm"),
        confirmText: t("common:delete"),
        kind: "danger",
      }))
    )
      return;
    setPendingId(p.id);
    try {
      await call(CMD.deleteProfile, { id: p.id });
      await load();
      toast.success(t("toast.deleted", { name: p.name }));
    } catch (e) {
      toast.error(t("toast.deleteFailed"), { description: errMsg(e) });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <PageHeader title={t("nav:profiles")} count={profiles.length} />

      { }
      <Card className="space-y-4 border-primary/20 bg-primary/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="font-semibold leading-snug">{t("about.title")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("about.body")}
            </p>
          </div>
        </div>
        <div className="grid gap-3 border-t border-primary/10 pt-4 sm:grid-cols-3">
          {[
            { icon: Plus, k: "create", tone: "bg-primary/10 text-primary" },
            { icon: Play, k: "apply", tone: "bg-primary/10 text-primary" },
            {
              icon: Trash2,
              k: "delete",
              tone: "bg-destructive/10 text-destructive",
            },
          ].map(({ icon: Icon, k, tone }) => (
            <div key={k} className="flex items-start gap-2.5">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  tone,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{t(`about.${k}Step`)}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t(`about.${k}Hint`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      { }
      <Card className="flex items-center gap-3 p-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("create.placeholder")}
          className="max-w-xs"
          disabled={creating}
          onKeyDown={(e) => e.key === "Enter" && void create()}
        />
        <Button
          onClick={() => void create()}
          disabled={!name.trim()}
          loading={creating}
        >
          {!creating && <Plus className="h-4 w-4" />}
          {t("create.label")}
        </Button>
      </Card>

      { }
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </Card>
          ))}
        </div>
      ) : loadError ? (
        <Card className="flex flex-col items-center gap-3 border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">{t("loadFailed")}</p>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              {loadError}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            {t("common:retry")}
          </Button>
        </Card>
      ) : profiles.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t("empty.title")}
          description={t("empty.description")}
        />
      ) : (
        <motion.div
          className="space-y-2"
          variants={listContainer}
          initial="hidden"
          animate="show"
        >
          {profiles.map((p) => {
            const busy = pendingId === p.id;
            return (
              <motion.div key={p.id} variants={listItem}>
                { }
                <div className="group relative">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-primary/30 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <Card className="flex transform-gpu items-center gap-3 rounded-xl p-4 transition-transform duration-300 ease-out hover:-translate-y-0.5">
                    { }
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("modSummary", {
                          enabled: p.enabledCount,
                          count: p.modCount,
                        })}
                      </div>
                    </div>
                    { }
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void apply(p)}
                      disabled={pendingId !== null && !busy}
                      loading={busy}
                      className="hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                    >
                      {!busy && <Play className="h-4 w-4" />}
                      {t("common:apply")}
                    </Button>
                    { }
                    <button
                      type="button"
                      onClick={() => void del(p)}
                      disabled={pendingId !== null && !busy}
                      aria-label={t("common:delete")}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-destructive/10 hover:text-destructive active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
