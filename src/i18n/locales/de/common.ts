const common = {
  ok: "OK",
  cancel: "Abbrechen",
  save: "Speichern",
  create: "Erstellen",
  apply: "Anwenden",
  delete: "Löschen",
  search: "Suchen…",
  refresh: "Aktualisieren",
  enable: "Aktivieren",
  disable: "Deaktivieren",
  browse: "Dateien durchsuchen",
  confirm: "Bestätigen",
  discard: "Verwerfen",
  retry: "Erneut versuchen",
  reload: "Neu laden",
  close: "Schließen",
  resetDefaults: "Standardwerte wiederherstellen",

  loading: "Wird geladen…",
  success: "Erfolgreich",
  failed: "Fehlgeschlagen",
  enabled: "Aktiviert",
  disabled: "Deaktiviert",
  upToDate: "Aktuell",
  yes: "Ja",
  no: "Nein",

  workshop: "Workshop",
  local: "Lokal",

  error: {
    title: "Etwas ist schiefgelaufen",
    description: "Ein unerwarteter Fehler ist aufgetreten. Versuche es erneut oder lade die App neu.",
  },

  unsaved: {
    title: "Nicht gespeicherte Änderungen",
    description: "Du hast nicht gespeicherte Änderungen. Wirklich verwerfen?",
  },
  trayShow: "HHMM anzeigen",
  trayQuit: "Beenden",
  gameRunningBanner: "Das Spiel läuft – Mod-Änderungen sind pausiert. Beende zuerst das Spiel.",
  update: {
    checkFailed: "Updateprüfung fehlgeschlagen",
    upToDate: "Du hast die neueste Version",
    available: "Neue Version {{version}} verfügbar",
    install: "Jetzt aktualisieren",
    downloading: "Update wird heruntergeladen…",
    downloadingPct: "Lädt {{pct}}%",
    installed: "Update installiert – zum Anwenden neu starten",
    installFailed: "Update-Installation fehlgeschlagen",
  },
} as const;

export default common;
