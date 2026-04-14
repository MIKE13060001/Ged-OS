import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/lib/ai/gemini";
import { generateExcel, generateDocx } from "@/lib/fileGenerator";

/**
 * Only trigger file generation when the user EXPLICITLY asks for an Excel/Word file.
 * Generic words like "génère", "tableau", "rapport" alone are NOT enough.
 */
function mightBeFileRequest(message: string): boolean {
  const lower = message.toLowerCase();
  // Must mention a file format explicitly
  const hasFileFormat = ["excel", "xlsx", ".xlsx", "fichier excel", "tableau excel", "export excel",
    "word", "docx", ".docx", "fichier word"].some(kw => lower.includes(kw));
  return hasFileFormat;
}

const EXCEL_TRIGGER = "##EXCEL_DATA##";
const SVG_TRIGGER = "##SVG_CHART##";
const CHART_TRIGGER = "##CHART_DATA##";
const ACTION_TRIGGER = "##ACTION##";

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
    const { history, level, documents, audioTranscriptions } = await req.json();

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
    const response = await gemini.chat(history, level || 1, documents || [], audioTranscriptions || []);
    const rawText = response.text || "";

    // Parse structured chart data (Recharts JSON)
    const chartIdx = rawText.indexOf(CHART_TRIGGER);
    if (chartIdx !== -1) {
      const beforeChart = rawText.substring(0, chartIdx).trim();
      const afterChart = rawText.substring(chartIdx + CHART_TRIGGER.length).trim();
      try {
        const jsonMatch = afterChart.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const chartData = JSON.parse(jsonMatch[0]);
          if (chartData.type && chartData.data) {
            return NextResponse.json({
              text: beforeChart || "Voici votre graphique.",
              chartData,
            });
          }
        }
      } catch {
        // fallback — return text without chart
      }
    }

    // Legacy SVG chart marker (rétrocompat)
    const svgIdx = rawText.indexOf(SVG_TRIGGER);
    if (svgIdx !== -1) {
      const beforeSvg = rawText.substring(0, svgIdx).trim();
      const svgContent = rawText.substring(svgIdx + SVG_TRIGGER.length).trim();
      return NextResponse.json({ text: beforeSvg || "Voici votre graphique.", chart: svgContent });
    }

    // Parse N3 action marker
    const actionIdx = rawText.indexOf(ACTION_TRIGGER);
    if (actionIdx !== -1) {
      const beforeAction = rawText.substring(0, actionIdx).trim();
      const afterAction = rawText.substring(actionIdx + ACTION_TRIGGER.length).trim();
      try {
        const jsonMatch = afterAction.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const action = JSON.parse(jsonMatch[0]);
          if (action.type && action.explanation && action.payload) {
            return NextResponse.json({
              text: beforeAction || "Une action est prête à être exécutée.",
              action,
            });
          }
        }
      } catch {
        // fallback to plain text
      }
    }

    return NextResponse.json({ text: rawText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { text: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
