const dashboard = {
  title: "Dashboard",
  gameRunning: "Game running",
  gameNotRunning: "Game not running",

  error: {
    title: "Failed to load",
  },

  gameStatus: "Game",
  bepinexStatus: "BepInEx",
  detected: "Detected",
  notDetected: "Not detected",
  notSet: "Not set",
  deployBepinex: "Deploy BepInEx",

  stats: {
    installed: "Installed",
    canInstall: "To install",
    canUpdate: "Updatable",
    enabled: "Enabled",
  },

  modActions: "Mod actions",
  allUpToDate: "Everything is up to date",
  updatable_one: "{{count}} mod can be updated",
  updatable_other: "{{count}} mods can be updated",
  installable_one: "{{count}} to install",
  installable_other: "{{count}} to install",
  syncAll: "Update all",
  installAll: "Install all",

  launchGame: "Launch game",
  launching: "Launching…",

  footer: {
    game: "GAME",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} enabled",
  },

  sync: {
    inProgress: "Syncing mods…",
    success_one: "Synced {{count}} mod",
    success_other: "Synced {{count}} mods",
    partial: "Synced {{ok}}, {{failed}} failed",
    failedAll: "Sync failed",
    nothing: "Nothing to sync",
  },

  deploy: {
    inProgress: "Deploying BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx deployed",
    failed: "BepInEx deploy failed",
    phase: {
      download: "Downloading",
      extract: "Extracting",
      done: "Finishing",
    },
  },

  launch: {
    starting: "Launching game… (via Steam, may take a few seconds)",
    started: "Game launched",
    slow: "Launch sent — the game is still loading…",
    failed: "Failed to launch game",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx version is older",
      desc: "Detected {{version}}, older than the recommended 5.4.23.2. Some mods may not work correctly — installing 5.4.23.2 is recommended.",
    },
    above: {
      title: "BepInEx version is newer",
      desc: "Detected {{version}}, newer than the recommended 5.4.23.2. Usually fine, but not fully tested — if a mod misbehaves, follow the mod author's instructions for the matching version.",
    },
    incompatible: {
      title: "BepInEx version is incompatible",
      desc: "Detected {{version}}, a different major version than these mods target (BepInEx 5.x). Mods will most likely fail to load — please install BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Required setting is off",
    desc: "This game needs HideManagerGameObject = true in BepInEx.cfg, or no BepInEx mod will load — they look installed but do nothing in game.",
    descMissing: "BepInEx.cfg doesn't exist yet (it's normally created on first game launch). HHMM can create it now with the required setting — no first launch needed.",
    fix: "Fix",
    fixed: "Required setting enabled — takes effect on the next game launch",
    fixFailed: "Couldn't apply the setting",
  },
} as const;

export default dashboard;
