const common = {
  ok: "確定",
  cancel: "取消",
  save: "儲存",
  create: "建立",
  apply: "套用",
  delete: "刪除",
  search: "搜尋…",
  refresh: "重新整理",
  enable: "啟用",
  disable: "停用",
  browse: "瀏覽檔案",
  confirm: "確認",
  discard: "捨棄",
  retry: "重試",
  reload: "重新載入",
  close: "關閉",
  resetDefaults: "還原預設值",

  loading: "載入中…",
  success: "成功",
  failed: "失敗",
  enabled: "已啟用",
  disabled: "已停用",
  upToDate: "已是最新版本",
  yes: "是",
  no: "否",

  workshop: "Workshop",
  local: "本機",

  error: {
    title: "發生錯誤",
    description: "出現未預期的錯誤，請重試或重新載入應用程式。",
  },

  unsaved: {
    title: "尚未儲存的變更",
    description: "您有尚未儲存的變更，確定要捨棄嗎？",
  },
  trayShow: "顯示 HHMM",
  trayQuit: "結束",
  gameRunningBanner: "遊戲執行中,已暫停模組變更。請先關閉遊戲再操作。",
  update: {
    checkFailed: "檢查更新失敗",
    upToDate: "已是最新版本",
    available: "發現新版本 {{version}}",
    install: "立即更新",
    downloading: "正在下載更新…",
    downloadingPct: "下載中 {{pct}}%",
    installed: "更新已安裝,重新啟動後生效",
    installFailed: "更新安裝失敗",
  },
} as const;

export default common;
