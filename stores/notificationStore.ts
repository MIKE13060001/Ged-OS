"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationState {
  lastSeenAt: string | null; // ISO — timestamp du dernier "panel ouvert"
  markAllSeen: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      lastSeenAt: null,
      markAllSeen: () => set({ lastSeenAt: new Date().toISOString() }),
    }),
    { name: "gedos-notifications" }
  )
);
