const settings = {
  title: "ตั้งค่า",

  appearance: {
    title: "รูปลักษณ์",
    description: "ธีมและภาษาที่แสดง",
    theme: "ธีม",
    language: "ภาษา",
    minimizeToTray: "ย่อลงถาดระบบเมื่อปิด",
    minimizeToTrayHint:
      "เมื่อเปิดใช้งาน การคลิกปุ่มปิดของหน้าต่างจะซ่อน HHMM ลงในถาดระบบแทนการออกจากโปรแกรม คลิกที่ไอคอนในถาดเพื่อเปิดอีกครั้ง หรือคลิกขวาเพื่อออก",
  },
  theme: {
    light: "สว่าง",
    dark: "มืด",
    system: "ตามระบบ",
  },

  environment: {
    title: "พาธและสภาพแวดล้อม",
    description: "ตำแหน่งเกมและ BepInEx mod loader",
    gamePath: "พาธเกม",
    gamePathEmpty: "ยังไม่ได้ตั้งค่า",
    setManually: "ตั้งค่าเอง",
    openFolder: "เปิดโฟลเดอร์",
    bepinexStatus: "สถานะ BepInEx",
    redeploy: "ติดตั้งใหม่",
    notDetected: "ไม่พบ",
    logs: "บันทึก",
    logsHint: "ดูบันทึกการทำงานเพื่อช่วยวิเคราะห์ปัญหา",
    openLogs: "ดูบันทึก",
  },

  about: {
    title: "เกี่ยวกับ",
    description: "ข้อมูลแอปและลิงก์",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "โปรแกรมจัดการ mod สำหรับ Human Host",
    version: "เวอร์ชัน",
    project: "โปรเจกต์",
    openRepo: "เปิดบน GitHub",
    checkUpdate: "ตรวจสอบอัปเดต",
    updateUnavailable: "ยังไม่รองรับการตรวจสอบอัปเดต",
  },

  toast: {
    gamePathSet: "อัปเดตพาธเกมแล้ว",
    gamePathFailed: "ตั้งค่าพาธเกมไม่สำเร็จ",
    deploying: "กำลังติดตั้ง BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "ติดตั้ง BepInEx แล้ว",
    deployFailed: "ติดตั้ง BepInEx ไม่สำเร็จ",
    openLogsFailed: "เปิดบันทึกไม่สำเร็จ",
  },

  logViewer: {
    title: "บันทึกการทำงาน",
    subtitle: "กิจกรรมล่าสุด (แสดงเฉพาะรายการล่าสุด)",
    refresh: "รีเฟรช",
    copy: "คัดลอก",
    openFolder: "เปิดโฟลเดอร์",
    clear: "ล้าง",
    empty: "ยังไม่มีรายการบันทึก",
    copied: "คัดลอกบันทึกไปยังคลิปบอร์ดแล้ว",
    copyFailed: "คัดลอกบันทึกไม่สำเร็จ",
    cleared: "ล้างบันทึกแล้ว",
    clearFailed: "ล้างบันทึกไม่สำเร็จ",
    clearConfirmTitle: "ล้างบันทึกหรือไม่?",
    clearConfirmBody:
      "การดำเนินการนี้จะลบรายการบันทึกทั้งหมดอย่างถาวรและไม่สามารถยกเลิกได้",
  },

  error: {
    title: "โหลดการตั้งค่าไม่สำเร็จ",
  },
} as const;

export default settings;
