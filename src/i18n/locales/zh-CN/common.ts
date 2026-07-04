const common = {
  ok: "确定",
  cancel: "取消",
  save: "保存",
  create: "新建",
  apply: "应用",
  delete: "删除",
  search: "搜索…",
  refresh: "刷新",
  enable: "启用",
  disable: "禁用",
  browse: "浏览文件",
  confirm: "确定",
  discard: "放弃修改",
  retry: "重试",
  reload: "重载",
  close: "关闭",
  resetDefaults: "恢复默认",

  loading: "加载中…",
  success: "成功",
  failed: "失败",
  enabled: "已启用",
  disabled: "已禁用",
  upToDate: "已是最新",
  yes: "是",
  no: "否",

  workshop: "创意工坊",
  local: "本地",

  error: {
    title: "出错了",
    description: "发生了未预期的错误。可以重试,或重载应用。",
  },

  unsaved: {
    title: "有未保存的修改",
    description: "你有未保存的修改,确定放弃吗?",
  },
  trayShow: "显示 HHMM",
  trayQuit: "退出",
  gameRunningBanner: "游戏运行中,已暂停模组改动。请先关闭游戏再操作。",
  update: {
    checkFailed: "检查更新失败",
    upToDate: "已是最新版本",
    available: "发现新版本 {{version}}",
    install: "立即更新",
    downloading: "正在下载更新…",
    downloadingPct: "下载中 {{pct}}%",
    installed: "更新已安装,重启后生效",
    installFailed: "更新安装失败",
  },
} as const;

export default common;
