
import { create } from 'zustand';
import { Language } from '../lib/i18n';

interface UIState {
  language: Language;
  sidebarOpen: boolean;
  assistantPanelOpen: boolean;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  toggleAssistantPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  language: 'fr',
  sidebarOpen: true,
  assistantPanelOpen: true,
  setLanguage: (lang) => set({ language: lang }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAssistantPanel: () => set((state) => ({ assistantPanelOpen: !state.assistantPanelOpen })),
}));
