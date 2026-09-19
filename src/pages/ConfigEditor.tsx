import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { confirm } from "@/store/useConfirm";
import { toast } from "sonner";
import {
  Save,
  FileText,
  FileCog,
  FolderSearch,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { DynamicItemList } from "@/components/cfg/DynamicItemList";
import { cn, errMsg } from "@/lib/utils";
import { call, CMD } from "@/lib/ipc";
import { setUnsavedCount } from "@/lib/unsaved";
import { SPRING_BOUNCY } from "@/lib/motion";
import type { CfgFile, CfgFileMeta, CfgEntry, CfgChange } from "@/lib/types";
import { cfgDescriptions } from "@/i18n/cfgDescriptions";

function eventToUnityKeyCode(code: string): string | null {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return "Alpha" + code.slice(5);
  if (/^Numpad[0-9]$/.test(code)) return "Keypad" + code.slice(6);
  if (/^F([1-9]|1[0-2])$/.test(code)) return code;
  const map: Record<string, string> = {
    Space: "Space", Enter: "Return", Escape: "Escape", Tab: "Tab",
    Backspace: "Backspace", Delete: "Delete", Insert: "Insert",
    Home: "Home", End: "End", PageUp: "PageUp", PageDown: "PageDown",
    ArrowUp: "UpArrow", ArrowDown: "DownArrow", ArrowLeft: "LeftArrow",
    ArrowRight: "RightArrow", ShiftLeft: "LeftShift", ShiftRight: "RightShift",
    ControlLeft: "LeftControl", ControlRight: "RightControl",
    AltLeft: "LeftAlt", AltRight: "RightAlt", NumpadEnter: "KeypadEnter",
    Comma: "Comma", Period: "Period", Slash: "Slash", Semicolon: "Semicolon",
    Quote: "Quote", BracketLeft: "LeftBracket", BracketRight: "RightBracket",
    Minus: "Minus", Equal: "Equals", Backquote: "BackQuote", Backslash: "Backslash",
    NumpadAdd: "KeypadPlus", NumpadSubtract: "KeypadMinus",
    NumpadMultiply: "KeypadMultiply", NumpadDivide: "KeypadDivide",
    NumpadDecimal: "KeypadPeriod", CapsLock: "CapsLock", Pause: "Pause",
  };
  return map[code] ?? null;
}

function KeybindInput({
  value,
  onChange,
  keycode = false,
}: {
  value: string;
  onChange: (v: string) => void;
  keycode?: boolean;
}) {
  const { t } = useTranslation("config");
  const [listening, setListening] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setListening(true)}
      onBlur={() => setListening(false)}
      onKeyDown={(e) => {
        if (!listening) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setListening(true);
          }
          return;
        }
        e.preventDefault();
        if (e.key === "Escape") {
          setListening(false);
          return;
        }
        if (["Control", "Shift", "Alt"].includes(e.key)) return;
        if (keycode) {
          const kc = eventToUnityKeyCode(e.code);
          if (!kc) return;
          onChange(kc);
        } else {
          const k = eventToUnityKeyCode(e.code);
          if (!k) return;
          const mods: string[] = [];
          if (e.ctrlKey) mods.push("LeftControl");
          if (e.shiftKey) mods.push("LeftShift");
          if (e.altKey) mods.push("LeftAlt");
          onChange([k, ...mods].join(" + "));
        }
        setListening(false);
      }}
      className={cn(
        "flex w-48 cursor-pointer select-none items-center rounded-md border px-3 py-2 text-sm outline-none transition-colors",
        listening
          ? "animate-pulse border-primary bg-primary/5 text-primary"
          : "border-input hover:border-primary/50 hover:bg-accent focus:border-primary/50",
      )}
    >
      {listening ? t("pressKey") : value || "—"}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  fallback,
  integer = false,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  fallback: string;
  integer?: boolean;
} & Omit<ComponentProps<typeof Input>, "value" | "onChange">) {
  return (
    <Input
      type="number"
      step={integer ? 1 : "any"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => {
        const n = Number(value);
        if (value.trim() === "" || Number.isNaN(n)) {
          onChange(fallback);
          return;
        }
        if (integer && !Number.isInteger(n)) onChange(String(Math.round(n)));
      }}
      {...rest}
    />
  );
}

