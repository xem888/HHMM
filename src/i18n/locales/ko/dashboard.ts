const dashboard = {
  title: "대시보드",
  gameRunning: "게임 실행 중",
  gameNotRunning: "게임 실행 중 아님",

  error: {
    title: "불러오기 실패",
  },

  gameStatus: "게임",
  bepinexStatus: "BepInEx",
  detected: "감지됨",
  notDetected: "감지되지 않음",
  notSet: "설정되지 않음",
  deployBepinex: "BepInEx 배포",

  stats: {
    installed: "설치됨",
    canInstall: "설치 가능",
    canUpdate: "업데이트 가능",
    enabled: "활성화됨",
  },

  modActions: "모드 작업",

  allUpToDate: "모두 최신 상태입니다",
  updatable_one: "{{count}}개 mod를 업데이트할 수 있습니다",
  updatable_other: "{{count}}개 mod를 업데이트할 수 있습니다",
  installable_one: "{{count}}개 설치 가능",
  installable_other: "{{count}}개 설치 가능",
  syncAll: "모두 업데이트",
  installAll: "모두 설치",

  launchGame: "게임 실행",
  launching: "실행 중…",

  footer: {
    game: "게임",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} 활성화됨",
  },

  sync: {
    inProgress: "Mod 동기화 중…",
    success_one: "{{count}}개 mod 동기화됨",
    success_other: "{{count}}개 mod 동기화됨",
    partial: "{{ok}} 동기화됨, {{failed}} 실패",
    failedAll: "동기화에 실패했습니다",
    nothing: "동기화할 항목이 없습니다",
  },

  deploy: {
    inProgress: "BepInEx 배포 중…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx 배포 완료",
    failed: "BepInEx 배포에 실패했습니다",
    phase: {
      download: "다운로드 중",
      extract: "압축 해제 중",
      done: "마무리 중",
    },
  },

  launch: {
    starting: "게임을 실행하는 중…(Steam을 통해 몇 초 걸립니다)",
    started: "게임이 실행되었습니다",
    slow: "실행 명령을 보냈습니다. 게임을 불러오는 중…",
    failed: "게임 실행에 실패했습니다",
  },

  bepinexCompat: {
    below: {
      title: "BepInEx 버전이 낮습니다",
      desc: "{{version}}이(가) 감지되었습니다. 권장 버전인 5.4.23.2보다 낮습니다. 일부 mod가 제대로 작동하지 않을 수 있으므로 5.4.23.2 설치를 권장합니다.",
    },
    above: {
      title: "BepInEx 버전이 높습니다",
      desc: "{{version}}이(가) 감지되었습니다. 권장 버전인 5.4.23.2보다 높습니다. 대체로 정상 작동하지만 완전히 검증되지는 않았습니다. mod에 문제가 발생하면 해당 mod 제작자의 안내에 따라 알맞은 버전을 설치하세요.",
    },
    incompatible: {
      title: "BepInEx 버전이 호환되지 않습니다",
      desc: "{{version}}이(가) 감지되었습니다. 이 mod들이 대상으로 하는 버전(BepInEx 5.x)과 주(主) 버전이 다릅니다. mod가 로드되지 않을 가능성이 매우 높으므로 BepInEx 5.4.23.2를 설치하세요.",
    },
  },

  hideManager: {
    title: "필수 설정이 꺼져 있습니다",
    desc: "이 게임은 BepInEx.cfg에서 HideManagerGameObject = true가 필요합니다. 그렇지 않으면 BepInEx mod가 하나도 로드되지 않습니다 — 설치된 것처럼 보여도 게임 안에서는 아무 동작도 하지 않습니다.",
    descMissing: "BepInEx.cfg가 아직 없습니다(보통 게임을 처음 실행할 때 생성됩니다). HHMM이 필수 설정을 켠 상태로 지금 바로 만들 수 있습니다 — 게임을 먼저 실행할 필요가 없습니다.",
    fix: "수정",
    fixed: "필수 설정을 켰습니다 — 다음 게임 실행 시 적용됩니다",
    fixFailed: "설정을 적용하지 못했습니다",
  },
} as const;

export default dashboard;
