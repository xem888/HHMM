const settings = {
  title: "Einstellungen",

  appearance: {
    title: "Darstellung",
    description: "Design und Anzeigesprache.",
    theme: "Design",
    language: "Sprache",
    minimizeToTray: "Beim Schließen in den Infobereich minimieren",
    minimizeToTrayHint:
      "Wenn aktiviert, blendet ein Klick auf die Schließen-Schaltfläche HHMM in den Infobereich (Systray) aus, statt das Programm zu beenden. Klicke auf das Symbol, um es wieder zu öffnen, oder mache einen Rechtsklick zum Beenden.",
  },

  theme: {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
  },

  environment: {
    title: "Pfade & Umgebung",
    description: "Spielverzeichnis und der BepInEx Mod-Loader.",
    gamePath: "Spielpfad",
    gamePathEmpty: "Nicht festgelegt",
    setManually: "Manuell festlegen",
    openFolder: "Ordner öffnen",
    bepinexStatus: "BepInEx-Status",
    redeploy: "Neu installieren",
    notDetected: "Nicht erkannt",
    logs: "Protokoll",
    logsHint: "Sieh dir das Laufzeitprotokoll an, um Probleme zu diagnostizieren.",
    openLogs: "Protokoll anzeigen",
  },

  about: {
    title: "Über",
    description: "App-Informationen und Links.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Ein Mod-Manager für Human Host.",
    version: "Version",
    project: "Projekt",
    openRepo: "Auf GitHub öffnen",
    checkUpdate: "Auf Updates prüfen",
    updateUnavailable: "Update-Prüfung ist noch nicht verfügbar.",
  },

  toast: {
    gamePathSet: "Spielpfad aktualisiert",
    gamePathFailed: "Spielpfad konnte nicht gesetzt werden",
    deploying: "BepInEx wird installiert…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx installiert",
    deployFailed: "BepInEx konnte nicht installiert werden",
    openLogsFailed: "Protokoll konnte nicht geöffnet werden",
  },

  logViewer: {
    title: "Laufzeitprotokoll",
    subtitle: "Letzte Aktivität (es werden nur die neuesten Einträge angezeigt).",
    refresh: "Aktualisieren",
    copy: "Kopieren",
    openFolder: "Ordner öffnen",
    clear: "Leeren",
    empty: "Noch keine Protokolleinträge.",
    copied: "Protokoll in die Zwischenablage kopiert",
    copyFailed: "Protokoll konnte nicht kopiert werden",
    cleared: "Protokoll geleert",
    clearFailed: "Protokoll konnte nicht geleert werden",
    clearConfirmTitle: "Protokoll leeren?",
    clearConfirmBody:
      "Dadurch werden alle aktuellen Protokolleinträge dauerhaft entfernt; dies kann nicht rückgängig gemacht werden.",
  },

  error: {
    title: "Einstellungen konnten nicht geladen werden",
  },
} as const;

export default settings;
