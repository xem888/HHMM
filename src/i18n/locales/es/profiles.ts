const profiles = {
  title: "Perfiles",
  subtitle: "Guarda y cambia entre configuraciones de mods",

  about: {
    title: "¿Qué son los perfiles?",
    body: "Un perfil guarda una copia completa de qué mods tienes activados y de todos los ajustes de cada mod. Cambias de estilo de juego con un clic, sin tener que activar y reajustar todo a mano.",
    createStep: "Crear",
    createHint: "Ponle un nombre a tu configuración actual y guárdala",
    applyStep: "Aplicar",
    applyHint: "Vuelve a un perfil — interruptores y ajustes todo restaurado",
    deleteStep: "Eliminar",
    deleteHint: "Quita un perfil que ya no necesitas",
  },

  create: {
    placeholder: "Nombre del nuevo perfil",
    label: "Crear perfil",
  },

  modSummary: "{{enabled}} de {{count}} mods activados",

  applyConfirm: "¿Aplicar este perfil? La configuración de mods actual se sobreescribirá.",
  applyConfirmDesc: "Restaura tus configuraciones, los mods instalados y sus estados de activado/desactivado tal y como estaban al guardar este perfil: los mods que falten se instalarán y los sobrantes se desinstalarán.",
  deleteConfirm: "¿Eliminar este perfil? Esta acción no se puede deshacer.",

  empty: {
    title: "Sin perfiles todavía",
    description:
      "Crea un perfil para guardar tu configuración de mods actual y volver a ella cuando quieras.",
  },

  toast: {
    created: "Perfil «{{name}}» creado",
    createFailed: "Error al crear el perfil",
    applied: "Perfil «{{name}}» aplicado",
    appliedPartial: "Perfil «{{name}}» aplicado, pero {{count}} elemento(s) fallaron",
    backupHint: "Tu configuración antes de este cambio se guardó automáticamente como el perfil «__backup__» — aplícalo para revertir.",
    hideManagerWarn: "Este perfil desactivó el ajuste obligatorio HideManagerGameObject: no se cargará ningún mod hasta que vuelvas a activarlo.",
    applyFailed: "Error al aplicar el perfil",
    deleted: "Perfil «{{name}}» eliminado",
    deleteFailed: "Error al eliminar el perfil",
  },

  loadFailed: "Error al cargar los perfiles",
} as const;

export default profiles;
