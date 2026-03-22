
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
   * Detect if a user message is requesting file generation and extract structured data.
   * Returns null if not a file generation request.
   */
  async detectAndStructureFileRequest(
    userMessage: string,
    knowledgeBase: string
  ): Promise<{
    isFileRequest: boolean;
    fileType?: 'xlsx' | 'docx';
    filename?: string;
    textResponse?: string;
    xlsxData?: { name: string; headers: string[]; rows: (string | number)[][] }[];
    docxData?: { type: string; text?: string; headers?: string[]; rows?: string[][] }[];
  }> {
    const ai = this.getAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        role: 'user',
        parts: [{ text: `Tu es GEDOS-ARCHITECT avec accès à cette base de connaissances :
${knowledgeBase || "VIDE"}

MESSAGE UTILISATEUR : "${userMessage}"

Détermine si l'utilisateur demande de CRÉER un fichier (Excel, DOCX, CSV, tableau, rapport, etc.).

Si OUI, génère les données structurées pour ce fichier en JSON STRICT :

Pour un fichier EXCEL (xlsx) :
{
  "isFileRequest": true,
  "fileType": "xlsx",
  "filename": "nom-du-fichier.xlsx",
  "textResponse": "Message à afficher à l'utilisateur expliquant ce qui a été généré",
  "xlsxData": [
    {
      "name": "Nom de l'onglet",
      "headers": ["Colonne 1", "Colonne 2", "..."],
      "rows": [["valeur1", "valeur2"], ["valeur3", "valeur4"]]
    }
  ]
}

Pour un fichier WORD (docx) :
{
  "isFileRequest": true,
  "fileType": "docx",
  "filename": "nom-du-fichier.docx",
  "textResponse": "Message à afficher à l'utilisateur expliquant ce qui a été généré",
  "docxData": [
    {"type": "heading1", "text": "Titre principal"},
    {"type": "heading2", "text": "Sous-titre"},
    {"type": "paragraph", "text": "Paragraphe de texte..."},
    {"type": "table", "headers": ["Col1", "Col2"], "rows": [["val1", "val2"]]}
  ]
}

Si NON (question normale) :
{"isFileRequest": false}

RÉPONDS UNIQUEMENT EN JSON VALIDE. PAS DE COMMENTAIRES. PAS DE MARKDOWN.` }]
      }],
      config: { temperature: 0.1 }
    });

    const raw = response.text || '{"isFileRequest": false}';
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      const json = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(json);
    } catch {
      return { isFileRequest: false };
    }
  }

  async chat(history: ChatMessage[], level: number = 1, documents: Document[]) {
    const ai = this.getAI();
    const validDocs = documents.filter(doc => doc.ocrStatus === 'completed' && doc.ocrText);
    
    const knowledgeBase = validDocs
      .map(doc => `[SOURCE: ${doc.name}]\nCONTENU EXTRAIT:\n${doc.ocrText}\n---`)
      .join('\n\n');

    const systemInstruction = `Tu es GEDOS-ARCHITECT.
    
    BASE DE CONNAISSANCES :
    ${knowledgeBase || "VIDE"}
    
    RÈGLES D'OR :
    - Utilise UNIQUEMENT la base de connaissances ci-dessus.
    - Pour les images PNG indexées, fie-toi à la transcription OCR fournie.
    - Si l'info n'y est pas, dis : "Désolé, cette information ne figure pas dans vos documents."
    - Ne jamais inventer (Hallucination interdite).
    - Température 0.1 active.`;

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
