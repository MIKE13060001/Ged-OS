"use client";

import { useState, useRef } from "react";
import { AudioRecorder } from "@/components/audio/AudioRecorder";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useAudioStore, type SynthesisTemplate } from "@/stores/audioStore";
import { useDocumentStore } from "@/stores/documentStore";
import {
  Mic,
  Clock,
  Play,
  Pause,
  Trash2,
  FolderPlus,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Lock,
  X,
  Check,
  LayoutTemplate,
  Download,
} from "lucide-react";

type Tab = "studio" | "recordings" | "templates";

/* ── Template dialog ───────────────────────────────────────── */
function TemplateDialog({
  initial,
  onSave,
  onClose,
}: {
  initial?: SynthesisTemplate;
  onSave: (data: { label: string; prompt: string }) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [prompt, setPrompt] = useState(initial?.prompt ?? "");
  const valid = label.trim().length > 0 && prompt.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.7)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl"
        style={{
          background: "hsl(240 10% 9%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <LayoutTemplate size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
            </div>
            <span className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.88)" }}>
              {initial ? "Modifier le template" : "Nouveau template"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Nom du template
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Entretien technique, Brief marketing…"
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.82)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Instructions pour l&apos;IA
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décris précisément comment l'IA doit traiter l'audio : format attendu, sections requises, ton, style…"
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none transition-all leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.82)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <p className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.22)" }}>
              {prompt.length} caractères · Le prompt est envoyé directement à Gemini avec l&apos;audio.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            Annuler
          </button>
          <button
            onClick={() => valid && onSave({ label: label.trim(), prompt: prompt.trim() })}
            disabled={!valid}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: valid ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${valid ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)"}`,
              color: valid ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.25)",
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            <Check size={12} />
            {initial ? "Enregistrer" : "Créer le template"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function AudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("studio");
  const [selectedTemplateId, setSelectedTemplateId] = useState("transcription");

  // Recordings state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Template dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SynthesisTemplate | undefined>();

  const { recordings, templates, removeRecording, markAddedToGed, addTemplate, updateTemplate, removeTemplate } =
    useAudioStore();
  const { addDocument } = useDocumentStore();

  /* ── Recordings helpers ─────────────────────────────────── */
  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const togglePlay = (recId: string, audioDataUrl: string) => {
    if (playingId === recId) {
      const el = audioElements.current.get(recId);
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
      setPlayingId(null);
      return;
    }
    if (playingId) {
      const prev = audioElements.current.get(playingId);
      if (prev) {
        prev.pause();
        prev.currentTime = 0;
      }
    }
    let el = audioElements.current.get(recId);
    if (!el) {
      el = new Audio(audioDataUrl);
      el.onended = () => setPlayingId(null);
      audioElements.current.set(recId, el);
    }
    el.play();
    setPlayingId(recId);
  };

  const handleAddToGed = (rec: (typeof recordings)[0]) => {
    if (!rec.transcription || rec.addedToGed) return;
    const tpl = templates.find((t) => t.id === rec.synthesisType);
    const synthLabel = tpl?.label ?? "Transcription";
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

  const handleDeleteRecording = (recId: string) => {
    const el = audioElements.current.get(recId);
    if (el) {
      el.pause();
      audioElements.current.delete(recId);
    }
    if (playingId === recId) setPlayingId(null);
    removeRecording(recId);
  };

  /* ── Template helpers ───────────────────────────────────── */
  const openCreate = () => {
    setEditingTemplate(undefined);
    setDialogOpen(true);
  };

  const openEdit = (tpl: SynthesisTemplate) => {
    setEditingTemplate(tpl);
    setDialogOpen(true);
  };

  const handleSave = ({ label, prompt }: { label: string; prompt: string }) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, { label, prompt });
    } else {
      addTemplate({
        id: crypto.randomUUID(),
        label,
        prompt,
        isDefault: false,
        createdAt: new Date().toISOString(),
      });
    }
    setDialogOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    removeTemplate(id);
    if (selectedTemplateId === id) setSelectedTemplateId("transcription");
  };

  /* ── Tabs config ────────────────────────────────────────── */
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "studio", label: "Studio" },
    { id: "recordings", label: "Enregistrements", count: recordings.length },
    { id: "templates", label: "Templates", count: templates.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ── Page header ──────────────────────────────────── */}
      <div
        className="px-6 pt-5 pb-0 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <BlurFade>
          <div className="flex items-center gap-2.5 pb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Mic size={13} style={{ color: "rgba(255,255,255,0.55)" }} />
            </div>
            <div>
              <h1
                className="text-[15px] font-semibold leading-tight"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                Module Audio
              </h1>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.32)" }}>
                Enregistrement · Transcription · Synthèse par IA
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all duration-150"
                style={{
                  color:
                    activeTab === tab.id
                      ? "rgba(255,255,255,0.88)"
                      : "rgba(255,255,255,0.35)",
                  borderBottom:
                    activeTab === tab.id
                      ? "1.5px solid rgba(255,255,255,0.7)"
                      : "1.5px solid transparent",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id)
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id)
                    e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                    style={{
                      background:
                        activeTab === tab.id
                          ? "rgba(255,255,255,0.10)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        activeTab === tab.id
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </BlurFade>
      </div>

      {/* ── Tab content ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* STUDIO ──────────────────────────────────────── */}
        {activeTab === "studio" && (
          <div className="p-6 space-y-5">
            {/* Template selector */}
            <BlurFade>
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Template actif
                </p>
                <div className="flex flex-wrap gap-2">
                  {templates.map((tpl) => {
                    const active = selectedTemplateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-100"
                        style={{
                          background: active
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.07)"}`,
                          color: active
                            ? "rgba(255,255,255,0.90)"
                            : "rgba(255,255,255,0.40)",
                        }}
                      >
                        <FileText size={11} />
                        {tpl.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setActiveTab("templates")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                    style={{
                      border: "1px dashed rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.25)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                    }
                  >
                    <Plus size={10} />
                    Gérer
                  </button>
                </div>
              </div>
            </BlurFade>

            {/* Recorder card */}
            <BlurFade delay={0.05}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "hsl(240 10% 8%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Card header */}
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div>
                    <p
                      className="text-[12px] font-semibold"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      Studio d&apos;enregistrement
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {templates.find((t) => t.id === selectedTemplateId)?.label ?? "Transcription"}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <Mic size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </div>
                </div>

                <div className="px-5 py-4">
                  <AudioRecorder
                    selectedTemplateId={selectedTemplateId}
                    onRecordingSaved={() => setActiveTab("recordings")}
                  />
                </div>
              </div>
            </BlurFade>

            {/* Quick tip */}
            <BlurFade delay={0.1}>
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Clock size={12} className="shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }} />
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.30)" }}>
                  Après traitement, l&apos;enregistrement est sauvegardé automatiquement. Retrouvez-le dans
                  l&apos;onglet <strong className="font-semibold text-white/40">Enregistrements</strong>. Ajoutez-le à la GED en un clic.
                </p>
              </div>
            </BlurFade>
          </div>
        )}

        {/* ENREGISTREMENTS ─────────────────────────────── */}
        {activeTab === "recordings" && (
          <div className="p-6">
            <BlurFade>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    Enregistrements récents
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {recordings.length} enregistrement{recordings.length !== 1 ? "s" : ""}
                </span>
              </div>

              {recordings.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center py-16 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px dashed rgba(255,255,255,0.06)",
                  }}
                >
                  <Mic size={28} style={{ color: "rgba(255,255,255,0.10)" }} />
                  <p
                    className="text-[13px] mt-3 font-medium"
                    style={{ color: "rgba(255,255,255,0.22)" }}
                  >
                    Aucun enregistrement
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.14)" }}>
                    Allez dans Studio pour enregistrer ou importer un fichier
                  </p>
                  <button
                    onClick={() => setActiveTab("studio")}
                    className="mt-4 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    Ouvrir le Studio
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {recordings.map((rec, i) => {
                  const tpl = templates.find((t) => t.id === rec.synthesisType);
                  const isExpanded = expandedId === rec.id;
                  const isPlaying = playingId === rec.id;

                  return (
                    <BlurFade key={rec.id} inView delay={i * 0.035}>
                      <div
                        className="rounded-xl overflow-hidden transition-all duration-150"
                        style={{
                          background: "hsl(240 10% 8%)",
                          border: isExpanded
                            ? "1px solid rgba(255,255,255,0.12)"
                            : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {/* Row */}
                        <div
                          className="flex items-center gap-3.5 p-3.5 cursor-pointer select-none"
                          onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay(rec.id, rec.audioDataUrl);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                            style={{
                              background: isPlaying
                                ? "rgba(255,255,255,0.12)"
                                : "rgba(255,255,255,0.06)",
                              border: `1px solid ${isPlaying ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)"}`,
                            }}
                          >
                            {isPlaying ? (
                              <Pause
                                size={12}
                                style={{ color: "rgba(255,255,255,0.8)" }}
                                fill="currentColor"
                              />
                            ) : (
                              <Play
                                size={12}
                                style={{ color: "rgba(255,255,255,0.55)" }}
                                fill="currentColor"
                              />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] font-medium truncate"
                              style={{ color: "rgba(255,255,255,0.82)" }}
                            >
                              {rec.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="text-[10px]"
                                style={{ color: "rgba(255,255,255,0.28)" }}
                              >
                                {formatDate(rec.createdAt)} · {formatTime(rec.createdAt)}
                              </span>
                              {tpl && (
                                <span
                                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                                  style={{
                                    background: "rgba(255,255,255,0.05)",
                                    color: "rgba(255,255,255,0.40)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }}
                                >
                                  {tpl.label}
                                </span>
                              )}
                              {rec.addedToGed && (
                                <span
                                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                                  style={{
                                    background: "rgba(52,211,153,0.08)",
                                    color: "rgba(52,211,153,0.65)",
                                    border: "1px solid rgba(52,211,153,0.14)",
                                  }}
                                >
                                  GED
                                </span>
                              )}
                            </div>
                          </div>

                          <span
                            className="text-[12px] font-mono shrink-0"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {formatDuration(rec.durationSeconds)}
                          </span>

                          {isExpanded ? (
                            <ChevronUp
                              size={13}
                              style={{ color: "rgba(255,255,255,0.25)" }}
                            />
                          ) : (
                            <ChevronDown
                              size={13}
                              style={{ color: "rgba(255,255,255,0.25)" }}
                            />
                          )}
                        </div>

                        {/* Expanded */}
                        {isExpanded && (
                          <div
                            className="px-3.5 pb-3.5 space-y-3"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                          >
                            {rec.transcription && (
                              <div
                                className="rounded-xl p-3.5 mt-3"
                                style={{
                                  background: "rgba(255,255,255,0.02)",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                }}
                              >
                                <div className="flex items-center gap-2 mb-2.5">
                                  <FileText
                                    size={11}
                                    style={{ color: "rgba(255,255,255,0.30)" }}
                                  />
                                  <span
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: "rgba(255,255,255,0.30)" }}
                                  >
                                    {tpl?.label ?? "Transcription"}
                                  </span>
                                </div>
                                <div
                                  className="text-[12px] leading-relaxed whitespace-pre-wrap overflow-y-auto"
                                  style={{
                                    color: "rgba(255,255,255,0.58)",
                                    maxHeight: "200px",
                                  }}
                                >
                                  {rec.transcription}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              {!rec.addedToGed && rec.transcription && (
                                <button
                                  onClick={() => handleAddToGed(rec)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                                  style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    color: "rgba(255,255,255,0.65)",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                      "rgba(255,255,255,0.10)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                      "rgba(255,255,255,0.06)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                                  }}
                                >
                                  <FolderPlus size={12} />
                                  Ajouter à la GED
                                </button>
                              )}
                              {rec.addedToGed && (
                                <div
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                                  style={{
                                    background: "rgba(52,211,153,0.06)",
                                    border: "1px solid rgba(52,211,153,0.12)",
                                    color: "rgba(52,211,153,0.65)",
                                  }}
                                >
                                  <CheckCircle2 size={12} />
                                  Dans la GED
                                </div>
                              )}
                              <div className="flex-1" />
                              <button
                                onClick={() => handleDeleteRecording(rec.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                                style={{
                                  background: "rgba(239,68,68,0.05)",
                                  border: "1px solid rgba(239,68,68,0.10)",
                                  color: "rgba(239,68,68,0.50)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(239,68,68,0.10)";
                                  e.currentTarget.style.color = "rgba(239,68,68,0.80)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "rgba(239,68,68,0.05)";
                                  e.currentTarget.style.color = "rgba(239,68,68,0.50)";
                                }}
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
            </BlurFade>
          </div>
        )}

        {/* TEMPLATES ───────────────────────────────────── */}
        {activeTab === "templates" && (
          <div className="p-6">
            <BlurFade>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    Templates de synthèse
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {templates.filter((t) => !t.isDefault).length} personnalisé
                    {templates.filter((t) => !t.isDefault).length !== 1 ? "s" : ""} ·{" "}
                    {templates.filter((t) => t.isDefault).length} par défaut
                  </p>
                </div>
                <button
                  onClick={openCreate}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.90)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  }}
                >
                  <Plus size={13} />
                  Nouveau template
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {templates.map((tpl, i) => (
                  <BlurFade key={tpl.id} inView delay={i * 0.03}>
                    <div
                      className="group rounded-xl p-4 transition-all duration-150"
                      style={{
                        background: "hsl(240 10% 8%)",
                        border:
                          selectedTemplateId === tpl.id
                            ? "1px solid rgba(255,255,255,0.14)"
                            : "1px solid rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(255,255,255,0.10)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          selectedTemplateId === tpl.id
                            ? "rgba(255,255,255,0.14)"
                            : "rgba(255,255,255,0.06)";
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <FileText
                            size={13}
                            style={{ color: "rgba(255,255,255,0.40)" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[13px] font-semibold"
                              style={{ color: "rgba(255,255,255,0.82)" }}
                            >
                              {tpl.label}
                            </span>
                            {tpl.isDefault && (
                              <span
                                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  color: "rgba(255,255,255,0.25)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                }}
                              >
                                <Lock size={8} />
                                Défaut
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[11px] leading-relaxed line-clamp-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {tpl.prompt}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedTemplateId(tpl.id);
                              setActiveTab("studio");
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.09)",
                              color: "rgba(255,255,255,0.50)",
                            }}
                            title="Utiliser ce template"
                          >
                            Utiliser
                          </button>
                          <button
                            onClick={() => openEdit(tpl)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              color: "rgba(255,255,255,0.35)",
                            }}
                            title="Modifier"
                          >
                            <Pencil size={11} />
                          </button>
                          {!tpl.isDefault && (
                            <button
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                              style={{
                                background: "rgba(239,68,68,0.05)",
                                border: "1px solid rgba(239,68,68,0.09)",
                                color: "rgba(239,68,68,0.45)",
                              }}
                              title="Supprimer"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.10)";
                                e.currentTarget.style.color = "rgba(239,68,68,0.75)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.05)";
                                e.currentTarget.style.color = "rgba(239,68,68,0.45)";
                              }}
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </BlurFade>
          </div>
        )}
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <TemplateDialog
          initial={editingTemplate}
          onSave={handleSave}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}
