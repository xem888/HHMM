const profiles = {
  title: "档案",
  subtitle: "保存并切换不同的 mod 配置",

  about: {
    title: "配置档案是什么？",
    body: "一个档案会完整记下你当前开了哪些 mod、以及每个 mod 的全部设置。换玩法时点一下就能整套切回,不用手动一个个调。",
    createStep: "创建",
    createHint: "给当前这套配置起个名存下来",
    applyStep: "应用",
    applyHint: "一键切回某套配置,开关和设置全恢复",
    deleteStep: "删除",
    deleteHint: "移除不需要的档案",
  },

  create: {
    placeholder: "新档案名称",
    label: "创建档案",
  },

  modSummary: "{{count}} 个 mod 中已启用 {{enabled}} 个",

  applyConfirm: "应用此档案？当前 mod 配置将被覆盖。",
  applyConfirmDesc: "将把配置、已安装的模组和启用/禁用状态，全部还原到此档案保存时的样子——缺失的模组会自动安装，多余的会被卸载。",
  deleteConfirm: "删除此档案？此操作无法撤销。",

  empty: {
    title: "还没有档案",
    description: "创建档案可为当前 mod 配置拍下快照，随时切换回来。",
  },

  toast: {
    created: "已创建档案“{{name}}”",
    createFailed: "创建档案失败",
    applied: "已应用档案“{{name}}”",
    appliedPartial: "档案“{{name}}”已应用，但有 {{count}} 项未成功",
    backupHint: "已自动把切换前的状态存为“__backup__”档案，应用它即可回退。",
    hideManagerWarn: "该档案把必开项 HideManagerGameObject 关掉了——重新开启前所有模组都不会加载。",
    applyFailed: "应用档案失败",
    deleted: "已删除档案“{{name}}”",
    deleteFailed: "删除档案失败",
  },

  loadFailed: "加载档案失败",
} as const;

export default profiles;
