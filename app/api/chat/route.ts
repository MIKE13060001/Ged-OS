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

const EXCEL_TRIGGER = "##EXCEL_DATA##";

function parseExcelAction(text: string): {
  text: string;
  action?: { type: "excel"; data: unknown[][]; filename: string };
} {
  const idx = text.indexOf(EXCEL_TRIGGER);
  if (idx === -1) return { text };

  const beforeTrigger = text.substring(0, idx).trim();
  const afterTrigger = text.substring(idx + EXCEL_TRIGGER.length).trim();

  try {
    const parsed = JSON.parse(afterTrigger);
    if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return {
        text: beforeTrigger || "Voici votre fichier Excel généré.",
        action: {
          type: "excel",
          data: parsed.data,
          filename: parsed.filename || "export",
        },
      };
    }
  } catch {
    // fallback: return full text without the broken marker
  }
  return { text: beforeTrigger || text };
}

export async function POST(req: NextRequest) {
  try {
    const { history, level, documents } = await req.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const gemini = new GeminiService();
    const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content || "";

    // File generation
    if (mightBeFileRequest(lastUserMessage)) {
      try {
        const validDocs = (documents || []).filter(
          (d: { ocrStatus: string; ocrText?: string; name: string }) =>
            d.ocrStatus === "completed" && d.ocrText
        );
        const knowledgeBase = validDocs
          .map((d: { name: string; ocrText: string }) => `[SOURCE: ${d.name}]\n${d.ocrText}\n---`)
          .join("\n\n");

        const { sheets, filename, textResponse } = await gemini.generateFileFromRequest(
          lastUserMessage,
          knowledgeBase
        );

        const generated = generateExcel(sheets, filename);

        return NextResponse.json({
          text: textResponse,
          file: {
            base64: generated.base64,
            mimeType: generated.mimeType,
            filename: generated.filename,
            type: generated.type,
          },
        });
      } catch (fileError) {
        console.error("[GEDOS] File generation error (falling back to chat):", fileError);
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
