const dashboard = {
  title: "Painel",
  gameRunning: "Jogo em execução",
  gameNotRunning: "Jogo não está em execução",

  error: {
    title: "Falha ao carregar",
  },

  gameStatus: "Jogo",
  bepinexStatus: "BepInEx",
  detected: "Detetado",
  notDetected: "Não detetado",
  notSet: "Não definido",
  deployBepinex: "Implantar BepInEx",

  stats: {
    installed: "Instalados",
    canInstall: "Por instalar",
    canUpdate: "Atualizáveis",
    enabled: "Ativos",
  },

  modActions: "Ações de mods",

  allUpToDate: "Tudo está atualizado",
  updatable_one: "{{count}} mod pode ser atualizado",
  updatable_other: "{{count}} mods podem ser atualizados",
  installable_one: "{{count}} por instalar",
  installable_other: "{{count}} por instalar",
  syncAll: "Atualizar tudo",
  installAll: "Instalar tudo",

  launchGame: "Iniciar jogo",
  launching: "A iniciar…",

  footer: {
    game: "JOGO",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} ativos",
  },

  sync: {
    inProgress: "A sincronizar mods…",
    success_one: "{{count}} mod sincronizado",
    success_other: "{{count}} mods sincronizados",
    partial: "{{ok}} sincronizados, {{failed}} falharam",
    failedAll: "Sincronização falhou",
    nothing: "Nada para sincronizar",
  },

  deploy: {
    inProgress: "A implantar o BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx implantado",
    failed: "Falha na implantação do BepInEx",
    phase: {
      download: "A transferir",
      extract: "A extrair",
      done: "A finalizar",
    },
  },

  launch: {
    starting: "A iniciar o jogo… (através do Steam, demora alguns segundos)",
    started: "Jogo iniciado",
    slow: "Comando enviado — o jogo ainda está a carregar…",
    failed: "Falha ao iniciar o jogo",
  },

  bepinexCompat: {
    below: {
      title: "Versão do BepInEx mais antiga",
      desc: "Detetada a versão {{version}}, mais antiga do que a recomendada 5.4.23.2. Alguns mods poderão não funcionar corretamente — recomenda-se instalar a 5.4.23.2.",
    },
    above: {
      title: "Versão do BepInEx mais recente",
      desc: "Detetada a versão {{version}}, mais recente do que a recomendada 5.4.23.2. Normalmente funciona, mas não foi totalmente testada — se algum mod der problemas, siga as instruções do autor do mod para a versão correspondente.",
    },
    incompatible: {
      title: "Versão do BepInEx incompatível",
      desc: "Detetada a versão {{version}}, uma versão principal diferente daquela para a qual estes mods foram concebidos (BepInEx 5.x). Os mods muito provavelmente não serão carregados — instale o BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Definição obrigatória desativada",
    desc: "Este jogo precisa de HideManagerGameObject = true no BepInEx.cfg, caso contrário nenhum mod do BepInEx será carregado — parecem instalados, mas não fazem nada dentro do jogo.",
    descMissing: "O BepInEx.cfg ainda não existe (normalmente é criado no primeiro arranque do jogo). O HHMM pode criá-lo já com a definição obrigatória ativada — sem ser preciso arrancar o jogo primeiro.",
    fix: "Corrigir",
    fixed: "Definição obrigatória ativada — terá efeito no próximo arranque do jogo",
    fixFailed: "Não foi possível aplicar a definição",
  },
} as const;

export default dashboard;
