const profiles = {
  title: "設定檔",
  subtitle: "儲存並切換不同的 mod 配置",

  about: {
    title: "設定檔是什麼？",
    body: "一個設定檔會完整記下你目前開了哪些 mod、以及每個 mod 的全部設定。換玩法時點一下就能整套切回,不用手動一個個調。",
    createStep: "建立",
    createHint: "給目前這套配置取個名字存下來",
    applyStep: "套用",
    applyHint: "一鍵切回某套配置,開關和設定全部還原",
    deleteStep: "刪除",
    deleteHint: "移除不需要的設定檔",
  },

  create: {
    placeholder: "新設定檔名稱",
    label: "建立設定檔",
  },

  modSummary: "{{enabled}} / {{count}} 個 mod 已啟用",

  applyConfirm: "套用此設定檔？目前的 mod 配置將被覆蓋。",
  applyConfirmDesc: "會將設定、已安裝的模組和啟用/停用狀態，全部還原成此設定檔儲存時的樣子——缺少的模組會自動安裝，多餘的則會被解除安裝。",
  deleteConfirm: "刪除此設定檔？此操作無法復原。",

  empty: {
    title: "尚無設定檔",
    description:
      "建立設定檔以快照目前的 mod 配置，之後可隨時切換回來。",
  },

  toast: {
    created: "設定檔「{{name}}」已建立",
    createFailed: "建立設定檔失敗",
    applied: "已套用設定檔「{{name}}」",
    appliedPartial: "設定檔「{{name}}」已套用，但有 {{count}} 項未成功",
    backupHint: "已自動把切換前的狀態存為「__backup__」設定檔，套用它即可回退。",
    hideManagerWarn: "此設定檔把必開項 HideManagerGameObject 關掉了——重新開啟前所有模組都不會載入。",
    applyFailed: "套用設定檔失敗",
    deleted: "設定檔「{{name}}」已刪除",
    deleteFailed: "刪除設定檔失敗",
  },

  loadFailed: "載入設定檔失敗",
} as const;

export default profiles;
