const config = {
  title: "Yapılandırma",
  filesTitle: "Yapılandırma dosyaları",
  noConfig: "Yapılandırma dosyası bulunamadı",
  noConfigHint:
    "Modlar bir kez çalıştırıldıktan ve BepInEx .cfg dosyalarını oluşturduktan sonra yapılandırmalar burada görünür.",

  selectTitle: "Bir yapılandırma dosyası seçin",
  selectHint: "Ayarlarını düzenlemek için soldan bir dosya seçin.",

  loadFailedTitle: "Yapılandırma yüklenemedi",
  loadFailedHint: "Yapılandırma dosyası okunamadı. Yeniden yüklemeyi deneyin.",

  searchPlaceholder: "Ayarlarda ara…",
  noMatch: "Aramanızla eşleşen ayar bulunamadı",

  save: "Kaydet",
  saveWithCount: "Kaydet ({{count}})",
  saveSuccess: "{{count}} değişiklik kaydedildi",
  saveSuccess_other: "{{count}} değişiklik kaydedildi",
  saveFailed: "Yapılandırma kaydedilemedi",

  openFile: "Ham dosyayı aç",
  openFileConfirmTitle: "Ham yapılandırma dosyası açılsın mı?",
  openFileConfirmDesc:
    "Düzenleyicide kaydedilmemiş değişiklikleriniz var. Ham dosyayı doğrudan düzenlemek bunlarla çakışabilir — önce düzenleyicideki değişikliklerinizi kaydedin ya da iptal edin. Yine de açılsın mı?",
  openFileConfirm: "Yine de aç",
  openFileFailed: "Dosya açılamadı",

  resetSection: "Bölümü sıfırla",
  resetSectionTip: "Bu bölümdeki tüm ayarları varsayılan değerlerine sıfırla",
  resetNoDefaults: "Bu bölümde sıfırlanacak varsayılan değer yok",
  resetApplied: "{{count}} ayar varsayılanına sıfırlandı — uygulamak için kaydedin",
  resetApplied_other: "{{count}} ayar varsayılanlarına sıfırlandı — uygulamak için kaydedin",

  defaultLabel: "Varsayılan",
  rangeLabel: "Aralık",
  acceptableLabel: "İzin verilen",
  dynamicCount: "{{count}} öğe",
  dynamicCount_other: "{{count}} öğe",

  pressKey: "Bir tuşa basın…",

  bepinexWarning: {
    title: "Dikkatli düzenleyin",
    description:
      "Bu, bir mod ayarı değil, BepInEx çatısının yapılandırmasıdır. Ne yaptığınızı tam olarak bilmiyorsanız ya da bir mod geliştiricisi belirli bir seçeneği değiştirmenizi açıkça istemediyse hiçbir şeyi değiştirmeyin — hatalar modların yüklenmesini engelleyebilir veya oyunu bozabilir.",
  },
} as const;

export default config;
