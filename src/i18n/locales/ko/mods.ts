const mods = {
  title: "내 Mod",
  subtitle: "설치된 Human Host mod",

  import: "가져오기",
  dropOverlay: {
    title: "놓아서 설치",
    hint: ".dll 또는 .zip mod 파일을 아무 곳에나 놓으면 설치됩니다",
  },
  dropTip: ".dll 또는 .zip mod 파일을 아무 곳에나 드래그하면 설치됩니다 — 또는 위의 “가져오기”를 사용하세요.",

  searchPlaceholder: "이름 또는 파일로 검색…",

  filter: {
    all: "전체",
    notInstalled: "미설치",
    enabled: "활성화됨",
    updatable: "업데이트 가능",
  },

  sort: {
    name: "이름 A-Z",
    nameDesc: "이름 Z-A",
    newest: "최근 업데이트순",
    largest: "용량 큰 순",
  },

  status: {
    canUpdate: "업데이트",
    upToDate: "최신 상태",
    notInstalled: "미설치",
  },

  source: {
    local: "로컬",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "버전 알 수 없음",
    modified: "{{time}}에 업데이트됨",
    unknownTime: "알 수 없음",
    author: "작성자",
    updatedAt: "마지막 업데이트",
    publishedAt: "최초 게시",
    size: "파일 크기",
    file: "파일",
  },

  time: {
    justNow: "방금 전",
    minutesAgo: "{{count}}분 전",
    hoursAgo: "{{count}}시간 전",
    daysAgo: "{{count}}일 전",
  },

  action: {
    openConfig: "설정 열기",
    install: "설치",
    update: "업데이트",
    uninstall: "제거",
  },

  empty: {
    none: {
      title: "설치된 Mod가 없습니다",
      description:
        "mod .dll 파일을 여기로 드래그하거나, Workshop에서 동기화하거나, 파일을 찾아보기로 설치하세요.",
    },
    noResults: {
      title: "일치하는 Mod가 없습니다",
      description: "다른 검색어나 필터를 시도해 보세요.",
    },
  },

  error: {
    title: "Mod를 불러올 수 없습니다",
    description: "설치된 mod를 검색하는 중 오류가 발생했습니다.",
  },

  toast: {
    installing: "Mod 설치 중…",
    installed: "{{name}} 설치됨",
    installFailed: "{{name}} 설치에 실패했습니다",
    installingOne: "설치 중…",
    installedOne: "{{name}} 설치됨",
    uninstalling: "제거 중…",
    uninstalled: "{{name}} 제거됨",
    uninstallFailed: "{{name}} 제거에 실패했습니다",
    updating: "업데이트 중…",
    updated: "{{name}} 업데이트됨",
    updateFailed: "{{name}} 업데이트에 실패했습니다",
    syncing: "Mod 동기화 중…",
    synced: "{{count}}개 mod 동기화됨",
    synced_other: "{{count}}개 mod 동기화됨",
    syncNothing: "모두 최신 상태입니다",
    syncPartial: "{{ok}} 동기화됨, {{failed}} 실패",
    syncFailed: "동기화에 실패했습니다",
    enabled: "{{name}} 활성화됨",
    disabled: "{{name}} 비활성화됨",
    toggleFailed: "{{name}} 전환에 실패했습니다",
  },
} as const;

export default mods;
