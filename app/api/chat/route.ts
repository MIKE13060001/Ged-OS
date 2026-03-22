import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/lib/ai/gemini";

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
    const response = await gemini.chat(history, level || 1, documents || []);
    const rawText = response.text || "";

    const result = parseExcelAction(rawText);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { text: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
