const profiles = {
  title: "Perfis",
  subtitle: "Guarde e alterne entre configurações de mods",

  about: {
    title: "O que são perfis?",
    body: "Um perfil guarda uma cópia completa dos mods que tens ativados e de todas as definições de cada mod. Mudas de estilo de jogo com um clique, sem teres de ativar e reajustar tudo à mão.",
    createStep: "Criar",
    createHint: "Dá um nome à tua configuração atual e guarda-a",
    applyStep: "Aplicar",
    applyHint: "Volta a um perfil — interruptores e definições tudo reposto",
    deleteStep: "Eliminar",
    deleteHint: "Remove um perfil de que já não precisas",
  },

  create: {
    placeholder: "Nome do novo perfil",
    label: "Criar perfil",
  },

  modSummary: "{{enabled}} de {{count}} mods ativos",

  applyConfirm: "Aplicar este perfil? A configuração atual de mods será substituída.",
  applyConfirmDesc: "Repõe as tuas configurações, os mods instalados e os estados de ativado/desativado exatamente como estavam quando este perfil foi guardado — os mods em falta são instalados e os que estiverem a mais são desinstalados.",
  deleteConfirm: "Eliminar este perfil? Esta ação não pode ser desfeita.",

  empty: {
    title: "Ainda não há perfis",
    description:
      "Crie um perfil para guardar a sua configuração atual de mods e voltar a ela a qualquer momento.",
  },

  toast: {
    created: "Perfil «{{name}}» criado",
    createFailed: "Falha ao criar perfil",
    applied: "Perfil «{{name}}» aplicado",
    appliedPartial: "Perfil «{{name}}» aplicado, mas {{count}} item(ns) falharam",
    backupHint: "A tua configuração antes desta troca foi guardada automaticamente como o perfil «__backup__» — aplica-o para reverter.",
    hideManagerWarn: "Este perfil desativou a definição obrigatória HideManagerGameObject — nenhum mod será carregado até voltar a ativá-la.",
    applyFailed: "Falha ao aplicar perfil",
    deleted: "Perfil «{{name}}» eliminado",
    deleteFailed: "Falha ao eliminar perfil",
  },

  loadFailed: "Falha ao carregar perfis",
} as const;

export default profiles;
