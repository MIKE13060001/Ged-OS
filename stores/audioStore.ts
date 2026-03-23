"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SynthesisTemplate {
  id: string;
  label: string;
  prompt: string;
  isDefault: boolean;
  createdAt: string;
}

export const DEFAULT_TEMPLATES: SynthesisTemplate[] = [
  {
    id: 'transcription',
    label: 'Transcription',
    prompt: 'Transcris intégralement cet enregistrement audio. Garde le texte fidèle mot à mot, avec la ponctuation et les paragraphes.',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cr-reunion',
    label: 'CR Réunion',
    prompt: 'Génère un compte-rendu structuré : Date & Participants, Ordre du jour, Points abordés, Décisions prises, Actions à mener (responsable + échéance).',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'synthese-rh',
    label: 'Synthèse RH',
    prompt: "Produis une synthèse RH structurée : Contexte (type d'entretien), Profil concerné, Points clés, Évaluation, Recommandations, Suivi nécessaire.",
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'resume-client',
    label: 'Résumé Client',
    prompt: "Génère un résumé client : Client (nom, entreprise), Objet de l'échange, Besoins exprimés, Propositions faites, Objections, Prochaines étapes, Température du deal.",
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'liste-actions',
    label: 'Actions',
    prompt: 'Extrais la liste des actions. Pour chaque action : Action, Responsable, Échéance, Priorité (Haute/Moyenne/Basse). Trie par priorité.',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export interface Recording {
  id: string;
  title: string;
  audioDataUrl: string;
  durationSeconds: number;
  synthesisType: string;
  transcription: string | null;
  tags: string[];
  addedToGed: boolean;
  gedDocumentId: string | null;
  createdAt: string;
}

interface AudioState {
  recordings: Recording[];
  templates: SynthesisTemplate[];
  addRecording: (rec: Recording) => void;
  updateRecording: (id: string, patch: Partial<Recording>) => void;
  removeRecording: (id: string) => void;
  markAddedToGed: (id: string, docId: string) => void;
  addTemplate: (tpl: SynthesisTemplate) => void;
  updateTemplate: (id: string, patch: Partial<SynthesisTemplate>) => void;
  removeTemplate: (id: string) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      recordings: [],
      templates: DEFAULT_TEMPLATES,
      addRecording: (rec) => set((s) => ({ recordings: [rec, ...s.recordings] })),
      updateRecording: (id, patch) => set((s) => ({
        recordings: s.recordings.map((r) => r.id === id ? { ...r, ...patch } : r),
      })),
      removeRecording: (id) => set((s) => ({
        recordings: s.recordings.filter((r) => r.id !== id),
      })),
      markAddedToGed: (id, docId) => set((s) => ({
        recordings: s.recordings.map((r) =>
          r.id === id ? { ...r, addedToGed: true, gedDocumentId: docId } : r
        ),
      })),
      addTemplate: (tpl) => set((s) => ({ templates: [...s.templates, tpl] })),
      updateTemplate: (id, patch) => set((s) => ({
        templates: s.templates.map((t) => t.id === id ? { ...t, ...patch } : t),
      })),
      removeTemplate: (id) => set((s) => ({
        templates: s.templates.filter((t) => t.id !== id),
      })),
    }),
    {
      name: 'gedos-audio-recordings',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<AudioState>;
        const existingIds = new Set((state?.templates || []).map(t => t.id));
        const missingDefaults = DEFAULT_TEMPLATES.filter(d => !existingIds.has(d.id));
        return {
          ...current,
          ...state,
          templates: [...(state?.templates || DEFAULT_TEMPLATES), ...missingDefaults],
        } as AudioState;
      },
    }
  )
);
