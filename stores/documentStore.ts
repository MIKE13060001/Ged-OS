"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Document, Folder } from '../types/database';

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
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [],
      selectedDocument: null,
      folders: [],
      selectedFolderId: null,
      addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
      setSelectedDocument: (doc) => set({ selectedDocument: doc }),
      removeDocument: (id) => set((state) => ({ documents: state.documents.filter(d => d.id !== id) })),
      updateDocumentStatus: (id, status) => set((state) => ({
        documents: state.documents.map(d => d.id === id ? { ...d, ocrStatus: status } : d)
      })),
      addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
      removeFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        documents: state.documents.map(d => d.folderId === id ? { ...d, folderId: undefined } : d),
        selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
      })),
      setSelectedFolder: (id) => set({ selectedFolderId: id }),
      moveDocument: (docId, folderId) => set((state) => ({
        documents: state.documents.map(d => d.id === docId ? { ...d, folderId: folderId ?? undefined } : d)
      })),
    }),
    {
      name: 'gedos-sovereign-vault',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
