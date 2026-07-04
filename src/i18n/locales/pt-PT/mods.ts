const mods = {
  title: "Os Meus Mods",
  subtitle: "Mods instalados no Human Host",

  import: "Importar",
  dropOverlay: {
    title: "Largue para instalar",
    hint: "Largue ficheiros de mod .dll ou .zip em qualquer lugar para instalar",
  },
  dropTip: "Arraste um ficheiro de mod .dll ou .zip para qualquer lugar para o instalar — ou use “Importar” acima.",

  searchPlaceholder: "Pesquisar por nome ou ficheiro…",

  filter: {
    all: "Todos",
    notInstalled: "Não instalados",
    enabled: "Ativos",
    updatable: "Atualizações",
  },

  sort: {
    name: "Nome A-Z",
    nameDesc: "Nome Z-A",
    newest: "Atualizados recentemente",
    largest: "Maior tamanho",
  },

  status: {
    canUpdate: "Atualizar",
    upToDate: "Atualizado",
    notInstalled: "Não instalado",
  },

  source: {
    local: "Local",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "versão desconhecida",
    modified: "Atualizado {{time}}",
    unknownTime: "desconhecido",
    author: "Autor",
    updatedAt: "Última atualização",
    publishedAt: "Primeira publicação",
    size: "Tamanho do ficheiro",
    file: "Ficheiro",
  },

  time: {
    justNow: "agora mesmo",
    minutesAgo: "há {{count}} min",
    hoursAgo: "há {{count}} h",
    daysAgo: "há {{count}} d",
  },

  action: {
    openConfig: "Abrir configuração",
    install: "Instalar",
    update: "Atualizar",
    uninstall: "Desinstalar",
  },

  empty: {
    none: {
      title: "Ainda não há mods",
      description:
        "Arraste um ficheiro .dll para aqui, sincronize com o Workshop ou procure um ficheiro para instalar.",
    },
    noResults: {
      title: "Nenhum mod encontrado",
      description: "Tente um termo de pesquisa ou filtro diferente.",
    },
  },

  error: {
    title: "Não foi possível carregar os mods",
    description: "Ocorreu um erro ao analisar os mods instalados.",
  },

  toast: {
    installing: "A instalar mod…",
    installed: "{{name}} instalado",
    installFailed: "Falha ao instalar {{name}}",
    installingOne: "A instalar…",
    installedOne: "{{name}} instalado",
    uninstalling: "A desinstalar…",
    uninstalled: "{{name}} desinstalado",
    uninstallFailed: "Falha ao desinstalar {{name}}",
    updating: "A atualizar…",
    updated: "{{name}} atualizado",
    updateFailed: "Falha ao atualizar {{name}}",
    syncing: "A sincronizar mods…",
    synced: "{{count}} mod sincronizado",
    synced_other: "{{count}} mods sincronizados",
    syncNothing: "Tudo já está atualizado",
    syncPartial: "{{ok}} sincronizados, {{failed}} falharam",
    syncFailed: "Sincronização falhou",
    enabled: "{{name}} ativado",
    disabled: "{{name}} desativado",
    toggleFailed: "Falha ao alternar {{name}}",
  },
} as const;

export default mods;
