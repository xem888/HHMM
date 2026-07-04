const common = {
  ok: "OK",
  cancel: "Cancel",
  save: "Save",
  create: "Create",
  apply: "Apply",
  delete: "Delete",
  search: "Search…",
  refresh: "Refresh",
  enable: "Enable",
  disable: "Disable",
  browse: "Browse files",
  confirm: "Confirm",
  discard: "Discard",
  retry: "Retry",
  reload: "Reload",
  close: "Close",
  resetDefaults: "Reset to defaults",

  loading: "Loading…",
  success: "Success",
  failed: "Failed",
  enabled: "Enabled",
  disabled: "Disabled",
  upToDate: "Up to date",
  yes: "Yes",
  no: "No",

  workshop: "Workshop",
  local: "Local",

  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Try again, or reload the app.",
  },

  unsaved: {
    title: "Unsaved changes",
    description: "You have unsaved changes. Discard them?",
  },
  trayShow: "Show HHMM",
  trayQuit: "Quit",
  gameRunningBanner: "Game is running — mod changes are paused. Close the game first.",
  update: {
    checkFailed: "Update check failed",
    upToDate: "You're on the latest version",
    available: "New version {{version}} available",
    install: "Update now",
    downloading: "Downloading update…",
    downloadingPct: "Downloading {{pct}}%",
    installed: "Update installed — restart to apply",
    installFailed: "Update install failed",
  },
} as const;

export default common;
