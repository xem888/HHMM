const profiles = {
  title: "프로필",
  subtitle: "Mod 구성을 저장하고 전환하세요",

  about: {
    title: "프로필이 뭔가요?",
    body: "프로필은 지금 어떤 mod를 켜 뒀는지, 그리고 각 mod의 모든 설정을 통째로 저장합니다. 플레이 스타일을 바꿀 땐 클릭 한 번으로 전부 전환 — 일일이 켜고 다시 맞출 필요가 없어요.",
    createStep: "만들기",
    createHint: "지금 구성에 이름을 붙여 저장하세요",
    applyStep: "적용",
    applyHint: "한 번에 다른 구성으로 전환 — 켜짐/꺼짐과 설정이 모두 복원돼요",
    deleteStep: "삭제",
    deleteHint: "더 이상 필요 없는 프로필을 지웁니다",
  },

  create: {
    placeholder: "새 프로필 이름",
    label: "프로필 만들기",
  },

  modSummary: "{{count}}개 중 {{enabled}}개 mod 활성화됨",

  applyConfirm: "이 프로필을 적용하겠습니까? 현재 mod 구성을 덮어씁니다.",
  applyConfirmDesc: "설정, 설치된 mod, 활성화/비활성화 상태를 이 프로필이 저장될 당시의 모습 그대로 되돌립니다. 빠진 mod는 자동으로 설치되고, 남는 mod는 제거됩니다.",
  deleteConfirm: "이 프로필을 삭제하겠습니까? 이 작업은 되돌릴 수 없습니다.",

  empty: {
    title: "프로필이 없습니다",
    description:
      "프로필을 만들어 현재 mod 구성을 스냅샷으로 저장하고 언제든지 되돌아오세요.",
  },

  toast: {
    created: "프로필 “{{name}}”이(가) 생성되었습니다",
    createFailed: "프로필 생성에 실패했습니다",
    applied: "프로필 “{{name}}”이(가) 적용되었습니다",
    appliedPartial: "프로필 “{{name}}”을(를) 적용했지만 {{count}}개 항목이 실패했습니다",
    backupHint: "전환하기 전의 구성이 “__backup__” 프로필로 자동 저장되었습니다. 이 프로필을 적용하면 되돌릴 수 있습니다.",
    hideManagerWarn: "이 프로필이 필수 설정인 HideManagerGameObject를 껐습니다 — 다시 켜기 전까지는 어떤 mod도 로드되지 않습니다.",
    applyFailed: "프로필 적용에 실패했습니다",
    deleted: "프로필 “{{name}}”이(가) 삭제되었습니다",
    deleteFailed: "프로필 삭제에 실패했습니다",
  },

  loadFailed: "프로필을 불러오지 못했습니다",
} as const;

export default profiles;
