import { create } from "zustand";
import { call, CMD } from "@/lib/ipc";
import type {
  BepInExStatus,
  GameInfo,
  ManagedMod,
  SyncAction,
  SyncResult,
} from "@/lib/types";
import { errMsg } from "@/lib/utils";

interface GameState {
  loading: boolean;
  game: GameInfo | null;
  bepinex: BepInExStatus | null;
  managed: ManagedMod[];
  syncPlan: SyncAction[];
  gameRunning: boolean;
  error: string | null;

  init: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshMods: () => Promise<void>;
  toggleMod: (id: string, enable: boolean) => Promise<void>;
  installOne: (itemId: string, toDisabled: boolean) => Promise<void>;
  uninstallOne: (modId: string) => Promise<void>;
  updateInstalled: () => Promise<SyncResult | null>;
  installAll: () => Promise<SyncResult | null>;
  deployBepinex: () => Promise<void>;
  fixHideManager: () => Promise<boolean>;
  refreshGameRunning: () => Promise<void>;
}

export function countByState(managed: ManagedMod[]) {
  let installed = 0;
  let installable = 0;
  let updatable = 0;
  let enabled = 0;
  for (const m of managed) {
    if (m.state === "notInstalled") installable++;
    else installed++;
    if (m.state === "enabled") enabled++;
    if (m.updatable) updatable++;
  }
  return { installed, installable, updatable, enabled };
}

function pickActions(plan: SyncAction[], action: "add" | "update"): SyncAction[] {
  return plan.filter((a) => a.action === action);
}

let modsRefreshSeq = 0;

async function refreshAfterAction(get: () => GameState) {
  try {
    await get().refreshMods();
  } catch (e) {
    console.warn("refresh after action failed:", e);
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  loading: false,
  game: null,
  bepinex: null,
  managed: [],
  syncPlan: [],
  gameRunning: false,
  error: null,

  init: async () => {
    set({ loading: true, error: null });
    try {
      const game = await call<GameInfo>(CMD.detectGame);
      set({ game });
      if (!game.installed) {
        set({ bepinex: null, managed: [], syncPlan: [] });
        return;
      }
      const bepinex = await call<BepInExStatus>(CMD.detectBepinex);
      set({ bepinex });
      await get().refreshMods();
      const gameRunning = await call<boolean>(CMD.isGameRunning);
      set({ gameRunning });
    } catch (e: unknown) {
      set({ error: errMsg(e) });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      const game = await call<GameInfo>(CMD.detectGame);
      if (!game.installed) {
        set({ game, bepinex: null, managed: [], syncPlan: [], error: null });
        return;
      }
      const bepinex = await call<BepInExStatus>(CMD.detectBepinex);
      set({ game, bepinex, error: null });
      await get().refreshMods();
      await get().refreshGameRunning();
    } catch (e: unknown) {
      set({ error: errMsg(e) });
    }
  },

  refreshMods: async () => {
    const seq = ++modsRefreshSeq;
    const managed = await call<ManagedMod[]>(CMD.listManagedMods);
    const syncPlan = await call<SyncAction[]>(CMD.computeSyncPlan);
    if (seq !== modsRefreshSeq) return;
    set({ managed, syncPlan, error: null });

    const itemIds = managed.flatMap((m) =>
      m.source.kind === "workshop" ? [m.source.itemId] : [],
    );
    if (itemIds.length > 0) {
      void call<ManagedMod[]>(CMD.refreshWorkshopMeta, { itemIds })
        .then((withMeta) => {
          if (seq === modsRefreshSeq) set({ managed: withMeta });
        })
        .catch(() => {
        });
    }
  },

  toggleMod: async (id, enable) => {
    await call(CMD.toggleMod, { modId: id, enable });
    await refreshAfterAction(get);
  },

  installOne: async (itemId, toDisabled) => {
    await call(CMD.installOne, { itemId, toDisabled });
    await refreshAfterAction(get);
  },

  uninstallOne: async (modId) => {
    await call(CMD.uninstallOne, { modId });
    await refreshAfterAction(get);
  },

  updateInstalled: async () => {
    const actions = pickActions(get().syncPlan, "update");
    if (actions.length === 0) return null;
    const result = await call<SyncResult>(CMD.applySync, { actions });
    await refreshAfterAction(get);
    return result;
  },

  installAll: async () => {
    const actions = pickActions(get().syncPlan, "add");
    if (actions.length === 0) return null;
    const result = await call<SyncResult>(CMD.applySync, { actions });
    await refreshAfterAction(get);
    return result;
  },

  deployBepinex: async () => {
    await call(CMD.deployBepinex);
    const bepinex = await call<BepInExStatus>(CMD.detectBepinex);
    set({ bepinex });
  },

  fixHideManager: async () => {
    const changed = await call<boolean>(CMD.fixHideManager);
    const bepinex = await call<BepInExStatus>(CMD.detectBepinex);
    set({ bepinex });
    return changed;
  },

  refreshGameRunning: async () => {
    try {
      const running = await call<boolean>(CMD.isGameRunning);
      if (get().gameRunning !== running) set({ gameRunning: running });
    } catch {
    }
  },
}));
