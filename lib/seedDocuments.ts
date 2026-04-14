"use client";

import { useDocumentStore } from "@/stores/documentStore";
import { ALL_MOCK_DOCUMENTS, MOCK_FOLDERS } from "@/lib/mockData";

/**
 * Version du jeu de données mock.
 * Incrémenter pour forcer un re-seed au prochain chargement.
 */
const SEED_VERSION = 5;

/**
 * Seed le store avec les données mock si vide ou si la version a changé.
 * Aussi ré-hydrate le ocrText des mock docs (non persisté en localStorage).
 * Appelé une seule fois au mount du layout dashboard.
 */
export function seedIfEmpty() {
  const currentVersion = localStorage.getItem("gedos-seed-version");
  const state = useDocumentStore.getState();

  // Re-seed si version différente ou store vide
  if (state.documents.length > 0 && currentVersion === String(SEED_VERSION)) {
    // Ré-hydrater ocrText des mock docs (perdu après reload car exclu de localStorage)
    hydrateOcrText(state);
    return;
  }

  // Reset complet du store
  state.clearAll();

  // 1. Créer les dossiers
  for (const folder of MOCK_FOLDERS) {
    state.addFolder(folder);
  }

  // 2. Ajouter tous les documents
  for (const doc of ALL_MOCK_DOCUMENTS) {
    state.addDocument(doc);
  }

  // Marquer la version
  localStorage.setItem("gedos-seed-version", String(SEED_VERSION));
}

/**
 * Re-inject ocrText from mock data into store documents that lost it
 * (because ocrText is excluded from localStorage persistence).
 */
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
