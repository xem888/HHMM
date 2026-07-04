const config = {
  title: "Config",
  filesTitle: "Config files",
  noConfig: "No config files found",
  noConfigHint:
    "Configs appear here after mods run once and BepInEx generates their .cfg files.",

  selectTitle: "Select a config file",
  selectHint: "Pick a file on the left to edit its settings.",

  loadFailedTitle: "Failed to load config",
  loadFailedHint: "The config file could not be read. Try reloading.",

  searchPlaceholder: "Search settings…",
  noMatch: "No settings match your search",

  save: "Save",
  saveWithCount: "Save ({{count}})",
  saveSuccess: "Saved {{count}} change",
  saveSuccess_other: "Saved {{count}} changes",
  saveFailed: "Failed to save config",

  openFile: "Open raw file",
  openFileConfirmTitle: "Open the raw config file?",
  openFileConfirmDesc:
    "You have unsaved changes in the editor. Editing the raw file directly may conflict with them — save or discard your editor changes first. Open anyway?",
  openFileConfirm: "Open anyway",
  openFileFailed: "Failed to open file",

  resetSection: "Reset section",
  resetSectionTip: "Reset all settings in this section to their default values",
  resetNoDefaults: "This section has no default values to reset",
  resetApplied: "Reset {{count}} setting to its default — Save to apply",
  resetApplied_other: "Reset {{count}} settings to their defaults — Save to apply",

  defaultLabel: "Default",
  rangeLabel: "Range",
  acceptableLabel: "Allowed",
  dynamicCount: "{{count}} item",
  dynamicCount_other: "{{count}} items",

  pressKey: "Press a key…",

  bepinexWarning: {
    title: "Edit with caution",
    description:
      "This is the BepInEx framework config, not mod settings. Don't change anything unless you know what you're doing, or a mod author explicitly tells you to change a specific option — mistakes can stop mods from loading or break the game.",
  },
} as const;

export default config;
