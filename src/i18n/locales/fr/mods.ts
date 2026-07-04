const mods = {
  title: "Mes Mods",
  subtitle: "Mods Human Host installés",

  import: "Importer",
  dropOverlay: {
    title: "Déposez pour installer",
    hint: "Déposez des fichiers .dll ou .zip n'importe où pour les installer",
  },
  dropTip: "Glissez un fichier mod .dll ou .zip n'importe où pour l'installer — ou utilisez « Importer » ci-dessus.",

  searchPlaceholder: "Rechercher par nom ou fichier…",

  filter: {
    all: "Tous",
    notInstalled: "Non installés",
    enabled: "Activés",
    updatable: "Mises à jour",
  },

  sort: {
    name: "Nom A-Z",
    nameDesc: "Nom Z-A",
    newest: "Récemment mis à jour",
    largest: "Taille la plus grande",
  },

  status: {
    canUpdate: "Mettre à jour",
    upToDate: "À jour",
    notInstalled: "Non installé",
  },

  source: {
    local: "Local",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "version inconnue",
    modified: "Mis à jour {{time}}",
    unknownTime: "inconnu",
    author: "Auteur",
    updatedAt: "Dernière mise à jour",
    publishedAt: "Première publication",
    size: "Taille du fichier",
    file: "Fichier",
  },

  time: {
    justNow: "à l'instant",
    minutesAgo: "il y a {{count}} min",
    hoursAgo: "il y a {{count}} h",
    daysAgo: "il y a {{count}} j",
  },

  action: {
    openConfig: "Ouvrir la config",
    install: "Installer",
    update: "Mettre à jour",
    uninstall: "Désinstaller",
  },

  empty: {
    none: {
      title: "Aucun mod pour l'instant",
      description:
        "Faites glisser un fichier .dll ici, synchronisez depuis le Workshop, ou parcourez les fichiers pour installer un mod.",
    },
    noResults: {
      title: "Aucun mod correspondant",
      description: "Essayez un autre terme de recherche ou filtre.",
    },
  },

  error: {
    title: "Impossible de charger les mods",
    description: "Une erreur s'est produite lors de la lecture des mods installés.",
  },

  toast: {
    installing: "Installation du mod…",
    installed: "{{name}} installé",
    installFailed: "Impossible d'installer {{name}}",
    installingOne: "Installation…",
    installedOne: "{{name}} installé",
    uninstalling: "Désinstallation…",
    uninstalled: "{{name}} désinstallé",
    uninstallFailed: "Impossible de désinstaller {{name}}",
    updating: "Mise à jour…",
    updated: "{{name}} mis à jour",
    updateFailed: "Impossible de mettre à jour {{name}}",
    syncing: "Synchronisation des mods…",
    synced: "{{count}} mod synchronisé",
    synced_other: "{{count}} mods synchronisés",
    syncNothing: "Tout est déjà à jour",
    syncPartial: "{{ok}} synchronisé(s), {{failed}} en échec",
    syncFailed: "Synchronisation échouée",
    enabled: "{{name}} activé",
    disabled: "{{name}} désactivé",
    toggleFailed: "Impossible de basculer {{name}}",
  },
} as const;

export default mods;
