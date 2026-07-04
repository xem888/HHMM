const profiles = {
  title: "Profile",
  subtitle: "Zapisuj i przełączaj zestawy modów",

  about: {
    title: "Czym są profile?",
    body: "Profil zapisuje kompletną migawkę tego, które mody masz włączone, oraz wszystkich ustawień każdego moda. Zmieniasz styl gry jednym kliknięciem — bez ręcznego przełączania i dostrajania wszystkiego od nowa.",
    createStep: "Utwórz",
    createHint: "Nadaj nazwę obecnej konfiguracji i zapisz ją",
    applyStep: "Zastosuj",
    applyHint: "Wróć do profilu — przełączniki i ustawienia wszystko przywrócone",
    deleteStep: "Usuń",
    deleteHint: "Usuń profil, którego już nie potrzebujesz",
  },

  create: {
    placeholder: "Nazwa nowego profilu",
    label: "Utwórz profil",
  },

  modSummary: "{{enabled}} z {{count}} modów włączonych",

  applyConfirm: "Zastosować ten profil? Bieżący zestaw modów zostanie nadpisany.",
  applyConfirmDesc: "Przywróci konfiguracje, zainstalowane mody oraz stany włączenia/wyłączenia dokładnie do postaci z chwili zapisania tego profilu — brakujące mody zostaną zainstalowane, a zbędne usunięte.",
  deleteConfirm: "Usunąć ten profil? Tej operacji nie można cofnąć.",

  empty: {
    title: "Brak profili",
    description:
      "Utwórz profil, aby zapisać bieżący zestaw modów i móc do niego wrócić w dowolnej chwili.",
  },

  toast: {
    created: "Profil „{{name}}” został utworzony",
    createFailed: "Nie udało się utworzyć profilu",
    applied: "Profil „{{name}}” został zastosowany",
    appliedPartial: "Profil „{{name}}” został zastosowany, ale {{count}} element(y/ów) nie powiodło się",
    backupHint: "Twoja konfiguracja sprzed tego przełączenia została automatycznie zapisana jako profil „__backup__” — zastosuj go, aby cofnąć zmiany.",
    hideManagerWarn: "Ten profil wyłączył wymagane ustawienie HideManagerGameObject — dopóki nie włączysz go ponownie, żadne mody się nie wczytają.",
    applyFailed: "Nie udało się zastosować profilu",
    deleted: "Profil „{{name}}” został usunięty",
    deleteFailed: "Nie udało się usunąć profilu",
  },

  loadFailed: "Nie udało się załadować profili",
} as const;

export default profiles;
