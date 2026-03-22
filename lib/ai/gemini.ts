
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

  async transcribeAudio(audioBase64: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: audioBase64, mimeType: 'audio/mp3' } },
          { text: "Transcris et résume précisément." }
        ]
      },
    });
    return response.text;
  }
}

export const gemini = new GeminiService();
