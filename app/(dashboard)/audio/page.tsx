"use client";

import { useState } from "react";
import { Mic, Clock, Play, Pause, Trash2, FolderPlus, CheckCircle2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { AudioRecorder } from "@/components/audio/AudioRecorder";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useAudioStore, SYNTHESIS_OPTIONS } from "@/stores/audioStore";
import { useDocumentStore } from "@/stores/documentStore";

export default function AudioPage() {
  const { recordings, removeRecording, markAddedToGed } = useAudioStore();
  const { addDocument } = useDocumentStore();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [audioElements] = useState<Map<string, HTMLAudioElement>>(new Map());

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = (recId: string, audioDataUrl: string) => {
    if (playingId === recId) {
      const el = audioElements.get(recId);
      if (el) { el.pause(); el.currentTime = 0; }
      setPlayingId(null);
      return;
    }

    // Stop any currently playing
    if (playingId) {
      const prev = audioElements.get(playingId);
      if (prev) { prev.pause(); prev.currentTime = 0; }
    }

    let el = audioElements.get(recId);
    if (!el) {
      el = new Audio(audioDataUrl);
      el.onended = () => setPlayingId(null);
      audioElements.set(recId, el);
    }
    el.play();
    setPlayingId(recId);
  };

  const handleAddToGed = (rec: typeof recordings[0]) => {
    if (!rec.transcription || rec.addedToGed) return;

    const synthLabel = SYNTHESIS_OPTIONS.find((o) => o.value === rec.synthesisType)?.label || "Transcription";
    const docId = crypto.randomUUID();

    addDocument({
      id: docId,
      tenantId: "default",
      name: `${rec.title} — ${synthLabel}`,
      originalName: `${rec.title}.audio`,
      mimeType: "text/plain",
      sizeBytes: new Blob([rec.transcription]).size,
      storagePath: "",
      version: 1,
      ocrStatus: "completed",
      ocrText: rec.transcription,
      extractedData: { source: "audio", synthesisType: rec.synthesisType },
      tags: ["audio", synthLabel.toLowerCase()],
      metadata: { audioRecordingId: rec.id, synthesisType: rec.synthesisType },
      createdBy: "local",
      createdAt: rec.createdAt,
    });

    markAddedToGed(rec.id, docId);
  };

  const handleDelete = (recId: string) => {
    const el = audioElements.get(recId);
    if (el) { el.pause(); audioElements.delete(recId); }
    if (playingId === recId) setPlayingId(null);
    removeRecording(recId);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div
        className="px-6 pt-6 pb-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <BlurFade>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <Mic size={14} className="text-violet-400" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Module Audio</h1>
          </div>
          <p className="text-[13px] ml-9" style={{ color: "rgba(255,255,255,0.4)" }}>
            Enregistrez, transcrivez et exploitez vos réunions — stockage souverain garanti.
          </p>
        </BlurFade>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Recorder section */}
        <div
          className="px-6 py-8 flex justify-center"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <BlurFade delay={0.05}>
            <AudioRecorder />
          </BlurFade>
        </div>

        {/* Recent recordings */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
            <h2 className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              Enregistrements récents
            </h2>
            <span
              className="text-[11px] font-mono px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(139,92,246,0.08)", color: "rgba(167,139,250,0.7)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              {recordings.length}
            </span>
          </div>

          {recordings.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}
            >
              <Mic size={28} style={{ color: "rgba(255,255,255,0.12)" }} />
              <p className="text-[13px] mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                Aucun enregistrement pour le moment
              </p>
            </div>
          )}

          <div className="space-y-2">
            {recordings.map((rec, i) => {
              const synthOption = SYNTHESIS_OPTIONS.find((o) => o.value === rec.synthesisType);
              const isExpanded = expandedId === rec.id;
              const isPlaying = playingId === rec.id;

              return (
                <BlurFade key={rec.id} inView delay={i * 0.04}>
                  <div
                    className="rounded-xl overflow-hidden transition-all duration-150"
                    style={{
                      background: "hsl(240 12% 7%)",
                      border: isExpanded ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Main row */}
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    >
                      {/* Play button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(rec.id, rec.audioDataUrl); }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{
                          background: isPlaying ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.1)",
                          border: `1px solid ${isPlaying ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.18)"}`,
                        }}
                      >
                        {isPlaying
                          ? <Pause size={14} className="text-violet-300" fill="currentColor" />
                          : <Play size={14} className="text-violet-300" fill="currentColor" />
                        }
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-white/90 truncate">{rec.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {formatDate(rec.createdAt)} · {formatTime(rec.createdAt)}
                          </span>
                          {synthOption && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                              style={{
                                background: "rgba(139,92,246,0.08)",
                                color: "rgba(167,139,250,0.7)",
                                border: "1px solid rgba(139,92,246,0.12)",
                              }}
                            >
                              {synthOption.icon} {synthOption.label}
                            </span>
                          )}
                          {rec.addedToGed && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                              style={{
                                background: "rgba(16,185,129,0.08)",
                                color: "rgba(52,211,153,0.7)",
                                border: "1px solid rgba(16,185,129,0.12)",
                              }}
                            >
                              GED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Duration */}
                      <span
                        className="text-[13px] font-mono font-semibold tabular-nums shrink-0"
                        style={{ color: "rgba(167,139,250,0.8)" }}
                      >
                        {formatDuration(rec.durationSeconds)}
                      </span>

                      {/* Expand indicator */}
                      {isExpanded
                        ? <ChevronUp size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                        : <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                      }
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div
                        className="px-4 pb-4 space-y-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                      >
                        {/* Transcription */}
                        {rec.transcription && (
                          <div
                            className="rounded-xl p-3 mt-3"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={11} style={{ color: "rgba(255,255,255,0.35)" }} />
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                                {synthOption?.label || "Transcription"}
                              </span>
                            </div>
                            <div
                              className="text-[12px] leading-relaxed whitespace-pre-wrap"
                              style={{ color: "rgba(255,255,255,0.6)", maxHeight: "200px", overflowY: "auto" }}
                            >
                              {rec.transcription}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!rec.addedToGed && rec.transcription && (
                            <button
                              onClick={() => handleAddToGed(rec)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                              style={{
                                background: "rgba(99,102,241,0.1)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                color: "#a78bfa",
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                            >
                              <FolderPlus size={12} />
                              Ajouter à la GED
                            </button>
                          )}
                          {rec.addedToGed && (
                            <div
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                              style={{
                                background: "rgba(16,185,129,0.08)",
                                border: "1px solid rgba(16,185,129,0.15)",
                                color: "#34d399",
                              }}
                            >
                              <CheckCircle2 size={12} />
                              Dans la GED
                            </div>
                          )}
                          <div className="flex-1" />
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                            style={{
                              background: "rgba(239,68,68,0.06)",
                              border: "1px solid rgba(239,68,68,0.12)",
                              color: "rgba(239,68,68,0.6)",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "rgba(239,68,68,0.9)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "rgba(239,68,68,0.6)"; }}
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
