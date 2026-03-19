"use client";

import { useState, useRef } from "react";
import { Mic, Square, Trash2, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      timerInterval.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.");
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
    <Card className="border-border max-w-xl w-full shadow-2xl">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Mic indicator */}
          <div className="relative">
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring" />
            )}
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                isRecording
                  ? "bg-red-500/10 border-red-500 scale-110"
                  : "bg-muted border-border"
              )}
            >
              <Mic size={40} className={isRecording ? "text-red-500" : "text-muted-foreground"} />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isRecording
                ? "Enregistrement en cours..."
                : audioBlob
                ? "Enregistrement terminé"
                : "Studio d'enregistrement"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isRecording
                ? "Votre voix est capturée en temps réel"
                : "Capturez vos réunions, l'IA fera le reste"}
            </p>
          </div>

          {/* Timer */}
          <div className="text-4xl font-mono font-bold text-foreground tabular-nums">
            {formatTime(duration)}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full justify-center">
            {!isRecording && !audioBlob && (
              <ShimmerButton onClick={startRecording} className="px-8 py-3.5 gap-2 font-bold">
                <Mic size={20} />
                Démarrer
              </ShimmerButton>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                className="px-8 py-3.5 bg-red-500 hover:bg-red-600 gap-2 font-bold shadow-lg shadow-red-500/20"
                size="lg"
              >
                <Square size={18} />
                Arrêter
              </Button>
            )}

            {audioBlob && !isProcessing && (
              <>
                <Button variant="outline" size="icon" onClick={reset} className="h-12 w-12 rounded-xl">
                  <Trash2 size={18} />
                </Button>
                <ShimmerButton
                  onClick={handleProcess}
                  className="flex-1 px-8 py-3.5 gap-2 font-bold"
                  background="rgba(16, 185, 129, 1)"
                >
                  <Sparkles size={20} />
                  Analyser avec IA
                </ShimmerButton>
              </>
            )}

            {isProcessing && (
              <div className="flex items-center gap-3 text-muted-foreground font-medium">
                <Loader2 size={20} className="animate-spin text-primary" />
                Traitement par l&apos;IA en cours...
              </div>
            )}
          </div>

          {/* Transcription result */}
          {transcription && (
            <div className="w-full bg-muted/30 border border-border rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Transcription complète</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{transcription}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
