const profiles = {
  title: "Profile",
  subtitle: "Mod-Konfigurationen speichern und wechseln",

  about: {
    title: "Was sind Profile?",
    body: "Ein Profil speichert eine komplette Momentaufnahme davon, welche Mods du aktiviert hast und welche Einstellungen jeder Mod hat. Mit einem Klick wechselst du den Spielstil — kein manuelles Umschalten und Nachjustieren mehr.",
    createStep: "Erstellen",
    createHint: "Gib deiner aktuellen Konfiguration einen Namen und speichere sie",
    applyStep: "Anwenden",
    applyHint: "Zurück zu einem Profil — Schalter und Einstellungen werden alle wiederhergestellt",
    deleteStep: "Löschen",
    deleteHint: "Entferne ein Profil, das du nicht mehr brauchst",
  },

  create: {
    placeholder: "Name des neuen Profils",
    label: "Profil erstellen",
  },

  modSummary: "{{enabled}} von {{count}} Mods aktiviert",

  applyConfirm: "Dieses Profil anwenden? Die aktuelle Mod-Konfiguration wird überschrieben.",
  applyConfirmDesc: "Deine Konfigurationen, installierten Mods und Aktiviert/Deaktiviert-Zustände werden genau so wiederhergestellt, wie sie beim Speichern dieses Profils waren – fehlende Mods werden installiert, überflüssige entfernt.",
  deleteConfirm: "Dieses Profil löschen? Dies kann nicht rückgängig gemacht werden.",

  empty: {
    title: "Noch keine Profile",
    description:
      "Erstelle ein Profil, um deine aktuelle Mod-Konfiguration zu speichern, und wechsle jederzeit zurück.",
  },

  toast: {
    created: "Profil „{{name}}“ erstellt",
    createFailed: "Profil konnte nicht erstellt werden",
    applied: "Profil „{{name}}“ angewendet",
    appliedPartial: "Profil „{{name}}“ angewendet, aber {{count}} Element(e) fehlgeschlagen",
    backupHint: "Deine Konfiguration vor diesem Wechsel wurde automatisch als Profil „__backup__“ gespeichert – wende es an, um zurückzuwechseln.",
    hideManagerWarn: "Dieses Profil hat die Pflichteinstellung HideManagerGameObject deaktiviert – bis sie wieder aktiviert wird, werden keine Mods geladen.",
    applyFailed: "Profil konnte nicht angewendet werden",
    deleted: "Profil „{{name}}“ gelöscht",
    deleteFailed: "Profil konnte nicht gelöscht werden",
  },

  loadFailed: "Profile konnten nicht geladen werden",
} as const;

export default profiles;
