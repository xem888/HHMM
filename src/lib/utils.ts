import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import i18n from "@/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const KIND_TO_I18N: Record<string, string> = {
  GameRunning: "gameRunningBanner",
};

export function errMsg(e: unknown): string {
  const kind = (e as { kind?: string })?.kind;
  if (kind && KIND_TO_I18N[kind]) {
    const key = KIND_TO_I18N[kind];
    const v = i18n.t(key, { ns: "common" });
    if (typeof v === "string" && v !== key) return v;
  }
  return (e as { message?: string })?.message ?? String(e);
}
