const config = {
  title: "Config",
  filesTitle: "Fichiers de config",
  noConfig: "Aucun fichier de config trouvé",
  noConfigHint:
    "Les configs apparaissent ici après que les mods ont été exécutés une fois et que BepInEx a généré leurs fichiers .cfg.",

  selectTitle: "Sélectionnez un fichier de config",
  selectHint: "Choisissez un fichier à gauche pour modifier ses paramètres.",

  loadFailedTitle: "Impossible de charger la config",
  loadFailedHint: "Le fichier de config n'a pas pu être lu. Essayez de recharger.",

  searchPlaceholder: "Rechercher des paramètres…",
  noMatch: "Aucun paramètre ne correspond à votre recherche",

  save: "Enregistrer",
  saveWithCount: "Enregistrer ({{count}})",
  saveSuccess: "{{count}} modification enregistrée",
  saveSuccess_other: "{{count}} modifications enregistrées",
  saveFailed: "Impossible d'enregistrer la config",

  openFile: "Ouvrir le fichier brut",
  openFileConfirmTitle: "Ouvrir le fichier de config brut ?",
  openFileConfirmDesc:
    "Vous avez des modifications non enregistrées dans l'éditeur. Modifier directement le fichier brut peut entrer en conflit avec elles — enregistrez ou abandonnez d'abord vos modifications dans l'éditeur. Ouvrir quand même ?",
  openFileConfirm: "Ouvrir quand même",
  openFileFailed: "Impossible d'ouvrir le fichier",

  resetSection: "Réinitialiser la section",
  resetSectionTip: "Réinitialiser tous les paramètres de cette section à leurs valeurs par défaut",
  resetNoDefaults: "Cette section n'a pas de valeurs par défaut à réinitialiser",
  resetApplied: "{{count}} paramètre réinitialisé — Enregistrez pour appliquer",
  resetApplied_other: "{{count}} paramètres réinitialisés — Enregistrez pour appliquer",

  defaultLabel: "Défaut",
  rangeLabel: "Plage",
  acceptableLabel: "Autorisé",
  dynamicCount: "{{count}} élément",
  dynamicCount_other: "{{count}} éléments",

  pressKey: "Appuyez sur une touche…",

  bepinexWarning: {
    title: "Modifier avec prudence",
    description:
      "Ceci est la configuration du framework BepInEx, pas les réglages d'un mod. Ne changez rien à moins de savoir exactement ce que vous faites, ou qu'un auteur de mod vous demande explicitement de modifier une option précise — une erreur peut empêcher le chargement des mods ou casser le jeu.",
  },
} as const;

export default config;
