const mods = import.meta.glob<{ default: Record<string, Record<string, string>> }>(
  "./cfgDesc/*.ts",
  { eager: true },
);
export const cfgDescriptions: Record<
  string,
  Record<string, Record<string, string>>
> = {};
for (const [path, mod] of Object.entries(mods)) {
  const lang = path.slice(path.lastIndexOf("/") + 1, -3);
  for (const [file, keys] of Object.entries(mod.default)) {
    cfgDescriptions[file] ??= {};
    for (const [key, text] of Object.entries(keys)) {
      (cfgDescriptions[file][key] ??= {})[lang] = text;
    }
  }
}
