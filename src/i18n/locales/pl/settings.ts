const settings = {
  title: "Ustawienia",

  appearance: {
    title: "Wygląd",
    description: "Motyw i język interfejsu.",
    theme: "Motyw",
    language: "Język",
    minimizeToTray: "Minimalizuj do zasobnika przy zamykaniu",
    minimizeToTrayHint:
      "Gdy włączone, kliknięcie przycisku zamykania okna nie zamyka programu, lecz ukrywa HHMM w zasobniku systemowym. Kliknij ikonę w zasobniku, aby otworzyć ponownie, lub kliknij prawym przyciskiem, aby zakończyć.",
  },
  theme: {
    light: "Jasny",
    dark: "Ciemny",
    system: "Systemowy",
  },

  environment: {
    title: "Ścieżki i środowisko",
    description: "Lokalizacja gry i program ładujący mody BepInEx.",
    gamePath: "Ścieżka do gry",
    gamePathEmpty: "Nie ustawiono",
    setManually: "Ustaw ręcznie",
    openFolder: "Otwórz folder",
    bepinexStatus: "Status BepInEx",
    redeploy: "Wdróż ponownie",
    notDetected: "Nie wykryto",
    logs: "Dziennik",
    logsHint: "Wyświetl dziennik działania, aby ułatwić diagnozowanie problemów.",
    openLogs: "Pokaż dziennik",
  },

  about: {
    title: "O aplikacji",
    description: "Informacje o aplikacji i linki.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Menedżer modów dla Human Host.",
    version: "Wersja",
    project: "Projekt",
    openRepo: "Otwórz na GitHub",
    checkUpdate: "Sprawdź aktualizacje",
    updateUnavailable: "Sprawdzanie aktualizacji nie jest jeszcze dostępne.",
  },

  toast: {
    gamePathSet: "Ścieżka do gry została zaktualizowana",
    gamePathFailed: "Nie udało się ustawić ścieżki do gry",
    deploying: "Wdrażanie BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx został wdrożony",
    deployFailed: "Nie udało się wdrożyć BepInEx",
    openLogsFailed: "Nie udało się otworzyć dziennika",
  },

  logViewer: {
    title: "Dziennik działania",
    subtitle: "Najnowsza aktywność (wyświetlane są ostatnie wpisy).",
    refresh: "Odśwież",
    copy: "Kopiuj",
    openFolder: "Otwórz folder",
    clear: "Wyczyść",
    empty: "Brak wpisów w dzienniku.",
    copied: "Dziennik skopiowano do schowka",
    copyFailed: "Nie udało się skopiować dziennika",
    cleared: "Dziennik wyczyszczony",
    clearFailed: "Nie udało się wyczyścić dziennika",
    clearConfirmTitle: "Wyczyścić dziennik?",
    clearConfirmBody:
      "Spowoduje to trwałe usunięcie wszystkich bieżących wpisów dziennika i nie można tego cofnąć.",
  },

  error: {
    title: "Nie udało się załadować ustawień",
  },
} as const;

export default settings;
