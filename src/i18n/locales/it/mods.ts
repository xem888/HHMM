const mods = {
  title: "I miei mod",
  subtitle: "Mod Human Host installati",

  import: "Importa",
  dropOverlay: {
    title: "Rilascia per installare",
    hint: "Rilascia file mod .dll o .zip ovunque per installarli",
  },
  dropTip: "Trascina un file mod .dll o .zip ovunque per installarlo — oppure usa « Importa » in alto.",

  searchPlaceholder: "Cerca per nome o file…",

  filter: {
    all: "Tutti",
    notInstalled: "Non installati",
    enabled: "Abilitati",
    updatable: "Aggiornamenti",
  },

  sort: {
    name: "Nome A-Z",
    nameDesc: "Nome Z-A",
    newest: "Aggiornati di recente",
    largest: "Dimensione maggiore",
  },

  status: {
    canUpdate: "Aggiorna",
    upToDate: "Aggiornato",
    notInstalled: "Non installato",
  },

  source: {
    local: "Locale",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "versione sconosciuta",
    modified: "Aggiornato {{time}}",
    unknownTime: "sconosciuto",
    author: "Autore",
    updatedAt: "Ultimo aggiornamento",
    publishedAt: "Prima pubblicazione",
    size: "Dimensione file",
    file: "File",
  },

  time: {
    justNow: "proprio ora",
    minutesAgo: "{{count}} min fa",
    hoursAgo: "{{count}} h fa",
    daysAgo: "{{count}} g fa",
  },

  action: {
    openConfig: "Apri config",
    install: "Installa",
    update: "Aggiorna",
    uninstall: "Disinstalla",
  },

  uninstallConfirm: {
    title: "Disinstallare {{name}}?",
    workshop: "I suoi file verranno rimossi dal gioco. L’iscrizione resta attiva, quindi potrai reinstallarla in qualsiasi momento.",
    local: "Questa mod è stata installata manualmente, quindi HHMM non ne ha una copia. I file verranno eliminati definitivamente e non potranno essere recuperati.",
  },

  empty: {
    none: {
      title: "Nessun mod installato",
      description:
        "Trascina qui un file .dll, sincronizza dal Workshop o sfoglia per installare un file.",
    },
    noResults: {
      title: "Nessun mod trovato",
      description: "Prova con un termine di ricerca o un filtro diverso.",
    },
  },

  error: {
    title: "Impossibile caricare i mod",
    description: "Si è verificato un errore durante la scansione dei mod installati.",
  },

  toast: {
    installing: "Installazione mod…",
    installed: "{{name}} installato",
    installFailed: "Installazione di {{name}} non riuscita",
    installingOne: "Installazione…",
    installedOne: "{{name}} installato",
    uninstalling: "Disinstallazione…",
    uninstalled: "{{name}} disinstallato",
    uninstallFailed: "Disinstallazione di {{name}} non riuscita",
    updating: "Aggiornamento…",
    updated: "{{name}} aggiornato",
    updateFailed: "Aggiornamento di {{name}} non riuscito",
    syncing: "Sincronizzazione mod…",
    synced: "{{count}} mod sincronizzato",
    synced_other: "{{count}} mod sincronizzati",
    syncNothing: "Tutto è già aggiornato",
    syncPartial: "Sincronizzati {{ok}}, {{failed}} non riusciti",
    syncFailed: "Sincronizzazione non riuscita",
    enabled: "{{name}} abilitato",
    disabled: "{{name}} disabilitato",
    toggleFailed: "Modifica di {{name}} non riuscita",
  },
} as const;

export default mods;
