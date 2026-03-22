# GEDOS — Progression features (vs Cahier des charges)

_Dernière mise à jour : 2026-03-22_

---

## Ce qui FONCTIONNE ✅

| Feature | Détail |
|---------|--------|
| Upload PDF / images | UploadZone avec drag-drop, OCR Gemini automatique |
| OCR auto à l'import | Gemini Vision → texte intégral + tags IA |
| Affichage grille documents | DocumentGrid + DocumentCard avec statut OCR |
| Viewer document | PDF embed (iframe), images inline, metadata, texte OCR |
| Ouvrir dans un onglet | Blob URL (white screen corrigé) |
| Chat assistant N1 | Gemini RAG sur les documents indexés |
| Chat assistant N2 | Génération Excel via Gemini + download |
| Génération Excel | Route /api/export/excel + XLSX lib |
| Génération DOCX | lib/fileGenerator.ts |
| Enregistrement audio in-app | AudioRecorder avec MediaRecorder API |
| Transcription audio | Gemini /api/transcribe |
| Interface 3 niveaux d'assistant | N1 / N2 / N3 dans ChatInterface |
| UI/UX dark theme | Tailwind + MagicUI + Shadcn |

---

## TODO — Étape par étape (par priorité)

### Phase 1 — Quick fixes & complétion CdC

- [ ] **S1** Fix bouton Télécharger dans DocumentViewer (non câblé)
- [ ] **S2** Fix bouton Partager dans DocumentViewer (non câblé)
- [ ] **S3** Fix barre de recherche/filtrage documents (UI présente, logique manquante)
- [ ] **S4** Upload fichiers audio existants dans /audio
- [ ] **S5** Synthèse IA structurée depuis transcription (CR réunion / synthèse RH / résumé client / liste d'actions)
- [ ] **S6** Système de dossiers — création, navigation, assignation document
- [ ] **S7** Édition manuelle des tags et métadonnées
- [ ] **S8** Audit log réel (événements trackés, pas mock)
- [ ] **S9** Versioning documents — afficher versions, uploader nouvelle version

### Phase 2 — Assistant N2 complet

- [ ] **S10** Comparaison de deux documents via assistant N2
- [ ] **S11** Génération de graphiques (camembert, histogramme) via N2

### Phase 3 — Assistant N3

- [ ] **S12** Workflow validation humaine pour actions N3 (ActionApproval branché)

### Infra (bloque la prod)

- [ ] **S13** Connexion Supabase (auth + DB + file storage) — remplace localStorage
- [ ] **S14** RBAC — roles admin/manager/member/viewer appliqués

---

## Ce qui est PARTIAL ⚠️

| Feature | État |
|---------|------|
| Dossiers | Type défini en DB, zéro UI |
| Tags | Auto-extraits par Gemini, pas éditables manuellement |
| Versioning | Champ `version` présent, pas de gestion UI |
| Audit log | Données mockées dans /admin |
| Auth | UI settings présente, zéro backend |
| RBAC | Types définis, non appliqués |
| Recherche sémantique | Filtrage UI présent, pas connecté |
| Synthèse audio | Transcription OK, pas de type de sortie structuré |
| N3 actions | ActionApproval composant présent mais non utilisé |

## Ce qui est MISSING ❌

- Stockage fichiers backend (tout en localStorage/base64 = pas scalable)
- Auth réelle (Supabase)
- Vector DB / RAG réel (Qdrant)
- Upload fichiers audio externes
- Génération graphiques
- Comparaison documents
- Partage de documents
