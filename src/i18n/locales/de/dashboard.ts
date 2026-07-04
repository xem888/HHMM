const dashboard = {
  title: "Übersicht",
  gameRunning: "Spiel läuft",
  gameNotRunning: "Spiel läuft nicht",

  error: {
    title: "Laden fehlgeschlagen",
  },

  gameStatus: "Spiel",
  bepinexStatus: "BepInEx",
  detected: "Erkannt",
  notDetected: "Nicht erkannt",
  notSet: "Nicht festgelegt",
  deployBepinex: "BepInEx installieren",

  stats: {
    installed: "Installiert",
    canInstall: "Zu installieren",
    canUpdate: "Aktualisierbar",
    enabled: "Aktiviert",
  },

  modActions: "Mod-Aktionen",

  allUpToDate: "Alles ist aktuell",
  updatable_one: "{{count}} Mod kann aktualisiert werden",
  updatable_other: "{{count}} Mods können aktualisiert werden",
  installable_one: "{{count}} zu installieren",
  installable_other: "{{count}} zu installieren",
  syncAll: "Alle aktualisieren",
  installAll: "Alle installieren",

  launchGame: "Spiel starten",
  launching: "Wird gestartet…",

  footer: {
    game: "SPIEL",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} aktiviert",
  },

  sync: {
    inProgress: "Mods werden synchronisiert…",
    success_one: "{{count}} Mod synchronisiert",
    success_other: "{{count}} Mods synchronisiert",
    partial: "{{ok}} synchronisiert, {{failed}} fehlgeschlagen",
    failedAll: "Synchronisierung fehlgeschlagen",
    nothing: "Nichts zu synchronisieren",
  },

  deploy: {
    inProgress: "BepInEx wird installiert…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx installiert",
    failed: "BepInEx-Installation fehlgeschlagen",
    phase: {
      download: "Wird heruntergeladen",
      extract: "Wird entpackt",
      done: "Wird abgeschlossen",
    },
  },

  launch: {
    starting: "Spiel wird gestartet… (über Steam, dauert einige Sekunden)",
    started: "Spiel gestartet",
    slow: "Startbefehl gesendet – das Spiel lädt noch…",
    failed: "Spiel konnte nicht gestartet werden",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx-Version ist zu alt",
      desc: "Version {{version}} erkannt, älter als die empfohlene Version 5.4.23.2. Einige Mods funktionieren möglicherweise nicht richtig – die Installation von Version 5.4.23.2 wird empfohlen.",
    },
    above: {
      title: "BepInEx-Version ist neuer",
      desc: "Version {{version}} erkannt, neuer als die empfohlene Version 5.4.23.2. Meist unproblematisch, aber nicht vollständig getestet; falls sich ein Mod fehlerhaft verhält, befolge die Anweisungen des Mod-Autors für die passende Version.",
    },
    incompatible: {
      title: "BepInEx-Version ist inkompatibel",
      desc: "Version {{version}} erkannt – eine andere Hauptversion als die, für die diese Mods ausgelegt sind (BepInEx 5.x). Die Mods werden höchstwahrscheinlich nicht geladen – bitte installiere BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Pflichteinstellung ist deaktiviert",
    desc: "Dieses Spiel benötigt HideManagerGameObject = true in der BepInEx.cfg, sonst wird kein einziger BepInEx-Mod geladen – sie wirken installiert, haben im Spiel aber keinerlei Effekt.",
    descMissing: "Die BepInEx.cfg existiert noch nicht (sie wird normalerweise beim ersten Spielstart erstellt). HHMM kann sie jetzt gleich mit der Pflichteinstellung anlegen – ein vorheriger Spielstart ist nicht nötig.",
    fix: "Beheben",
    fixed: "Pflichteinstellung aktiviert – wirksam ab dem nächsten Spielstart",
    fixFailed: "Einstellung konnte nicht angewendet werden",
  },
} as const;

export default dashboard;
