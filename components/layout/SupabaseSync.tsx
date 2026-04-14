"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useDocumentStore } from "@/stores/documentStore";
import { fetchDocuments, fetchFolders } from "@/lib/supabase/documentAdapter";
import type { Document, Folder } from "@/types/database";

/**
 * Invisible component — syncs Supabase documents into Zustand store
 * when user is authenticated and Supabase is configured.
 */
export function SupabaseSync() {
  const { user, isConfigured } = useAuth();
  const didSync = useRef(false);

  useEffect(() => {
    if (!isConfigured || !user || didSync.current) return;
    didSync.current = true;

    async function sync() {
      try {
        const state = useDocumentStore.getState();

        // Fetch folders from Supabase
        const folders = await fetchFolders(user!.id);
        const existingFolderIds = new Set(state.folders.map(f => f.id));

        for (const f of folders) {
          if (!existingFolderIds.has(f.id)) {
            state.addFolder({
              id: f.id,
              tenantId: "t1",
              name: f.name,
              path: `/${f.name}`,
              color: f.color || "#3b82f6",
              icon: "folder",
              createdBy: user!.id,
              createdAt: new Date().toISOString(),
            } as Folder);
          }
        }

        // Fetch documents from Supabase
        const docs = await fetchDocuments(user!.id);
        const existingDocIds = new Set(state.documents.map(d => d.id));

        for (const d of docs) {
          if (!existingDocIds.has(d.id)) {
            state.addDocument({
              id: d.id,
              tenantId: "t1",
              name: d.name,
              originalName: d.originalName || d.name,
              mimeType: d.mimeType,
              sizeBytes: d.sizeBytes || 0,
              storagePath: d.storagePath || "",
              version: d.version || 1,
              ocrStatus: (d.ocrStatus as Document["ocrStatus"]) || "completed",
              ocrText: d.ocrText,
              extractedData: {},
              tags: d.tags || [],
              metadata: {},
              createdBy: user!.id,
              createdAt: new Date().toISOString(),
              folderId: d.folderId,
            } as Document);
          }
        }

        console.log(`[GEDOS] Synced ${docs.length} documents + ${folders.length} folders from Supabase`);
      } catch (err) {
        console.error("[GEDOS] Supabase sync error:", err);
      }
    }

    sync();
  }, [user, isConfigured]);

  return null;
}
