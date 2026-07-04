import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Copy, FolderOpen, RotateCw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { call, CMD } from "@/lib/ipc";
import { errMsg } from "@/lib/utils";
import { confirm } from "@/store/useConfirm";

export function LogViewer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("settings");
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const content = await call<string>(CMD.readLog);
      setText(content);
    } catch (e: unknown) {
      toast.error(t("toast.openLogsFailed"), {
        description: errMsg(e),
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!open) return;
    void load();
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, load, onClose]);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("logViewer.copied"));
    } catch {
      toast.error(t("logViewer.copyFailed"));
    }
  }

  async function clearAll() {
    const ok = await confirm({
      title: t("logViewer.clearConfirmTitle"),
      description: t("logViewer.clearConfirmBody"),
      confirmText: t("logViewer.clear"),
      kind: "danger",
    });
    if (!ok) return;
    try {
      await call(CMD.clearLog);
      await load();
      toast.success(t("logViewer.cleared"));
    } catch (e: unknown) {
      toast.error(t("logViewer.clearFailed"), {
        description: errMsg(e),
      });
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          { }
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          { }
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative flex h-[70vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
          >
            { }
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div className="min-w-0">
                <h2 className="text-base font-semibold">
                  {t("logViewer.title")}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t("logViewer.subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("common:close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            { }
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
              <Button
                size="sm"
                variant="outline"
                loading={loading}
                onClick={() => void load()}
                className="hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <RotateCw className="h-4 w-4" />
                {t("logViewer.refresh")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!text}
                onClick={() => void copyAll()}
                className="hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <Copy className="h-4 w-4" />
                {t("logViewer.copy")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void call(CMD.openLogDir).catch(() => {})}
                className="hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <FolderOpen className="h-4 w-4" />
                {t("logViewer.openFolder")}
              </Button>
              <div className="flex-1" />
              <Button
                size="sm"
                variant="outline"
                disabled={!text}
                onClick={() => void clearAll()}
                className="hover:scale-105 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t("logViewer.clear")}
              </Button>
            </div>
            { }
            <div className="min-h-0 flex-1 overflow-auto bg-muted/30 p-4">
              {text ? (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/90">
                  {text}
                </pre>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {loading ? t("common:loading") : t("logViewer.empty")}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
