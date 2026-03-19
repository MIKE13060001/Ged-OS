import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { audioBase64 } = await req.json();

    if (!audioBase64) {
      return NextResponse.json({ error: "Missing audio data" }, { status: 400 });
    }

    const gemini = new GeminiService();
    const text = await gemini.transcribeAudio(audioBase64);

    return NextResponse.json({ text: text || "Transcription non disponible." });
  } catch (error) {
    console.error("Transcription API error:", error);
    return NextResponse.json(
      { text: "Erreur lors de la transcription." },
      { status: 500 }
    );
  }
}
