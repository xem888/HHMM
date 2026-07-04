const config = {
  title: "Configuração",
  filesTitle: "Ficheiros de configuração",
  noConfig: "Nenhum ficheiro de configuração encontrado",
  noConfigHint:
    "Os ficheiros de configuração aparecem aqui depois de os mods serem executados uma vez e o BepInEx gerar os respetivos ficheiros .cfg.",

  selectTitle: "Selecione um ficheiro de configuração",
  selectHint: "Escolha um ficheiro à esquerda para editar as suas definições.",

  loadFailedTitle: "Falha ao carregar configuração",
  loadFailedHint: "Não foi possível ler o ficheiro de configuração. Tente recarregar.",

  searchPlaceholder: "Pesquisar definições…",
  noMatch: "Nenhuma definição corresponde à pesquisa",

  save: "Guardar",
  saveWithCount: "Guardar ({{count}})",
  saveSuccess: "{{count}} alteração guardada",
  saveSuccess_other: "{{count}} alterações guardadas",
  saveFailed: "Falha ao guardar configuração",

  openFile: "Abrir ficheiro original",
  openFileConfirmTitle: "Abrir o ficheiro de configuração original?",
  openFileConfirmDesc:
    "Tem alterações não guardadas no editor. Editar diretamente o ficheiro original pode entrar em conflito com elas — guarde ou descarte primeiro as alterações do editor. Abrir mesmo assim?",
  openFileConfirm: "Abrir mesmo assim",
  openFileFailed: "Falha ao abrir o ficheiro",

  resetSection: "Repor secção",
  resetSectionTip: "Repor todas as definições desta secção para os valores predefinidos",
  resetNoDefaults: "Esta secção não tem valores predefinidos para repor",
  resetApplied: "{{count}} definição reposta para o valor predefinido — Guarde para aplicar",
  resetApplied_other: "{{count}} definições repostas para os valores predefinidos — Guarde para aplicar",

  defaultLabel: "Predefinição",
  rangeLabel: "Intervalo",
  acceptableLabel: "Permitido",
  dynamicCount: "{{count}} item",
  dynamicCount_other: "{{count}} itens",

  pressKey: "Prima uma tecla…",

  bepinexWarning: {
    title: "Edite com cuidado",
    description:
      "Esta é a configuração do framework BepInEx, não as definições de um mod. Não altere nada a menos que saiba exatamente o que está a fazer, ou que o autor de um mod lhe peça explicitamente para alterar uma opção específica — um erro pode impedir o carregamento dos mods ou danificar o jogo.",
  },
} as const;

export default config;
