const common = {
  ok: "Aceptar",
  cancel: "Cancelar",
  save: "Guardar",
  create: "Crear",
  apply: "Aplicar",
  delete: "Eliminar",
  search: "Buscar…",
  refresh: "Actualizar",
  enable: "Activar",
  disable: "Desactivar",
  browse: "Examinar archivos",
  confirm: "Confirmar",
  discard: "Descartar",
  retry: "Reintentar",
  reload: "Recargar",
  close: "Cerrar",
  resetDefaults: "Restablecer valores predeterminados",

  loading: "Cargando…",
  success: "Correcto",
  failed: "Error",
  enabled: "Activado",
  disabled: "Desactivado",
  upToDate: "Al día",
  yes: "Sí",
  no: "No",

  workshop: "Workshop",
  local: "Local",

  error: {
    title: "Algo ha ido mal",
    description: "Se ha producido un error inesperado. Inténtalo de nuevo o recarga la aplicación.",
  },

  unsaved: {
    title: "Cambios sin guardar",
    description: "Tienes cambios sin guardar. ¿Descartarlos?",
  },
  trayShow: "Mostrar HHMM",
  trayQuit: "Salir",
  gameRunningBanner: "El juego está en ejecución: los cambios de mods están en pausa. Cierra primero el juego.",
  update: {
    checkFailed: "Error al buscar actualizaciones",
    upToDate: "Tienes la última versión",
    available: "Nueva versión {{version}} disponible",
    install: "Actualizar ahora",
    downloading: "Descargando actualización…",
    downloadingPct: "Descargando {{pct}}%",
    installed: "Actualización instalada: reinicia para aplicar",
    installFailed: "Error al instalar la actualización",
  },
} as const;

export default common;
