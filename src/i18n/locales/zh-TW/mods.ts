const mods = {
  title: "我的 Mod",
  subtitle: "已安裝的 Human Host mod",

  import: "匯入",
  dropOverlay: {
    title: "放開以安裝",
    hint: "將 .dll 或 .zip mod 檔案拖曳至任意位置即可安裝",
  },
  dropTip: "將 .dll 或 .zip mod 檔案拖曳至任意位置即可安裝 — 或點選上方的「匯入」。",

  searchPlaceholder: "依名稱或檔案搜尋…",

  filter: {
    all: "全部",
    notInstalled: "未安裝",
    enabled: "已啟用",
    updatable: "有更新",
  },

  sort: {
    name: "名稱 A-Z",
    nameDesc: "名稱 Z-A",
    newest: "最近更新",
    largest: "體積最大",
  },

  status: {
    canUpdate: "更新",
    upToDate: "已是最新版本",
    notInstalled: "未安裝",
  },

  source: {
    local: "本機",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "版本未知",
    modified: "更新於 {{time}}",
    unknownTime: "未知",
    author: "作者",
    updatedAt: "最後更新",
    publishedAt: "首次發布",
    size: "檔案大小",
    file: "檔案",
  },

  time: {
    justNow: "剛剛",
    minutesAgo: "{{count}} 分鐘前",
    hoursAgo: "{{count}} 小時前",
    daysAgo: "{{count}} 天前",
  },

  action: {
    openConfig: "開啟設定檔",
    install: "安裝",
    update: "更新",
    uninstall: "解除安裝",
  },

  uninstallConfirm: {
    title: "解除安裝 {{name}}？",
    workshop: "它的檔案會從遊戲中移除。訂閱仍會保留，隨時可以重新安裝。",
    local: "這個模組是手動安裝的，HHMM 沒有它的備份。檔案將被永久刪除，無法復原。",
  },

  empty: {
    none: {
      title: "尚未安裝任何 mod",
      description:
        "將 mod .dll 拖曳至此、從 Workshop 同步，或瀏覽檔案以安裝。",
    },
    noResults: {
      title: "找不到符合的 mod",
      description: "請嘗試不同的搜尋關鍵字或篩選條件。",
    },
  },

  error: {
    title: "無法載入 mod",
    description: "掃描已安裝的 mod 時發生錯誤。",
  },

  toast: {
    installing: "正在安裝 mod…",
    installed: "已安裝 {{name}}",
    installFailed: "安裝 {{name}} 失敗",
    installingOne: "正在安裝…",
    installedOne: "已安裝 {{name}}",
    uninstalling: "正在解除安裝…",
    uninstalled: "已解除安裝 {{name}}",
    uninstallFailed: "解除安裝 {{name}} 失敗",
    updating: "正在更新…",
    updated: "已更新 {{name}}",
    updateFailed: "更新 {{name}} 失敗",
    syncing: "正在同步 mod…",
    synced: "已同步 {{count}} 個 mod",
    synced_other: "已同步 {{count}} 個 mod",
    syncNothing: "所有 mod 均已是最新版本",
    syncPartial: "已同步 {{ok}} 個，{{failed}} 個失敗",
    syncFailed: "同步失敗",
    enabled: "已啟用 {{name}}",
    disabled: "已停用 {{name}}",
    toggleFailed: "切換 {{name}} 狀態失敗",
  },
} as const;

export default mods;
