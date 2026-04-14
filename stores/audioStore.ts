"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TemplateCategory = "general" | "reunion" | "rh" | "commercial" | "juridique" | "technique";

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; color: string }[] = [
  { id: "general", label: "Général", color: "#94a3b8" },
  { id: "reunion", label: "Réunion", color: "#8b5cf6" },
  { id: "rh", label: "Ressources Humaines", color: "#f59e0b" },
  { id: "commercial", label: "Commercial", color: "#10b981" },
  { id: "juridique", label: "Juridique", color: "#ef4444" },
  { id: "technique", label: "Technique", color: "#3b82f6" },
];

export interface SynthesisTemplate {
  id: string;
  label: string;
  prompt: string;
  /** Category for grouping */
  category: TemplateCategory;
  /** Pre-filled markdown output template — Gemini fills in the sections */
  outputTemplate?: string;
  isDefault: boolean;
  createdAt: string;
}

export const DEFAULT_TEMPLATES: SynthesisTemplate[] = [
  {
    id: 'reunion-commerciale',
    label: 'Réunion commerciale',
    category: 'commercial',
    prompt: `Tu es un directeur commercial senior. Analyse cet enregistrement audio d'une réunion commerciale et produis un compte-rendu structuré orienté résultats. Sois factuel et précis sur les montants, les noms de clients/prospects, les engagements pris. Identifie les signaux d'achat, les objections non levées, et les risques sur le pipe. Remplis EXACTEMENT le modèle fourni — chaque [placeholder] doit être remplacé par l'information extraite ou "Non mentionné" si absent.`,
    outputTemplate: `# COMPTE-RENDU — RÉUNION COMMERCIALE

**Date** : [date]
**Lieu** : [lieu ou "Visioconférence"]
**Participants** : [noms et rôles]
**Rédigé par** : IA — GEDOS

---

## 1. Tour de table pipeline
| Client / Prospect | Montant estimé | Stade | Prochaine action | Échéance |
|--------------------|---------------|-------|-----------------|----------|
| [nom] | [montant €] | [Prospection / Qualification / Proposition / Négociation / Closing] | [action] | [date] |

## 2. Deals en cours — points saillants
### [Nom du deal 1]
- **Contexte** : [résumé situation]
- **Avancement** : [ce qui a progressé]
- **Blocages** : [freins identifiés]
- **Stratégie décidée** : [approche retenue]

## 3. Objectifs & KPIs discutés
- **CA réalisé période** : [montant si mentionné]
- **Objectif période** : [montant si mentionné]
- **Taux de conversion** : [% si mentionné]
- **Nombre de RDV planifiés** : [nombre]

## 4. Décisions prises
| # | Décision | Responsable |
|---|----------|-------------|
| 1 | [décision] | [personne] |

## 5. Actions à mener
| # | Action | Responsable | Échéance | Priorité |
|---|--------|-------------|----------|----------|
| 1 | [action] | [personne] | [date] | Haute / Moyenne / Basse |

## 6. Alertes & Risques
- [risque identifié sur un deal ou un objectif]

## 7. Prochaine réunion
**Date** : [date prévue]
**Sujets prioritaires** : [sujets à aborder]`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'notes-idees',
    label: 'Notes & Idées',
    category: 'general',
    prompt: `Tu es un assistant de prise de notes intelligent. Analyse cet enregistrement audio — il peut s'agir de réflexions personnelles, d'un brainstorming, d'une note vocale rapide ou d'idées dictées en vrac. Ton rôle est de structurer le contenu de manière claire et exploitable. Regroupe les idées par thème, identifie les points clés et les actions potentielles. Garde le ton de l'auteur. Ne reformule pas excessivement — conserve les formulations originales quand elles sont claires.`,
    outputTemplate: `# NOTES & IDÉES

**Date** : [date]
**Contexte** : [sujet principal ou "Note libre"]

---

## Idées clés
1. **[Idée principale 1]** — [développement ou détail]
2. **[Idée principale 2]** — [développement ou détail]
3. **[Idée principale 3]** — [développement ou détail]

## Réflexions détaillées

### [Thème 1]
[Contenu des réflexions sur ce thème, fidèle à l'enregistrement]

### [Thème 2]
[Contenu des réflexions sur ce thème]

## Points à creuser
- [ ] [sujet à approfondir ou recherche à faire]
- [ ] [question ouverte à résoudre]

## Actions potentielles
| # | Action identifiée | Urgence | Notes |
|---|-------------------|---------|-------|
| 1 | [action] | Haute / Moyenne / Basse | [contexte] |

## Verbatims importants
> "[citation exacte notable de l'enregistrement]"

> "[autre citation clé]"`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'reunion-marketing',
    label: 'Réunion marketing',
    category: 'reunion',
    prompt: `Tu es un Head of Marketing expérimenté. Analyse cet enregistrement audio d'une réunion marketing et produis un compte-rendu structuré axé sur la performance des campagnes, les KPIs, les décisions créatives et le planning éditorial. Sois précis sur les chiffres (impressions, CPL, taux de conversion, budget). Identifie les campagnes qui performent et celles à ajuster. Remplis EXACTEMENT le modèle fourni.`,
    outputTemplate: `# COMPTE-RENDU — RÉUNION MARKETING

**Date** : [date]
**Participants** : [noms et rôles]
**Période analysée** : [mois / trimestre concerné]

---

## 1. Bilan performance
| Canal | Impressions | Leads | CPL | Budget dépensé | ROI |
|-------|------------|-------|-----|---------------|-----|
| [LinkedIn / Google Ads / Email / SEO / ...] | [nombre] | [nombre] | [montant €] | [montant €] | [%] |

### Campagnes actives
| Campagne | Statut | Performance | Ajustement prévu |
|----------|--------|-------------|-----------------|
| [nom campagne] | Active / En pause / Terminée | [bonne / moyenne / faible] | [action] |

## 2. Contenu & Éditorial
- **Contenus publiés** : [nombre et types]
- **Top performing** : [contenu qui a le mieux marché]
- **Contenus planifiés** : [ce qui est prévu]

## 3. Stratégie & Orientations
[Décisions stratégiques prises pendant la réunion]

## 4. Budget
- **Budget consommé** : [montant € / % du budget total]
- **Réallocation prévue** : [changements de budget entre canaux]

## 5. Décisions
| # | Décision | Responsable |
|---|----------|-------------|
| 1 | [décision] | [personne] |

## 6. Actions à mener
| # | Action | Responsable | Échéance | Priorité |
|---|--------|-------------|----------|----------|
| 1 | [action] | [personne] | [date] | Haute / Moyenne / Basse |

## 7. Prochaine réunion
**Date** : [date]
**Focus** : [sujets prioritaires]`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'reunion-support',
    label: 'Réunion support client',
    category: 'commercial',
    prompt: `Tu es un responsable support client. Analyse cet enregistrement audio d'une réunion d'équipe support et produis un compte-rendu structuré. Focus sur les tickets en cours, les problèmes récurrents, la satisfaction client, les escalades et les améliorations process. Sois factuel — mentionne les numéros de tickets, noms de clients et délais de résolution quand ils sont évoqués. Remplis EXACTEMENT le modèle fourni.`,
    outputTemplate: `# COMPTE-RENDU — RÉUNION SUPPORT CLIENT

**Date** : [date]
**Participants** : [noms et rôles]
**Période couverte** : [semaine / mois]

---

## 1. Métriques support
- **Tickets ouverts** : [nombre]
- **Tickets résolus (période)** : [nombre]
- **Temps moyen de résolution** : [durée]
- **Taux de satisfaction (CSAT)** : [% ou score]
- **Tickets escaladés** : [nombre]

## 2. Tickets critiques / Escalades
| # | Client | Problème | Statut | Responsable | Échéance résolution |
|---|--------|----------|--------|-------------|-------------------|
| 1 | [client] | [description] | Ouvert / En cours / Bloqué | [personne] | [date] |

## 3. Problèmes récurrents identifiés
| Problème | Fréquence | Impact | Solution envisagée |
|----------|-----------|--------|-------------------|
| [problème] | [nb occurrences] | Élevé / Moyen / Faible | [action corrective] |

## 4. Retours clients notables
- **Positifs** : [feedbacks positifs mentionnés]
- **Négatifs** : [plaintes ou insatisfactions]

## 5. Améliorations process
[Idées d'amélioration du support discutées]

## 6. Actions à mener
| # | Action | Responsable | Échéance | Priorité |
|---|--------|-------------|----------|----------|
| 1 | [action] | [personne] | [date] | Haute / Moyenne / Basse |

## 7. Prochaine réunion
**Date** : [date]
**Focus** : [sujets prioritaires]`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'synthese-rh',
    label: 'Synthèse entretien RH',
    category: 'rh',
    prompt: `Tu es un expert RH senior. Analyse l'audio d'un entretien RH (annuel, professionnel, recadrage ou recrutement) et produis une synthèse structurée. Sois neutre, factuel et professionnel. Capture fidèlement les évaluations, les souhaits du collaborateur et les objectifs fixés. Remplis EXACTEMENT le modèle fourni.`,
    outputTemplate: `# SYNTHÈSE D'ENTRETIEN RH

**Type d'entretien** : [annuel / professionnel / recadrage / recrutement]
**Date** : [date]
**Collaborateur** : [nom, poste]
**Manager / RH** : [nom]

---

## 1. Contexte
[Raison de l'entretien, contexte général]

## 2. Bilan de la période
- **Points forts** : [réussites, compétences démontrées]
- **Axes d'amélioration** : [points à travailler]
- **Objectifs précédents** : [atteints / partiellement / non atteints]

## 3. Évaluation
| Critère | Niveau | Commentaire |
|---------|--------|-------------|
| [critère] | [A/B/C/D] | [détail] |

## 4. Souhaits du collaborateur
- **Évolution** : [souhait d'évolution exprimé]
- **Formation** : [besoins de formation identifiés]
- **Conditions** : [demandes particulières]

## 5. Objectifs fixés
| # | Objectif | Indicateur | Échéance |
|---|----------|-----------|----------|
| 1 | [objectif] | [KPI] | [date] |

## 6. Plan d'action
[Actions décidées, suivi prévu]`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cr-juridique',
    label: 'Note de consultation juridique',
    category: 'juridique',
    prompt: `Tu es un assistant juridique de haut niveau. Analyse l'enregistrement d'une consultation ou réunion juridique et produis une note structurée avec une précision absolue. Cite les textes de loi, articles et jurisprudences mentionnés. Distingue clairement les faits, l'analyse et les recommandations. Remplis EXACTEMENT le modèle fourni.`,
    outputTemplate: `# NOTE DE CONSULTATION JURIDIQUE

**Date** : [date]
**Participants** : [noms, qualités]
**Objet** : [sujet de la consultation]

---

## 1. Faits exposés
[Résumé factuel de la situation présentée]

## 2. Questions juridiques soulevées
- [question 1]
- [question 2]

## 3. Analyse & Positions
[Arguments développés, textes cités, jurisprudence mentionnée]

## 4. Recommandations
| # | Recommandation | Urgence | Coût estimé |
|---|---------------|---------|-------------|
| 1 | [recommandation] | [oui/non] | [si mentionné] |

## 5. Actions à mener
- [ ] [action 1 — responsable — échéance]
- [ ] [action 2 — responsable — échéance]`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cr-technique',
    label: 'CR Réunion technique',
    category: 'technique',
    prompt: `Tu es un lead technique / CTO. Analyse l'audio d'une réunion technique et produis un compte-rendu structuré. Focus absolu sur les décisions d'architecture, les choix techniques argumentés, les alternatives écartées, la dette technique identifiée et les tâches assignées avec leur priorité. Sois précis sur les technologies, versions et patterns mentionnés. Remplis EXACTEMENT le modèle fourni.`,
    outputTemplate: `# COMPTE-RENDU TECHNIQUE

**Date** : [date]
**Participants** : [noms, rôles]
**Projet** : [nom du projet]

---

## 1. Sujets traités
### [Sujet 1]
- **Problème** : [description]
- **Solution retenue** : [décision technique]
- **Alternatives écartées** : [options rejetées et pourquoi]

## 2. Décisions d'architecture
| # | Décision | Justification | Impact |
|---|----------|--------------|--------|
| 1 | [décision] | [pourquoi] | [impact] |

## 3. Bugs / Dette technique
- [bug ou dette identifié]

## 4. Tâches
| # | Tâche | Assigné à | Sprint | Priorité |
|---|-------|-----------|--------|----------|
| 1 | [tâche] | [dev] | [sprint] | P0/P1/P2 |

## 5. Points de blocage
- [blocage éventuel et plan de résolution]`,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export interface Recording {
  id: string;
  title: string;
  audioDataUrl: string;
  durationSeconds: number;
  synthesisType: string;
  transcription: string | null;
  tags: string[];
  addedToGed: boolean;
  gedDocumentId: string | null;
  createdAt: string;
}

interface AudioState {
  recordings: Recording[];
  templates: SynthesisTemplate[];
  addRecording: (rec: Recording) => void;
  updateRecording: (id: string, patch: Partial<Recording>) => void;
  removeRecording: (id: string) => void;
  markAddedToGed: (id: string, docId: string) => void;
  addTemplate: (tpl: SynthesisTemplate) => void;
  updateTemplate: (id: string, patch: Partial<SynthesisTemplate>) => void;
  removeTemplate: (id: string) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      recordings: [],
      templates: DEFAULT_TEMPLATES,
      addRecording: (rec) => set((s) => ({ recordings: [rec, ...s.recordings] })),
      updateRecording: (id, patch) => set((s) => ({
        recordings: s.recordings.map((r) => r.id === id ? { ...r, ...patch } : r),
      })),
      removeRecording: (id) => set((s) => ({
        recordings: s.recordings.filter((r) => r.id !== id),
      })),
      markAddedToGed: (id, docId) => set((s) => ({
        recordings: s.recordings.map((r) =>
          r.id === id ? { ...r, addedToGed: true, gedDocumentId: docId } : r
        ),
      })),
      addTemplate: (tpl) => set((s) => ({ templates: [...s.templates, tpl] })),
      updateTemplate: (id, patch) => set((s) => ({
        templates: s.templates.map((t) => t.id === id ? { ...t, ...patch } : t),
      })),
      removeTemplate: (id) => set((s) => ({
        templates: s.templates.filter((t) => t.id !== id),
      })),
    }),
    {
      name: 'gedos-audio-recordings',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<AudioState>;
        // Always use latest DEFAULT_TEMPLATES + keep user-created ones
        const userTemplates = (state?.templates || []).filter(t => !t.isDefault);
        return {
          ...current,
          ...state,
          templates: [...DEFAULT_TEMPLATES, ...userTemplates],
        } as AudioState;
      },
    }
  )
);
