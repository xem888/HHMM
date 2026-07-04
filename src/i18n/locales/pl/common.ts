const common = {
  ok: "OK",
  cancel: "Anuluj",
  save: "Zapisz",
  create: "Utwórz",
  apply: "Zastosuj",
  delete: "Usuń",
  search: "Szukaj…",
  refresh: "Odśwież",
  enable: "Włącz",
  disable: "Wyłącz",
  browse: "Przeglądaj pliki",
  confirm: "Potwierdź",
  discard: "Odrzuć",
  retry: "Spróbuj ponownie",
  reload: "Przeładuj",
  close: "Zamknij",
  resetDefaults: "Przywróć domyślne",

  loading: "Ładowanie…",
  success: "Sukces",
  failed: "Błąd",
  enabled: "Włączony",
  disabled: "Wyłączony",
  upToDate: "Aktualne",
  yes: "Tak",
  no: "Nie",

  workshop: "Workshop",
  local: "Lokalny",

  error: {
    title: "Coś poszło nie tak",
    description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub przeładuj aplikację.",
  },

  unsaved: {
    title: "Niezapisane zmiany",
    description: "Masz niezapisane zmiany. Odrzucić je?",
  },
  trayShow: "Pokaż HHMM",
  trayQuit: "Zakończ",
  gameRunningBanner: "Gra jest uruchomiona — zmiany modów wstrzymane. Najpierw zamknij grę.",
  update: {
    checkFailed: "Sprawdzanie aktualizacji nie powiodło się",
    upToDate: "Masz najnowszą wersję",
    available: "Dostępna nowa wersja {{version}}",
    install: "Aktualizuj teraz",
    downloading: "Pobieranie aktualizacji…",
    downloadingPct: "Pobieranie {{pct}}%",
    installed: "Zainstalowano aktualizację — uruchom ponownie",
    installFailed: "Instalacja aktualizacji nie powiodła się",
  },
} as const;

export default common;
