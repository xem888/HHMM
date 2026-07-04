const profiles = {
  title: "Profils",
  subtitle: "Sauvegarder et basculer entre différentes configurations de mods",

  about: {
    title: "C'est quoi un profil ?",
    body: "Un profil enregistre une copie complète des mods que tu as activés et de tous leurs réglages. Tu changes de style de jeu en un clic, sans avoir à tout réactiver et reconfigurer à la main.",
    createStep: "Créer",
    createHint: "Donne un nom à ta config actuelle et enregistre-la",
    applyStep: "Appliquer",
    applyHint: "Reviens à un profil — interrupteurs et réglages tout est restauré",
    deleteStep: "Supprimer",
    deleteHint: "Retire un profil dont tu n'as plus besoin",
  },

  create: {
    placeholder: "Nom du nouveau profil",
    label: "Créer un profil",
  },

  modSummary: "{{enabled}} mod(s) activé(s) sur {{count}}",

  applyConfirm: "Appliquer ce profil ? La configuration de mods actuelle sera écrasée.",
  applyConfirmDesc: "Vos configurations, vos mods installés et leurs états activé/désactivé seront restaurés exactement tels qu'ils étaient lors de l'enregistrement de ce profil — les mods manquants seront installés et ceux en trop supprimés.",
  deleteConfirm: "Supprimer ce profil ? Cette action est irréversible.",

  empty: {
    title: "Aucun profil pour l'instant",
    description:
      "Créez un profil pour capturer votre configuration de mods actuelle, puis revenez-y à tout moment.",
  },

  toast: {
    created: "Profil « {{name}} » créé",
    createFailed: "Impossible de créer le profil",
    applied: "Profil « {{name}} » appliqué",
    appliedPartial: "Profil « {{name}} » appliqué, mais {{count}} élément(s) ont échoué",
    backupHint: "Votre configuration avant ce changement a été enregistrée automatiquement dans le profil « __backup__ » — appliquez-le pour revenir en arrière.",
    hideManagerWarn: "Ce profil a désactivé le réglage indispensable HideManagerGameObject — aucun mod ne se chargera tant qu'il n'est pas réactivé.",
    applyFailed: "Impossible d'appliquer le profil",
    deleted: "Profil « {{name}} » supprimé",
    deleteFailed: "Impossible de supprimer le profil",
  },

  loadFailed: "Impossible de charger les profils",
} as const;

export default profiles;
