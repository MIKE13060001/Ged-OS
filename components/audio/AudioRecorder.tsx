"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, RotateCcw, Loader2, Upload, ArrowRight } from "lucide-react";
import { useAudioStore, type Recording } from "@/stores/audioStore";

interface AudioRecorderProps {
  selectedTemplateId: string;
  onTranscription?: (text: string) => void;
  onRecordingSaved?: (rec: Recording) => void;
}

export function AudioRecorder({ selectedTemplateId, onTranscription, onRecordingSaved }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioMime, setAudioMime] = useState("audio/mp3");
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("");

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const { addRecording, templates } = useAudioStore();
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Waveform visualization
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const mid = h / 2;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;

    const sliceWidth = w / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * mid;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.stroke();
    animFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup analyser for waveform
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        setAudioMime("audio/mp3");
        stream.getTracks().forEach((t) => t.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        analyserRef.current = null;
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      timerInterval.current = setInterval(() => setDuration((d) => d + 1), 1000);

      // Start waveform
      drawWaveform();
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
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    setDuration(Math.round(file.size / 16000));
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
          body: JSON.stringify({
            audioBase64: base64,
            synthesisType: selectedTemplate.id,
            mimeType: audioMime,
            customPrompt: selectedTemplate.isDefault ? undefined : selectedTemplate.prompt,
          }),
        });
        const data = res.ok ? await res.json() : { text: "Transcription échouée." };
        const result = data.text || "Transcription échouée.";
        onTranscription?.(result);

        const recId = crypto.randomUUID();
        const recTitle = title || `Enregistrement ${new Date().toLocaleDateString("fr-FR")} ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
        const rec: Recording = {
          id: recId,
          title: recTitle,
          audioDataUrl: dataUrl,
          durationSeconds: duration,
          synthesisType: selectedTemplate.id,
          transcription: result,
          tags: [selectedTemplate.label],
          addedToGed: false,
          gedDocumentId: null,
          createdAt: new Date().toISOString(),
        };
        addRecording(rec);
        onRecordingSaved?.(rec);
        setIsProcessing(false);
        reset();
      };
    } catch {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setDuration(0);
    setTitle("");
  };

  return (
    <div className="w-full">
      {/* Waveform / Timer area */}
      <div className="flex flex-col items-center gap-5 py-6">
        {/* Waveform canvas */}
        <div className="relative w-full h-16 flex items-center justify-center">
          {isRecording ? (
            <canvas
              ref={canvasRef}
              width={320}
              height={64}
              className="w-full h-full"
              style={{ opacity: 0.6 }}
            />
          ) : (
            <div className="flex items-center gap-[3px] h-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full transition-all duration-300"
                  style={{
                    height: audioBlob
                      ? `${12 + Math.sin(i * 0.5) * 12}px`
                      : "4px",
                    background: audioBlob
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <span
            className="text-3xl font-mono font-light tracking-wider tabular-nums"
            style={{
              color: isRecording ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTime(duration)}
          </span>
          {isRecording && (
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "rgba(255,255,255,0.7)" }}
            />
          )}
        </div>

        {/* Title input */}
        {audioBlob && !isRecording && !isProcessing && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre (optionnel)"
            className="w-full max-w-xs px-0 py-1 text-center text-[13px] font-medium text-white/80 placeholder:text-white/20 outline-none border-b bg-transparent"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pb-2">
        {!isRecording && !audioBlob && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-4 rounded-lg text-[12px] font-medium flex items-center gap-2 transition-all"
              style={{
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
            >
              <Upload size={13} />
              Importer
            </button>
            <button
              onClick={startRecording}
              className="h-10 px-6 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all text-white"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              <Mic size={14} />
              Enregistrer
            </button>
            <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
          </>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="h-10 px-6 rounded-lg text-[13px] font-semibold flex items-center gap-2 text-white transition-all"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Square size={12} fill="white" />
            Arrêter
          </button>
        )}

        {audioBlob && !isProcessing && (
          <>
            <button
              onClick={reset}
              className="h-10 w-10 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={handleProcess}
              className="h-10 px-5 rounded-lg text-[13px] font-semibold flex items-center gap-2 text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              Traiter
              <ArrowRight size={13} />
            </button>
          </>
        )}

        {isProcessing && (
          <div className="h-10 px-5 rounded-lg flex items-center gap-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Loader2 size={15} className="animate-spin" />
            <span className="text-[12px] font-medium">Analyse en cours…</span>
          </div>
        )}
      </div>

      {/* Selected template indicator */}
      <div className="flex justify-center pt-3 pb-1">
        <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
          {selectedTemplate.label}
        </span>
      </div>
    </div>
  );
}
