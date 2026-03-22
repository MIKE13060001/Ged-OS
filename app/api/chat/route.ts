import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/lib/ai/gemini";
import { generateExcel, generateDocx } from "@/lib/fileGenerator";

const FILE_KEYWORDS = [
  "crée", "créé", "créer", "génère", "génèrer", "générer", "exporte", "exporter",
  "fichier", "excel", "xlsx", "word", "docx", "tableau", "rapport",
  "create", "generate", "export", "file", "spreadsheet",
];

function mightBeFileRequest(message: string): boolean {
  const lower = message.toLowerCase();
  return FILE_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const { history, level, documents } = await req.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const gemini = new GeminiService();
    const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content || "";

    console.log('[GEDOS] Chat request, lastMsg:', lastUserMessage.slice(0, 80));
    console.log('[GEDOS] mightBeFileRequest:', mightBeFileRequest(lastUserMessage));

    // Check if this might be a file generation request
    if (mightBeFileRequest(lastUserMessage)) {
      const validDocs = (documents || []).filter(
        (d: { ocrStatus: string; ocrText?: string; name: string }) =>
          d.ocrStatus === "completed" && d.ocrText
      );
      const knowledgeBase = validDocs
        .map((d: { name: string; ocrText: string }) => `[SOURCE: ${d.name}]\n${d.ocrText}\n---`)
        .join("\n\n");

      const fileResult = await gemini.detectAndStructureFileRequest(
        lastUserMessage,
        knowledgeBase
      );

      if (fileResult.isFileRequest && fileResult.fileType) {
        try {
          let generated;

          if (fileResult.fileType === "xlsx" && fileResult.xlsxData) {
            generated = generateExcel(fileResult.xlsxData, fileResult.filename);
          } else if (fileResult.fileType === "docx" && fileResult.docxData) {
            generated = await generateDocx(
              fileResult.docxData as Parameters<typeof generateDocx>[0],
              fileResult.filename
            );
          }

          if (generated) {
            return NextResponse.json({
              text:
                fileResult.textResponse ||
                `Votre fichier ${fileResult.fileType.toUpperCase()} a été généré avec succès.`,
              file: {
                base64: generated.base64,
                mimeType: generated.mimeType,
                filename: generated.filename,
                type: generated.type,
              },
            });
          }
        } catch (fileError) {
          console.error("File generation error:", fileError);
          // Fall through to normal chat response
        }
      }
    }

    // Normal chat response
    const response = await gemini.chat(history, level || 1, documents || []);
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { text: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