function SliderControl({
  min,
  max,
  step,
  value,
  fallback,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: string;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const num = parseFloat(value) || 0;
  return (
    <div className="flex w-64 items-center gap-3">
      <Slider
        min={min}
        max={max}
        step={step}
        value={[num]}
        onValueChange={(v) => onChange(String(v[0]))}
        className="flex-1"
      />
      { }
      <NumberInput
        min={min}
        max={max}
        step={step}
        value={value}
        fallback={fallback}
        integer={step === 1}
        onChange={onChange}
        className="w-20 tabular-nums"
      />
    </div>
  );
}

function stripVendorPrefix(name: string): string {
  const s = name.replace(/^human\s*host[\s:_·-]*/i, "").trim();
  return s || name;
}

const REDUNDANT_PREFIXES = [
  "setting type:",
  "default value:",
  "acceptable values:",
];
function cleanDescription(lines: string[]): string {
  return lines
    .filter(
      (l) =>
        !REDUNDANT_PREFIXES.some((p) =>
          l.trim().toLowerCase().startsWith(p),
        ),
    )
    .join(" ")
    .trim();
}

function metaParts(
  entry: CfgEntry,
  labels: { def: string; range: string; allowed: string },
): string[] {
  const parts: string[] = [];
  if (entry.defaultValue != null && entry.defaultValue !== "")
    parts.push(`${labels.def}: ${entry.defaultValue}`);
  if (entry.range)
    parts.push(`${labels.range}: ${entry.range[0]}–${entry.range[1]}`);
  if (entry.acceptableValues && entry.acceptableValues.length > 0)
    parts.push(`${labels.allowed}: ${entry.acceptableValues.join(", ")}`);
  return parts;
}

type I18nTable = Record<string, Record<string, Record<string, string>>>;
export interface ModCfgI18n {
  entries: I18nTable;
  labels: I18nTable;
}

function ControlRow({
  entry,
  value,
  onChange,
  fileName,
  modI18n,
}: {
  entry: CfgEntry;
  value: string;
  onChange: (v: string) => void;
  fileName: string;
  modI18n: ModCfgI18n;
}) {
  const { t, i18n } = useTranslation("config");
  const c = entry.control;
  const translated =
    modI18n.entries[fileName]?.[entry.key]?.[i18n.language] ??
    cfgDescriptions[fileName]?.[entry.key]?.[i18n.language];
  const desc = translated ?? cleanDescription(entry.description);
  const label = modI18n.labels[fileName]?.[entry.key]?.[i18n.language];
  const meta = metaParts(entry, {
    def: t("defaultLabel"),
    range: t("rangeLabel"),
    allowed: t("acceptableLabel"),
  });
  const changed = entry.defaultValue != null && value !== entry.value;
  return (
    <div className="space-y-1.5">
      { }
      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-medium" title={entry.key}>
            {label ?? entry.key}
          </span>
          {changed && (
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <div className="shrink-0 pt-0.5">
        {c.kind === "toggle" && (
          <Switch
            checked={value.trim().toLowerCase() === "true"}
            onCheckedChange={(v) => onChange(v ? "true" : "false")}
          />
        )}
        {c.kind === "slider" && (
          <SliderControl
            min={c.min}
            max={c.max}
            step={c.step}
            value={value}
            fallback={entry.value}
            onChange={onChange}
          />
        )}
        {c.kind === "number" && (
          <NumberInput
            value={value}
            fallback={entry.value}
            integer={c.integer}
            onChange={onChange}
            className="w-28 tabular-nums"
          />
        )}
        {c.kind === "dropdown" &&
          (c.options.includes(value) ? (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {c.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-48"
            />
          ))}
        {c.kind === "keybind" && (
          <KeybindInput value={value} onChange={onChange} />
        )}
        {c.kind === "keyCode" && (
          <KeybindInput value={value} onChange={onChange} keycode />
        )}
        {(c.kind === "text" || c.kind === "multiText") && (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-64"
          />
        )}
        </div>
      </div>
      {desc && (
        <div className="text-xs leading-relaxed text-muted-foreground">
          {desc}
        </div>
      )}
      {meta.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground/70">
          {meta.map((m) => (
            <span key={m} className="tabular-nums">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type LoadState = "loading" | "ready" | "error";

export default function ConfigEditor() {
  const { t } = useTranslation("config");
  const reduced = useReducedMotion();
  const location = useLocation();
  const [files, setFiles] = useState<CfgFileMeta[]>([]);
  const [modI18n, setModI18n] = useState<ModCfgI18n>({ entries: {}, labels: {} });
  const [listState, setListState] = useState<LoadState>("loading");
  const [sel, setSel] = useState<string | null>(null);
  const [cfg, setCfg] = useState<CfgFile | null>(null);
  const [fileState, setFileState] = useState<LoadState>("ready");
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  const [sidebarW, setSidebarW] = useState(() => {
    const v = Number(localStorage.getItem("cfgSidebarW"));
    return v >= 180 && v <= 480 ? v : 224;
  });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(sidebarW);
  const onResizeStart = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (ev: MouseEvent) => {
      const next = Math.min(480, Math.max(180, widthRef.current + ev.movementX));
      widthRef.current = next;
      if (sidebarRef.current) sidebarRef.current.style.width = `${next}px`;
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setSidebarW(widthRef.current);
      localStorage.setItem("cfgSidebarW", String(widthRef.current));
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  function loadList() {
    setListState("loading");
    call<CfgFileMeta[]>(CMD.listCfgFiles)
      .then((fs) => {
        setFiles(fs);
        setListState("ready");
      })
      .catch((e) => {
        console.error(e);
        setListState("error");
      });
    call<ModCfgI18n>(CMD.readModCfgI18n)
      .then(setModI18n)
      .catch((e) => console.warn("read_mod_cfg_i18n failed:", e));
  }
  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    const target = (location.state as { openCfg?: string } | null)?.openCfg;
    if (!target || listState !== "ready" || files.length === 0) return;
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const nt = norm(target);
    const hit = (f: (typeof files)[number], test: (s: string) => boolean) =>
      (!!f.pluginName && test(norm(f.pluginName))) ||
      test(norm(f.fileName.replace(/\.cfg$/i, "")));
    const exact = files.filter((f) => hit(f, (s) => s === nt || s.endsWith(nt)));
    const fuzzy = files.filter((f) => hit(f, (s) => s.includes(nt)));
    const match =
      exact.length === 1 ? exact[0] : fuzzy.length === 1 ? fuzzy[0] : undefined;
    if (match && match.fileName !== sel) void openFile(match.fileName);
  }, [location.state, listState, files]);

  const dirtyCount = Object.keys(dirty).length;

  const loadSeq = useRef(0);

  async function loadFile(name: string) {
    const seq = ++loadSeq.current;
    setSel(name);
    setDirty({});
    setQ("");
    setFileState("loading");
    try {
      const f = await call<CfgFile>(CMD.readCfg, { fileName: name });
      if (seq !== loadSeq.current) return;
      setCfg(f);
      setFileState("ready");
    } catch (e) {
      if (seq !== loadSeq.current) return;
      console.error(e);
      setCfg(null);
      setFileState("error");
    }
  }

  async function openFile(name: string) {
    if (name === sel) return;
    if (dirtyCount > 0) {
      const go = await confirm({
        title: t("common:unsaved.title"),
        description: t("common:unsaved.description"),
        confirmText: t("common:discard"),
        kind: "warning",
      });
      if (!go) return;
    }
    await loadFile(name);
  }

  useEffect(() => {
    setUnsavedCount(dirtyCount);
    return () => setUnsavedCount(0);
  }, [dirtyCount]);

  useEffect(() => {
    if (dirtyCount === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyCount]);

  const keyOf = (section: string, key: string) => `${section}\x00${key}`;
  const parseKey = (k: string): { section: string; key: string } => {
    const i = k.indexOf("\x00");
    return { section: k.slice(0, i), key: k.slice(i + 1) };
  };
  const setVal = (section: string, key: string, value: string, original: string) =>
    setDirty((d) => {
      const k = keyOf(section, key);
      if (value === original) {
        if (!(k in d)) return d;
        const { [k]: _drop, ...rest } = d;
        return rest;
      }
      return { ...d, [k]: value };
    });
  const getVal = (section: string, e: CfgEntry) =>
    dirty[keyOf(section, e.key)] ?? e.value;

  function resetSection(section: { name: string; entries: CfgEntry[] }) {
    const updates: Array<[string, string | null]> = [];
    for (const e of section.entries) {
      if (e.defaultValue == null) continue;
      const k = keyOf(section.name, e.key);
      const cur = dirty[k] ?? e.value;
      if (cur === e.defaultValue) continue;
      updates.push([k, e.defaultValue === e.value ? null : e.defaultValue]);
    }
    if (updates.length === 0) {
      toast.info(t("resetNoDefaults"));
      return;
    }
    setDirty((d) => {
      const next = { ...d };
      for (const [k, v] of updates) {
        if (v === null) delete next[k];
        else next[k] = v;
      }
      return next;
    });
    toast.success(t("resetApplied", { count: updates.length }));
  }

  async function save() {
    if (!cfg) return;
    const changes: CfgChange[] = Object.entries(dirty).map(([k, value]) => ({
      ...parseKey(k),
      value,
    }));
    if (changes.length === 0) return;
    const n = changes.length;
    const snapshot = { ...dirty };
    setSaving(true);
    const seq = loadSeq.current;
    try {
      await call(CMD.writeCfgValues, { fileName: cfg.fileName, changes });
      const f = await call<CfgFile>(CMD.readCfg, { fileName: cfg.fileName });
      toast.success(t("saveSuccess", { count: n }));
      if (seq !== loadSeq.current) return;
      setCfg(f);
      setDirty((d) => {
        const next: Record<string, string> = {};
        for (const [k, v] of Object.entries(d)) {
          if (snapshot[k] !== v) next[k] = v;
        }
        return next;
      });
    } catch (e) {
      console.error(e);
      toast.error(t("saveFailed"), { description: errMsg(e) });
    } finally {
      setSaving(false);
    }
  }

  async function openRaw() {
    if (!cfg) return;
    if (Object.keys(dirty).length > 0) {
      const ok = await confirm({
        title: t("openFileConfirmTitle"),
        description: t("openFileConfirmDesc"),
        confirmText: t("openFileConfirm"),
        kind: "warning",
      });
      if (!ok) return;
    }
    try {
      await call(CMD.openCfgFile, { fileName: cfg.fileName });
    } catch (e) {
      toast.error(t("openFileFailed"), { description: errMsg(e) });
    }
  }

  return (
    <div className="flex h-full">
      { }
      <div
        ref={sidebarRef}
        style={{ width: sidebarW }}
        className="flex shrink-0 flex-col overflow-y-auto p-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40"
      >
        <h2 className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filesTitle")}
          {listState === "ready" && files.length > 0 && (
            <span className="ml-1.5 text-muted-foreground/60">
              {files.length}
            </span>
          )}
        </h2>

        {listState === "loading" && (
          <div className="space-y-1 px-1 py-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        )}

        {listState === "error" && (
          <button
            onClick={loadList}
            className="mx-1 mt-2 flex flex-col items-center gap-1 rounded-lg border border-border p-4 text-center text-xs text-muted-foreground hover:bg-accent"
          >
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>{t("loadFailedTitle")}</span>
            <span className="text-primary">{t("common:retry")}</span>
          </button>
        )}

        {listState === "ready" &&
          files.map((f) => {
            const active = sel === f.fileName;
            return (
              <button
                key={f.fileName}
                onClick={() => void openFile(f.fileName)}
                title={
                  f.pluginName ? `${f.pluginName}\n${f.fileName}` : f.fileName
                }
                className={cn(
                  "group relative flex w-full items-start gap-2 rounded-lg py-2 pl-4 pr-2 text-left text-sm transition-colors",
                  active
                    ? "bg-primary/5 text-primary"
                    : "text-foreground hover:bg-accent",
                )}
              >
                { }
                {active && (
                  <motion.span
                    layoutId="cfg-active"
                    aria-hidden
                    className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary"
                    transition={reduced ? { duration: 0 } : SPRING_BOUNCY}
                  >
                    <span className="absolute inset-0 rounded-full bg-primary opacity-60 blur-[5px]" />
                  </motion.span>
                )}
                { }
                <FileText
                  className={cn(
                    "relative z-10 mt-0.5 h-4 w-4 shrink-0 transition-transform duration-300",
                    active ? "scale-110" : "group-hover:translate-x-0.5",
                  )}
                />
                <span className="relative z-10 min-w-0 flex-1">
                  <span className="block truncate">
                    {f.pluginName ? stripVendorPrefix(f.pluginName) : f.fileName}
                  </span>
                  {f.pluginName && f.pluginName !== f.fileName && (
                    <span className="block truncate text-[11px] text-muted-foreground/60">
                      {f.fileName}
                    </span>
                  )}
                </span>
              </button>
            );
          })}

        {listState === "ready" && files.length === 0 && (
          <p className="px-2 py-4 text-xs leading-relaxed text-muted-foreground">
            {t("noConfig")}
          </p>
        )}
      </div>

      { }
      <div
        onMouseDown={onResizeStart}
        role="separator"
        aria-orientation="vertical"
        className="w-1 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary/40 active:bg-primary/60"
      />

      { }
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sel ?? "__empty__"}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
        { }
        {!sel && fileState !== "loading" && (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={FileCog}
              title={t("selectTitle")}
              description={t("selectHint")}
            />
          </div>
        )}

        { }
        {sel && fileState === "loading" && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-9 w-72" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="space-y-4 p-5">
                <Skeleton className="h-5 w-40" />
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-7 w-28" />
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

        { }
        {sel && fileState === "error" && (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={AlertTriangle}
              title={t("loadFailedTitle")}
              description={t("loadFailedHint")}
              action={
                <Button variant="outline" onClick={() => void loadFile(sel)}>
                  {t("common:retry")}
                </Button>
              }
            />
          </div>
        )}

        { }
        {sel && fileState === "ready" && cfg && (
          <div className="space-y-6">
            <PageHeader
              title={cfg.pluginName ? stripVendorPrefix(cfg.pluginName) : cfg.fileName}
              count={dirtyCount > 0 ? dirtyCount : undefined}
              actions={
                <div className="flex gap-2">
                  { }
                  <Button
                    variant="outline"
                    onClick={() => void openRaw()}
                    className="group hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                  >
                    <FileCog className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    {t("openFile")}
                  </Button>
                  <Button
                    onClick={() => void save()}
                    disabled={dirtyCount === 0}
                    loading={saving}
                    className="group bg-gradient-to-br from-[#1bd96a] to-[#00af5c] shadow-[0_2px_10px_rgba(0,175,92,0.35)] hover:scale-[1.03]"
                  >
                    {!saving && (
                      <Save className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
                    )}
                    {dirtyCount > 0 ? t("saveWithCount", { count: dirtyCount }) : t("save")}
                  </Button>
                </div>
              }
            />
            { }
            {cfg.fileName === "BepInEx.cfg" && (
              <Card className="border-warning/40 bg-warning/5 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-warning">
                      {t("bepinexWarning.title")}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {t("bepinexWarning.description")}
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {cfg.pluginVersion && (
              <div className="-mt-4 text-xs text-muted-foreground">
                v{cfg.pluginVersion}
              </div>
            )}

            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="max-w-sm"
            />

            <div className="space-y-4">
              {(() => {
                let anyVisible = false;
                const cards = cfg.sections.map((section) => {
                  const rows =
                    section.kind === "dynamic"
                      ? section.entries
                      : section.entries.filter(
                          (e) =>
                            !q ||
                            e.key.toLowerCase().includes(q.toLowerCase()),
                        );
                  if (rows.length === 0) return null;
                  if (
                    section.kind === "dynamic" &&
                    q &&
                    !section.entries.some((e) =>
                      e.key.toLowerCase().includes(q.toLowerCase()),
                    )
                  )
                    return null;
                  anyVisible = true;

                  const hasDefaults = section.entries.some(
                    (e) => e.defaultValue != null,
                  );

                  return (
                    <div key={section.name}>
                      <Card className="p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3 className="flex items-center gap-2 font-semibold">
                            {section.name}
                            {section.kind === "dynamic" && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground tabular-nums">
                                {t("dynamicCount", {
                                  count: section.entries.length,
                                })}
                              </span>
                            )}
                          </h3>
                          {hasDefaults && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resetSection(section)}
                              title={t("resetSectionTip")}
                              className="group hover:scale-105 hover:bg-primary/10 hover:text-primary"
                            >
                              <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-180" />
                              {t("resetSection")}
                            </Button>
                          )}
                        </div>
                        {section.kind === "dynamic" ? (
                          <DynamicItemList
                            entries={section.entries}
                            q={q}
                            values={Object.fromEntries(
                              section.entries.map((e) => [
                                e.key,
                                getVal(section.name, e),
                              ]),
                            )}
                            onChange={(key, value) => {
                              const orig =
                                section.entries.find((e) => e.key === key)
                                  ?.value ?? "";
                              setVal(section.name, key, value, orig);
                            }}
                          />
                        ) : (
                          <div className="space-y-4">
                            {rows.map((e) => (
                              <ControlRow
                                key={e.key}
                                entry={e}
                                value={getVal(section.name, e)}
                                onChange={(v) =>
                                  setVal(section.name, e.key, v, e.value)
                                }
                                fileName={cfg.fileName}
                                modI18n={modI18n}
                              />
                            ))}
                          </div>
                        )}
                      </Card>
                    </div>
                  );
                });
                return (
                  <>
                    {cards}
                    { }
                    {q && !anyVisible && (
                      <EmptyState
                        icon={FolderSearch}
                        title={t("noMatch")}
                      />
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
