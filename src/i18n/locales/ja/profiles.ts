const profiles = {
  title: "プロファイル",
  subtitle: "mod 構成を保存して切り替える",

  about: {
    title: "プロファイルって何？",
    body: "プロファイルは、今どの mod を有効にしているか、それぞれの mod の設定をまるごと記録します。プレイスタイルを変えたいときはワンクリックで丸ごと切り替え。いちいち手で切り替えたり調整し直す必要はありません。",
    createStep: "作成",
    createHint: "今の構成に名前を付けて保存",
    applyStep: "適用",
    applyHint: "ワンクリックで別の構成に切り替え。オンオフも設定も全部復元",
    deleteStep: "削除",
    deleteHint: "いらなくなったプロファイルを消す",
  },

  create: {
    placeholder: "新しいプロファイル名",
    label: "プロファイルを作成",
  },

  modSummary: "{{count}} 個中 {{enabled}} 個の mod が有効",

  applyConfirm: "このプロファイルを適用しますか？現在の mod 構成は上書きされます。",
  applyConfirmDesc: "設定・インストール済みの mod・有効/無効の状態を、このプロファイルを保存したときの状態にそっくり戻します。足りない mod は自動でインストールされ、余分な mod は削除されます。",
  deleteConfirm: "このプロファイルを削除しますか？この操作は取り消せません。",

  empty: {
    title: "プロファイルがありません",
    description:
      "プロファイルを作成して現在の mod 構成をスナップショットし、いつでも切り替えられます。",
  },

  toast: {
    created: "プロファイル「{{name}}」を作成しました",
    createFailed: "プロファイルの作成に失敗しました",
    applied: "プロファイル「{{name}}」を適用しました",
    appliedPartial: "プロファイル「{{name}}」を適用しましたが、{{count}} 件が失敗しました",
    backupHint: "切り替え前の構成は「__backup__」プロファイルとして自動保存されました。これを適用すれば元に戻せます。",
    hideManagerWarn: "このプロファイルは必須の設定 HideManagerGameObject をオフにしました — 再び有効にするまで mod は読み込まれません。",
    applyFailed: "プロファイルの適用に失敗しました",
    deleted: "プロファイル「{{name}}」を削除しました",
    deleteFailed: "プロファイルの削除に失敗しました",
  },

  loadFailed: "プロファイルの読み込みに失敗しました",
} as const;

export default profiles;
