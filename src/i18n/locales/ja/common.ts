const common = {
  ok: "OK",
  cancel: "キャンセル",
  save: "保存",
  create: "作成",
  apply: "適用",
  delete: "削除",
  search: "検索…",
  refresh: "更新",
  enable: "有効化",
  disable: "無効化",
  browse: "ファイルを参照",
  confirm: "確認",
  discard: "破棄",
  retry: "再試行",
  reload: "再読み込み",
  close: "閉じる",
  resetDefaults: "デフォルトに戻す",

  loading: "読み込み中…",
  success: "成功",
  failed: "失敗",
  enabled: "有効",
  disabled: "無効",
  upToDate: "最新",
  yes: "はい",
  no: "いいえ",

  workshop: "Workshop",
  local: "ローカル",

  error: {
    title: "エラーが発生しました",
    description: "予期しないエラーが発生しました。再試行するか、アプリを再読み込みしてください。",
  },

  unsaved: {
    title: "未保存の変更",
    description: "未保存の変更があります。破棄しますか？",
  },
  trayShow: "HHMM を表示",
  trayQuit: "終了",
  gameRunningBanner: "ゲームの実行中はMODの変更を一時停止しています。先にゲームを終了してください。",
  update: {
    checkFailed: "更新の確認に失敗しました",
    upToDate: "最新バージョンです",
    available: "新しいバージョン {{version}} が利用可能",
    install: "今すぐ更新",
    downloading: "更新をダウンロード中…",
    downloadingPct: "ダウンロード中 {{pct}}%",
    installed: "更新をインストールしました。再起動で適用",
    installFailed: "更新のインストールに失敗しました",
  },
} as const;

export default common;
