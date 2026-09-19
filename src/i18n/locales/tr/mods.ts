const mods = {
  title: "Modlarım",
  subtitle: "Yüklü Human Host modları",

  import: "İçe aktar",
  dropOverlay: {
    title: "Yüklemek için bırakın",
    hint: ".dll veya .zip mod dosyalarını yüklemek için herhangi bir yere bırakın",
  },
  dropTip: "Yüklemek için bir .dll veya .zip mod dosyasını herhangi bir yere sürükleyin — ya da yukarıdaki “İçe aktar” düğmesini kullanın.",

  searchPlaceholder: "Ad veya dosyaya göre ara…",

  filter: {
    all: "Tümü",
    notInstalled: "Yüklü değil",
    enabled: "Etkin",
    updatable: "Güncellemeler",
  },

  sort: {
    name: "Ad A-Z",
    nameDesc: "Ad Z-A",
    newest: "Son güncellenenler",
    largest: "En büyük boyut",
  },

  status: {
    canUpdate: "Güncelle",
    upToDate: "Güncel",
    notInstalled: "Yüklü değil",
  },

  source: {
    local: "Yerel",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "sürüm bilinmiyor",
    modified: "{{time}} güncellendi",
    unknownTime: "bilinmiyor",
    author: "Yazar",
    updatedAt: "Son güncelleme",
    publishedAt: "İlk yayınlanma",
    size: "Dosya boyutu",
    file: "Dosya",
  },

  time: {
    justNow: "az önce",
    minutesAgo: "{{count}} dk önce",
    hoursAgo: "{{count}} sa önce",
    daysAgo: "{{count}} gün önce",
  },

  action: {
    openConfig: "Yapılandırmayı aç",
    install: "Yükle",
    update: "Güncelle",
    uninstall: "Kaldır",
  },

  uninstallConfirm: {
    title: "{{name}} kaldırılsın mı?",
    workshop: "Dosyaları oyundan kaldırılacak. Aboneliğin devam eder, istediğin zaman yeniden yükleyebilirsin.",
    local: "Bu mod elle yüklendi, bu yüzden HHMM’de bir kopyası yok. Dosyaları kalıcı olarak silinecek ve geri getirilemeyecek.",
  },

  empty: {
    none: {
      title: "Henüz mod yok",
      description:
        "Bir mod .dll dosyasını buraya sürükleyin, Workshop ile senkronize edin veya yüklemek için dosyaya göz atın.",
    },
    noResults: {
      title: "Eşleşen mod bulunamadı",
      description: "Farklı bir arama terimi veya filtre deneyin.",
    },
  },

  error: {
    title: "Modlar yüklenemedi",
    description: "Yüklü modlar taranırken bir hata oluştu.",
  },

  toast: {
    installing: "Mod yükleniyor…",
    installed: "{{name}} yüklendi",
    installFailed: "{{name}} yüklenemedi",
    installingOne: "Yükleniyor…",
    installedOne: "{{name}} yüklendi",
    uninstalling: "Kaldırılıyor…",
    uninstalled: "{{name}} kaldırıldı",
    uninstallFailed: "{{name}} kaldırılamadı",
    updating: "Güncelleniyor…",
    updated: "{{name}} güncellendi",
    updateFailed: "{{name}} güncellenemedi",
    syncing: "Modlar senkronize ediliyor…",
    synced: "{{count}} mod senkronize edildi",
    synced_other: "{{count}} mod senkronize edildi",
    syncNothing: "Her şey zaten güncel",
    syncPartial: "{{ok}} senkronize edildi, {{failed}} başarısız",
    syncFailed: "Senkronizasyon başarısız",
    enabled: "{{name}} etkinleştirildi",
    disabled: "{{name}} devre dışı bırakıldı",
    toggleFailed: "{{name}} durumu değiştirilemedi",
  },
} as const;

export default mods;
