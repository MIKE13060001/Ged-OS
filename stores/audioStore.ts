"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SynthesisType = 'transcription' | 'cr-reunion' | 'synthese-rh' | 'resume-client' | 'liste-actions';

export const SYNTHESIS_OPTIONS: { value: SynthesisType; label: string; icon: string }[] = [
  { value: 'transcription', label: 'Transcription brute', icon: '📝' },
  { value: 'cr-reunion', label: 'CR de réunion', icon: '🤝' },
  { value: 'synthese-rh', label: 'Synthèse RH', icon: '👥' },
  { value: 'resume-client', label: 'Résumé client', icon: '💼' },
  { value: 'liste-actions', label: "Liste d'actions", icon: '✅' },
];

export interface Recording {
  id: string;
  title: string;
  audioDataUrl: string;
  durationSeconds: number;
  synthesisType: SynthesisType;
  transcription: string | null;
  tags: string[];
  addedToGed: boolean;
  gedDocumentId: string | null;
  createdAt: string;
}

interface AudioState {
  recordings: Recording[];
  addRecording: (rec: Recording) => void;
  updateRecording: (id: string, patch: Partial<Recording>) => void;
  removeRecording: (id: string) => void;
  markAddedToGed: (id: string, docId: string) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      recordings: [],
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
    }),
    {
      name: 'gedos-audio-recordings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
