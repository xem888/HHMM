const dashboard = {
  title: "ダッシュボード",
  gameRunning: "ゲーム実行中",
  gameNotRunning: "ゲーム未起動",

  error: {
    title: "読み込みに失敗しました",
  },

  gameStatus: "ゲーム",
  bepinexStatus: "BepInEx",
  detected: "検出済み",
  notDetected: "検出されません",
  notSet: "未設定",
  deployBepinex: "BepInEx をデプロイ",

  stats: {
    installed: "インストール済み",
    canInstall: "インストール可能",
    canUpdate: "更新可能",
    enabled: "有効",
  },

  modActions: "Mod 操作",
  allUpToDate: "すべて最新です",
  updatable_one: "{{count}} 個の mod を更新できます",
  updatable_other: "{{count}} 個の mod を更新できます",
  installable_one: "{{count}} 個インストール可能",
  installable_other: "{{count}} 個インストール可能",
  syncAll: "すべて更新",
  installAll: "すべてインストール",

  launchGame: "ゲームを起動",
  launching: "起動中…",

  footer: {
    game: "GAME",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} 有効",
  },

  sync: {
    inProgress: "mod を同期中…",
    success_one: "{{count}} 個の mod を同期しました",
    success_other: "{{count}} 個の mod を同期しました",
    partial: "{{ok}} 個同期完了、{{failed}} 個失敗",
    failedAll: "同期に失敗しました",
    nothing: "同期するものがありません",
  },

  deploy: {
    inProgress: "BepInEx をデプロイ中…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx をデプロイしました",
    failed: "BepInEx のデプロイに失敗しました",
    phase: {
      download: "ダウンロード中",
      extract: "展開中",
      done: "完了処理中",
    },
  },

  launch: {
    starting: "ゲームを起動中…(Steam 経由で数秒かかります)",
    started: "ゲームを起動しました",
    slow: "起動コマンドを送信しました。ゲームを読み込み中…",
    failed: "ゲームの起動に失敗しました",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx のバージョンが古いです",
      desc: "{{version}} を検出しました。推奨の 5.4.23.2 より古いバージョンです。一部の mod が正しく動作しない可能性があるため、5.4.23.2 のインストールをおすすめします。",
    },
    above: {
      title: "BepInEx のバージョンが新しいです",
      desc: "{{version}} を検出しました。推奨の 5.4.23.2 より新しいバージョンです。通常は問題ありませんが、完全に検証されてはいません。mod の動作に不具合がある場合は、各 mod 作者の指示に従って対応するバージョンをインストールしてください。",
    },
    incompatible: {
      title: "BepInEx のバージョンが互換性がありません",
      desc: "{{version}} を検出しました。これらの mod が対象とするバージョン(BepInEx 5.x)とはメジャーバージョンが異なります。mod はほぼ確実に読み込めません。「BepInEx 5.4.23.2」をインストールしてください。",
    },
  },

  hideManager: {
    title: "必須の設定がオフになっています",
    desc: "このゲームでは BepInEx.cfg で HideManagerGameObject = true が必須です。オフのままだと BepInEx の mod は一つも読み込まれません — インストール済みに見えても、ゲーム内ではまったく機能しません。",
    descMissing: "BepInEx.cfg はまだ存在しません(通常はゲームの初回起動時に作成されます)。HHMM が必須の設定を有効にした状態で今すぐ作成できます — 先にゲームを起動する必要はありません。",
    fix: "修復",
    fixed: "必須の設定を有効にしました — 次回のゲーム起動時に反映されます",
    fixFailed: "設定を適用できませんでした",
  },
} as const;

export default dashboard;
