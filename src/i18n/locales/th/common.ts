const common = {
  ok: "ตกลง",
  cancel: "ยกเลิก",
  save: "บันทึก",
  create: "สร้าง",
  apply: "ใช้งาน",
  delete: "ลบ",
  search: "ค้นหา…",
  refresh: "รีเฟรช",
  enable: "เปิดใช้งาน",
  disable: "ปิดใช้งาน",
  browse: "เลือกไฟล์",
  confirm: "ยืนยัน",
  discard: "ละทิ้ง",
  retry: "ลองใหม่",
  reload: "โหลดใหม่",
  close: "ปิด",
  resetDefaults: "คืนค่าเริ่มต้น",

  loading: "กำลังโหลด…",
  success: "สำเร็จ",
  failed: "ล้มเหลว",
  enabled: "เปิดใช้งาน",
  disabled: "ปิดใช้งาน",
  upToDate: "อัปเดตแล้ว",
  yes: "ใช่",
  no: "ไม่",

  workshop: "Workshop",
  local: "ในเครื่อง",

  error: {
    title: "เกิดข้อผิดพลาด",
    description: "พบข้อผิดพลาดที่ไม่คาดคิด ลองอีกครั้ง หรือโหลดแอปใหม่",
  },

  unsaved: {
    title: "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก",
    description: "คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการละทิ้งหรือไม่?",
  },
  trayShow: "แสดง HHMM",
  trayQuit: "ออก",
  gameRunningBanner: "เกมกำลังทำงาน — หยุดการเปลี่ยนแปลงม็อดชั่วคราว กรุณาปิดเกมก่อน",
  update: {
    checkFailed: "ตรวจสอบการอัปเดตล้มเหลว",
    upToDate: "คุณใช้เวอร์ชันล่าสุดแล้ว",
    available: "มีเวอร์ชันใหม่ {{version}}",
    install: "อัปเดตทันที",
    downloading: "กำลังดาวน์โหลดอัปเดต…",
    downloadingPct: "กำลังดาวน์โหลด {{pct}}%",
    installed: "ติดตั้งอัปเดตแล้ว — รีสตาร์ทเพื่อใช้งาน",
    installFailed: "ติดตั้งอัปเดตล้มเหลว",
  },
} as const;

export default common;
