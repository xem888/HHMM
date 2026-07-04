const profiles = {
  title: "Profili",
  subtitle: "Salva e passa tra diverse configurazioni di mod",

  about: {
    title: "Cosa sono i profili?",
    body: "Un profilo salva un'istantanea completa dei mod che hai attivato e di tutte le loro impostazioni. Cambi stile di gioco con un clic, senza dover riattivare e risistemare tutto a mano.",
    createStep: "Crea",
    createHint: "Dai un nome alla configurazione attuale e salvala",
    applyStep: "Applica",
    applyHint: "Torna a un profilo — interruttori e impostazioni tutto ripristinato",
    deleteStep: "Elimina",
    deleteHint: "Rimuovi un profilo che non ti serve più",
  },

  create: {
    placeholder: "Nome del nuovo profilo",
    label: "Crea profilo",
  },

  modSummary: "{{enabled}} di {{count}} mod abilitati",

  applyConfirm: "Applicare questo profilo? La configurazione mod attuale verrà sovrascritta.",
  applyConfirmDesc: "Le tue configurazioni, i mod installati e gli stati di attivazione/disattivazione verranno ripristinati esattamente com'erano al salvataggio di questo profilo: i mod mancanti verranno installati e quelli in più rimossi.",
  deleteConfirm: "Eliminare questo profilo? L'operazione non può essere annullata.",

  empty: {
    title: "Nessun profilo",
    description:
      "Crea un profilo per salvare la configurazione mod attuale, poi ripristinala in qualsiasi momento.",
  },

  toast: {
    created: "Profilo «{{name}}» creato",
    createFailed: "Creazione del profilo non riuscita",
    applied: "Profilo «{{name}}» applicato",
    appliedPartial: "Profilo «{{name}}» applicato, ma {{count}} elemento/i non sono riusciti",
    backupHint: "La tua configurazione prima di questo cambio è stata salvata automaticamente nel profilo «__backup__» — applicalo per ripristinarla.",
    hideManagerWarn: "Questo profilo ha disattivato l'impostazione obbligatoria HideManagerGameObject: nessun mod verrà caricato finché non viene riattivata.",
    applyFailed: "Applicazione del profilo non riuscita",
    deleted: "Profilo «{{name}}» eliminato",
    deleteFailed: "Eliminazione del profilo non riuscita",
  },

  loadFailed: "Caricamento dei profili non riuscito",
} as const;

export default profiles;
