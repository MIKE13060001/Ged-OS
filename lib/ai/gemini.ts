
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Document } from "../../types/database";

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Liste des types MIME officiellement supportés par Gemini Vision/Document
const SUPPORTED_OCR_MIMES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif'
];

/**
 * Utility to extract JSON from a string that might contain markdown backticks or extra text.
 */
function cleanJsonString(input: string): string {
  let cleaned = input.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned;
}

export class GeminiService {
  private getAI() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Extrait le contenu REEL d'un document (Image ou PDF) via la Vision de Gemini
   */
  async indexDocumentContent(base64Data: string, mimeType: string, fileName: string): Promise<{text: string, tags: string[]}> {
    const ai = this.getAI();
    const normalizedMime = mimeType.includes('pdf') ? 'application/pdf' : mimeType;

    if (!SUPPORTED_OCR_MIMES.includes(normalizedMime)) {
      throw new Error(`Le format ${mimeType} n'est pas supporté.`);
    }

    const isImage = normalizedMime.startsWith('image/');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: normalizedMime,
              }
            },
            { text: `Tu es un expert en extraction de données souveraines (OCR de haute précision).
              ANALYSE DU DOCUMENT : "${fileName}" (${isImage ? 'IMAGE PNG/JPG' : 'DOCUMENT PDF'})
              
              INSTRUCTIONS :
              1. Lis et extrais TOUT le texte visible. Si c'est une image, décris précisément les tableaux, les chiffres, les noms et les montants.
              2. Ne saute aucun détail numérique. Les dates et montants sont critiques.
              3. Identifie le type de document (facture, contrat, note, etc.).
              4. Génère 5 tags contextuels.
              
              RÉPONDS EXCLUSIVEMENT AU FORMAT JSON SUIVANT :
              {"fullText": "Transcription complète ici...", "tags": ["tag1", "tag2", "..."]}
              
              INTERDICTION : Ne rajoute aucun commentaire avant ou après le JSON.` 
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const rawText = response.text || '{}';
    try {
      const sanitized = cleanJsonString(rawText);
      const result = JSON.parse(sanitized);
      return {
        text: result.fullText || "Contenu illisible.",
        tags: result.tags || ['archive']
      };
    } catch (e) {
      console.error("JSON Parse Error:", rawText);
      return { 
        text: rawText.length > 30 ? rawText : "Échec de l'indexation sémantique.", 
        tags: ['non-indexé'] 
      };
    }
  }

  /**
   * Generate a real Excel or DOCX file from a user request + knowledge base.
   * Returns base64 file data ready to send to the client.
   */
  async generateFileFromRequest(
    userMessage: string,
    knowledgeBase: string
  ): Promise<{
    sheets: { name: string; headers: string[]; rows: string[][] }[];
    filename: string;
    textResponse: string;
  }> {
    const ai = this.getAI();

    const prompt = `Tu es un générateur de fichiers Excel. Tu dois créer le contenu d'un fichier Excel basé sur la demande de l'utilisateur.

BASE DE CONNAISSANCES DISPONIBLE :
${knowledgeBase || "Aucun document. Génère des données d'exemple pertinentes selon la demande."}

DEMANDE : "${userMessage}"

Génère les données pour le fichier Excel. Réponds avec du JSON UNIQUEMENT, dans ce format exact :
{
  "filename": "nom-descriptif.xlsx",
  "textResponse": "Description courte de ce qui a été généré",
  "sheets": [
    {
      "name": "Nom de l'onglet",
      "headers": ["En-tête 1", "En-tête 2", "En-tête 3"],
      "rows": [
        ["valeur1", "valeur2", "valeur3"],
        ["valeur4", "valeur5", "valeur6"]
      ]
    }
  ]
}

RÈGLES ABSOLUES :
1. Retourne UNIQUEMENT du JSON valide, rien d'autre
2. Utilise les vraies données de la base de connaissances si disponibles
3. Minimum 5 lignes de données par onglet
4. Maximum 3 onglets
5. Les headers doivent être clairs et descriptifs
6. Toutes les valeurs dans "rows" doivent être des strings`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.1 }
    });

    const raw = (response.text || '').trim();
    console.log('[GEDOS] File generation response (first 400):', raw.slice(0, 400));

    // Extract JSON from response (handles markdown code blocks)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.sheets || !Array.isArray(parsed.sheets) || parsed.sheets.length === 0) {
      throw new Error('Invalid sheets data: ' + JSON.stringify(parsed).slice(0, 200));
    }

    console.log('[GEDOS] Parsed sheets:', parsed.sheets.length, 'filename:', parsed.filename);
    return {
      sheets: parsed.sheets,
      filename: parsed.filename || 'export.xlsx',
      textResponse: parsed.textResponse || 'Votre fichier Excel a été généré.',
    };
  }

  async chat(history: ChatMessage[], level: number = 1, documents: Document[]) {
    const ai = this.getAI();
    const validDocs = documents.filter(doc => doc.ocrStatus === 'completed' && doc.ocrText);
    
    const knowledgeBase = validDocs
      .map(doc => `[SOURCE: ${doc.name}]\nCONTENU EXTRAIT:\n${doc.ocrText}\n---`)
      .join('\n\n');

    const systemInstruction = `Tu es GEDOS-ARCHITECT, un assistant documentaire intelligent.

    BASE DE CONNAISSANCES :
    ${knowledgeBase || "VIDE"}

    RÈGLES D'OR :
    - Utilise UNIQUEMENT la base de connaissances ci-dessus.
    - Pour les images PNG indexées, fie-toi à la transcription OCR fournie.
    - Si l'info n'y est pas, dis : "Désolé, cette information ne figure pas dans vos documents."
    - Ne jamais inventer (Hallucination interdite).
    - Température 0.1 active.

    GÉNÉRATION DE FICHIERS EXCEL :
    Quand l'utilisateur demande un tableau Excel, un export Excel, ou une extraction de données en tableur :
    1. Génère le contenu textuel d'introduction (ex: "J'ai préparé votre fichier Excel avec X lignes.")
    2. Ajoute EXACTEMENT le marqueur ##EXCEL_DATA## sur une nouvelle ligne
    3. Suivi IMMÉDIATEMENT d'un objet JSON valide sur une seule ligne avec cette structure :
       {"filename":"nom_du_fichier","data":[["Col1","Col2","Col3"],["val1","val2","val3"],...]}

    RÈGLES CRITIQUES pour l'Excel :
    - La première ligne de "data" DOIT être les en-têtes de colonnes
    - Toutes les valeurs doivent être des strings ou des nombres
    - Le JSON doit être valide et sur UNE SEULE ligne après ##EXCEL_DATA##
    - Ne mets RIEN après le JSON
    - N'utilise jamais ce format pour autre chose que les demandes Excel explicites

    GÉNÉRATION DE GRAPHIQUES SVG :
    Quand l'utilisateur demande un graphique (camembert, histogramme, barres, courbe) :
    1. Génère une courte introduction textuelle.
    2. Ajoute EXACTEMENT le marqueur ##SVG_CHART## sur une nouvelle ligne.
    3. Suivi IMMÉDIATEMENT d'un SVG valide (viewBox="0 0 400 300", largeur max 400px).
    4. Style sombre : fond transparent, couleurs vives (#3b82f6 #10b981 #f59e0b #ef4444 #8b5cf6).
    5. Inclure une légende textuelle lisible directement dans le SVG.
    6. Ne mets RIEN après le SVG.

    ACTIONS N3 (uniquement si l'utilisateur demande une action concrète comme envoyer un email, créer un dossier, appeler une API) :
    1. Génère une courte introduction (1-2 phrases max).
    2. Ajoute EXACTEMENT le marqueur ##ACTION## sur une nouvelle ligne.
    3. Suivi IMMÉDIATEMENT d'un JSON valide sur une seule ligne :
       {"type":"email"|"folder"|"api","explanation":"Explication courte de l'action","payload":{"clé":"valeur",...}}
    RÈGLES CRITIQUES pour les actions :
    - Le JSON doit être sur UNE SEULE ligne après ##ACTION##
    - Ne génère ce format QUE si une action concrète est demandée (pas pour des questions)
    - Pour type "email" : payload doit contenir "to", "subject", "body"
    - Pour type "folder" : payload doit contenir "name", "path"
    - Pour type "api" : payload doit contenir "endpoint", "method", "description"
    - Ne mets RIEN après le JSON

    COMPARAISON DE DOCUMENTS :
    Quand l'utilisateur demande de comparer des documents, structure ta réponse ainsi :
    ## Points communs
    ## Différences clés
    ## Synthèse comparative
    Cite toujours le document source entre [crochets].

    EXEMPLE de réponse Excel :
    J'ai extrait les données en 10 lignes depuis vos documents.
    ##EXCEL_DATA##
    {"filename":"plan_action_BTP","data":[["Semaine","Étape","Actions","Documents"],["Semaine 1","Poser les fondations","Mettre à jour les docs","Kbis, Assurances"]]}`;


    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: level > 1 ? 12000 : 0 }
      },
    });

    return response;
  }

  async transcribeAudio(audioBase64: string, synthesisType: string = 'transcription', mimeType: string = 'audio/mp3') {
    const ai = this.getAI();

    const prompts: Record<string, string> = {
      'transcription': "Transcris précisément l'intégralité de cet enregistrement audio en français. Préserve la ponctuation naturelle.",
      'cr-reunion': `Transcris puis rédige un compte rendu de réunion structuré en français avec les sections suivantes :
## Participants
## Ordre du jour
## Points abordés
## Décisions prises
## Actions à mener (qui fait quoi, échéance)
## Prochaine réunion`,
      'synthese-rh': `Transcris puis rédige une synthèse RH structurée en français avec les sections suivantes :
## Contexte de l'entretien
## Points forts identifiés
## Axes d'amélioration
## Compétences clés évoquées
## Décisions / Recommandations
## Prochaines étapes`,
      'resume-client': `Transcris puis rédige un résumé client structuré en français avec les sections suivantes :
## Contexte client
## Besoins exprimés
## Objections / Points de friction
## Solutions évoquées
## Engagements pris
## Prochaines étapes`,
      'liste-actions': `Transcris puis extrais uniquement la liste d'actions concrètes mentionnées dans cet enregistrement.
Format pour chaque action :
- [ ] **Action** — Responsable : [nom ou "non précisé"] — Échéance : [date ou "non précisée"]

Groupe les actions par thématique si pertinent.`,
    };

    const prompt = prompts[synthesisType] ?? prompts['transcription'];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: audioBase64, mimeType } },
          { text: prompt }
        ]
      },
    });
    return response.text;
  }
}

export const gemini = new GeminiService();
