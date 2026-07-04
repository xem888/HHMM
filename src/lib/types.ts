
export interface GameInfo {
  root: string | null;
  installed: boolean;
  library: string | null;
}

export interface BepInExStatus {
  installed: boolean;
  hasWinhttp: boolean;
  version: string | null;
  compat: "ok" | "below" | "above" | "incompatible" | null;
  hideManager: "ok" | "missingFile" | "disabled" | null;
}

export interface ModEntry {
  id: string;
  dllName: string;
  enabled: boolean;
  version: string | null;
  hash: string;
  mtime: number;
  size: number;
  extraFiles: string[];
  workshopItemId: string | null;
}

export interface WorkshopItem {
  itemId: string;
  dllName: string;
  version: string | null;
  hash: string;
  mtime: number;
  extraFiles: string[];
}

export type SyncAction =
  | { action: "add"; item: WorkshopItem }
  | { action: "update"; item: WorkshopItem; current: ModEntry }
  | { action: "upToDate"; item: WorkshopItem };

export interface FailedItem {
  dllName: string;
  reason: string;
}
export interface SyncResult {
  succeeded: string[];
  failed: FailedItem[];
}

export interface ApplyResult {
  applied: string[];
  failed: FailedItem[];
}

export interface ProfileMeta {
  id: string;
  name: string;
  modCount: number;
  enabledCount: number;
}

export interface DeployProgress {
  phase: "download" | "extract" | "done";
  percent: number;
}

export type ManagedSource =
  | { kind: "workshop"; itemId: string }
  | { kind: "local" };

export type ManagedState = "notInstalled" | "enabled" | "disabled";

export interface ManagedMod {
  key: string;
  id: string;
  dllName: string;
  displayName: string;
  source: ManagedSource;
  state: ManagedState;
  updatable: boolean;
  size: number;
  mtime: number;
  title: string | null;
  author: string | null;
  previewUrl: string | null;
  timeCreated: number | null;
  timeUpdated: number | null;
}

export interface AppError {
  kind: string;
  message: string;
}

export type SettingType =
  | "Boolean"
  | "Int32"
  | "Single"
  | "String"
  | "KeyboardShortcut"
  | "KeyCode"
  | { Enum: string }
  | { Unknown: string };

export type ControlKind =
  | { kind: "toggle" }
  | { kind: "slider"; min: number; max: number; step: number }
  | { kind: "number"; integer: boolean }
  | { kind: "dropdown"; options: string[] }
  | { kind: "keybind" }
  | { kind: "keyCode" }
  | { kind: "text" }
  | { kind: "multiText"; separator: string }
  | { kind: "dynamicKeyInt" };

export interface CfgEntry {
  key: string;
  value: string;
  description: string[];
  settingType: SettingType;
  defaultValue: string | null;
  range: [number, number] | null;
  acceptableValues: string[] | null;
  control: ControlKind;
}

export interface CfgSection {
  name: string;
  kind: "schema" | "dynamic";
  entries: CfgEntry[];
}

export interface CfgFile {
  fileName: string;
  pluginName: string | null;
  pluginVersion: string | null;
  pluginGuid: string | null;
  sections: CfgSection[];
}

export interface CfgFileMeta {
  fileName: string;
  pluginName: string | null;
  pluginVersion: string | null;
  pluginGuid: string | null;
}

export interface CfgChange {
  section: string;
  key: string;
  value: string;
}
