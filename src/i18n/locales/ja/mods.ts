const mods = {
  title: "Mod 一覧",
  subtitle: "インストール済みの Human Host mod",

  import: "インポート",
  dropOverlay: {
    title: "ドロップしてインストール",
    hint: ".dll または .zip の mod ファイルをどこにでもドロップしてインストール",
  },
  dropTip: ".dll または .zip の mod ファイルをどこにでもドラッグしてインストール — または上の「インポート」をご利用ください。",

  searchPlaceholder: "名前またはファイルで検索…",

  filter: {
    all: "すべて",
    notInstalled: "未インストール",
    enabled: "有効",
    updatable: "更新あり",
  },

  sort: {
    name: "名前 A-Z",
    nameDesc: "名前 Z-A",
    newest: "最近更新した順",
    largest: "サイズが大きい順",
  },

  status: {
    canUpdate: "更新",
    upToDate: "最新",
    notInstalled: "未インストール",
  },

  source: {
    local: "ローカル",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "バージョン不明",
    modified: "{{time}} に更新",
    unknownTime: "不明",
    author: "作者",
    updatedAt: "最終更新",
    publishedAt: "初回公開",
    size: "ファイルサイズ",
    file: "ファイル",
  },

  time: {
    justNow: "たった今",
    minutesAgo: "{{count}} 分前",
    hoursAgo: "{{count}} 時間前",
    daysAgo: "{{count}} 日前",
  },

  action: {
    openConfig: "設定を開く",
    install: "インストール",
    update: "更新",
    uninstall: "アンインストール",
  },

  empty: {
    none: {
      title: "mod がありません",
      description:
        "mod の .dll をここにドロップするか、Workshop から同期するか、ファイルを参照してインストールしてください。",
    },
    noResults: {
      title: "一致する mod がありません",
      description: "別の検索ワードまたはフィルターをお試しください。",
    },
  },

  error: {
    title: "mod を読み込めませんでした",
    description: "インストール済み mod のスキャン中にエラーが発生しました。",
  },

  toast: {
    installing: "mod をインストール中…",
    installed: "{{name}} をインストールしました",
    installFailed: "{{name}} のインストールに失敗しました",
    installingOne: "インストール中…",
    installedOne: "{{name}} をインストールしました",
    uninstalling: "アンインストール中…",
    uninstalled: "{{name}} をアンインストールしました",
    uninstallFailed: "{{name}} のアンインストールに失敗しました",
    updating: "更新中…",
    updated: "{{name}} を更新しました",
    updateFailed: "{{name}} の更新に失敗しました",
    syncing: "mod を同期中…",
    synced: "{{count}} 個の mod を同期しました",
    synced_other: "{{count}} 個の mod を同期しました",
    syncNothing: "すべて最新です",
    syncPartial: "{{ok}} 個同期完了、{{failed}} 個失敗",
    syncFailed: "同期に失敗しました",
    enabled: "{{name}} を有効化しました",
    disabled: "{{name}} を無効化しました",
    toggleFailed: "{{name}} の切り替えに失敗しました",
  },
} as const;

export default mods;
