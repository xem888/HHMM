const settings = {
  title: "Impostazioni",

  appearance: {
    title: "Aspetto",
    description: "Tema e lingua dell'interfaccia.",
    theme: "Tema",
    language: "Lingua",
    minimizeToTray: "Riduci a icona nell'area di notifica alla chiusura",
    minimizeToTrayHint:
      "Quando è attivo, fare clic sul pulsante di chiusura della finestra nasconde HHMM nell'area di notifica invece di uscire. Fai clic sull'icona per riaprirlo, o clic destro per uscire.",
  },

  theme: {
    light: "Chiaro",
    dark: "Scuro",
    system: "Sistema",
  },

  environment: {
    title: "Percorsi e ambiente",
    description: "Posizione del gioco e mod loader BepInEx.",
    gamePath: "Percorso del gioco",
    gamePathEmpty: "Non impostato",
    setManually: "Imposta manualmente",
    openFolder: "Apri cartella",
    bepinexStatus: "Stato BepInEx",
    redeploy: "Ridistribuisci",
    notDetected: "Non rilevato",
    logs: "Log",
    logsHint: "Consulta il log di esecuzione per aiutare a diagnosticare i problemi.",
    openLogs: "Visualizza i log",
  },

  about: {
    title: "Informazioni",
    description: "Informazioni sull'app e collegamenti.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Un mod manager per Human Host.",
    version: "Versione",
    project: "Progetto",
    openRepo: "Apri su GitHub",
    checkUpdate: "Controlla aggiornamenti",
    updateUnavailable: "Il controllo degli aggiornamenti non è ancora disponibile.",
  },

  toast: {
    gamePathSet: "Percorso del gioco aggiornato",
    gamePathFailed: "Impostazione del percorso del gioco non riuscita",
    deploying: "Distribuzione di BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx distribuito",
    deployFailed: "Distribuzione di BepInEx non riuscita",
    openLogsFailed: "Apertura dei log non riuscita",
  },

  logViewer: {
    title: "Log di esecuzione",
    subtitle: "Attività recente (vengono mostrate solo le voci più recenti).",
    refresh: "Aggiorna",
    copy: "Copia",
    openFolder: "Apri cartella",
    clear: "Cancella",
    empty: "Nessuna voce di log al momento.",
    copied: "Log copiato negli appunti",
    copyFailed: "Copia del log non riuscita",
    cleared: "Log cancellato",
    clearFailed: "Cancellazione del log non riuscita",
    clearConfirmTitle: "Cancellare il log?",
    clearConfirmBody:
      "Questa azione rimuove definitivamente tutte le voci attuali del log e non può essere annullata.",
  },

  error: {
    title: "Caricamento delle impostazioni non riuscito",
  },
} as const;

export default settings;
