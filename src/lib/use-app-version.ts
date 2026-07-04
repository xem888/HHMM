import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";

let cached: string | null = null;

export function useAppVersion(): string {
  const [v, setV] = useState(cached ?? "");
  useEffect(() => {
    if (cached !== null) return;
    getVersion()
      .then((ver) => {
        cached = ver;
        setV(ver);
      })
      .catch(() => {
      });
  }, []);
  return v;
}
