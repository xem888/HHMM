const common = {
  ok: "확인",
  cancel: "취소",
  save: "저장",
  create: "만들기",
  apply: "적용",
  delete: "삭제",
  search: "검색…",
  refresh: "새로 고침",
  enable: "활성화",
  disable: "비활성화",
  browse: "파일 찾아보기",
  confirm: "확인",
  discard: "변경 사항 버리기",
  retry: "다시 시도",
  reload: "다시 로드",
  close: "닫기",
  resetDefaults: "기본값으로 초기화",

  loading: "로딩 중…",
  success: "성공",
  failed: "실패",
  enabled: "활성화됨",
  disabled: "비활성화됨",
  upToDate: "최신 상태",
  yes: "예",
  no: "아니요",

  workshop: "Workshop",
  local: "로컬",

  error: {
    title: "오류가 발생했습니다",
    description: "예기치 않은 오류가 발생했습니다. 다시 시도하거나 앱을 다시 로드하세요.",
  },

  unsaved: {
    title: "저장되지 않은 변경 사항",
    description: "저장되지 않은 변경 사항이 있습니다. 버리겠습니까?",
  },
  trayShow: "HHMM 표시",
  trayQuit: "종료",
  gameRunningBanner: "게임이 실행 중이라 모드 변경이 일시 중지되었습니다. 먼저 게임을 종료해 주세요.",
  update: {
    checkFailed: "업데이트 확인 실패",
    upToDate: "최신 버전입니다",
    available: "새 버전 {{version}} 사용 가능",
    install: "지금 업데이트",
    downloading: "업데이트 다운로드 중…",
    downloadingPct: "다운로드 중 {{pct}}%",
    installed: "업데이트 설치됨 — 재시작하면 적용",
    installFailed: "업데이트 설치 실패",
  },
} as const;

export default common;
