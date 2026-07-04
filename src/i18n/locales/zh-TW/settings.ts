const settings = {
  title: "設定",

  appearance: {
    title: "外觀",
    description: "主題與顯示語言。",
    theme: "主題",
    language: "語言",
    minimizeToTray: "關閉時最小化到系統匣",
    minimizeToTrayHint:
      "開啟後,點視窗的關閉按鈕不會結束程式,而是縮到系統匣(右下角圖示);點系統匣圖示可重新開啟,右鍵系統匣可結束程式。",
  },
  theme: {
    light: "淺色",
    dark: "深色",
    system: "跟隨系統",
  },

  environment: {
    title: "路徑與環境",
    description: "遊戲位置及 BepInEx mod 載入器。",
    gamePath: "遊戲路徑",
    gamePathEmpty: "尚未設定",
    setManually: "手動設定",
    openFolder: "開啟資料夾",
    bepinexStatus: "BepInEx 狀態",
    redeploy: "重新部署",
    notDetected: "未偵測到",
    logs: "日誌",
    logsHint: "檢視執行紀錄,協助診斷問題。",
    openLogs: "檢視日誌",
  },

  about: {
    title: "關於",
    description: "應用程式資訊與相關連結。",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Human Host 的 mod 管理器。",
    version: "版本",
    project: "專案",
    openRepo: "在 GitHub 上開啟",
    checkUpdate: "檢查更新",
    updateUnavailable: "更新檢查功能尚未開放。",
  },

  toast: {
    gamePathSet: "遊戲路徑已更新",
    gamePathFailed: "設定遊戲路徑失敗",
    deploying: "正在部署 BepInEx…",
    deployPhase: "BepInEx：{{phase}} {{percent}}%",
    deployDone: "BepInEx 已部署完成",
    deployFailed: "部署 BepInEx 失敗",
    openLogsFailed: "開啟日誌失敗",
  },

  logViewer: {
    title: "執行紀錄",
    subtitle: "最近的活動(僅顯示最新的項目)。",
    refresh: "重新整理",
    copy: "複製",
    openFolder: "開啟資料夾",
    clear: "清除",
    empty: "尚無日誌項目。",
    copied: "日誌已複製到剪貼簿",
    copyFailed: "複製日誌失敗",
    cleared: "日誌已清除",
    clearFailed: "清除日誌失敗",
    clearConfirmTitle: "要清除日誌嗎?",
    clearConfirmBody:
      "這會永久移除目前所有的日誌項目,且無法復原。",
  },

  error: {
    title: "載入設定失敗",
  },
} as const;

export default settings;
