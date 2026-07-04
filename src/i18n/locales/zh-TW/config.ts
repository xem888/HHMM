const config = {
  title: "設定檔",
  filesTitle: "設定檔列表",
  noConfig: "找不到設定檔",
  noConfigHint:
    "mod 執行一次後，BepInEx 產生 .cfg 檔案，設定檔才會顯示在此處。",

  selectTitle: "選擇設定檔",
  selectHint: "在左側選擇一個檔案以編輯其設定。",

  loadFailedTitle: "載入設定檔失敗",
  loadFailedHint: "無法讀取設定檔，請嘗試重新載入。",

  searchPlaceholder: "搜尋設定…",
  noMatch: "找不到符合的設定項目",

  save: "儲存",
  saveWithCount: "儲存（{{count}}）",
  saveSuccess: "已儲存 {{count}} 項變更",
  saveSuccess_other: "已儲存 {{count}} 項變更",
  saveFailed: "儲存設定檔失敗",

  openFile: "開啟原始檔案",
  openFileConfirmTitle: "要開啟原始設定檔嗎？",
  openFileConfirmDesc:
    "編輯器中有尚未儲存的變更。直接編輯原始檔案可能與這些變更衝突——請先儲存或捨棄編輯器中的變更。仍要開啟嗎？",
  openFileConfirm: "仍要開啟",
  openFileFailed: "開啟檔案失敗",

  resetSection: "重置區段",
  resetSectionTip: "將此區段所有設定還原為預設值",
  resetNoDefaults: "此區段沒有可還原的預設值",
  resetApplied: "已將 {{count}} 項設定還原為預設值 — 請儲存以套用",
  resetApplied_other: "已將 {{count}} 項設定還原為預設值 — 請儲存以套用",

  defaultLabel: "預設值",
  rangeLabel: "範圍",
  acceptableLabel: "允許值",
  dynamicCount: "{{count}} 個項目",
  dynamicCount_other: "{{count}} 個項目",

  pressKey: "請按下按鍵…",

  bepinexWarning: {
    title: "謹慎修改",
    description:
      "這是 BepInEx 框架的設定檔，不是 mod 設定。請勿隨意更改，除非你清楚自己在做什麼，或 mod 作者明確要求你修改某一項——改錯可能導致 mod 無法載入或遊戲異常。",
  },
} as const;

export default config;
