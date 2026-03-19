
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Document } from '../types/database';

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  addDocument: (doc: Document) => void;
  setSelectedDocument: (doc: Document | null) => void;
  removeDocument: (id: string) => void;
  updateDocumentStatus: (id: string, status: Document['ocrStatus']) => void;
}

// On démarre avec une liste vide pour éviter que le mock n'écrase les données utilisateur lors de la fusion du store
export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [], // Initialement vide pour laisser place aux données du localStorage
      selectedDocument: null,
      addDocument: (doc) => set((state) => ({ 
        documents: [doc, ...state.documents] 
      })),
      setSelectedDocument: (doc) => set({ selectedDocument: doc }),
      removeDocument: (id) => set((state) => ({ 
        documents: state.documents.filter(d => d.id !== id) 
      })),
      updateDocumentStatus: (id, status) => set((state) => ({
        documents: state.documents.map(d => d.id === id ? { ...d, ocrStatus: status } : d)
      })),
    }),
    {
      name: 'gedos-sovereign-vault', // Changement de clé pour forcer un clean state propre
      storage: createJSONStorage(() => localStorage),
    }
  )
);
