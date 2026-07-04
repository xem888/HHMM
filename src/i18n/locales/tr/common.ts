const common = {
  ok: "Tamam",
  cancel: "İptal",
  save: "Kaydet",
  create: "Oluştur",
  apply: "Uygula",
  delete: "Sil",
  search: "Ara…",
  refresh: "Yenile",
  enable: "Etkinleştir",
  disable: "Devre dışı bırak",
  browse: "Dosyalara göz at",
  confirm: "Onayla",
  discard: "Vazgeç",
  retry: "Tekrar dene",
  reload: "Yeniden yükle",
  close: "Kapat",
  resetDefaults: "Varsayılanlara sıfırla",

  loading: "Yükleniyor…",
  success: "Başarılı",
  failed: "Başarısız",
  enabled: "Etkin",
  disabled: "Devre dışı",
  upToDate: "Güncel",
  yes: "Evet",
  no: "Hayır",

  workshop: "Workshop",
  local: "Yerel",

  error: {
    title: "Bir şeyler yanlış gitti",
    description: "Beklenmedik bir hata oluştu. Tekrar deneyin veya uygulamayı yeniden yükleyin.",
  },

  unsaved: {
    title: "Kaydedilmemiş değişiklikler",
    description: "Kaydedilmemiş değişiklikleriniz var. Vazgeçilsin mi?",
  },
  trayShow: "HHMM'yi göster",
  trayQuit: "Çıkış",
  gameRunningBanner: "Oyun çalışıyor — mod değişiklikleri duraklatıldı. Önce oyunu kapatın.",
  update: {
    checkFailed: "Güncelleme kontrolü başarısız",
    upToDate: "En son sürümü kullanıyorsun",
    available: "Yeni sürüm {{version}} mevcut",
    install: "Şimdi güncelle",
    downloading: "Güncelleme indiriliyor…",
    downloadingPct: "İndiriliyor {{pct}}%",
    installed: "Güncelleme yüklendi — uygulamak için yeniden başlat",
    installFailed: "Güncelleme yüklenemedi",
  },
} as const;

export default common;
