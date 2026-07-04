const config = {
  title: "Konfiguracja",
  filesTitle: "Pliki konfiguracyjne",
  noConfig: "Nie znaleziono plików konfiguracyjnych",
  noConfigHint:
    "Pliki konfiguracyjne pojawią się tutaj po pierwszym uruchomieniu modów, gdy BepInEx wygeneruje ich pliki .cfg.",

  selectTitle: "Wybierz plik konfiguracyjny",
  selectHint: "Wybierz plik po lewej stronie, aby edytować jego ustawienia.",

  loadFailedTitle: "Nie udało się załadować konfiguracji",
  loadFailedHint: "Nie można odczytać pliku konfiguracyjnego. Spróbuj przeładować.",

  searchPlaceholder: "Szukaj ustawień…",
  noMatch: "Brak ustawień pasujących do wyszukiwania",

  save: "Zapisz",
  saveWithCount: "Zapisz ({{count}})",
  saveSuccess: "Zapisano {{count}} zmianę",
  saveSuccess_other: "Zapisano {{count}} zmiany",
  saveFailed: "Nie udało się zapisać konfiguracji",

  openFile: "Otwórz plik źródłowy",
  openFileConfirmTitle: "Otworzyć źródłowy plik konfiguracyjny?",
  openFileConfirmDesc:
    "Masz niezapisane zmiany w edytorze. Bezpośrednia edycja pliku źródłowego może być z nimi sprzeczna — najpierw zapisz lub odrzuć zmiany w edytorze. Otworzyć mimo to?",
  openFileConfirm: "Otwórz mimo to",
  openFileFailed: "Nie udało się otworzyć pliku",

  resetSection: "Resetuj sekcję",
  resetSectionTip: "Przywróć domyślne wartości wszystkich ustawień w tej sekcji",
  resetNoDefaults: "Ta sekcja nie ma domyślnych wartości do przywrócenia",
  resetApplied: "Przywrócono domyślną wartość {{count}} ustawienia — zapisz, aby zastosować",
  resetApplied_other: "Przywrócono domyślne wartości {{count}} ustawień — zapisz, aby zastosować",

  defaultLabel: "Domyślnie",
  rangeLabel: "Zakres",
  acceptableLabel: "Dozwolone",
  dynamicCount: "{{count}} element",
  dynamicCount_other: "{{count}} elementy",

  pressKey: "Naciśnij klawisz…",

  bepinexWarning: {
    title: "Edytuj ostrożnie",
    description:
      "To jest konfiguracja frameworka BepInEx, a nie ustawienia moda. Nie zmieniaj niczego, chyba że dokładnie wiesz, co robisz, albo autor moda wyraźnie poprosi Cię o zmianę konkretnej opcji — błąd może uniemożliwić wczytanie modów lub uszkodzić grę.",
  },
} as const;

export default config;
