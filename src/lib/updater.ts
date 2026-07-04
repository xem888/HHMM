import { check, type Update } from "@tauri-apps/plugin-updater";
import { toast } from "sonner";
import i18n from "@/i18n";

function t(key: string, opts?: Record<string, unknown>): string {
  return i18n.t(`common:update.${key}`, opts ?? {}) as string;
}

export async function checkForUpdate(manual: boolean): Promise<void> {
  let update: Update | null = null;
  try {
    update = await check();
  } catch {
    if (manual) toast.error(t("checkFailed"));
    return;
  }
  if (!update) {
    if (manual) toast.info(t("upToDate"));
    return;
  }
  toast(t("available", { version: update.version }), {
    id: "update-available",
    duration: Infinity,
    action: {
      label: t("install"),
      onClick: () => void installUpdate(update as Update),
    },
  });
}

async function installUpdate(update: Update): Promise<void> {
  const id = toast.loading(t("downloading"));
  try {
    let total = 0;
    let done = 0;
    await update.downloadAndInstall((e) => {
      switch (e.event) {
        case "Started":
          total = e.data.contentLength ?? 0;
          break;
        case "Progress":
          done += e.data.chunkLength;
          toast.loading(
            t("downloadingPct", {
              pct: total ? Math.round((done / total) * 100) : 0,
            }),
            { id },
          );
          break;
        case "Finished":
          toast.success(t("installed"), { id, duration: Infinity });
          break;
      }
    });
  } catch {
    toast.error(t("installFailed"), { id });
  }
}
