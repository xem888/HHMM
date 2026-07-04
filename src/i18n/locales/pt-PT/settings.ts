const settings = {
  title: "Definições",

  appearance: {
    title: "Aparência",
    description: "Tema e idioma de exibição.",
    theme: "Tema",
    language: "Idioma",
    minimizeToTray: "Minimizar para a bandeja ao fechar",
    minimizeToTrayHint:
      "Quando ativado, clicar no botão de fechar da janela esconde o HHMM na bandeja do sistema em vez de sair. Clique no ícone da bandeja para reabrir, ou clique com o botão direito para sair.",
  },
  theme: {
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
  },

  environment: {
    title: "Caminhos e Ambiente",
    description: "Localização do jogo e o carregador de mods BepInEx.",
    gamePath: "Caminho do jogo",
    gamePathEmpty: "Não definido",
    setManually: "Definir manualmente",
    openFolder: "Abrir pasta",
    bepinexStatus: "Estado do BepInEx",
    redeploy: "Reimplantar",
    notDetected: "Não detetado",
    logs: "Registos",
    logsHint: "Veja o registo de execução para ajudar a diagnosticar problemas.",
    openLogs: "Ver registos",
  },

  about: {
    title: "Sobre",
    description: "Informações e ligações da aplicação.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Um gestor de mods para Human Host.",
    version: "Versão",
    project: "Projeto",
    openRepo: "Abrir no GitHub",
    checkUpdate: "Verificar atualizações",
    updateUnavailable: "A verificação de atualizações ainda não está disponível.",
  },

  toast: {
    gamePathSet: "Caminho do jogo atualizado",
    gamePathFailed: "Falha ao definir o caminho do jogo",
    deploying: "A implantar o BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx implantado",
    deployFailed: "Falha ao implantar o BepInEx",
    openLogsFailed: "Falha ao abrir os registos",
  },

  logViewer: {
    title: "Registo de execução",
    subtitle: "Atividade mais recente (são apresentadas as entradas mais recentes).",
    refresh: "Atualizar",
    copy: "Copiar",
    openFolder: "Abrir pasta",
    clear: "Limpar",
    empty: "Ainda não há entradas no registo.",
    copied: "Registo copiado para a área de transferência",
    copyFailed: "Falha ao copiar o registo",
    cleared: "Registo limpo",
    clearFailed: "Falha ao limpar o registo",
    clearConfirmTitle: "Limpar o registo?",
    clearConfirmBody:
      "Isto remove permanentemente todas as entradas atuais do registo e não pode ser anulado.",
  },

  error: {
    title: "Falha ao carregar definições",
  },
} as const;

export default settings;
