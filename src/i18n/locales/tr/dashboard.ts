const dashboard = {
  title: "Gösterge Paneli",
  gameRunning: "Oyun çalışıyor",
  gameNotRunning: "Oyun çalışmıyor",

  error: {
    title: "Yüklenemedi",
  },

  gameStatus: "Oyun",
  bepinexStatus: "BepInEx",
  detected: "Algılandı",
  notDetected: "Algılanamadı",
  notSet: "Ayarlanmadı",
  deployBepinex: "BepInEx'i dağıt",

  stats: {
    installed: "Yüklü",
    canInstall: "Yüklenecek",
    canUpdate: "Güncellenebilir",
    enabled: "Etkin",
  },

  modActions: "Mod işlemleri",
  allUpToDate: "Her şey güncel",
  updatable_one: "{{count}} mod güncellenebilir",
  updatable_other: "{{count}} mod güncellenebilir",
  installable_one: "{{count}} yüklenecek",
  installable_other: "{{count}} yüklenecek",
  syncAll: "Tümünü güncelle",
  installAll: "Tümünü yükle",

  launchGame: "Oyunu başlat",
  launching: "Başlatılıyor…",

  footer: {
    game: "OYUN",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} etkin",
  },

  sync: {
    inProgress: "Modlar senkronize ediliyor…",
    success_one: "{{count}} mod senkronize edildi",
    success_other: "{{count}} mod senkronize edildi",
    partial: "{{ok}} senkronize edildi, {{failed}} başarısız",
    failedAll: "Senkronizasyon başarısız",
    nothing: "Senkronize edilecek bir şey yok",
  },

  deploy: {
    inProgress: "BepInEx dağıtılıyor…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx dağıtıldı",
    failed: "BepInEx dağıtımı başarısız",
    phase: {
      download: "İndiriliyor",
      extract: "Çıkarılıyor",
      done: "Tamamlanıyor",
    },
  },

  launch: {
    starting: "Oyun başlatılıyor… (Steam üzerinden, birkaç saniye sürer)",
    started: "Oyun başlatıldı",
    slow: "Komut gönderildi — oyun hâlâ yükleniyor…",
    failed: "Oyun başlatılamadı",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx sürümü çok eski",
      desc: "{{version}} sürümü algılandı; önerilen 5.4.23.2 sürümünden eski. Bazı modlar düzgün çalışmayabilir — 5.4.23.2 sürümünü yüklemeniz önerilir.",
    },
    above: {
      title: "BepInEx sürümü daha yeni",
      desc: "{{version}} sürümü algılandı; önerilen 5.4.23.2 sürümünden yeni. Genellikle sorunsuz çalışır ancak tam olarak test edilmemiştir; bir mod hatalı davranırsa ilgili sürüm için mod yazarının talimatlarını izleyin.",
    },
    incompatible: {
      title: "BepInEx sürümü uyumsuz",
      desc: "{{version}} sürümü algılandı; bu modların hedeflediğinden (BepInEx 5.x) farklı bir ana sürüm. Modlar büyük olasılıkla yüklenemeyecek — lütfen BepInEx 5.4.23.2 sürümünü yükleyin.",
    },
  },

  hideManager: {
    title: "Zorunlu ayar kapalı",
    desc: "Bu oyun, BepInEx.cfg dosyasında HideManagerGameObject = true olmasını gerektirir; aksi hâlde hiçbir BepInEx modu yüklenmez — kurulu görünürler ama oyunda hiçbir etkileri olmaz.",
    descMissing: "BepInEx.cfg henüz yok (normalde oyunu ilk kez açtığınızda oluşturulur). HHMM, zorunlu ayar açık olacak şekilde dosyayı hemen oluşturabilir — önce oyunu başlatmanıza gerek kalmaz.",
    fix: "Düzelt",
    fixed: "Zorunlu ayar etkinleştirildi — oyunu bir sonraki açışınızda geçerli olur",
    fixFailed: "Ayar uygulanamadı",
  },
} as const;

export default dashboard;
