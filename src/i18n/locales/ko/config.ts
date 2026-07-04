const config = {
  title: "설정 편집기",
  filesTitle: "설정 파일",
  noConfig: "설정 파일을 찾을 수 없습니다",
  noConfigHint:
    "Mod를 한 번 실행하고 BepInEx가 .cfg 파일을 생성하면 여기에 표시됩니다.",

  selectTitle: "설정 파일을 선택하세요",
  selectHint: "왼쪽에서 파일을 선택하면 설정을 편집할 수 있습니다.",

  loadFailedTitle: "설정을 불러오지 못했습니다",
  loadFailedHint: "설정 파일을 읽을 수 없습니다. 다시 로드해 보세요.",

  searchPlaceholder: "설정 검색…",
  noMatch: "검색 결과가 없습니다",

  save: "저장",
  saveWithCount: "저장 ({{count}})",
  saveSuccess: "{{count}}개 변경 사항 저장됨",
  saveSuccess_other: "{{count}}개 변경 사항 저장됨",
  saveFailed: "설정 저장에 실패했습니다",

  openFile: "원본 파일 열기",
  openFileConfirmTitle: "원본 설정 파일을 여시겠습니까?",
  openFileConfirmDesc:
    "편집기에 저장하지 않은 변경 사항이 있습니다. 원본 파일을 직접 편집하면 해당 변경 사항과 충돌할 수 있습니다 — 먼저 편집기의 변경 사항을 저장하거나 취소하세요. 그래도 여시겠습니까？",
  openFileConfirm: "그래도 열기",
  openFileFailed: "파일을 열지 못했습니다",

  resetSection: "섹션 초기화",
  resetSectionTip: "이 섹션의 모든 설정을 기본값으로 초기화합니다",
  resetNoDefaults: "이 섹션에는 초기화할 기본값이 없습니다",
  resetApplied: "{{count}}개 설정을 기본값으로 초기화했습니다 — 저장하여 적용하세요",
  resetApplied_other: "{{count}}개 설정을 기본값으로 초기화했습니다 — 저장하여 적용하세요",

  defaultLabel: "기본값",
  rangeLabel: "범위",
  acceptableLabel: "허용값",
  dynamicCount: "{{count}}개 항목",
  dynamicCount_other: "{{count}}개 항목",

  pressKey: "키를 누르세요…",

  bepinexWarning: {
    title: "신중하게 수정하세요",
    description:
      "이것은 mod 설정이 아니라 BepInEx 프레임워크의 설정 파일입니다. 무엇을 하는지 정확히 알고 있거나 mod 제작자가 특정 항목을 변경하라고 명확히 안내한 경우가 아니라면 함부로 변경하지 마세요. 잘못 수정하면 mod가 로드되지 않거나 게임이 비정상 작동할 수 있습니다.",
  },
} as const;

export default config;
