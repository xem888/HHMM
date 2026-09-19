import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { FolderInput } from "lucide-react";
import { useInstallPaths } from "@/lib/use-install-paths";

export function DropInstall() {
  const { t } = useTranslation("mods");
  const installPaths = useInstallPaths();
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let disposed = false;
    void getCurrentWebview()
      .onDragDropEvent(async (e) => {
        if (e.payload.type === "over" || e.payload.type === "enter") {
          setDragOver(true);
        } else if (e.payload.type === "leave") {
          setDragOver(false);
        } else if (e.payload.type === "drop") {
          setDragOver(false);
          await installPaths(e.payload.paths);
        }
      })
      .then((u) => {
        if (disposed) u();
        else unlisten = u;
      });
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [installPaths]);

  if (!dragOver) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-primary/15 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary bg-card px-14 py-10 shadow-2xl">
        <FolderInput className="h-14 w-14 text-primary" />
        <p className="text-xl font-semibold text-foreground">
          {t("dropOverlay.title")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("dropOverlay.hint")}
        </p>
      </div>
    </div>
  );
}
