import { create } from "zustand";

export type ConfirmKind = "default" | "warning" | "danger";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  kind?: ConfirmKind;
}

interface ConfirmState {
  open: boolean;
  opts: ConfirmOptions | null;
  _resolve: ((v: boolean) => void) | null;
  confirm: (o: ConfirmOptions) => Promise<boolean>;
  respond: (v: boolean) => void;
}

export const useConfirm = create<ConfirmState>((set, get) => ({
  open: false,
  opts: null,
  _resolve: null,
  confirm: (o) =>
    new Promise<boolean>((resolve) => {
      if (get().open) {
        resolve(false);
        return;
      }
      set({ open: true, opts: o, _resolve: resolve });
    }),
  respond: (v) => {
    get()._resolve?.(v);
    set({ open: false, _resolve: null });
  },
}));

export const confirm = (o: ConfirmOptions) => useConfirm.getState().confirm(o);
