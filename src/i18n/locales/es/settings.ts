const settings = {
  title: "Ajustes",

  appearance: {
    title: "Apariencia",
    description: "Tema e idioma de la interfaz.",
    theme: "Tema",
    language: "Idioma",
    minimizeToTray: "Minimizar a la bandeja al cerrar",
    minimizeToTrayHint:
      "Cuando está activado, al pulsar el botón de cerrar de la ventana, HHMM se oculta en la bandeja del sistema en lugar de salir. Haz clic en el icono de la bandeja para volver a abrirlo, o clic derecho para salir.",
  },
  theme: {
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  },

  environment: {
    title: "Rutas y entorno",
    description: "Ubicación del juego y el cargador de mods BepInEx.",
    gamePath: "Ruta del juego",
    gamePathEmpty: "No configurada",
    setManually: "Configurar manualmente",
    openFolder: "Abrir carpeta",
    bepinexStatus: "Estado de BepInEx",
    redeploy: "Volver a desplegar",
    notDetected: "No detectado",
    logs: "Registros",
    logsHint: "Consulta el registro de ejecución para ayudar a diagnosticar problemas.",
    openLogs: "Ver registros",
  },

  about: {
    title: "Acerca de",
    description: "Información de la aplicación y enlaces.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Un gestor de mods para Human Host.",
    version: "Versión",
    project: "Proyecto",
    openRepo: "Abrir en GitHub",
    checkUpdate: "Buscar actualizaciones",
    updateUnavailable: "La búsqueda de actualizaciones no está disponible aún.",
  },

  toast: {
    gamePathSet: "Ruta del juego actualizada",
    gamePathFailed: "Error al configurar la ruta del juego",
    deploying: "Desplegando BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx desplegado",
    deployFailed: "Error al desplegar BepInEx",
    openLogsFailed: "Error al abrir los registros",
  },

  logViewer: {
    title: "Registro de ejecución",
    subtitle: "Actividad reciente (solo se muestran las entradas más recientes).",
    refresh: "Actualizar",
    copy: "Copiar",
    openFolder: "Abrir carpeta",
    clear: "Borrar",
    empty: "Todavía no hay entradas de registro.",
    copied: "Registro copiado al portapapeles",
    copyFailed: "Error al copiar el registro",
    cleared: "Registro borrado",
    clearFailed: "Error al borrar el registro",
    clearConfirmTitle: "¿Borrar el registro?",
    clearConfirmBody:
      "Esto elimina permanentemente todas las entradas actuales del registro y no se puede deshacer.",
  },

  error: {
    title: "Error al cargar los ajustes",
  },
} as const;

export default settings;
