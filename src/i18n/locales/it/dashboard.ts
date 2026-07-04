const dashboard = {
  title: "Dashboard",
  gameRunning: "Gioco in esecuzione",
  gameNotRunning: "Gioco non in esecuzione",

  error: {
    title: "Caricamento non riuscito",
  },

  gameStatus: "Gioco",
  bepinexStatus: "BepInEx",
  detected: "Rilevato",
  notDetected: "Non rilevato",
  notSet: "Non impostato",
  deployBepinex: "Distribuisci BepInEx",

  stats: {
    installed: "Installati",
    canInstall: "Da installare",
    canUpdate: "Aggiornabili",
    enabled: "Abilitati",
  },

  modActions: "Azioni mod",

  allUpToDate: "Tutto è aggiornato",
  updatable_one: "{{count}} mod può essere aggiornato",
  updatable_other: "{{count}} mod possono essere aggiornati",
  installable_one: "{{count}} da installare",
  installable_other: "{{count}} da installare",
  syncAll: "Aggiorna tutto",
  installAll: "Installa tutto",

  launchGame: "Avvia il gioco",
  launching: "Avvio in corso…",

  footer: {
    game: "GIOCO",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} abilitati",
  },

  sync: {
    inProgress: "Sincronizzazione mod…",
    success_one: "{{count}} mod sincronizzato",
    success_other: "{{count}} mod sincronizzati",
    partial: "Sincronizzati {{ok}}, {{failed}} non riusciti",
    failedAll: "Sincronizzazione non riuscita",
    nothing: "Niente da sincronizzare",
  },

  deploy: {
    inProgress: "Distribuzione di BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx distribuito",
    failed: "Distribuzione di BepInEx non riuscita",
    phase: {
      download: "Download",
      extract: "Estrazione",
      done: "Completamento",
    },
  },

  launch: {
    starting: "Avvio del gioco… (tramite Steam, richiede alcuni secondi)",
    started: "Gioco avviato",
    slow: "Comando inviato: il gioco è ancora in caricamento…",
    failed: "Avvio del gioco non riuscito",
  },

  bepinexCompat: {
    below: {
      title: "Versione di BepInEx troppo vecchia",
      desc: "Rilevata la versione {{version}}, precedente a quella consigliata 5.4.23.2. Alcuni mod potrebbero non funzionare correttamente: si consiglia di installare la versione 5.4.23.2.",
    },
    above: {
      title: "Versione di BepInEx più recente",
      desc: "Rilevata la versione {{version}}, successiva a quella consigliata 5.4.23.2. Di solito funziona, ma non è stata testata a fondo; se un mod si comporta in modo anomalo, segui le indicazioni del suo autore per la versione corrispondente.",
    },
    incompatible: {
      title: "Versione di BepInEx incompatibile",
      desc: "Rilevata la versione {{version}}, una versione principale diversa da quella per cui sono pensati questi mod (BepInEx 5.x). Molto probabilmente i mod non riusciranno a caricarsi: installa la versione BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Impostazione obbligatoria disattivata",
    desc: "Questo gioco richiede HideManagerGameObject = true in BepInEx.cfg, altrimenti nessun mod BepInEx verrà caricato: risultano installati, ma in gioco non hanno alcun effetto.",
    descMissing: "BepInEx.cfg non esiste ancora (di norma viene creato al primo avvio del gioco). HHMM può crearlo subito con l'impostazione obbligatoria già attiva — senza dover prima avviare il gioco.",
    fix: "Correggi",
    fixed: "Impostazione obbligatoria attivata — avrà effetto al prossimo avvio del gioco",
    fixFailed: "Impossibile applicare l'impostazione",
  },
} as const;

export default dashboard;
