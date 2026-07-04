const mods = {
  title: "My Mods",
  subtitle: "Installed Human Host mods",

  import: "Import",
  dropOverlay: {
    title: "Drop to install",
    hint: "Drop .dll or .zip mod files anywhere to install",
  },
  dropTip: "Drag a .dll or .zip mod file anywhere to install it — or use Import above.",

  searchPlaceholder: "Search by name or file…",

  filter: {
    all: "All",
    notInstalled: "Not installed",
    enabled: "Enabled",
    updatable: "Updates",
  },

  sort: {
    name: "Name A-Z",
    nameDesc: "Name Z-A",
    newest: "Recently updated",
    largest: "Largest size",
  },

  status: {
    canUpdate: "Update",
    upToDate: "Up to date",
    notInstalled: "Not installed",
  },

  source: {
    local: "Local",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "unknown version",
    modified: "Updated {{time}}",
    unknownTime: "unknown",
    author: "Author",
    updatedAt: "Last updated",
    publishedAt: "First published",
    size: "File size",
    file: "File",
  },

  time: {
    justNow: "just now",
    minutesAgo: "{{count}} min ago",
    hoursAgo: "{{count}} h ago",
    daysAgo: "{{count}} d ago",
  },

  action: {
    openConfig: "Open config",
    install: "Install",
    update: "Update",
    uninstall: "Uninstall",
  },

  empty: {
    none: {
      title: "No mods yet",
      description:
        "Drag a mod .dll here, sync from the Workshop, or browse for a file to install.",
    },
    noResults: {
      title: "No matching mods",
      description: "Try a different search term or filter.",
    },
  },

  error: {
    title: "Couldn't load mods",
    description: "Something went wrong while scanning installed mods.",
  },

  toast: {
    installing: "Installing mod…",
    installed: "Installed {{name}}",
    installFailed: "Failed to install {{name}}",
    installingOne: "Installing…",
    installedOne: "Installed {{name}}",
    uninstalling: "Uninstalling…",
    uninstalled: "Uninstalled {{name}}",
    uninstallFailed: "Failed to uninstall {{name}}",
    updating: "Updating…",
    updated: "Updated {{name}}",
    updateFailed: "Failed to update {{name}}",
    syncing: "Syncing mods…",
    synced: "Synced {{count}} mod",
    synced_other: "Synced {{count}} mods",
    syncNothing: "Everything is already up to date",
    syncPartial: "Synced {{ok}}, {{failed}} failed",
    syncFailed: "Sync failed",
    enabled: "Enabled {{name}}",
    disabled: "Disabled {{name}}",
    toggleFailed: "Failed to toggle {{name}}",
  },
} as const;

export default mods;
