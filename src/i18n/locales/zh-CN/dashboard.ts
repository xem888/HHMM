const dashboard = {
  title: "仪表盘",
  gameRunning: "游戏运行中",
  gameNotRunning: "游戏未运行",

  error: {
    title: "加载失败",
  },

  gameStatus: "游戏",
  bepinexStatus: "BepInEx",
  detected: "已检测",
  notDetected: "未检测到",
  notSet: "未设置",
  deployBepinex: "部署 BepInEx",

  stats: {
    installed: "已安装",
    canInstall: "可安装",
    canUpdate: "可更新",
    enabled: "已启用",
  },

  modActions: "模组操作",
  allUpToDate: "全部已是最新",
  updatable_one: "{{count}} 个 mod 可更新",
  updatable_other: "{{count}} 个 mod 可更新",
  installable_one: "{{count}} 个可安装",
  installable_other: "{{count}} 个可安装",
  syncAll: "全部更新",
  installAll: "全部安装",

  launchGame: "启动游戏",
  launching: "启动中…",

  footer: {
    game: "游戏",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "已启用 {{enabled}}/{{total}}",
  },

  sync: {
    inProgress: "正在同步 mod…",
    success_one: "已同步 {{count}} 个 mod",
    success_other: "已同步 {{count}} 个 mod",
    partial: "已同步 {{ok}} 个,{{failed}} 个失败",
    failedAll: "同步失败",
    nothing: "没有需要同步的内容",
  },

  deploy: {
    inProgress: "正在部署 BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx 已部署",
    failed: "BepInEx 部署失败",
    phase: {
      download: "下载中",
      extract: "解压中",
      done: "收尾中",
    },
  },

  launch: {
    starting: "正在启动游戏…(经 Steam 拉起需几秒)",
    started: "游戏已启动",
    slow: "启动指令已发送,游戏仍在加载…",
    failed: "启动游戏失败",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx 版本偏低",
      desc: "检测到 {{version}},低于推荐的 5.4.23.2。部分模组可能无法正常工作,建议安装 5.4.23.2。",
    },
    above: {
      title: "BepInEx 版本较新",
      desc: "检测到 {{version}},高于推荐的 5.4.23.2。通常可用,但未经完整测试;如遇模组异常,请按各模组作者的说明安装对应版本。",
    },
    incompatible: {
      title: "BepInEx 版本不兼容",
      desc: "检测到 {{version}},与本工具模组所基于的大版本(BepInEx 5.x)不同,模组很可能无法加载。请安装 BepInEx 5.4.23.2。",
    },
  },

  hideManager: {
    title: "必开项未开启",
    desc: "本游戏必须在 BepInEx.cfg 中开启 HideManagerGameObject,否则所有模组都不会加载——看着已安装,进游戏毫无效果。",
    descMissing: "BepInEx.cfg 还未生成(通常首次启动游戏时才创建)。HHMM 可以现在就带着必开项创建它,无需先启动一次游戏。",
    fix: "立即修复",
    fixed: "必开项已开启,下次启动游戏生效",
    fixFailed: "修复失败",
  },
} as const;

export default dashboard;
