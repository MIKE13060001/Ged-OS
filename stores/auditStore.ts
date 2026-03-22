"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AuditStatus = 'success' | 'warning' | 'error';

export interface AuditEvent {
  id: string;
  action: string;
  detail: string;
  status: AuditStatus;
  user: string;
  timestamp: string; // ISO
}

interface AuditState {
  events: AuditEvent[];
  logEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  clearEvents: () => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      events: [],
      logEvent: (event) => set((state) => ({
        events: [
          {
            ...event,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
          ...state.events,
        ].slice(0, 200), // garde les 200 derniers événements
      })),
      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'gedos-audit-log',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
