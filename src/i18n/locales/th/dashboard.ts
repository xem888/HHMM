const dashboard = {
  title: "แดชบอร์ด",
  gameRunning: "เกมกำลังทำงาน",
  gameNotRunning: "เกมไม่ได้ทำงาน",

  error: {
    title: "โหลดไม่สำเร็จ",
  },

  gameStatus: "เกม",
  bepinexStatus: "BepInEx",
  detected: "พบแล้ว",
  notDetected: "ไม่พบ",
  notSet: "ยังไม่ได้ตั้งค่า",
  deployBepinex: "ติดตั้ง BepInEx",

  stats: {
    installed: "ติดตั้งแล้ว",
    canInstall: "ติดตั้งได้",
    canUpdate: "มีอัปเดต",
    enabled: "เปิดใช้งาน",
  },

  modActions: "การดำเนินการกับม็อด",

  allUpToDate: "ทุกอย่างอัปเดตแล้ว",
  updatable_one: "{{count}} mod สามารถอัปเดตได้",
  updatable_other: "{{count}} mod สามารถอัปเดตได้",
  installable_one: "{{count}} ติดตั้งได้",
  installable_other: "{{count}} ติดตั้งได้",
  syncAll: "อัปเดตทั้งหมด",
  installAll: "ติดตั้งทั้งหมด",

  launchGame: "เปิดเกม",
  launching: "กำลังเปิด…",

  footer: {
    game: "GAME",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "เปิดใช้งาน {{enabled}}/{{total}}",
  },

  sync: {
    inProgress: "กำลังซิงค์ mod…",
    success_one: "ซิงค์ {{count}} mod แล้ว",
    success_other: "ซิงค์ {{count}} mod แล้ว",
    partial: "ซิงค์สำเร็จ {{ok}}, ล้มเหลว {{failed}} รายการ",
    failedAll: "ซิงค์ล้มเหลว",
    nothing: "ไม่มีอะไรต้องซิงค์",
  },

  deploy: {
    inProgress: "กำลังติดตั้ง BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "ติดตั้ง BepInEx แล้ว",
    failed: "ติดตั้ง BepInEx ล้มเหลว",
    phase: {
      download: "กำลังดาวน์โหลด",
      extract: "กำลังแตกไฟล์",
      done: "กำลังเสร็จสิ้น",
    },
  },

  launch: {
    starting: "กำลังเปิดเกม… (ผ่าน Steam ใช้เวลาสองสามวินาที)",
    started: "เปิดเกมแล้ว",
    slow: "ส่งคำสั่งแล้ว — เกมกำลังโหลดอยู่…",
    failed: "เปิดเกมไม่สำเร็จ",
  },

  bepinexCompat: {
    below: {
      title: "เวอร์ชัน BepInEx เก่ากว่าที่แนะนำ",
      desc: "ตรวจพบ {{version}} ซึ่งเก่ากว่าเวอร์ชันที่แนะนำ 5.4.23.2 ม็อดบางตัวอาจทำงานไม่ถูกต้อง — แนะนำให้ติดตั้ง 5.4.23.2",
    },
    above: {
      title: "เวอร์ชัน BepInEx ใหม่กว่าที่แนะนำ",
      desc: "ตรวจพบ {{version}} ซึ่งใหม่กว่าเวอร์ชันที่แนะนำ 5.4.23.2 โดยทั่วไปใช้งานได้ แต่ยังไม่ได้ทดสอบอย่างครบถ้วน — หากม็อดทำงานผิดปกติ โปรดทำตามคำแนะนำของผู้สร้างม็อดเพื่อติดตั้งเวอร์ชันที่ตรงกัน",
    },
    incompatible: {
      title: "เวอร์ชัน BepInEx ไม่เข้ากัน",
      desc: "ตรวจพบ {{version}} ซึ่งเป็นเวอร์ชันหลักที่ต่างจากที่ม็อดเหล่านี้รองรับ (BepInEx 5.x) ม็อดมีแนวโน้มสูงมากที่จะโหลดไม่สำเร็จ — โปรดติดตั้ง BepInEx 5.4.23.2",
    },
  },

  hideManager: {
    title: "การตั้งค่าที่จำเป็นถูกปิดอยู่",
    desc: "เกมนี้ต้องตั้ง HideManagerGameObject = true ใน BepInEx.cfg ไม่เช่นนั้นจะไม่มี mod ของ BepInEx ตัวใดถูกโหลดเลย — ดูเหมือนติดตั้งแล้วแต่ไม่ทำงานใด ๆ ในเกม",
    descMissing: "ยังไม่มีไฟล์ BepInEx.cfg (ปกติจะถูกสร้างเมื่อเปิดเกมครั้งแรก) HHMM สามารถสร้างให้เดี๋ยวนี้พร้อมเปิดการตั้งค่าที่จำเป็นไว้ให้เลย — ไม่ต้องเปิดเกมก่อน",
    fix: "แก้ไข",
    fixed: "เปิดการตั้งค่าที่จำเป็นแล้ว — จะมีผลเมื่อเปิดเกมครั้งถัดไป",
    fixFailed: "ใช้การตั้งค่าไม่สำเร็จ",
  },
} as const;

export default dashboard;
