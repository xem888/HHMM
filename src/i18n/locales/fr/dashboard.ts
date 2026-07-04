const dashboard = {
  title: "Tableau de bord",
  gameRunning: "Jeu en cours",
  gameNotRunning: "Jeu arrêté",

  error: {
    title: "Échec du chargement",
  },

  gameStatus: "Jeu",
  bepinexStatus: "BepInEx",
  detected: "Détecté",
  notDetected: "Non détecté",
  notSet: "Non défini",
  deployBepinex: "Déployer BepInEx",

  stats: {
    installed: "Installés",
    canInstall: "À installer",
    canUpdate: "Mises à jour",
    enabled: "Activés",
  },

  modActions: "Actions des mods",

  allUpToDate: "Tout est à jour",
  updatable_one: "{{count}} mod peut être mis à jour",
  updatable_other: "{{count}} mods peuvent être mis à jour",
  installable_one: "{{count}} à installer",
  installable_other: "{{count}} à installer",
  syncAll: "Tout mettre à jour",
  installAll: "Tout installer",

  launchGame: "Lancer le jeu",
  launching: "Lancement…",

  footer: {
    game: "JEU",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} activés",
  },

  sync: {
    inProgress: "Synchronisation des mods…",
    success_one: "{{count}} mod synchronisé",
    success_other: "{{count}} mods synchronisés",
    partial: "{{ok}} synchronisé(s), {{failed}} en échec",
    failedAll: "Synchronisation échouée",
    nothing: "Rien à synchroniser",
  },

  deploy: {
    inProgress: "Déploiement de BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx déployé",
    failed: "Échec du déploiement de BepInEx",
    phase: {
      download: "Téléchargement",
      extract: "Extraction",
      done: "Finalisation",
    },
  },

  launch: {
    starting: "Lancement du jeu… (via Steam, quelques secondes)",
    started: "Jeu lancé",
    slow: "Commande envoyée — le jeu charge encore…",
    failed: "Impossible de lancer le jeu",
  },

  bepinexCompat: {
    below: {
      title: "Version de BepInEx trop ancienne",
      desc: "Version {{version}} détectée, antérieure à la version recommandée 5.4.23.2. Certains mods risquent de mal fonctionner — l'installation de la version 5.4.23.2 est conseillée.",
    },
    above: {
      title: "Version de BepInEx plus récente",
      desc: "Version {{version}} détectée, postérieure à la version recommandée 5.4.23.2. Généralement sans problème, mais pas entièrement testée ; en cas d'anomalie d'un mod, suivez les instructions de son auteur pour la version correspondante.",
    },
    incompatible: {
      title: "Version de BepInEx incompatible",
      desc: "Version {{version}} détectée, une version majeure différente de celle ciblée par ces mods (BepInEx 5.x). Les mods ne pourront très probablement pas se charger — veuillez installer BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Réglage indispensable désactivé",
    desc: "Ce jeu exige HideManagerGameObject = true dans BepInEx.cfg, sinon aucun mod BepInEx ne se chargera — ils semblent installés mais n'ont aucun effet en jeu.",
    descMissing: "BepInEx.cfg n'existe pas encore (il est normalement créé au premier lancement du jeu). HHMM peut le créer dès maintenant avec le réglage indispensable — pas besoin de lancer le jeu d'abord.",
    fix: "Corriger",
    fixed: "Réglage indispensable activé — il prendra effet au prochain lancement du jeu",
    fixFailed: "Impossible d'appliquer le réglage",
  },
} as const;

export default dashboard;
