
export type Language = 'fr' | 'en';

const translations = {
  fr: {
    sidebar: {
      documents: 'Documents',
      folders: 'Dossiers',
      audio: 'Audio & Réunions',
      assistant: 'Assistant IA',
      settings: 'Paramètres',
      admin: 'Administration'
    },
    documents: {
      title: 'Gestion des Documents',
      upload: 'Téléverser',
      newFolder: 'Nouveau Dossier',
      search: 'Rechercher un document...',
      empty: 'Aucun document trouvé.',
      status: {
        pending: 'En attente',
        processing: 'Traitement...',
        completed: 'Terminé',
        failed: 'Échec'
      }
    },
    assistant: {
      title: 'Assistant IA',
      placeholder: 'Posez une question sur vos documents...',
      levels: {
        n1: 'N1 - Recherche',
        n2: 'N2 - Analyse',
        n3: 'N3 - Action'
      },
      sources: 'Sources citées',
      thinking: 'L\'IA réfléchit...'
    },
    audio: {
      title: 'Enregistrements Audio',
      record: 'Enregistrer',
      stop: 'Arrêter',
      transcription: 'Transcription',
      summary: 'Résumé IA',
      actionItems: 'Actions à entreprendre'
    }
  },
  en: {
    sidebar: {
      documents: 'Documents',
      folders: 'Folders',
      audio: 'Audio & Meetings',
      assistant: 'AI Assistant',
      settings: 'Settings',
      admin: 'Admin'
    },
    documents: {
      title: 'Document Management',
      upload: 'Upload',
      newFolder: 'New Folder',
      search: 'Search documents...',
      empty: 'No documents found.',
      status: {
        pending: 'Pending',
        processing: 'Processing...',
        completed: 'Completed',
        failed: 'Failed'
      }
    },
    assistant: {
      title: 'AI Assistant',
      placeholder: 'Ask a question about your documents...',
      levels: {
        n1: 'L1 - Research',
        n2: 'L2 - Analysis',
        n3: 'L3 - Action'
      },
      sources: 'Cited Sources',
      thinking: 'AI is thinking...'
    },
    audio: {
      title: 'Audio Recordings',
      record: 'Record',
      stop: 'Stop',
      transcription: 'Transcription',
      summary: 'AI Summary',
      actionItems: 'Action Items'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
