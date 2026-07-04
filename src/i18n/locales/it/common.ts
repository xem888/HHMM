const common = {
  ok: "OK",
  cancel: "Annulla",
  save: "Salva",
  create: "Crea",
  apply: "Applica",
  delete: "Elimina",
  search: "Cerca…",
  refresh: "Aggiorna",
  enable: "Abilita",
  disable: "Disabilita",
  browse: "Sfoglia file",
  confirm: "Conferma",
  discard: "Ignora",
  retry: "Riprova",
  reload: "Ricarica",
  close: "Chiudi",
  resetDefaults: "Ripristina predefiniti",

  loading: "Caricamento…",
  success: "Operazione riuscita",
  failed: "Non riuscito",
  enabled: "Abilitato",
  disabled: "Disabilitato",
  upToDate: "Aggiornato",
  yes: "Sì",
  no: "No",

  workshop: "Workshop",
  local: "Locale",

  error: {
    title: "Si è verificato un errore",
    description: "Si è verificato un errore imprevisto. Riprova o ricarica l'app.",
  },

  unsaved: {
    title: "Modifiche non salvate",
    description: "Hai delle modifiche non salvate. Vuoi ignorarle?",
  },
  trayShow: "Mostra HHMM",
  trayQuit: "Esci",
  gameRunningBanner: "Il gioco è in esecuzione — le modifiche ai mod sono sospese. Chiudi prima il gioco.",
  update: {
    checkFailed: "Controllo aggiornamenti non riuscito",
    upToDate: "Hai l'ultima versione",
    available: "Nuova versione {{version}} disponibile",
    install: "Aggiorna ora",
    downloading: "Download aggiornamento…",
    downloadingPct: "Download {{pct}}%",
    installed: "Aggiornamento installato — riavvia per applicare",
    installFailed: "Installazione aggiornamento non riuscita",
  },
} as const;

export default common;
