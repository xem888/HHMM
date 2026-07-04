const settings = {
  title: "設定",

  appearance: {
    title: "外観",
    description: "テーマと表示言語。",
    theme: "テーマ",
    language: "言語",
    minimizeToTray: "閉じるときにトレイへ最小化",
    minimizeToTrayHint:
      "オンにすると、ウィンドウの閉じるボタンを押しても終了せず、システムトレイ(通知領域)に収納されます。トレイアイコンをクリックすると再表示、右クリックで終了できます。",
  },
  theme: {
    light: "ライト",
    dark: "ダーク",
    system: "システム",
  },

  environment: {
    title: "パスと環境",
    description: "ゲームの場所と BepInEx mod ローダー。",
    gamePath: "ゲームパス",
    gamePathEmpty: "未設定",
    setManually: "手動で設定",
    openFolder: "フォルダーを開く",
    bepinexStatus: "BepInEx 状態",
    redeploy: "再デプロイ",
    notDetected: "検出されません",
    logs: "ログ",
    logsHint: "問題の診断に役立つよう、実行ログを表示します。",
    openLogs: "ログを表示",
  },

  about: {
    title: "バージョン情報",
    description: "アプリ情報とリンク。",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Human Host 用 mod マネージャー。",
    version: "バージョン",
    project: "プロジェクト",
    openRepo: "GitHub で開く",
    checkUpdate: "更新を確認",
    updateUnavailable: "更新確認はまだ利用できません。",
  },

  toast: {
    gamePathSet: "ゲームパスを更新しました",
    gamePathFailed: "ゲームパスの設定に失敗しました",
    deploying: "BepInEx をデプロイ中…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx をデプロイしました",
    deployFailed: "BepInEx のデプロイに失敗しました",
    openLogsFailed: "ログを開けませんでした",
  },

  logViewer: {
    title: "実行ログ",
    subtitle: "最近のアクティビティ(最新のエントリを表示)。",
    refresh: "更新",
    copy: "コピー",
    openFolder: "フォルダーを開く",
    clear: "クリア",
    empty: "ログエントリはまだありません。",
    copied: "ログをクリップボードにコピーしました",
    copyFailed: "ログのコピーに失敗しました",
    cleared: "ログをクリアしました",
    clearFailed: "ログのクリアに失敗しました",
    clearConfirmTitle: "ログをクリアしますか?",
    clearConfirmBody:
      "現在のすべてのログエントリが完全に削除され、元に戻すことはできません。",
  },

  error: {
    title: "設定の読み込みに失敗しました",
  },
} as const;

export default settings;
