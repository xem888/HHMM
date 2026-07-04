const mods = {
  title: "Mod ของฉัน",
  subtitle: "Mod Human Host ที่ติดตั้งแล้ว",

  import: "นำเข้า",
  dropOverlay: {
    title: "ปล่อยเพื่อติดตั้ง",
    hint: "ปล่อยไฟล์ mod .dll หรือ .zip ที่ใดก็ได้เพื่อติดตั้ง",
  },
  dropTip: "ลากไฟล์ mod .dll หรือ .zip ไปวางที่ใดก็ได้เพื่อติดตั้ง — หรือใช้ “นำเข้า” ด้านบน",

  searchPlaceholder: "ค้นหาตามชื่อหรือไฟล์…",

  filter: {
    all: "ทั้งหมด",
    notInstalled: "ยังไม่ได้ติดตั้ง",
    enabled: "เปิดใช้งาน",
    updatable: "มีอัปเดต",
  },

  sort: {
    name: "ชื่อ A-Z",
    nameDesc: "ชื่อ Z-A",
    newest: "อัปเดตล่าสุด",
    largest: "ขนาดใหญ่ที่สุด",
  },

  status: {
    canUpdate: "อัปเดต",
    upToDate: "อัปเดตแล้ว",
    notInstalled: "ยังไม่ได้ติดตั้ง",
  },

  source: {
    local: "ในเครื่อง",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "ไม่ทราบเวอร์ชัน",
    modified: "อัปเดต {{time}}",
    unknownTime: "ไม่ทราบเวลา",
    author: "ผู้สร้าง",
    updatedAt: "อัปเดตล่าสุด",
    publishedAt: "เผยแพร่ครั้งแรก",
    size: "ขนาดไฟล์",
    file: "ไฟล์",
  },

  time: {
    justNow: "เมื่อกี้",
    minutesAgo: "{{count}} นาทีที่แล้ว",
    hoursAgo: "{{count}} ชม. ที่แล้ว",
    daysAgo: "{{count}} วันที่แล้ว",
  },

  action: {
    openConfig: "เปิดการตั้งค่า",
    install: "ติดตั้ง",
    update: "อัปเดต",
    uninstall: "ถอนการติดตั้ง",
  },

  empty: {
    none: {
      title: "ยังไม่มี mod",
      description:
        "ลาก .dll ของ mod มาวาง, ซิงค์จาก Workshop หรือเลือกไฟล์เพื่อติดตั้ง",
    },
    noResults: {
      title: "ไม่พบ mod ที่ตรงกัน",
      description: "ลองเปลี่ยนคำค้นหาหรือตัวกรอง",
    },
  },

  error: {
    title: "โหลด mod ไม่สำเร็จ",
    description: "เกิดข้อผิดพลาดขณะสแกน mod ที่ติดตั้ง",
  },

  toast: {
    installing: "กำลังติดตั้ง mod…",
    installed: "ติดตั้ง {{name}} แล้ว",
    installFailed: "ติดตั้ง {{name}} ไม่สำเร็จ",
    installingOne: "กำลังติดตั้ง…",
    installedOne: "ติดตั้ง {{name}} แล้ว",
    uninstalling: "กำลังถอนการติดตั้ง…",
    uninstalled: "ถอนการติดตั้ง {{name}} แล้ว",
    uninstallFailed: "ถอนการติดตั้ง {{name}} ไม่สำเร็จ",
    updating: "กำลังอัปเดต…",
    updated: "อัปเดต {{name}} แล้ว",
    updateFailed: "อัปเดต {{name}} ไม่สำเร็จ",
    syncing: "กำลังซิงค์ mod…",
    synced: "ซิงค์ {{count}} mod แล้ว",
    synced_other: "ซิงค์ {{count}} mod แล้ว",
    syncNothing: "ทุกอย่างอัปเดตแล้ว",
    syncPartial: "ซิงค์สำเร็จ {{ok}}, ล้มเหลว {{failed}} รายการ",
    syncFailed: "ซิงค์ล้มเหลว",
    enabled: "เปิดใช้งาน {{name}} แล้ว",
    disabled: "ปิดใช้งาน {{name}} แล้ว",
    toggleFailed: "สลับสถานะ {{name}} ไม่สำเร็จ",
  },
} as const;

export default mods;
