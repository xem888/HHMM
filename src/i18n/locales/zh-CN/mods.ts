const mods = {
  title: "我的 Mod",
  subtitle: "已安装的 Human Host mod",

  import: "导入",
  dropOverlay: {
    title: "松开即可安装",
    hint: "把 .dll 或 .zip 模组文件拖到窗口任意位置即可安装",
  },
  dropTip: "把 .dll 或 .zip 模组文件拖到窗口任意位置即可安装,也可点右上角「导入」。",

  searchPlaceholder: "按名称或文件名搜索…",

  filter: {
    all: "全部",
    notInstalled: "未安装",
    enabled: "已启用",
    updatable: "可更新",
  },

  sort: {
    name: "名称 A-Z",
    nameDesc: "名称 Z-A",
    newest: "最近更新",
    largest: "体积最大",
  },

  status: {
    canUpdate: "可更新",
    upToDate: "已是最新",
    notInstalled: "未安装",
  },

  source: {
    local: "本地",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "版本未知",
    modified: "{{time}}更新",
    unknownTime: "未知",
    author: "作者",
    updatedAt: "最后更新",
    publishedAt: "首次发布",
    size: "文件大小",
    file: "文件",
  },

  time: {
    justNow: "刚刚",
    minutesAgo: "{{count}} 分钟前",
    hoursAgo: "{{count}} 小时前",
    daysAgo: "{{count}} 天前",
  },

  action: {
    openConfig: "打开配置",
    install: "安装",
    update: "更新",
    uninstall: "卸载",
  },

  empty: {
    none: {
      title: "还没有 Mod",
      description: "把 mod 的 .dll 拖到这里、从创意工坊同步,或浏览文件来安装。",
    },
    noResults: {
      title: "没有匹配的 Mod",
      description: "换个搜索词或过滤条件试试。",
    },
  },

  error: {
    title: "无法加载 Mod",
    description: "扫描已安装 mod 时出错了。",
  },

  toast: {
    installing: "正在安装 Mod…",
    installed: "已安装 {{name}}",
    installFailed: "安装 {{name}} 失败",
    installingOne: "正在安装…",
    installedOne: "已安装 {{name}}",
    uninstalling: "正在卸载…",
    uninstalled: "已卸载 {{name}}",
    uninstallFailed: "卸载 {{name}} 失败",
    updating: "正在更新…",
    updated: "已更新 {{name}}",
    updateFailed: "更新 {{name}} 失败",
    syncing: "正在同步 Mod…",
    synced: "已同步 {{count}} 个 mod",
    synced_other: "已同步 {{count}} 个 mod",
    syncNothing: "全部已是最新,无需同步",
    syncPartial: "已同步 {{ok}} 个,{{failed}} 个失败",
    syncFailed: "同步失败",
    enabled: "已启用 {{name}}",
    disabled: "已禁用 {{name}}",
    toggleFailed: "切换 {{name}} 失败",
  },
} as const;

export default mods;
