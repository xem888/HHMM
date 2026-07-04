const common = {
  ok: "OK",
  cancel: "Annuler",
  save: "Enregistrer",
  create: "Créer",
  apply: "Appliquer",
  delete: "Supprimer",
  search: "Rechercher…",
  refresh: "Actualiser",
  enable: "Activer",
  disable: "Désactiver",
  browse: "Parcourir les fichiers",
  confirm: "Confirmer",
  discard: "Ignorer",
  retry: "Réessayer",
  reload: "Recharger",
  close: "Fermer",
  resetDefaults: "Réinitialiser par défaut",

  loading: "Chargement…",
  success: "Succès",
  failed: "Échec",
  enabled: "Activé",
  disabled: "Désactivé",
  upToDate: "À jour",
  yes: "Oui",
  no: "Non",

  workshop: "Workshop",
  local: "Local",

  error: {
    title: "Une erreur est survenue",
    description: "Une erreur inattendue s'est produite. Réessayez ou rechargez l'application.",
  },

  unsaved: {
    title: "Modifications non enregistrées",
    description: "Vous avez des modifications non enregistrées. Les ignorer ?",
  },
  trayShow: "Afficher HHMM",
  trayQuit: "Quitter",
  gameRunningBanner: "Le jeu est en cours d'exécution — les modifications des mods sont suspendues. Fermez d'abord le jeu.",
  update: {
    checkFailed: "Échec de la vérification des mises à jour",
    upToDate: "Vous avez la dernière version",
    available: "Nouvelle version {{version}} disponible",
    install: "Mettre à jour",
    downloading: "Téléchargement de la mise à jour…",
    downloadingPct: "Téléchargement {{pct}}%",
    installed: "Mise à jour installée — redémarrez pour appliquer",
    installFailed: "Échec de l'installation de la mise à jour",
  },
} as const;

export default common;
