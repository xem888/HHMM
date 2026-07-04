const mods = {
  title: "Mis Mods",
  subtitle: "Mods de Human Host instalados",

  import: "Importar",
  dropOverlay: {
    title: "Suelta para instalar",
    hint: "Suelta archivos de mod .dll o .zip en cualquier lugar para instalarlos",
  },
  dropTip: "Arrastra un archivo de mod .dll o .zip a cualquier lugar para instalarlo — o usa « Importar » arriba.",

  searchPlaceholder: "Buscar por nombre o archivo…",

  filter: {
    all: "Todos",
    notInstalled: "No instalados",
    enabled: "Activados",
    updatable: "Actualizaciones",
  },

  sort: {
    name: "Nombre A-Z",
    nameDesc: "Nombre Z-A",
    newest: "Actualizados recientemente",
    largest: "Mayor tamaño",
  },

  status: {
    canUpdate: "Actualizar",
    upToDate: "Al día",
    notInstalled: "No instalado",
  },

  source: {
    local: "Local",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "versión desconocida",
    modified: "Actualizado {{time}}",
    unknownTime: "desconocido",
    author: "Autor",
    updatedAt: "Última actualización",
    publishedAt: "Primera publicación",
    size: "Tamaño del archivo",
    file: "Archivo",
  },

  time: {
    justNow: "ahora mismo",
    minutesAgo: "hace {{count}} min",
    hoursAgo: "hace {{count}} h",
    daysAgo: "hace {{count}} d",
  },

  action: {
    openConfig: "Abrir configuración",
    install: "Instalar",
    update: "Actualizar",
    uninstall: "Desinstalar",
  },

  empty: {
    none: {
      title: "Sin mods todavía",
      description:
        "Arrastra un archivo .dll aquí, sincroniza desde el Workshop o selecciona un archivo para instalar.",
    },
    noResults: {
      title: "Sin mods coincidentes",
      description: "Prueba con otro término de búsqueda o filtro.",
    },
  },

  error: {
    title: "No se pudieron cargar los mods",
    description: "Algo ha fallado al analizar los mods instalados.",
  },

  toast: {
    installing: "Instalando mod…",
    installed: "{{name}} instalado",
    installFailed: "Error al instalar {{name}}",
    installingOne: "Instalando…",
    installedOne: "{{name}} instalado",
    uninstalling: "Desinstalando…",
    uninstalled: "{{name}} desinstalado",
    uninstallFailed: "Error al desinstalar {{name}}",
    updating: "Actualizando…",
    updated: "{{name}} actualizado",
    updateFailed: "Error al actualizar {{name}}",
    syncing: "Sincronizando mods…",
    synced: "{{count}} mod sincronizado",
    synced_other: "{{count}} mods sincronizados",
    syncNothing: "Todo está ya al día",
    syncPartial: "{{ok}} sincronizados, {{failed}} con error",
    syncFailed: "Error de sincronización",
    enabled: "{{name}} activado",
    disabled: "{{name}} desactivado",
    toggleFailed: "Error al cambiar el estado de {{name}}",
  },
} as const;

export default mods;
