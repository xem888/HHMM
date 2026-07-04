const dashboard = {
  title: "Panel",
  gameRunning: "Juego en ejecución",
  gameNotRunning: "Juego no iniciado",

  error: {
    title: "Error al cargar",
  },

  gameStatus: "Juego",
  bepinexStatus: "BepInEx",
  detected: "Detectado",
  notDetected: "No detectado",
  notSet: "No configurado",
  deployBepinex: "Desplegar BepInEx",

  stats: {
    installed: "Instalados",
    canInstall: "Por instalar",
    canUpdate: "Actualizables",
    enabled: "Activados",
  },

  modActions: "Acciones de mods",

  allUpToDate: "Todo está al día",
  updatable_one: "{{count}} mod puede actualizarse",
  updatable_other: "{{count}} mods pueden actualizarse",
  installable_one: "{{count}} por instalar",
  installable_other: "{{count}} por instalar",
  syncAll: "Actualizar todo",
  installAll: "Instalar todo",

  launchGame: "Iniciar juego",
  launching: "Iniciando…",

  footer: {
    game: "JUEGO",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} activados",
  },

  sync: {
    inProgress: "Sincronizando mods…",
    success_one: "{{count}} mod sincronizado",
    success_other: "{{count}} mods sincronizados",
    partial: "{{ok}} sincronizados, {{failed}} con error",
    failedAll: "Error de sincronización",
    nothing: "Nada que sincronizar",
  },

  deploy: {
    inProgress: "Desplegando BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx desplegado",
    failed: "Error al desplegar BepInEx",
    phase: {
      download: "Descargando",
      extract: "Extrayendo",
      done: "Finalizando",
    },
  },

  launch: {
    starting: "Iniciando el juego… (mediante Steam, tarda unos segundos)",
    started: "Juego iniciado",
    slow: "Comando enviado: el juego aún se está cargando…",
    failed: "Error al iniciar el juego",
  },

  bepinexCompat: {
    below: {
      title: "La versión de BepInEx es demasiado antigua",
      desc: "Se detectó la versión {{version}}, anterior a la versión recomendada 5.4.23.2. Es posible que algunos mods no funcionen correctamente; se recomienda instalar la versión 5.4.23.2.",
    },
    above: {
      title: "La versión de BepInEx es más reciente",
      desc: "Se detectó la versión {{version}}, posterior a la versión recomendada 5.4.23.2. Normalmente funciona, pero no se ha probado por completo; si un mod presenta fallos, sigue las instrucciones de su autor para la versión correspondiente.",
    },
    incompatible: {
      title: "La versión de BepInEx es incompatible",
      desc: "Se detectó la versión {{version}}, una versión principal distinta de la que utilizan estos mods (BepInEx 5.x). Lo más probable es que los mods no puedan cargarse; instala la versión BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Ajuste obligatorio desactivado",
    desc: "Este juego necesita HideManagerGameObject = true en BepInEx.cfg; de lo contrario no se cargará ningún mod de BepInEx: parecen instalados, pero no hacen nada dentro del juego.",
    descMissing: "BepInEx.cfg aún no existe (normalmente se crea al iniciar el juego por primera vez). HHMM puede crearlo ahora mismo con el ajuste obligatorio ya activado, sin necesidad de iniciar el juego antes.",
    fix: "Corregir",
    fixed: "Ajuste obligatorio activado: surtirá efecto la próxima vez que inicies el juego",
    fixFailed: "No se pudo aplicar el ajuste",
  },
} as const;

export default dashboard;
