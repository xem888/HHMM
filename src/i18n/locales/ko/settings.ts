const settings = {
  title: "설정",

  appearance: {
    title: "외관",
    description: "테마 및 표시 언어.",
    theme: "테마",
    language: "언어",
    minimizeToTray: "닫을 때 트레이로 최소화",
    minimizeToTrayHint:
      "켜면 창의 닫기 버튼을 눌러도 종료되지 않고 시스템 트레이(오른쪽 아래 아이콘)로 숨겨집니다. 트레이 아이콘을 클릭하면 다시 열리고, 우클릭하면 종료됩니다.",
  },
  theme: {
    light: "라이트",
    dark: "다크",
    system: "시스템",
  },

  environment: {
    title: "경로 및 환경",
    description: "게임 위치 및 BepInEx mod 로더.",
    gamePath: "게임 경로",
    gamePathEmpty: "설정되지 않음",
    setManually: "직접 설정",
    openFolder: "폴더 열기",
    bepinexStatus: "BepInEx 상태",
    redeploy: "재배포",
    notDetected: "감지되지 않음",
    logs: "로그",
    logsHint: "런타임 로그를 확인하여 문제 진단에 활용하세요.",
    openLogs: "로그 보기",
  },

  about: {
    title: "정보",
    description: "앱 정보 및 링크.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Human Host용 Mod 관리자.",
    version: "버전",
    project: "프로젝트",
    openRepo: "GitHub에서 열기",
    checkUpdate: "업데이트 확인",
    updateUnavailable: "업데이트 확인은 아직 지원되지 않습니다.",
  },

  toast: {
    gamePathSet: "게임 경로가 업데이트되었습니다",
    gamePathFailed: "게임 경로 설정에 실패했습니다",
    deploying: "BepInEx 배포 중…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx 배포 완료",
    deployFailed: "BepInEx 배포에 실패했습니다",
    openLogsFailed: "로그를 여는 데 실패했습니다",
  },

  logViewer: {
    title: "런타임 로그",
    subtitle: "최근 활동(최신 항목만 표시됩니다).",
    refresh: "새로고침",
    copy: "복사",
    openFolder: "폴더 열기",
    clear: "지우기",
    empty: "아직 로그 항목이 없습니다.",
    copied: "로그를 클립보드에 복사했습니다",
    copyFailed: "로그 복사에 실패했습니다",
    cleared: "로그를 지웠습니다",
    clearFailed: "로그 지우기에 실패했습니다",
    clearConfirmTitle: "로그를 지우시겠습니까?",
    clearConfirmBody:
      "현재 모든 로그 항목이 영구적으로 삭제되며 되돌릴 수 없습니다.",
  },

  error: {
    title: "설정을 불러오지 못했습니다",
  },
} as const;

export default settings;
