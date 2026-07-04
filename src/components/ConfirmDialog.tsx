import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/store/useConfirm";

export function ConfirmDialog() {
  const { t } = useTranslation("common");
  const reduce = useReducedMotion();
  const open = useConfirm((s) => s.open);
  const opts = useConfirm((s) => s.opts);
  const respond = useConfirm((s) => s.respond);
  const cardRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        respond(false);
      } else if (e.key === "Enter") {
        if (cardRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        e.stopPropagation();
        respond(true);
      } else if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        const next =
          document.activeElement === confirmRef.current
            ? cancelRef.current
            : confirmRef.current;
        next?.focus();
      }
    };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [open, respond]);

  const danger = opts?.kind === "danger";
  const warning = opts?.kind === "warning";

  return (
    <AnimatePresence>
      {open && opts && (
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
            onClick={() => respond(false)}
          />
          { }
          <motion.div
            ref={cardRef}
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl"
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }
            }
            animate={
              reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
            }
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
          >
            <div className="flex gap-3">
              {(warning || danger) && (
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    danger
                      ? "bg-destructive/15 text-destructive"
                      : "bg-warning/15 text-warning",
                  )}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold leading-snug">
                  {opts.title}
                </h2>
                {opts.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {opts.description}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                ref={cancelRef}
                variant="outline"
                onClick={() => respond(false)}
              >
                {opts.cancelText ?? t("cancel")}
              </Button>
              <Button
                ref={confirmRef}
                variant={danger ? "destructive" : "default"}
                onClick={() => respond(true)}
              >
                {opts.confirmText ?? t("confirm")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
