const mods = {
  title: "Meine Mods",
  subtitle: "Installierte Human Host Mods",

  import: "Importieren",
  dropOverlay: {
    title: "Zum Installieren ablegen",
    hint: "Ziehe .dll- oder .zip-Mod-Dateien an eine beliebige Stelle, um sie zu installieren",
  },
  dropTip: "Ziehe eine .dll- oder .zip-Mod-Datei an eine beliebige Stelle, um sie zu installieren — oder nutze oben „Importieren“.",

  searchPlaceholder: "Nach Name oder Datei suchen…",

  filter: {
    all: "Alle",
    notInstalled: "Nicht installiert",
    enabled: "Aktiviert",
    updatable: "Updates",
  },

  sort: {
    name: "Name A-Z",
    nameDesc: "Name Z-A",
    newest: "Zuletzt aktualisiert",
    largest: "Größte Größe",
  },

  status: {
    canUpdate: "Update",
    upToDate: "Aktuell",
    notInstalled: "Nicht installiert",
  },

  source: {
    local: "Lokal",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "unbekannte Version",
    modified: "Aktualisiert {{time}}",
    unknownTime: "unbekannt",
    author: "Autor",
    updatedAt: "Zuletzt aktualisiert",
    publishedAt: "Erstveröffentlichung",
    size: "Dateigröße",
    file: "Datei",
  },

  time: {
    justNow: "gerade eben",
    minutesAgo: "vor {{count}} Min.",
    hoursAgo: "vor {{count}} Std.",
    daysAgo: "vor {{count}} T.",
  },

  action: {
    openConfig: "Konfiguration öffnen",
    install: "Installieren",
    update: "Aktualisieren",
    uninstall: "Deinstallieren",
  },

  uninstallConfirm: {
    title: "{{name}} deinstallieren?",
    workshop: "Die Dateien werden aus dem Spiel entfernt. Dein Abonnement bleibt bestehen, du kannst die Mod jederzeit wieder installieren.",
    local: "Diese Mod wurde manuell installiert – HHMM besitzt keine Kopie davon. Die Dateien werden endgültig gelöscht und lassen sich nicht wiederherstellen.",
  },

  empty: {
    none: {
      title: "Noch keine Mods",
      description:
        "Ziehe eine .dll hierher, synchronisiere aus dem Workshop oder wähle eine Datei zum Installieren.",
    },
    noResults: {
      title: "Keine passenden Mods",
      description: "Versuche einen anderen Suchbegriff oder Filter.",
    },
  },

  error: {
    title: "Mods konnten nicht geladen werden",
    description: "Beim Scannen der installierten Mods ist ein Fehler aufgetreten.",
  },

  toast: {
    installing: "Mod wird installiert…",
    installed: "{{name}} installiert",
    installFailed: "{{name}} konnte nicht installiert werden",
    installingOne: "Wird installiert…",
    installedOne: "{{name}} installiert",
    uninstalling: "Wird deinstalliert…",
    uninstalled: "{{name}} deinstalliert",
    uninstallFailed: "{{name}} konnte nicht deinstalliert werden",
    updating: "Wird aktualisiert…",
    updated: "{{name}} aktualisiert",
    updateFailed: "{{name}} konnte nicht aktualisiert werden",
    syncing: "Mods werden synchronisiert…",
    synced: "{{count}} Mod synchronisiert",
    synced_other: "{{count}} Mods synchronisiert",
    syncNothing: "Alles ist bereits aktuell",
    syncPartial: "{{ok}} synchronisiert, {{failed}} fehlgeschlagen",
    syncFailed: "Synchronisierung fehlgeschlagen",
    enabled: "{{name}} aktiviert",
    disabled: "{{name}} deaktiviert",
    toggleFailed: "{{name}} konnte nicht umgeschaltet werden",
  },
} as const;

export default mods;
