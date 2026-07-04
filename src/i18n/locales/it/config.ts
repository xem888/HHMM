const config = {
  title: "Config",
  filesTitle: "File di configurazione",
  noConfig: "Nessun file di configurazione trovato",
  noConfigHint:
    "I file di configurazione compaiono qui dopo che i mod vengono eseguiti almeno una volta e BepInEx genera i relativi file .cfg.",

  selectTitle: "Seleziona un file di configurazione",
  selectHint: "Scegli un file a sinistra per modificarne le impostazioni.",

  loadFailedTitle: "Caricamento della config non riuscito",
  loadFailedHint: "Impossibile leggere il file di configurazione. Prova a ricaricare.",

  searchPlaceholder: "Cerca impostazioni…",
  noMatch: "Nessuna impostazione corrisponde alla ricerca",

  save: "Salva",
  saveWithCount: "Salva ({{count}})",
  saveSuccess: "Salvata {{count}} modifica",
  saveSuccess_other: "Salvate {{count}} modifiche",
  saveFailed: "Salvataggio della config non riuscito",

  openFile: "Apri il file grezzo",
  openFileConfirmTitle: "Aprire il file di configurazione grezzo?",
  openFileConfirmDesc:
    "Hai modifiche non salvate nell'editor. Modificare direttamente il file grezzo potrebbe entrare in conflitto con esse — salva o annulla prima le modifiche nell'editor. Aprire comunque?",
  openFileConfirm: "Apri comunque",
  openFileFailed: "Impossibile aprire il file",

  resetSection: "Ripristina sezione",
  resetSectionTip: "Ripristina i valori predefiniti di tutte le impostazioni in questa sezione",
  resetNoDefaults: "Questa sezione non ha valori predefiniti da ripristinare",
  resetApplied: "{{count}} impostazione ripristinata al valore predefinito — Salva per applicare",
  resetApplied_other: "{{count}} impostazioni ripristinate ai valori predefiniti — Salva per applicare",

  defaultLabel: "Predefinito",
  rangeLabel: "Intervallo",
  acceptableLabel: "Consentito",
  dynamicCount: "{{count}} elemento",
  dynamicCount_other: "{{count}} elementi",

  pressKey: "Premi un tasto…",

  bepinexWarning: {
    title: "Modifica con cautela",
    description:
      "Questa è la configurazione del framework BepInEx, non le impostazioni di un mod. Non modificare nulla a meno che tu non sappia esattamente cosa stai facendo, o un autore di mod ti chieda esplicitamente di cambiare una specifica opzione — un errore può impedire il caricamento dei mod o rompere il gioco.",
  },
} as const;

export default config;
