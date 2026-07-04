const dashboard = {
  title: "Panel główny",
  gameRunning: "Gra uruchomiona",
  gameNotRunning: "Gra nie jest uruchomiona",

  error: {
    title: "Nie udało się załadować",
  },

  gameStatus: "Gra",
  bepinexStatus: "BepInEx",
  detected: "Wykryto",
  notDetected: "Nie wykryto",
  notSet: "Nie ustawiono",
  deployBepinex: "Wdróż BepInEx",

  stats: {
    installed: "Zainstalowane",
    canInstall: "Do zainstalowania",
    canUpdate: "Do aktualizacji",
    enabled: "Włączone",
  },

  modActions: "Akcje modów",
  allUpToDate: "Wszystko jest aktualne",
  updatable_one: "{{count}} mod można zaktualizować",
  updatable_few: "{{count}} mody można zaktualizować",
  updatable_many: "{{count}} modów można zaktualizować",
  updatable_other: "{{count}} moda można zaktualizować",
  installable_one: "{{count}} do zainstalowania",
  installable_few: "{{count}} do zainstalowania",
  installable_many: "{{count}} do zainstalowania",
  installable_other: "{{count}} do zainstalowania",
  syncAll: "Zaktualizuj wszystkie",
  installAll: "Zainstaluj wszystkie",

  launchGame: "Uruchom grę",
  launching: "Uruchamianie…",

  footer: {
    game: "GRA",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} włączonych",
  },

  sync: {
    inProgress: "Synchronizacja modów…",
    success_one: "Zsynchronizowano {{count}} mod",
    success_few: "Zsynchronizowano {{count}} mody",
    success_many: "Zsynchronizowano {{count}} modów",
    success_other: "Zsynchronizowano {{count}} moda",
    partial: "Zsynchronizowano {{ok}}, {{failed}} nie powiodło się",
    failedAll: "Synchronizacja nie powiodła się",
    nothing: "Nie ma nic do synchronizacji",
  },

  deploy: {
    inProgress: "Wdrażanie BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx został wdrożony",
    failed: "Wdrożenie BepInEx nie powiodło się",
    phase: {
      download: "Pobieranie",
      extract: "Rozpakowywanie",
      done: "Kończenie",
    },
  },

  launch: {
    starting: "Uruchamianie gry… (przez Steam, zajmie kilka sekund)",
    started: "Gra uruchomiona",
    slow: "Wysłano polecenie — gra wciąż się ładuje…",
    failed: "Nie udało się uruchomić gry",
  },

  bepinexCompat: {
    below: {
      title: "Starsza wersja BepInEx",
      desc: "Wykryto {{version}}, starszą niż zalecana 5.4.23.2. Niektóre mody mogą nie działać poprawnie — zalecamy zainstalowanie wersji 5.4.23.2.",
    },
    above: {
      title: "Nowsza wersja BepInEx",
      desc: "Wykryto {{version}}, nowszą niż zalecana 5.4.23.2. Zwykle działa bez problemów, ale nie została w pełni przetestowana — jeśli któryś mod sprawia kłopoty, postępuj zgodnie z instrukcjami autora moda dotyczącymi odpowiedniej wersji.",
    },
    incompatible: {
      title: "Wersja BepInEx jest niezgodna",
      desc: "Wykryto {{version}} — inną wersję główną niż ta, na którą przeznaczone są te mody (BepInEx 5.x). Mody najprawdopodobniej nie zostaną wczytane — zainstaluj BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Wymagane ustawienie jest wyłączone",
    desc: "Ta gra wymaga HideManagerGameObject = true w pliku BepInEx.cfg — w przeciwnym razie żaden mod BepInEx się nie wczyta. Wyglądają na zainstalowane, ale w grze nic nie robią.",
    descMissing: "Plik BepInEx.cfg jeszcze nie istnieje (zwykle powstaje przy pierwszym uruchomieniu gry). HHMM może utworzyć go teraz z włączonym wymaganym ustawieniem — bez potrzeby wcześniejszego uruchamiania gry.",
    fix: "Napraw",
    fixed: "Wymagane ustawienie włączone — zadziała przy następnym uruchomieniu gry",
    fixFailed: "Nie udało się zastosować ustawienia",
  },
} as const;

export default dashboard;
