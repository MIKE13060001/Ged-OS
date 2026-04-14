
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
  async indexDocumentContent(base64Data: string, mimeType: string, fileName: string): Promise<{
    text: string;
    tags: string[];
    extractedData: Record<string, unknown>;
  }> {
    const ai = this.getAI();
    const normalizedMime = mimeType.includes('pdf') ? 'application/pdf' : mimeType;

    if (!SUPPORTED_OCR_MIMES.includes(normalizedMime)) {
      throw new Error(`Le format ${mimeType} n'est pas supporté.`);
    }

    const isImage = normalizedMime.startsWith('image/');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
            { text: `Tu es un expert en extraction de données documentaires (OCR de haute précision).
ANALYSE DU DOCUMENT : "${fileName}" (${isImage ? 'IMAGE' : 'PDF'})

INSTRUCTIONS :
1. Extrais TOUT le texte visible fidèlement. Dates, montants, noms, adresses : rien ne doit manquer.
2. Identifie le TYPE du document parmi : facture_fournisseur, facture_client, devis, bon_de_commande, contrat, compte_rendu, administratif, courrier, autre.
3. Extrais les MÉTADONNÉES STRUCTURÉES selon le type :
   - Pour les factures : fournisseur ou client (nom), adresse, numero (n° de facture), date (YYYY-MM-DD), montantHT (nombre), tva (nombre), montantTTC (nombre), objet (description courte)
   - Pour les comptes-rendus : objet, date (YYYY-MM-DD), participants (liste de noms)
   - Pour les contrats/admin : objet, date, fournisseur si applicable
4. Génère 5-8 tags contextuels pertinents en français.

RÉPONDS EXCLUSIVEMENT en JSON :
{
  "fullText": "Transcription intégrale du document...",
  "tags": ["tag1", "tag2"],
  "extractedData": {
    "type": "facture_fournisseur",
    "fournisseur": "Nom Société",
    "adresse": "Adresse complète",
    "numero": "FAC-2026-001",
    "date": "2026-03-15",
    "montantHT": 1500.00,
    "tva": 300.00,
    "montantTTC": 1800.00,
    "objet": "Description de la prestation"
  }
}

RÈGLES :
- Les montants sont des NOMBRES (pas de strings avec €)
- La date est au format YYYY-MM-DD
- N'inclus que les champs pertinents au type de document
- AUCUN texte avant ou après le JSON`
            }
          ]
        }
      ],
      config: {
        temperature: 0.1
      }
    });

    const rawText = response.text || '';
    try {
      const sanitized = cleanJsonString(rawText);
      const result = JSON.parse(sanitized);
      return {
        text: result.fullText || "Contenu illisible.",
        tags: Array.isArray(result.tags) ? result.tags : ['archive'],
        extractedData: result.extractedData && typeof result.extractedData === 'object' ? result.extractedData : {},
      };
    } catch {
      // If JSON parsing fails, return the raw text as OCR content
      console.error("JSON Parse Error, returning raw text. First 200 chars:", rawText.slice(0, 200));
      return {
        text: rawText.length > 30 ? rawText : "Échec de l'indexation sémantique.",
        tags: ['non-indexé'],
        extractedData: {},
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
      model: 'gemini-2.5-flash',
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

  /**
   * Build a structured knowledge base from documents and audio transcriptions.
   * Includes: full OCR text, structured extractedData, pre-computed financial aggregates.
   */
  private buildKnowledgeBase(
    documents: Document[],
    audioTranscriptions?: { title: string; transcription: string; synthesisType: string; createdAt: string }[],
  ): string {
    const validDocs = documents.filter(doc => doc.ocrStatus === 'completed' && (doc.ocrText?.trim() || Object.keys(doc.extractedData || {}).length > 0));

    // ── Section 1: Documents with full text + structured metadata ──
    const docEntries = validDocs.map(doc => {
      const ext = doc.extractedData || {};
      const metaLines: string[] = [];
      if (ext.type) metaLines.push(`Type: ${ext.type}`);
      if (ext.fournisseur) metaLines.push(`Fournisseur: ${ext.fournisseur}`);
      if (ext.client) metaLines.push(`Client: ${ext.client}`);
      if (ext.numero) metaLines.push(`N° facture: ${ext.numero}`);
      if (ext.date) metaLines.push(`Date: ${ext.date}`);
      if (ext.montantHT != null) metaLines.push(`Montant HT: ${ext.montantHT} €`);
      if (ext.tva != null) metaLines.push(`TVA: ${ext.tva} €`);
      if (ext.montantTTC != null) metaLines.push(`Montant TTC: ${ext.montantTTC} €`);
      if (ext.objet) metaLines.push(`Objet: ${ext.objet}`);
      if (ext.adresse) metaLines.push(`Adresse: ${ext.adresse}`);
      if (ext.participants) metaLines.push(`Participants: ${(ext.participants as string[]).join(', ')}`);

      const metadata = metaLines.length > 0 ? `\nMÉTADONNÉES:\n${metaLines.join('\n')}` : '';
      const tags = doc.tags?.length ? `\nTags: ${doc.tags.join(', ')}` : '';
      const text = doc.ocrText?.trim() ? `\nCONTENU EXTRAIT:\n${doc.ocrText}` : '';

      return `[DOCUMENT: ${doc.name}]${metadata}${tags}${text}\n---`;
    }).join('\n\n');

    // ── Section 2: Pre-computed financial aggregates ──
    const invoicesFournisseurs = validDocs.filter(d => d.extractedData?.type === 'facture_fournisseur' && d.extractedData?.montantTTC != null);
    const invoicesClients = validDocs.filter(d => d.extractedData?.type === 'facture_client' && d.extractedData?.montantTTC != null);

    const totalFournHT = invoicesFournisseurs.reduce((sum, d) => sum + (d.extractedData?.montantHT || 0), 0);
    const totalFournTTC = invoicesFournisseurs.reduce((sum, d) => sum + (d.extractedData?.montantTTC || 0), 0);
    const totalClientHT = invoicesClients.reduce((sum, d) => sum + (d.extractedData?.montantHT || 0), 0);
    const totalClientTTC = invoicesClients.reduce((sum, d) => sum + (d.extractedData?.montantTTC || 0), 0);

    // Group by supplier
    const bySupplier: Record<string, { count: number; totalHT: number; totalTTC: number }> = {};
    for (const d of invoicesFournisseurs) {
      const name = (d.extractedData?.fournisseur as string) || 'Inconnu';
      if (!bySupplier[name]) bySupplier[name] = { count: 0, totalHT: 0, totalTTC: 0 };
      bySupplier[name].count++;
      bySupplier[name].totalHT += d.extractedData?.montantHT || 0;
      bySupplier[name].totalTTC += d.extractedData?.montantTTC || 0;
    }

    // Group by client
    const byClient: Record<string, { count: number; totalHT: number; totalTTC: number }> = {};
    for (const d of invoicesClients) {
      const name = (d.extractedData?.client as string) || 'Inconnu';
      if (!byClient[name]) byClient[name] = { count: 0, totalHT: 0, totalTTC: 0 };
      byClient[name].count++;
      byClient[name].totalHT += d.extractedData?.montantHT || 0;
      byClient[name].totalTTC += d.extractedData?.montantTTC || 0;
    }

    // Count by type
    const typeCounts: Record<string, number> = {};
    for (const d of validDocs) {
      const t = (d.extractedData?.type as string) || 'autre';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    }

    const supplierTable = Object.entries(bySupplier)
      .sort((a, b) => b[1].totalTTC - a[1].totalTTC)
      .map(([name, v]) => `  - ${name}: ${v.count} facture(s), ${v.totalHT.toFixed(2)} € HT, ${v.totalTTC.toFixed(2)} € TTC`)
      .join('\n');

    const clientTable = Object.entries(byClient)
      .sort((a, b) => b[1].totalTTC - a[1].totalTTC)
      .map(([name, v]) => `  - ${name}: ${v.count} facture(s), ${v.totalHT.toFixed(2)} € HT, ${v.totalTTC.toFixed(2)} € TTC`)
      .join('\n');

    const typeTable = Object.entries(typeCounts)
      .map(([type, count]) => `  - ${type}: ${count} document(s)`)
      .join('\n');

    // Individual invoices ranked by TTC (for "which is the most expensive" type questions)
    const topFournisseurInvoices = invoicesFournisseurs
      .sort((a, b) => (b.extractedData?.montantTTC || 0) - (a.extractedData?.montantTTC || 0))
      .slice(0, 10)
      .map((d, i) => `  ${i + 1}. ${d.extractedData?.fournisseur || d.name} — ${d.extractedData?.numero || 'N/A'} — ${(d.extractedData?.montantTTC || 0).toFixed(2)} € TTC (${d.extractedData?.date || '?'})`)
      .join('\n');

    const topClientInvoices = invoicesClients
      .sort((a, b) => (b.extractedData?.montantTTC || 0) - (a.extractedData?.montantTTC || 0))
      .slice(0, 10)
      .map((d, i) => `  ${i + 1}. ${d.extractedData?.client || d.name} — ${d.extractedData?.numero || 'N/A'} — ${(d.extractedData?.montantTTC || 0).toFixed(2)} € TTC (${d.extractedData?.date || '?'})`)
      .join('\n');

    const aggregates = `
AGRÉGATS FINANCIERS PRÉ-CALCULÉS :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Factures fournisseurs : ${invoicesFournisseurs.length} facture(s)
  Total HT : ${totalFournHT.toFixed(2)} €
  Total TTC : ${totalFournTTC.toFixed(2)} €

Factures clients : ${invoicesClients.length} facture(s)
  Total HT : ${totalClientHT.toFixed(2)} €
  Total TTC : ${totalClientTTC.toFixed(2)} €

TOTAUX PAR FOURNISSEUR (cumulés si plusieurs factures) :
${supplierTable || '  Aucune facture fournisseur'}

TOTAUX PAR CLIENT (cumulés si plusieurs factures) :
${clientTable || '  Aucune facture client'}

TOP FACTURES FOURNISSEURS INDIVIDUELLES (par montant TTC décroissant) :
${topFournisseurInvoices || '  Aucune'}

TOP FACTURES CLIENTS INDIVIDUELLES (par montant TTC décroissant) :
${topClientInvoices || '  Aucune'}

Par type de document :
${typeTable}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ATTENTION : Distinguer "facture la plus chère" (= 1 facture individuelle avec le montant TTC le plus élevé) de "fournisseur avec le plus gros total cumulé" (= somme de toutes ses factures).`;

    // ── Section 3: Audio transcriptions ──
    const audioSection = audioTranscriptions?.length
      ? '\n\nTRANSCRIPTIONS AUDIO :\n' + audioTranscriptions
          .map(a => `[AUDIO: ${a.title}] (${a.synthesisType}, ${new Date(a.createdAt).toLocaleDateString('fr-FR')})\n${a.transcription}\n---`)
          .join('\n\n')
      : '';

    return `${aggregates}\n\nDOCUMENTS (${validDocs.length} indexés) :\n\n${docEntries}${audioSection}`;
  }

  async chat(
    history: ChatMessage[],
    level: number = 1,
    documents: Document[],
    audioTranscriptions?: { title: string; transcription: string; synthesisType: string; createdAt: string }[],
  ) {
    const ai = this.getAI();
    const knowledgeBase = this.buildKnowledgeBase(documents, audioTranscriptions);

    const systemInstruction = `Tu es GEDOS-ARCHITECT, un assistant documentaire intelligent et omniscient sur tous les documents de l'entreprise.

BASE DE CONNAISSANCES :
${knowledgeBase}

RÈGLES :
1. Tu as accès à TOUS les documents indexés ci-dessus : factures, contrats, comptes-rendus, documents administratifs, et transcriptions audio.
2. Tu peux et DOIS effectuer des calculs : totaux, moyennes, comparaisons, filtrages. Les agrégats financiers pré-calculés sont fournis — utilise-les directement.
3. Quand on te demande un montant total, une somme, une liste de fournisseurs, etc., réponds avec précision en citant les sources.
4. Pour les questions sur le contenu d'un document spécifique, base-toi sur le texte extrait ET les métadonnées structurées. Extrais et partage TOUTES les informations pertinentes du document, pas un résumé de 2 lignes.
5. Ne jamais inventer de données. Si une information précise n'est pas dans les documents, dis-le clairement mais propose des informations connexes que tu trouves.
6. Réponds en français, de manière professionnelle et structurée.
7. Quand tu cites des chiffres, mentionne le document source.
8. CRITIQUE : Pour les questions de type "la plus chère", "le plus gros", "le maximum", VÉRIFIE TOUJOURS dans le classement TOP FACTURES INDIVIDUELLES fourni dans les agrégats. Ne confonds JAMAIS le total cumulé d'un fournisseur avec le montant d'une facture individuelle. Cite toujours le numéro de facture et le montant exact.

FORMATAGE DES RÉPONSES :
- N'utilise JAMAIS de guillemets autour du texte. Écris le texte directement, sans guillemets.
- Adapte la LONGUEUR de ta réponse à la complexité de la demande :
  - Question simple (oui/non, montant, date) → réponse courte et directe (2-5 lignes)
  - Question sur un document spécifique ("de quoi parle ce document", "résume-moi cette facture") → réponse détaillée et complète avec TOUTES les informations du document (objet, montants, dates, parties, détails ligne par ligne si facture)
  - Comparaison de documents → analyse structurée avec points communs et différences
  - Analyse complexe → réponse exhaustive et structurée
- Quand on te demande de parler d'un document, donne le CONTENU COMPLET : objet, émetteur, destinataire, montants détaillés ligne par ligne, dates, conditions de paiement, tout ce qui est dans le texte extrait.
- Utilise des listes à puces, des titres et des tableaux pour structurer les réponses longues.
- Ne coupe JAMAIS une réponse en plein milieu. Termine toujours ta réponse.

GÉNÉRATION DE GRAPHIQUES :
Quand l'utilisateur demande un graphique, une visualisation, un chart, ou quand les données s'y prêtent particulièrement (montants de factures, répartitions, évolutions) :
1. Rédige d'abord ta réponse textuelle avec les données et l'analyse
2. Ajoute EXACTEMENT le marqueur ##CHART_DATA## sur une nouvelle ligne
3. Suivi IMMÉDIATEMENT d'un JSON valide sur UNE SEULE ligne avec cette structure :
   {"type":"bar","title":"Titre du graphique","data":[{"name":"Label1","value":1234},{"name":"Label2","value":5678}],"unit":"€"}

Types supportés : "bar" (barres verticales), "pie" (camembert/donut), "line" (courbe), "area" (courbe avec remplissage)
Champs JSON :
- type : "bar" | "pie" | "line" | "area"
- title : titre descriptif du graphique
- data : tableau d'objets avec au minimum "name" et "value"
- xKey : clé pour l'axe X (défaut: "name")
- yKeys : tableau des clés numériques à afficher (défaut: ["value"])
- unit : unité d'affichage ("€", "%", ou vide)

RÈGLE IMPORTANTE : quand tu fournis des données chiffrées (factures, montants, répartitions), PROPOSE SYSTÉMATIQUEMENT un graphique en fin de réponse pour illustrer visuellement les données. Ne le fais PAS quand la question est purement textuelle.

GÉNÉRATION DE FICHIERS EXCEL :
Quand l'utilisateur demande un tableau Excel, un export Excel, ou une extraction de données en tableur :
1. Génère le contenu textuel d'introduction
2. Ajoute EXACTEMENT le marqueur ##EXCEL_DATA## sur une nouvelle ligne
3. Suivi IMMÉDIATEMENT d'un objet JSON valide sur une seule ligne :
   {"filename":"nom_du_fichier","data":[["Col1","Col2"],["val1","val2"],...]}
Règles Excel : première ligne = en-têtes, JSON valide sur UNE ligne après ##EXCEL_DATA##, rien après.`;

    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: level > 1 ? 12000 : 0 }
      },
    });

    return response;
  }

  async transcribeAudio(
    audioBase64: string,
    synthesisType: string = 'transcription',
    mimeType: string = 'audio/mp3',
    customPrompt?: string,
    outputTemplate?: string,
  ) {
    const ai = this.getAI();

    // Build the full prompt
    let prompt = customPrompt || 'Transcris intégralement cet enregistrement audio.';

    // If an output template is provided, instruct Gemini to fill it
    if (outputTemplate) {
      prompt += `\n\nTu DOIS structurer ta réponse en suivant EXACTEMENT ce modèle Markdown. Remplis chaque section avec les informations extraites de l'audio. Si une info n'est pas disponible, écris "Non mentionné".\n\nMODÈLE À REMPLIR :\n${outputTemplate}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
