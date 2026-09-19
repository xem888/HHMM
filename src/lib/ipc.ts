import { invoke } from "@tauri-apps/api/core";
import { listen, type EventCallback } from "@tauri-apps/api/event";

export function call<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  return invoke<T>(cmd, args);
}

export function on<T>(event: string, cb: EventCallback<T>) {
  return listen<T>(event, cb);
}

export const CMD = {
  detectGame: "detect_game",
  setGamePathManual: "set_game_path_manual",
  isGameRunning: "is_game_running",
  launchGame: "launch_game",
  quitApp: "quit_app",
  updateTrayLang: "update_tray_lang",
  openLogDir: "open_log_dir",
  readLog: "read_log",
  clearLog: "clear_log",
  detectBepinex: "detect_bepinex",
  deployBepinex: "deploy_bepinex",
  fixHideManager: "fix_hide_manager",
  listManagedMods: "list_managed_mods",
  refreshWorkshopMeta: "refresh_workshop_meta",
  installOne: "install_one",
  uninstallOne: "uninstall_one",
  computeSyncPlan: "compute_sync_plan",
  applySync: "apply_sync",
  toggleMod: "toggle_mod",
  listCfgFiles: "list_cfg_files",
  readCfg: "read_cfg",
  writeCfgValues: "write_cfg_values",
  openCfgFile: "open_cfg_file",
  readModCfgI18n: "read_mod_cfg_i18n",
  listProfiles: "list_profiles",
  createProfile: "create_profile",
  applyProfile: "apply_profile",
  deleteProfile: "delete_profile",
  installFromPath: "install_from_path",
} as const;

export const EVT = {
  bepinexDeployProgress: "bepinex://deploy-progress",
  quitRequested: "app://quit-requested",
} as const;
