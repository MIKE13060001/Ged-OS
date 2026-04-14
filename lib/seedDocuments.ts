"use client";

import { useDocumentStore } from "@/stores/documentStore";
import { ALL_MOCK_DOCUMENTS, MOCK_FOLDERS } from "@/lib/mockData";

const SEED_VERSION = 5;

/**
 * Seed le store avec les données mock en mode démo (pas de Supabase).
 * Quand Supabase est configuré, les docs viennent de la DB — pas de seed.
 */
export function seedIfEmpty() {
  // Skip seeding if Supabase is configured (data comes from DB)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) return;

  const currentVersion = localStorage.getItem("gedos-seed-version");
  const state = useDocumentStore.getState();

  if (state.documents.length > 0 && currentVersion === String(SEED_VERSION)) {
    hydrateOcrText(state);
    return;
  }

  state.clearAll();

  for (const folder of MOCK_FOLDERS) {
    state.addFolder(folder);
  }

  for (const doc of ALL_MOCK_DOCUMENTS) {
    state.addDocument(doc);
  }

  localStorage.setItem("gedos-seed-version", String(SEED_VERSION));
}

function hydrateOcrText(state: ReturnType<typeof useDocumentStore.getState>) {
  const mockMap = new Map(ALL_MOCK_DOCUMENTS.map((d) => [d.originalName, d]));

  for (const doc of state.documents) {
    if (!doc.ocrText && doc.originalName) {
      const mock = mockMap.get(doc.originalName);
      if (mock?.ocrText) {
        state.updateDocument(doc.id, {
          ocrText: mock.ocrText,
          extractedData: mock.extractedData,
          tags: mock.tags,
        });
      }
    }
  }
}
