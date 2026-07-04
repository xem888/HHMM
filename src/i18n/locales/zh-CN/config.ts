const config = {
  title: "配置",
  filesTitle: "配置文件",
  noConfig: "未找到配置文件",
  noConfigHint: "mod 运行一次后,BepInEx 会生成对应的 .cfg 文件,届时会显示在这里。",

  selectTitle: "选择一个配置文件",
  selectHint: "在左侧选择一个文件以编辑其设置。",

  loadFailedTitle: "配置加载失败",
  loadFailedHint: "无法读取该配置文件,请尝试重新加载。",

  searchPlaceholder: "搜索设置项…",
  noMatch: "没有匹配的设置项",

  save: "保存",
  saveWithCount: "保存 ({{count}})",
  saveSuccess: "已保存 {{count}} 项更改",
  saveSuccess_other: "已保存 {{count}} 项更改",
  saveFailed: "配置保存失败",

  openFile: "打开原文件",
  openFileConfirmTitle: "打开原始配置文件?",
  openFileConfirmDesc:
    "编辑器里有未保存的修改。直接编辑原文件可能与之冲突,建议先保存或放弃编辑器里的修改。仍要打开?",
  openFileConfirm: "仍要打开",
  openFileFailed: "打开文件失败",

  resetSection: "重置本节",
  resetSectionTip: "把本节所有设置重置为默认值",
  resetNoDefaults: "本节没有可重置的默认值",
  resetApplied: "已将 {{count}} 项重置为默认值 — 保存后生效",
  resetApplied_other: "已将 {{count}} 项重置为默认值 — 保存后生效",

  defaultLabel: "默认",
  rangeLabel: "范围",
  acceptableLabel: "可选",
  dynamicCount: "{{count}} 项",
  dynamicCount_other: "{{count}} 项",

  pressKey: "按下按键…",

  bepinexWarning: {
    title: "谨慎修改",
    description:
      "这是 BepInEx 框架的配置文件,不是 mod 设置。请勿随意更改,除非你清楚自己在做什么,或 mod 作者明确要求你修改某一项——改错可能导致 mod 无法加载或游戏异常。",
  },
} as const;

export default config;
