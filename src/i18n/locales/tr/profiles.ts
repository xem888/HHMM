const profiles = {
  title: "Profiller",
  subtitle: "Mod kurulumlarınızı kaydedin ve aralarında geçiş yapın",

  about: {
    title: "Profiller nedir?",
    body: "Bir profil, hangi modları açtığını ve her modun tüm ayarlarını eksiksiz kaydeder. Oyun tarzını tek tıkla değiştirirsin — her şeyi tek tek açıp yeniden ayarlamana gerek kalmaz.",
    createStep: "Oluştur",
    createHint: "Mevcut kurulumuna bir ad ver ve kaydet",
    applyStep: "Uygula",
    applyHint: "Bir profile geri dön — anahtarlar ve ayarlar hepsi geri yüklenir",
    deleteStep: "Sil",
    deleteHint: "Artık ihtiyacın olmayan bir profili kaldır",
  },

  create: {
    placeholder: "Yeni profil adı",
    label: "Profil oluştur",
  },

  modSummary: "{{count}} moddan {{enabled}} tanesi etkin",

  applyConfirm: "Bu profil uygulanacak. Mevcut mod kurulumunun üzerine yazılacak. Devam edilsin mi?",
  applyConfirmDesc: "Yapılandırmaların, kurulu modların ve etkin/devre dışı durumların tam olarak bu profil kaydedildiğindeki haline geri yüklenir — eksik modlar kurulur, fazlalıklar kaldırılır.",
  deleteConfirm: "Bu profil silinecek. Bu işlem geri alınamaz. Emin misiniz?",

  empty: {
    title: "Henüz profil yok",
    description:
      "Mevcut mod kurulumunuzu anlık olarak kaydetmek için bir profil oluşturun, daha sonra istediğiniz zaman geri dönün.",
  },

  toast: {
    created: "\"{{name}}\" profili oluşturuldu",
    createFailed: "Profil oluşturulamadı",
    applied: "\"{{name}}\" profili uygulandı",
    appliedPartial: "\"{{name}}\" profili uygulandı, ancak {{count}} öğe başarısız oldu",
    backupHint: "Bu geçişten önceki kurulumunuz \"__backup__\" profili olarak otomatik kaydedildi — geri almak için onu uygulayın.",
    hideManagerWarn: "Bu profil, zorunlu ayar olan HideManagerGameObject'i kapattı — yeniden açılana kadar hiçbir mod yüklenmez.",
    applyFailed: "Profil uygulanamadı",
    deleted: "\"{{name}}\" profili silindi",
    deleteFailed: "Profil silinemedi",
  },

  loadFailed: "Profiller yüklenemedi",
} as const;

export default profiles;
