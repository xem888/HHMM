import { create } from "zustand";
import i18n, { availableLocales } from "@/i18n";

export type Theme = "light" | "dark";

export type Lang =
  | "zh-CN"
  | "en"
  | "fr"
  | "it"
  | "de"
  | "es"
  | "ru"
  | "tr"
  | "ja"
  | "pl"
  | "zh-TW"
  | "pt-PT"
  | "ko"
  | "th";

export const LANGUAGES: { code: Lang; native: string }[] = [
  { code: "zh-CN", native: "简体中文" },
  { code: "en", native: "English" },
  { code: "fr", native: "Français" },
  { code: "it", native: "Italiano" },
  { code: "de", native: "Deutsch" },
  { code: "es", native: "Español" },
  { code: "ru", native: "Русский" },
  { code: "tr", native: "Türkçe" },
  { code: "ja", native: "日本語" },
  { code: "pl", native: "Polski" },
  { code: "zh-TW", native: "繁體中文" },
  { code: "pt-PT", native: "Português" },
  { code: "ko", native: "한국어" },
  { code: "th", native: "ไทย" },
];

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readTheme(): Theme {
  const raw = localStorage.getItem("hhmm-theme");
  if (raw === "light" || raw === "dark") return raw;
  if (raw === "system") {
    const resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    localStorage.setItem("hhmm-theme", resolved);
    return resolved;
  }
  return "light";
}

function canViewTransition(): boolean {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function readLang(): Lang {
  const raw = localStorage.getItem("hhmm-lang");
  if (raw === "zh") return "zh-CN";
  if (raw && availableLocales.includes(raw)) return raw as Lang;
  return "en";
}

interface AppState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  minimizeToTray: boolean;
  setMinimizeToTray: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: readTheme(),
  setTheme: (theme) => {
    localStorage.setItem("hhmm-theme", theme);
    const run = () => {
      applyTheme(theme);
      set({ theme });
    };
    if (canViewTransition()) {
      document.startViewTransition(run);
    } else {
      run();
    }
  },
  lang: readLang(),
  setLang: (lang) => {
    localStorage.setItem("hhmm-lang", lang);
    void i18n.changeLanguage(lang);
    set({ lang });
  },
  minimizeToTray: localStorage.getItem("hhmm-tray") === "true",
  setMinimizeToTray: (minimizeToTray) => {
    localStorage.setItem("hhmm-tray", String(minimizeToTray));
    set({ minimizeToTray });
  },
}));
