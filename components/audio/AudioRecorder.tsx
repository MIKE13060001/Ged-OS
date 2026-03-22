"use client";

import { useState, useRef } from "react";
import { Mic, Square, Trash2, Sparkles, Loader2, CheckCircle2, Upload, FolderPlus, ChevronDown } from "lucide-react";
import { useAudioStore, SYNTHESIS_OPTIONS, type SynthesisType, type Recording } from "@/stores/audioStore";
import { useDocumentStore } from "@/stores/documentStore";

interface AudioRecorderProps {
  onTranscription?: (text: string) => void;
  onRecordingSaved?: (rec: Recording) => void;
}

export function AudioRecorder({ onTranscription, onRecordingSaved }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioMime, setAudioMime] = useState("audio/mp3");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [synthesisType, setSynthesisType] = useState<SynthesisType>("transcription");
  const [showSynthesisMenu, setShowSynthesisMenu] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [addedToGed, setAddedToGed] = useState(false);
  const [title, setTitle] = useState("");

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addRecording, updateRecording, markAddedToGed } = useAudioStore();
  const { addDocument } = useDocumentStore();

  const selectedSynthesis = SYNTHESIS_OPTIONS.find((o) => o.value === synthesisType)!;

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
      setAddedToGed(false);
      setCurrentRecordingId(null);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        setAudioMime("audio/mp3");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioBlob(file);
    setAudioMime(file.type || "audio/mp3");
    setTranscription(null);
    setAddedToGed(false);
    setCurrentRecordingId(null);
    setTitle(file.name.replace(/\.[^.]+$/, ""));

    // Estimate duration from file size (rough)
    const estimatedDuration = Math.round(file.size / 16000);
    setDuration(estimatedDuration);
  };

  const handleProcess = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioBase64: base64, synthesisType, mimeType: audioMime }),
        });
        const data = res.ok ? await res.json() : { text: "Transcription échouée." };
        const result = data.text || "Transcription échouée.";
        setTranscription(result);
        onTranscription?.(result);

        // Save to audioStore
        const recId = crypto.randomUUID();
        const recTitle = title || `Enregistrement ${new Date().toLocaleDateString("fr-FR")} ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
        const rec: Recording = {
          id: recId,
          title: recTitle,
          audioDataUrl: dataUrl,
          durationSeconds: duration,
          synthesisType,
          transcription: result,
          tags: [selectedSynthesis.label],
          addedToGed: false,
          gedDocumentId: null,
          createdAt: new Date().toISOString(),
        };
        addRecording(rec);
        setCurrentRecordingId(recId);
        onRecordingSaved?.(rec);

        setIsProcessing(false);
      };
    } catch {
      setIsProcessing(false);
      setTranscription("Une erreur s'est produite lors de la transcription.");
    }
  };

  const handleAddToGed = () => {
    if (!transcription || !currentRecordingId) return;

    const recTitle = title || `Enregistrement ${new Date().toLocaleDateString("fr-FR")}`;
    const docId = crypto.randomUUID();
    const now = new Date().toISOString();

    addDocument({
      id: docId,
      tenantId: "default",
      name: `${recTitle} — ${selectedSynthesis.label}`,
      originalName: `${recTitle}.audio`,
      mimeType: "text/plain",
      sizeBytes: new Blob([transcription]).size,
      storagePath: "",
      version: 1,
      ocrStatus: "completed",
      ocrText: transcription,
      extractedData: { source: "audio", synthesisType },
      tags: ["audio", selectedSynthesis.label.toLowerCase()],
      metadata: { audioRecordingId: currentRecordingId, synthesisType },
      createdBy: "local",
      createdAt: now,
    });

    markAddedToGed(currentRecordingId, docId);
    setAddedToGed(true);
  };

  const reset = () => {
    setAudioBlob(null);
    setDuration(0);
    setTranscription(null);
    setCurrentRecordingId(null);
    setAddedToGed(false);
    setTitle("");
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
              : "Transcription et synthèse par IA Gemini"}
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

        {/* Synthesis type selector */}
        <div className="w-full relative">
          <button
            onClick={() => setShowSynthesisMenu(!showSynthesisMenu)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <span className="flex items-center gap-2">
              <span>{selectedSynthesis.icon}</span>
              <span>{selectedSynthesis.label}</span>
            </span>
            <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)", transform: showSynthesisMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {showSynthesisMenu && (
            <div
              className="absolute z-20 top-full mt-1 w-full rounded-xl overflow-hidden"
              style={{
                background: "hsl(240 12% 10%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              }}
            >
              {SYNTHESIS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSynthesisType(opt.value); setShowSynthesisMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] transition-colors"
                  style={{
                    color: opt.value === synthesisType ? "#a78bfa" : "rgba(255,255,255,0.7)",
                    background: opt.value === synthesisType ? "rgba(139,92,246,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (opt.value !== synthesisType) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { if (opt.value !== synthesisType) e.currentTarget.style.background = "transparent"; }}
                >
                  <span>{opt.icon}</span>
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title input when blob is ready */}
        {audioBlob && !isRecording && !isProcessing && !transcription && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'enregistrement (optionnel)"
            className="w-full px-4 py-2.5 rounded-xl text-[13px] font-medium text-white/90 placeholder:text-white/25 outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        )}

        {/* Controls */}
        <div className="flex items-center gap-3 w-full justify-center">
          {!isRecording && !audioBlob && (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.6)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.4)")}
              >
                <Mic size={18} />
                Enregistrer
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                title="Importer un fichier audio"
              >
                <Upload size={17} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
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

          {audioBlob && !isProcessing && !transcription && (
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
                Analyser — {selectedSynthesis.label}
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
          <div className="w-full space-y-3">
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
                  {selectedSynthesis.label}
                </span>
              </div>
              <div
                className="text-[13px] leading-relaxed whitespace-pre-wrap"
                style={{ color: "rgba(255,255,255,0.75)", maxHeight: "300px", overflowY: "auto" }}
              >
                {transcription}
              </div>
            </div>

            {/* Action buttons after transcription */}
            <div className="flex items-center gap-2">
              {!addedToGed && (
                <button
                  onClick={handleAddToGed}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "#a78bfa",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                >
                  <FolderPlus size={15} />
                  Ajouter à la GED
                </button>
              )}
              {addedToGed && (
                <div
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "#34d399",
                  }}
                >
                  <CheckCircle2 size={15} />
                  Ajouté à la GED
                </div>
              )}
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                Nouvel enregistrement
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }} />
    </div>
  );
}
