const config = {
  title: "Config",
  filesTitle: "ไฟล์ Config",
  noConfig: "ไม่พบไฟล์ config",
  noConfigHint:
    "ไฟล์ config จะปรากฏที่นี่หลังจาก mod ทำงานครั้งแรกและ BepInEx สร้างไฟล์ .cfg แล้ว",

  selectTitle: "เลือกไฟล์ config",
  selectHint: "เลือกไฟล์ทางด้านซ้ายเพื่อแก้ไขการตั้งค่า",

  loadFailedTitle: "โหลด config ไม่สำเร็จ",
  loadFailedHint: "ไม่สามารถอ่านไฟล์ config ได้ ลองโหลดใหม่",

  searchPlaceholder: "ค้นหาการตั้งค่า…",
  noMatch: "ไม่พบการตั้งค่าที่ตรงกัน",

  save: "บันทึก",
  saveWithCount: "บันทึก ({{count}})",
  saveSuccess: "บันทึก {{count}} รายการแล้ว",
  saveSuccess_other: "บันทึก {{count}} รายการแล้ว",
  saveFailed: "บันทึก config ไม่สำเร็จ",

  openFile: "เปิดไฟล์ต้นฉบับ",
  openFileConfirmTitle: "เปิดไฟล์ config ต้นฉบับหรือไม่？",
  openFileConfirmDesc:
    "คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึกในตัวแก้ไข การแก้ไขไฟล์ต้นฉบับโดยตรงอาจขัดแย้งกับการเปลี่ยนแปลงเหล่านั้น — โปรดบันทึกหรือยกเลิกการเปลี่ยนแปลงในตัวแก้ไขก่อน ยังต้องการเปิดอยู่หรือไม่？",
  openFileConfirm: "ยืนยันการเปิด",
  openFileFailed: "เปิดไฟล์ไม่สำเร็จ",

  resetSection: "รีเซ็ตส่วนนี้",
  resetSectionTip: "คืนค่าเริ่มต้นให้กับการตั้งค่าทั้งหมดในส่วนนี้",
  resetNoDefaults: "ส่วนนี้ไม่มีค่าเริ่มต้นให้รีเซ็ต",
  resetApplied: "รีเซ็ต {{count}} รายการเป็นค่าเริ่มต้นแล้ว — บันทึกเพื่อใช้งาน",
  resetApplied_other: "รีเซ็ต {{count}} รายการเป็นค่าเริ่มต้นแล้ว — บันทึกเพื่อใช้งาน",

  defaultLabel: "ค่าเริ่มต้น",
  rangeLabel: "ช่วงค่า",
  acceptableLabel: "ค่าที่อนุญาต",
  dynamicCount: "{{count}} รายการ",
  dynamicCount_other: "{{count}} รายการ",

  pressKey: "กดปุ่มที่ต้องการ…",

  bepinexWarning: {
    title: "แก้ไขด้วยความระมัดระวัง",
    description:
      "นี่คือไฟล์ตั้งค่าของเฟรมเวิร์ก BepInEx ไม่ใช่การตั้งค่าของ mod อย่าเปลี่ยนแปลงสิ่งใดเว้นแต่คุณจะเข้าใจอย่างชัดเจนว่ากำลังทำอะไรอยู่ หรือผู้สร้าง mod ระบุให้คุณแก้ไขรายการใดรายการหนึ่งโดยเฉพาะ — การแก้ไขผิดอาจทำให้โหลด mod ไม่ได้หรือเกมทำงานผิดปกติ",
  },
} as const;

export default config;
