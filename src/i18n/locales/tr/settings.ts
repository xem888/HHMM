const settings = {
  title: "Ayarlar",

  appearance: {
    title: "Görünüm",
    description: "Tema ve görüntü dili.",
    theme: "Tema",
    language: "Dil",
    minimizeToTray: "Kapatırken sistem tepsisine küçült",
    minimizeToTrayHint:
      "Açıkken pencerenin kapat düğmesine tıklamak programdan çıkmak yerine HHMM'yi sistem tepsisine gizler. Yeniden açmak için tepsi simgesine tıklayın, çıkmak için sağ tıklayın.",
  },

  theme: {
    light: "Açık",
    dark: "Koyu",
    system: "Sistem",
  },

  environment: {
    title: "Yollar ve Ortam",
    description: "Oyun konumu ve BepInEx mod yükleyicisi.",
    gamePath: "Oyun yolu",
    gamePathEmpty: "Ayarlanmadı",
    setManually: "Elle ayarla",
    openFolder: "Klasörü aç",
    bepinexStatus: "BepInEx durumu",
    redeploy: "Yeniden dağıt",
    notDetected: "Algılanamadı",
    logs: "Günlük",
    logsHint: "Sorunları teşhis etmeye yardımcı olmak için çalışma günlüğünü görüntüleyin.",
    openLogs: "Günlüğü görüntüle",
  },

  about: {
    title: "Hakkında",
    description: "Uygulama bilgileri ve bağlantılar.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Human Host için bir mod yöneticisi.",
    version: "Sürüm",
    project: "Proje",
    openRepo: "GitHub'da aç",
    checkUpdate: "Güncellemeleri kontrol et",
    updateUnavailable: "Güncelleme kontrolü henüz kullanılamıyor.",
  },

  toast: {
    gamePathSet: "Oyun yolu güncellendi",
    gamePathFailed: "Oyun yolu ayarlanamadı",
    deploying: "BepInEx dağıtılıyor…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx dağıtıldı",
    deployFailed: "BepInEx dağıtılamadı",
    openLogsFailed: "Günlük açılamadı",
  },

  logViewer: {
    title: "Çalışma günlüğü",
    subtitle: "En son etkinlikler (en yeni kayıtlar gösterilir).",
    refresh: "Yenile",
    copy: "Kopyala",
    openFolder: "Klasörü aç",
    clear: "Temizle",
    empty: "Henüz günlük kaydı yok.",
    copied: "Günlük panoya kopyalandı",
    copyFailed: "Günlük kopyalanamadı",
    cleared: "Günlük temizlendi",
    clearFailed: "Günlük temizlenemedi",
    clearConfirmTitle: "Günlük temizlensin mi?",
    clearConfirmBody:
      "Bu, tüm mevcut günlük kayıtlarını kalıcı olarak siler ve geri alınamaz.",
  },

  error: {
    title: "Ayarlar yüklenemedi",
  },
} as const;

export default settings;
