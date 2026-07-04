import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";

type LocaleModule = { default: Record<string, unknown> };

const modules = import.meta.glob<LocaleModule>("./locales/**/*.ts", {
  eager: true,
});

const resources: Resource = {};
for (const path in modules) {
  const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.ts$/);
  if (!match) continue;
  const [, locale, namespace] = match;
  (resources[locale] ??= {})[namespace] = modules[path].default;
}

export const availableLocales = Object.keys(resources);

const rawLang = localStorage.getItem("hhmm-lang");
const saved =
  rawLang === "zh" ? "zh-CN" : rawLang && resources[rawLang] ? rawLang : "en";

void i18n.use(initReactI18next).init({
  resources,
  lng: saved,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
