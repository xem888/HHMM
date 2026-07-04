const dashboard = {
  title: "總覽",
  gameRunning: "遊戲執行中",
  gameNotRunning: "遊戲未執行",

  error: {
    title: "載入失敗",
  },

  gameStatus: "遊戲",
  bepinexStatus: "BepInEx",
  detected: "已偵測到",
  notDetected: "未偵測到",
  notSet: "尚未設定",
  deployBepinex: "部署 BepInEx",

  stats: {
    installed: "已安裝",
    canInstall: "可安裝",
    canUpdate: "可更新",
    enabled: "已啟用",
  },

  modActions: "模組操作",

  allUpToDate: "所有項目均已是最新版本",
  updatable_one: "{{count}} 個 mod 可更新",
  updatable_other: "{{count}} 個 mod 可更新",
  installable_one: "{{count}} 個可安裝",
  installable_other: "{{count}} 個可安裝",
  syncAll: "全部更新",
  installAll: "全部安裝",

  launchGame: "啟動遊戲",
  launching: "啟動中…",

  footer: {
    game: "遊戲",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} 已啟用",
  },

  sync: {
    inProgress: "正在同步 mod…",
    success_one: "已同步 {{count}} 個 mod",
    success_other: "已同步 {{count}} 個 mod",
    partial: "已同步 {{ok}} 個，{{failed}} 個失敗",
    failedAll: "同步失敗",
    nothing: "沒有需要同步的項目",
  },

  deploy: {
    inProgress: "正在部署 BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx 已部署完成",
    failed: "BepInEx 部署失敗",
    phase: {
      download: "下載中",
      extract: "解壓縮中",
      done: "收尾中",
    },
  },

  launch: {
    starting: "正在啟動遊戲…(透過 Steam 啟動需幾秒)",
    started: "遊戲已啟動",
    slow: "啟動指令已送出,遊戲仍在載入…",
    failed: "啟動遊戲失敗",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx 版本偏舊",
      desc: "偵測到 {{version}},低於建議的 5.4.23.2。部分模組可能無法正常運作,建議安裝 5.4.23.2。",
    },
    above: {
      title: "BepInEx 版本較新",
      desc: "偵測到 {{version}},高於建議的 5.4.23.2。通常可正常使用,但尚未經過完整測試;若遇到模組異常,請依各模組作者的說明安裝對應版本。",
    },
    incompatible: {
      title: "BepInEx 版本不相容",
      desc: "偵測到 {{version}},與本工具模組所依據的大版本(BepInEx 5.x)不同,模組極可能無法載入。請安裝 BepInEx 5.4.23.2。",
    },
  },

  hideManager: {
    title: "必開項未開啟",
    desc: "本遊戲必須在 BepInEx.cfg 中開啟 HideManagerGameObject，否則所有模組都不會載入——看似已安裝，進遊戲卻毫無效果。",
    descMissing: "BepInEx.cfg 尚未產生(通常首次啟動遊戲時才會建立)。HHMM 可以現在就帶著必開項一起建立，無需先啟動一次遊戲。",
    fix: "立即修復",
    fixed: "必開項已開啟，下次啟動遊戲生效",
    fixFailed: "修復失敗",
  },
} as const;

export default dashboard;
