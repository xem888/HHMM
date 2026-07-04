const settings = {
  title: "Paramètres",

  appearance: {
    title: "Apparence",
    description: "Thème et langue d'affichage.",
    theme: "Thème",
    language: "Langue",
    minimizeToTray: "Réduire dans la barre d'état à la fermeture",
    minimizeToTrayHint:
      "Une fois activé, cliquer sur le bouton de fermeture de la fenêtre réduit HHMM dans la barre d'état système au lieu de quitter. Cliquez sur l'icône pour rouvrir, ou faites un clic droit dessus pour quitter.",
  },
  theme: {
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },

  environment: {
    title: "Chemins & Environnement",
    description: "Emplacement du jeu et chargeur de mods BepInEx.",
    gamePath: "Chemin du jeu",
    gamePathEmpty: "Non défini",
    setManually: "Définir manuellement",
    openFolder: "Ouvrir le dossier",
    bepinexStatus: "Statut BepInEx",
    redeploy: "Redéployer",
    notDetected: "Non détecté",
    logs: "Journaux",
    logsHint: "Consultez le journal d'exécution pour aider à diagnostiquer les problèmes.",
    openLogs: "Voir les journaux",
  },

  about: {
    title: "À propos",
    description: "Informations sur l'application et liens.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Un gestionnaire de mods pour Human Host.",
    version: "Version",
    project: "Projet",
    openRepo: "Ouvrir sur GitHub",
    checkUpdate: "Vérifier les mises à jour",
    updateUnavailable: "La vérification des mises à jour n'est pas encore disponible.",
  },

  toast: {
    gamePathSet: "Chemin du jeu mis à jour",
    gamePathFailed: "Impossible de définir le chemin du jeu",
    deploying: "Déploiement de BepInEx…",
    deployPhase: "BepInEx : {{phase}} {{percent}}%",
    deployDone: "BepInEx déployé",
    deployFailed: "Impossible de déployer BepInEx",
    openLogsFailed: "Impossible d'ouvrir les journaux",
  },

  logViewer: {
    title: "Journal d'exécution",
    subtitle: "Activité récente (seules les dernières entrées sont affichées).",
    refresh: "Actualiser",
    copy: "Copier",
    openFolder: "Ouvrir le dossier",
    clear: "Effacer",
    empty: "Aucune entrée de journal pour le moment.",
    copied: "Journal copié dans le presse-papiers",
    copyFailed: "Impossible de copier le journal",
    cleared: "Journal effacé",
    clearFailed: "Impossible d'effacer le journal",
    clearConfirmTitle: "Effacer le journal ?",
    clearConfirmBody:
      "Cette action supprime définitivement toutes les entrées actuelles du journal et est irréversible.",
  },

  error: {
    title: "Impossible de charger les paramètres",
  },
} as const;

export default settings;
