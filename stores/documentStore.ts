"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Document, Folder } from '../types/database';
import { useAuditStore } from './auditStore';

const log = (action: string, detail: string, status: 'success' | 'warning' | 'error' = 'success') =>
  useAuditStore.getState().logEvent({ action, detail, status, user: 'Utilisateur local' });

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  folders: Folder[];
  selectedFolderId: string | null;
  addDocument: (doc: Document) => void;
  setSelectedDocument: (doc: Document | null) => void;
  removeDocument: (id: string) => void;
  updateDocumentStatus: (id: string, status: Document['ocrStatus']) => void;
  addFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  setSelectedFolder: (id: string | null) => void;
  moveDocument: (docId: string, folderId: string | null) => void;
  updateDocument: (id: string, patch: Partial<Document>) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [],
      selectedDocument: null,
      folders: [],
      selectedFolderId: null,
      addDocument: (doc) => {
        log('Document importé', doc.originalName || doc.name);
        set((state) => ({ documents: [doc, ...state.documents] }));
      },
      setSelectedDocument: (doc) => set({ selectedDocument: doc }),
      removeDocument: (id) => set((state) => {
        const doc = state.documents.find(d => d.id === id);
        log('Document supprimé', doc?.name ?? id, 'warning');
        return { documents: state.documents.filter(d => d.id !== id) };
      }),
      updateDocumentStatus: (id, status) => set((state) => ({
        documents: state.documents.map(d => d.id === id ? { ...d, ocrStatus: status } : d)
      })),
      addFolder: (folder) => {
        log('Dossier créé', folder.name);
        set((state) => ({ folders: [...state.folders, folder] }));
      },
      removeFolder: (id) => set((state) => {
        const folder = state.folders.find(f => f.id === id);
        log('Dossier supprimé', folder?.name ?? id, 'warning');
        return {
          folders: state.folders.filter(f => f.id !== id),
          documents: state.documents.map(d => d.folderId === id ? { ...d, folderId: undefined } : d),
          selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
        };
      }),
      setSelectedFolder: (id) => set({ selectedFolderId: id }),
      moveDocument: (docId, folderId) => set((state) => {
        const doc = state.documents.find(d => d.id === docId);
        const folder = folderId ? state.folders.find(f => f.id === folderId) : null;
        log('Document déplacé', `${doc?.name ?? docId} → ${folder?.name ?? 'Racine'}`);
        return { documents: state.documents.map(d => d.id === docId ? { ...d, folderId: folderId ?? undefined } : d) };
      }),
      updateDocument: (id, patch) => {
        if (patch.name) log('Document renommé', patch.name);
        if (patch.tags) log('Tags mis à jour', patch.tags.join(', '));
        set((state) => ({
          documents: state.documents.map(d => d.id === id ? { ...d, ...patch } : d),
          selectedDocument: state.selectedDocument?.id === id
            ? { ...state.selectedDocument, ...patch }
            : state.selectedDocument,
        }));
      },
    }),
    {
      name: 'gedos-sovereign-vault',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
