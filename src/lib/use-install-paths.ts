import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { call, CMD } from "@/lib/ipc";
import { errMsg } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export function useInstallPaths() {
  const { t } = useTranslation("mods");
  const refreshMods = useGameStore((s) => s.refreshMods);

  return useCallback(
    async (paths: string[]) => {
      for (const p of paths) {
        const name = p.split(/[\\/]/).pop() ?? p;
        const tid = toast.loading(t("toast.installing"));
        try {
          const dlls = await call<string[]>(CMD.installFromPath, { path: p });
          toast.success(
            t("toast.installed", { name: dlls.length > 0 ? dlls.join(", ") : name }),
            { id: tid },
          );
        } catch (err) {
          const msg = errMsg(err);
          toast.error(t("toast.installFailed", { name }), {
            id: tid,
            description: msg,
          });
        }
      }
      try {
        await refreshMods();
      } catch (err) {
        console.warn("refresh after install failed:", err);
      }
    },
    [refreshMods, t],
  );
}
