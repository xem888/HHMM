const settings = {
  title: "设置",

  appearance: {
    title: "外观",
    description: "主题与显示语言。",
    theme: "主题",
    language: "语言",
    minimizeToTray: "关闭时最小化到托盘",
    minimizeToTrayHint:
      "开启后,点窗口的关闭按钮不会退出程序,而是缩到系统托盘(右下角图标);点托盘图标可重新打开,右键托盘可退出。",
  },
  theme: {
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
  },

  environment: {
    title: "路径与环境",
    description: "游戏位置与 BepInEx 模组加载器。",
    gamePath: "游戏路径",
    gamePathEmpty: "未设置",
    setManually: "手动设置",
    openFolder: "打开文件夹",
    bepinexStatus: "BepInEx 状态",
    redeploy: "重新部署",
    notDetected: "未检测到",
    logs: "日志",
    logsHint: "查看运行日志,出问题时用于排查。",
    openLogs: "查看日志",
  },

  about: {
    title: "关于",
    description: "应用信息与链接。",
    appName: "HHMM — Human Host 模组管理器",
    tagline: "一款 Human Host 模组管理器。",
    version: "版本",
    project: "项目",
    openRepo: "在 GitHub 打开",
    checkUpdate: "检查更新",
    updateUnavailable: "暂不支持检查更新。",
  },

  toast: {
    gamePathSet: "已更新游戏路径",
    gamePathFailed: "设置游戏路径失败",
    deploying: "正在部署 BepInEx…",
    deployPhase: "BepInEx:{{phase}} {{percent}}%",
    deployDone: "BepInEx 已部署",
    deployFailed: "BepInEx 部署失败",
    openLogsFailed: "打开日志失败",
  },

  logViewer: {
    title: "运行日志",
    subtitle: "最近的运行记录(只显示最新部分)。",
    refresh: "刷新",
    copy: "复制",
    openFolder: "打开目录",
    clear: "清空",
    empty: "暂无日志。",
    copied: "日志已复制到剪贴板",
    copyFailed: "复制日志失败",
    cleared: "日志已清空",
    clearFailed: "清空日志失败",
    clearConfirmTitle: "清空日志?",
    clearConfirmBody: "将永久删除当前所有日志记录,此操作不可撤销。",
  },

  error: {
    title: "加载设置失败",
  },
} as const;

export default settings;
