import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { data, mimeType, fileName } = await req.json();

    if (!data || !mimeType || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const gemini = new GeminiService();
    const result = await gemini.indexDocumentContent(data, mimeType, fileName);

    return NextResponse.json(result);
  } catch (error) {
    console.error("OCR API error:", error);
    return NextResponse.json(
      { error: "OCR processing failed", text: "", tags: ["error"], extractedData: {} },
      { status: 500 }
    );
  }
}
