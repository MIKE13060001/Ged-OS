"use client";

import { useState, useRef } from "react";
import { Mic, Square, Trash2, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onTranscription?: (text: string) => void;
}

export function AudioRecorder({ onTranscription }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];
      setTranscription(null);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      timerInterval.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  };

  const handleProcess = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioBase64: base64 }),
        });
        const data = res.ok ? await res.json() : { text: "Transcription échouée." };
        const result = data.text || "Transcription échouée.";
        setTranscription(result);
        onTranscription?.(result);
        setIsProcessing(false);
        setAudioBlob(null);
      };
    } catch {
      setIsProcessing(false);
      setTranscription("Une erreur s'est produite lors de la transcription.");
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setDuration(0);
    setTranscription(null);
  };

  return (
    <div
      className="w-full max-w-lg rounded-3xl overflow-hidden relative"
      style={{
        background: "hsl(240 12% 7%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top gradient line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />

      <div className="p-10 flex flex-col items-center text-center gap-7">
        {/* Mic ring */}
        <div className="relative flex items-center justify-center">
          {isRecording && (
            <>
              <span className="absolute w-32 h-32 rounded-full animate-pulse-ring"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }} />
              <span className="absolute w-24 h-24 rounded-full animate-pulse-ring"
                style={{ background: "rgba(239,68,68,0.06)", animationDelay: "0.4s" }} />
            </>
          )}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10"
            style={{
              background: isRecording
                ? "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))"
                : "rgba(255,255,255,0.04)",
              border: isRecording
                ? "1px solid rgba(239,68,68,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isRecording ? "0 0 30px rgba(239,68,68,0.2)" : "none",
              transform: isRecording ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Mic
              size={34}
              style={{ color: isRecording ? "#ef4444" : "rgba(255,255,255,0.3)" }}
              className="transition-colors duration-300"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-black text-white mb-1.5">
            {isRecording ? "Capture en cours…" : audioBlob ? "Prêt à analyser" : "Studio d'enregistrement"}
          </h2>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {isRecording
              ? "Voix capturée — traitement local souverain"
              : "Transcription et résumé par IA Gemini"}
          </p>
        </div>

        {/* Timer */}
        <div
          className="text-5xl font-black tabular-nums tracking-tighter"
          style={{
            color: isRecording ? "#ef4444" : "rgba(255,255,255,0.9)",
            fontVariantNumeric: "tabular-nums",
            transition: "color 0.3s",
          }}
        >
          {formatTime(duration)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full justify-center">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.6)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.4)")}
            >
              <Mic size={18} />
              Démarrer
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 8px 24px rgba(239,68,68,0.4)",
              }}
            >
              <Square size={16} fill="white" />
              Arrêter
            </button>
          )}

          {audioBlob && !isProcessing && (
            <>
              <button
                onClick={reset}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(239,68,68,0.9)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                <Trash2 size={17} />
              </button>
              <button
                onClick={handleProcess}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(16,185,129,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.35)")}
              >
                <Sparkles size={17} />
                Analyser avec l'IA
              </button>
            </>
          )}

          {isProcessing && (
            <div className="flex items-center gap-3 py-3 font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              <Loader2 size={20} className="animate-spin text-blue-400" />
              <span className="text-sm">Traitement en cours…</span>
            </div>
          )}
        </div>

        {/* Transcription result */}
        {transcription && (
          <div
            className="w-full rounded-2xl p-4 text-left"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Transcription complète
              </span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              {transcription}
            </p>
          </div>
        )}
      </div>

      {/* Bottom gradient line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }} />
    </div>
  );
}
