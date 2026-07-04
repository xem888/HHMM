const config = {
  title: "設定ファイル",
  filesTitle: "設定ファイル一覧",
  noConfig: "設定ファイルが見つかりません",
  noConfigHint:
    "mod を一度起動して BepInEx が .cfg ファイルを生成すると、ここに表示されます。",

  selectTitle: "設定ファイルを選択",
  selectHint: "左のファイルを選択して設定を編集してください。",

  loadFailedTitle: "設定ファイルの読み込みに失敗しました",
  loadFailedHint: "設定ファイルを読み取れませんでした。再読み込みをお試しください。",

  searchPlaceholder: "設定を検索…",
  noMatch: "一致する設定が見つかりません",

  save: "保存",
  saveWithCount: "保存 ({{count}})",
  saveSuccess: "{{count}} 件の変更を保存しました",
  saveSuccess_other: "{{count}} 件の変更を保存しました",
  saveFailed: "設定の保存に失敗しました",

  openFile: "元ファイルを開く",
  openFileConfirmTitle: "元の設定ファイルを開きますか？",
  openFileConfirmDesc:
    "エディターに未保存の変更があります。元ファイルを直接編集すると、その変更と競合するおそれがあります。先にエディターの変更を保存するか破棄してください。それでも開きますか？",
  openFileConfirm: "それでも開く",
  openFileFailed: "ファイルを開けませんでした",

  resetSection: "セクションをリセット",
  resetSectionTip: "このセクションのすべての設定をデフォルト値に戻します",
  resetNoDefaults: "このセクションにはリセットできるデフォルト値がありません",
  resetApplied: "{{count}} 件の設定をデフォルトに戻しました — 保存して適用",
  resetApplied_other: "{{count}} 件の設定をデフォルトに戻しました — 保存して適用",

  defaultLabel: "デフォルト",
  rangeLabel: "範囲",
  acceptableLabel: "許容値",
  dynamicCount: "{{count}} 件",
  dynamicCount_other: "{{count}} 件",

  pressKey: "キーを押してください…",

  bepinexWarning: {
    title: "変更は慎重に",
    description:
      "これは mod の設定ではなく、BepInEx フレームワークの設定ファイルです。自分が何をしているかをはっきり理解している場合、または mod 作者から特定の項目を変更するよう明確に指示された場合を除き、むやみに変更しないでください。誤った変更は mod の読み込み失敗やゲームの不具合を招くおそれがあります。",
  },
} as const;

export default config;
