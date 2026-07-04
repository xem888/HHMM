const profiles = {
  title: "Profiles",
  subtitle: "Save and switch between mod setups",

  about: {
    title: "What are profiles?",
    body: "A profile saves a complete snapshot of which mods you have enabled and all of each mod's settings. Switch playstyles with one click — no need to toggle and re-tune everything by hand.",
    createStep: "Create",
    createHint: "Name your current setup and save it",
    applyStep: "Apply",
    applyHint: "Switch back to a profile — toggles and settings all restored",
    deleteStep: "Delete",
    deleteHint: "Remove a profile you no longer need",
  },

  create: {
    placeholder: "New profile name",
    label: "Create profile",
  },

  modSummary: "{{enabled}} of {{count}} mods enabled",

  applyConfirm: "Apply this profile? Current mod setup will be overwritten.",
  applyConfirmDesc: "Restores your configs, installed mods, and enable/disable states to exactly how they were when this profile was saved — missing mods get installed, extra ones removed.",
  deleteConfirm: "Delete this profile? This cannot be undone.",

  empty: {
    title: "No profiles yet",
    description:
      "Create a profile to snapshot your current mod setup, then switch back anytime.",
  },

  toast: {
    created: "Profile “{{name}}” created",
    createFailed: "Failed to create profile",
    applied: "Profile “{{name}}” applied",
    appliedPartial: "Profile “{{name}}” applied, but {{count}} item(s) failed",
    backupHint: "Your setup before this switch was auto-saved as the “__backup__” profile — apply it to roll back.",
    hideManagerWarn: "This profile turned off the required setting HideManagerGameObject — mods won't load until it's re-enabled.",
    applyFailed: "Failed to apply profile",
    deleted: "Profile “{{name}}” deleted",
    deleteFailed: "Failed to delete profile",
  },

  loadFailed: "Failed to load profiles",
} as const;

export default profiles;
