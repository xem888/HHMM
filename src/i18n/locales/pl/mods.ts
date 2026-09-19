const mods = {
  title: "Moje mody",
  subtitle: "Zainstalowane mody Human Host",

  import: "Importuj",
  dropOverlay: {
    title: "Upuść, aby zainstalować",
    hint: "Upuść pliki modów .dll lub .zip w dowolnym miejscu, aby zainstalować",
  },
  dropTip: "Przeciągnij plik moda .dll lub .zip w dowolne miejsce, aby go zainstalować — lub użyj przycisku „Importuj” powyżej.",

  searchPlaceholder: "Szukaj po nazwie lub pliku…",

  filter: {
    all: "Wszystkie",
    notInstalled: "Niezainstalowane",
    enabled: "Włączone",
    updatable: "Aktualizacje",
  },

  sort: {
    name: "Nazwa A-Z",
    nameDesc: "Nazwa Z-A",
    newest: "Ostatnio zaktualizowane",
    largest: "Największy rozmiar",
  },

  status: {
    canUpdate: "Aktualizuj",
    upToDate: "Aktualne",
    notInstalled: "Niezainstalowane",
  },

  source: {
    local: "Lokalny",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "nieznana wersja",
    modified: "Zaktualizowano {{time}}",
    unknownTime: "nieznana",
    author: "Autor",
    updatedAt: "Ostatnia aktualizacja",
    publishedAt: "Pierwsza publikacja",
    size: "Rozmiar pliku",
    file: "Plik",
  },

  time: {
    justNow: "przed chwilą",
    minutesAgo: "{{count}} min temu",
    hoursAgo: "{{count}} godz. temu",
    daysAgo: "{{count}} dni temu",
  },

  action: {
    openConfig: "Otwórz konfigurację",
    install: "Zainstaluj",
    update: "Aktualizuj",
    uninstall: "Odinstaluj",
  },

  uninstallConfirm: {
    title: "Odinstalować {{name}}?",
    workshop: "Pliki moda zostaną usunięte z gry. Subskrypcja pozostaje aktywna, więc możesz zainstalować go ponownie w dowolnej chwili.",
    local: "Ten mod został zainstalowany ręcznie, więc HHMM nie ma jego kopii. Pliki zostaną trwale usunięte i nie będzie można ich przywrócić.",
  },

  empty: {
    none: {
      title: "Brak modów",
      description:
        "Przeciągnij plik .dll moda tutaj, zsynchronizuj z Workshop lub przeglądaj pliki, aby zainstalować.",
    },
    noResults: {
      title: "Brak pasujących modów",
      description: "Spróbuj innej frazy lub zmień filtr.",
    },
  },

  error: {
    title: "Nie można załadować modów",
    description: "Wystąpił błąd podczas skanowania zainstalowanych modów.",
  },

  toast: {
    installing: "Instalowanie moda…",
    installed: "Zainstalowano {{name}}",
    installFailed: "Nie udało się zainstalować {{name}}",
    installingOne: "Instalowanie…",
    installedOne: "Zainstalowano {{name}}",
    uninstalling: "Odinstalowywanie…",
    uninstalled: "Odinstalowano {{name}}",
    uninstallFailed: "Nie udało się odinstalować {{name}}",
    updating: "Aktualizowanie…",
    updated: "Zaktualizowano {{name}}",
    updateFailed: "Nie udało się zaktualizować {{name}}",
    syncing: "Synchronizacja modów…",
    synced: "Zsynchronizowano {{count}} mod",
    synced_other: "Zsynchronizowano {{count}} mody",
    syncNothing: "Wszystko jest już aktualne",
    syncPartial: "Zsynchronizowano {{ok}}, {{failed}} nie powiodło się",
    syncFailed: "Synchronizacja nie powiodła się",
    enabled: "Włączono {{name}}",
    disabled: "Wyłączono {{name}}",
    toggleFailed: "Nie udało się przełączyć {{name}}",
  },
} as const;

export default mods;
