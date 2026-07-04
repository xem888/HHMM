const settings = {
  title: "Settings",

  appearance: {
    title: "Appearance",
    description: "Theme and display language.",
    theme: "Theme",
    language: "Language",
    minimizeToTray: "Minimize to tray on close",
    minimizeToTrayHint:
      "When on, clicking the window's close button hides HHMM to the system tray instead of quitting. Click the tray icon to reopen, or right-click it to quit.",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },

  environment: {
    title: "Paths & Environment",
    description: "Game location and the BepInEx mod loader.",
    gamePath: "Game path",
    gamePathEmpty: "Not set",
    setManually: "Set manually",
    openFolder: "Open folder",
    bepinexStatus: "BepInEx status",
    redeploy: "Redeploy",
    notDetected: "Not detected",
    logs: "Logs",
    logsHint: "View the runtime log to help diagnose issues.",
    openLogs: "View logs",
  },

  about: {
    title: "About",
    description: "App information and links.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "A mod manager for Human Host.",
    version: "Version",
    project: "Project",
    openRepo: "Open on GitHub",
    checkUpdate: "Check for updates",
    updateUnavailable: "Update checking is not available yet.",
  },

  toast: {
    gamePathSet: "Game path updated",
    gamePathFailed: "Failed to set game path",
    deploying: "Deploying BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx deployed",
    deployFailed: "Failed to deploy BepInEx",
    openLogsFailed: "Failed to open logs",
  },

  logViewer: {
    title: "Runtime log",
    subtitle: "Most recent activity (latest entries shown).",
    refresh: "Refresh",
    copy: "Copy",
    openFolder: "Open folder",
    clear: "Clear",
    empty: "No log entries yet.",
    copied: "Log copied to clipboard",
    copyFailed: "Failed to copy log",
    cleared: "Log cleared",
    clearFailed: "Failed to clear log",
    clearConfirmTitle: "Clear the log?",
    clearConfirmBody:
      "This permanently removes all current log entries and cannot be undone.",
  },

  error: {
    title: "Failed to load settings",
  },
} as const;

export default settings;
