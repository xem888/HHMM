const config = {
  title: "Konfiguration",
  filesTitle: "Konfigurationsdateien",
  noConfig: "Keine Konfigurationsdateien gefunden",
  noConfigHint:
    "Konfigurationen erscheinen hier, nachdem Mods einmal ausgeführt wurden und BepInEx deren .cfg-Dateien generiert hat.",

  selectTitle: "Konfigurationsdatei auswählen",
  selectHint: "Wähle links eine Datei, um ihre Einstellungen zu bearbeiten.",

  loadFailedTitle: "Konfiguration konnte nicht geladen werden",
  loadFailedHint: "Die Konfigurationsdatei konnte nicht gelesen werden. Versuche es erneut zu laden.",

  searchPlaceholder: "Einstellungen suchen…",
  noMatch: "Keine Einstellungen gefunden",

  save: "Speichern",
  saveWithCount: "Speichern ({{count}})",
  saveSuccess: "{{count}} Änderung gespeichert",
  saveSuccess_other: "{{count}} Änderungen gespeichert",
  saveFailed: "Konfiguration konnte nicht gespeichert werden",

  openFile: "Rohdatei öffnen",
  openFileConfirmTitle: "Die rohe Konfigurationsdatei öffnen?",
  openFileConfirmDesc:
    "Du hast ungespeicherte Änderungen im Editor. Das direkte Bearbeiten der Rohdatei kann mit ihnen in Konflikt geraten – speichere oder verwirf zuerst deine Änderungen im Editor. Trotzdem öffnen?",
  openFileConfirm: "Trotzdem öffnen",
  openFileFailed: "Datei konnte nicht geöffnet werden",

  resetSection: "Abschnitt zurücksetzen",
  resetSectionTip: "Alle Einstellungen in diesem Abschnitt auf ihre Standardwerte zurücksetzen",
  resetNoDefaults: "Dieser Abschnitt hat keine Standardwerte zum Zurücksetzen",
  resetApplied: "{{count}} Einstellung zurückgesetzt – Speichern zum Übernehmen",
  resetApplied_other: "{{count}} Einstellungen zurückgesetzt – Speichern zum Übernehmen",

  defaultLabel: "Standard",
  rangeLabel: "Bereich",
  acceptableLabel: "Erlaubt",
  dynamicCount: "{{count}} Eintrag",
  dynamicCount_other: "{{count}} Einträge",

  pressKey: "Taste drücken…",

  bepinexWarning: {
    title: "Mit Vorsicht bearbeiten",
    description:
      "Dies ist die Konfiguration des BepInEx-Frameworks, nicht die Einstellungen eines Mods. Ändere nichts, es sei denn, du weißt genau, was du tust, oder ein Mod-Autor weist dich ausdrücklich an, eine bestimmte Option zu ändern – Fehler können das Laden von Mods verhindern oder das Spiel beschädigen.",
  },
} as const;

export default config;
