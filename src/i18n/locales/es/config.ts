const config = {
  title: "Configuración",
  filesTitle: "Archivos de configuración",
  noConfig: "No se encontraron archivos de configuración",
  noConfigHint:
    "Los archivos de configuración aparecerán aquí después de que los mods se ejecuten por primera vez y BepInEx genere sus archivos .cfg.",

  selectTitle: "Selecciona un archivo de configuración",
  selectHint: "Elige un archivo a la izquierda para editar sus ajustes.",

  loadFailedTitle: "Error al cargar la configuración",
  loadFailedHint: "No se pudo leer el archivo de configuración. Intenta recargarlo.",

  searchPlaceholder: "Buscar ajustes…",
  noMatch: "Ningún ajuste coincide con tu búsqueda",

  save: "Guardar",
  saveWithCount: "Guardar ({{count}})",
  saveSuccess: "{{count}} cambio guardado",
  saveSuccess_other: "{{count}} cambios guardados",
  saveFailed: "Error al guardar la configuración",

  openFile: "Abrir el archivo original",
  openFileConfirmTitle: "¿Abrir el archivo de configuración original?",
  openFileConfirmDesc:
    "Tienes cambios sin guardar en el editor. Editar directamente el archivo original puede entrar en conflicto con ellos — guarda o descarta primero tus cambios en el editor. ¿Abrir de todos modos?",
  openFileConfirm: "Abrir de todos modos",
  openFileFailed: "No se pudo abrir el archivo",

  resetSection: "Restablecer sección",
  resetSectionTip: "Restablecer todos los ajustes de esta sección a sus valores predeterminados",
  resetNoDefaults: "Esta sección no tiene valores predeterminados para restablecer",
  resetApplied: "{{count}} ajuste restablecido al valor predeterminado — Guarda para aplicar",
  resetApplied_other: "{{count}} ajustes restablecidos a sus valores predeterminados — Guarda para aplicar",

  defaultLabel: "Predeterminado",
  rangeLabel: "Rango",
  acceptableLabel: "Permitido",
  dynamicCount: "{{count}} elemento",
  dynamicCount_other: "{{count}} elementos",

  pressKey: "Pulsa una tecla…",

  bepinexWarning: {
    title: "Edita con cuidado",
    description:
      "Esta es la configuración del framework BepInEx, no los ajustes de un mod. No cambies nada a menos que sepas exactamente lo que haces, o que el autor de un mod te indique explícitamente que modifiques una opción concreta: un error puede impedir que los mods se carguen o estropear el juego.",
  },
} as const;

export default config;
