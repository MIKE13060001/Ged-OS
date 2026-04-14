"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Database,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  GitCompare,
  BarChart2,
  User,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { useAudioStore } from "@/stores/audioStore";
import { useAuditStore } from "@/stores/auditStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionApproval, type ActionPayload } from "@/components/assistant/ActionApproval";
import { ChartRenderer, type ChartData } from "@/components/assistant/ChartRenderer";

interface FileAttachment {
  base64: string;
  mimeType: string;
  filename: string;
  type: "xlsx" | "docx";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  level?: number;
  timestamp: Date;
  file?: FileAttachment;
  chart?: string;
  chartData?: ChartData;
  action?: ActionPayload & { status?: "pending" | "approved" | "rejected" };
}

const levels = [
  {
    id: 1,
    label: "N1",
    fullLabel: "Recherche",
    desc: "Recherche sémantique et résumés",
  },
  {
    id: 2,
    label: "N2",
    fullLabel: "Analyse",
    desc: "Extraction, tableaux, graphiques",
  },
  {
    id: 3,
    label: "N3",
    fullLabel: "Action",
    desc: "Actions avec validation humaine",
  },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white/90">
        <img src="/dos-logo.png" alt="DOS" className="w-4 h-4 object-contain" />
      </div>
      <div
        className="px-3 py-2.5 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.3)",
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatInterface({ compact = false }: { compact?: boolean }) {
  const documents = useDocumentStore((state) => state.documents);
  const recordings = useAudioStore((state) => state.recordings);
  const logEvent = useAuditStore((state) => state.logEvent);

  // Pre-compute stats for RAG panel
  const indexedDocs = documents.filter(d => d.ocrStatus === 'completed' && (d.ocrText?.trim() || Object.keys(d.extractedData || {}).length > 0));
  const pendingDocs = documents.filter(d => d.ocrStatus !== 'completed');
  const audioWithTranscription = recordings.filter(r => r.transcription?.trim());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Assistant Documents Office Solutions initialisé — ${documents.length} document${documents.length !== 1 ? "s" : ""} en mémoire. Je peux analyser vos documents, calculer des totaux, comparer des factures et répondre à toutes vos questions.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [level, setLevel] = useState(1);
  const [showKB, setShowKB] = useState(false);
  const [compareDoc1, setCompareDoc1] = useState("");
  const [compareDoc2, setCompareDoc2] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Voice input
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopRecording = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        audioCtx.close();
        if (chunksRef.current.length === 0) return;

        setIsTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
            reader.readAsDataURL(blob);
          });

          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64: base64,
              synthesisType: "transcription",
              mimeType: mimeType.split(";")[0],
              customPrompt: `Transcris fidèlement cet enregistrement vocal. L'audio peut contenir des bruits de fond, une mauvaise prononciation ou un accent. Corrige les erreurs évidentes de prononciation pour produire un texte clair et correct en français. Ne résume pas — transcris mot à mot en corrigeant la grammaire et l'orthographe si nécessaire. Réponds UNIQUEMENT avec le texte transcrit, rien d'autre.`,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const text = (data.text || "").trim();
            if (text && text !== "Transcription non disponible.") {
              setInput(text);
              // Auto-send after setting input
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }
          }
        } catch (err) {
          console.error("Voice transcription error:", err);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsRecording(true);

      // Silence detection — stop after 3s of silence
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastSoundTime = Date.now();

      const checkSilence = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (avg > 8) lastSoundTime = Date.now();
        if (Date.now() - lastSoundTime > 3000 && isRecording) {
          stopRecording();
          return;
        }
        animFrameRef.current = requestAnimationFrame(checkSilence);
      };
      checkSilence();
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  }, [isRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userQuery = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userQuery,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const history = newMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          level,
          documents,
          audioTranscriptions: audioWithTranscription.map(r => ({
            title: r.title,
            transcription: r.transcription!,
            synthesisType: r.synthesisType,
            createdAt: r.createdAt,
          })),
        }),
      });

      const data = res.ok
        ? await res.json()
        : { text: "Désolé, une erreur s'est produite." };

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text || "Désolé, je n'ai pas pu traiter cette demande.",
          level,
          timestamp: new Date(),
          file: data.file || undefined,
          chart: data.chart || undefined,
          chartData: data.chartData || undefined,
          action: data.action ? { ...data.action, status: "pending" } : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Erreur réseau. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentLevel = levels.find((l) => l.id === level)!;

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: "hsl(240 10% 8%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white/90">
            <img src="/dos-logo.png" alt="DOS" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <p
              className="text-[12px] font-semibold"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {compact ? "Assistant Documents Office Solutions" : "Assistant Souverain"}
            </p>
            <button
              onClick={() => setShowKB(!showKB)}
              className="flex items-center gap-1 text-[10px] font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.30)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.30)")
              }
            >
              <Database size={9} />
              {indexedDocs.length}/{documents.length} doc{documents.length !== 1 ? "s" : ""}
              {audioWithTranscription.length > 0 && ` · ${audioWithTranscription.length} audio`}
              {showKB ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
            </button>
          </div>
        </div>

        {/* Level selector */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {levels.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className="px-2.5 py-1 text-[11px] font-semibold transition-all duration-150"
              style={{
                color:
                  level === l.id
                    ? "rgba(255,255,255,0.90)"
                    : "rgba(255,255,255,0.32)",
                background:
                  level === l.id
                    ? "rgba(255,255,255,0.10)"
                    : "transparent",
                borderRight: l.id < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* RAG Knowledge Panel */}
      {showKB && (
        <div
          className="px-4 py-3 shrink-0 space-y-2 max-h-[240px] overflow-y-auto"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          {/* Stats bar */}
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-semibold" style={{ color: "rgba(16,185,129,0.7)" }}>
              {indexedDocs.length} indexé{indexedDocs.length !== 1 ? 's' : ''}
            </span>
            {pendingDocs.length > 0 && (
              <span className="text-[10px] font-semibold" style={{ color: "rgba(245,158,11,0.7)" }}>
                {pendingDocs.length} en attente
              </span>
            )}
            {audioWithTranscription.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "rgba(139,92,246,0.7)" }}>
                <Mic size={8} /> {audioWithTranscription.length} audio{audioWithTranscription.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Document list */}
          <div className="flex flex-wrap gap-1">
            {documents.map((doc) => {
              const indexed = doc.ocrStatus === 'completed' && (doc.ocrText?.trim() || Object.keys(doc.extractedData || {}).length > 0);
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                  style={{
                    background: indexed ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${indexed ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"}`,
                  }}
                  title={indexed ? `Indexé — ${doc.ocrText?.length || 0} chars` : 'Non indexé'}
                >
                  {indexed ? (
                    <CheckCircle2 size={8} style={{ color: "rgba(16,185,129,0.6)" }} />
                  ) : (
                    <XCircle size={8} style={{ color: "rgba(245,158,11,0.5)" }} />
                  )}
                  <span
                    className="text-[10px] font-medium truncate max-w-[120px]"
                    style={{ color: indexed ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.30)" }}
                  >
                    {doc.name}
                  </span>
                </div>
              );
            })}

            {/* Audio transcriptions */}
            {audioWithTranscription.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                style={{
                  background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.15)",
                }}
              >
                <Mic size={8} style={{ color: "rgba(139,92,246,0.6)" }} />
                <span
                  className="text-[10px] font-medium truncate max-w-[120px]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {rec.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active level bar */}
      {!compact && (
        <div
          className="px-4 py-2 shrink-0 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {currentLevel.label}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            {currentLevel.fullLabel} — {currentLevel.desc}
          </span>
        </div>
      )}

      {/* ── Messages ───────────────────────────────────────── */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mb-0.5 overflow-hidden"
                  style={
                    m.role === "assistant"
                      ? { background: "rgba(255,255,255,0.9)" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {m.role === "assistant" ? (
                    <img src="/dos-logo.png" alt="DOS" className="w-4 h-4 object-contain" />
                  ) : (
                    <User
                      size={11}
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`${m.chartData ? "max-w-[95%]" : "max-w-[80%]"} text-[13px] leading-relaxed overflow-hidden`}
                  style={
                    m.role === "user"
                      ? {
                          background: "rgba(255,255,255,0.09)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "12px 4px 12px 12px",
                          color: "rgba(255,255,255,0.88)",
                          padding: "8px 12px",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "4px 12px 12px 12px",
                          color: "rgba(255,255,255,0.78)",
                          padding: "8px 12px",
                        }
                  }
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* File download */}
                  {m.file && (
                    <button
                      onClick={() => {
                        const byteChars = atob(m.file!.base64);
                        const byteNums = Array.from(byteChars, (c) =>
                          c.charCodeAt(0)
                        );
                        const blob = new Blob([new Uint8Array(byteNums)], {
                          type: m.file!.mimeType,
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = m.file!.filename;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="mt-2.5 flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-150"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.09)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)")
                      }
                    >
                      {m.file.type === "xlsx" ? (
                        <FileSpreadsheet
                          size={13}
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        />
                      ) : (
                        <FileText
                          size={13}
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        />
                      )}
                      <span
                        className="text-[11px] font-medium flex-1 text-left truncate"
                        style={{ color: "rgba(255,255,255,0.60)" }}
                      >
                        {m.file.filename}
                      </span>
                      <Download
                        size={11}
                        style={{ color: "rgba(255,255,255,0.30)" }}
                      />
                    </button>
                  )}

                  {/* Recharts Chart */}
                  {m.chartData && <ChartRenderer data={m.chartData} />}

                  {/* Legacy SVG Chart (rétrocompat) */}
                  {m.chart && !m.chartData && (
                    <div
                      className="mt-2.5 rounded-xl overflow-hidden p-3"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                      dangerouslySetInnerHTML={{ __html: m.chart }}
                    />
                  )}

                  {/* N3 ActionApproval */}
                  {m.action && m.action.status === "pending" && (
                    <ActionApproval
                      type={m.action.type}
                      explanation={m.action.explanation}
                      payload={m.action.payload}
                      onApprove={() => {
                        logEvent({
                          action: "Action N3 approuvée",
                          detail: `${m.action!.type} — ${m.action!.explanation}`,
                          status: "success",
                          user: "Utilisateur local",
                        });
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === m.id
                              ? {
                                  ...msg,
                                  action: { ...msg.action!, status: "approved" },
                                  content:
                                    msg.content + "\n\n✅ Action approuvée.",
                                }
                              : msg
                          )
                        );
                      }}
                      onReject={() => {
                        logEvent({
                          action: "Action N3 rejetée",
                          detail: `${m.action!.type} — ${m.action!.explanation}`,
                          status: "warning",
                          user: "Utilisateur local",
                        });
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === m.id
                              ? {
                                  ...msg,
                                  action: { ...msg.action!, status: "rejected" },
                                  content: msg.content + "\n\n❌ Action rejetée.",
                                }
                              : msg
                          )
                        );
                      }}
                    />
                  )}
                  {m.action && m.action.status !== "pending" && (
                    <div
                      className="mt-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                      style={{
                        background:
                          m.action.status === "approved"
                            ? "rgba(52,211,153,0.08)"
                            : "rgba(239,68,68,0.06)",
                        border: `1px solid ${m.action.status === "approved" ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.12)"}`,
                        color:
                          m.action.status === "approved"
                            ? "rgba(52,211,153,0.7)"
                            : "rgba(239,68,68,0.6)",
                      }}
                    >
                      {m.action.status === "approved"
                        ? "Action exécutée"
                        : "Action rejetée"}
                    </div>
                  )}
                </div>
              </div>

              <span
                className="text-[9px] font-medium mt-1 mx-8"
                style={{ color: "rgba(255,255,255,0.18)" }}
              >
                {m.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}

          {isTyping && <TypingDots />}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* ── Input area ─────────────────────────────────────── */}
      <div
        className="px-3 pb-3 pt-2.5 shrink-0 space-y-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* N3 warning */}
        {level === 3 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <AlertTriangle
              size={10}
              style={{ color: "rgba(255,255,255,0.35)" }}
            />
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Mode Action — toute exécution requiert votre validation explicite
            </p>
          </div>
        )}

        {/* N2 quick actions */}
        {level === 2 &&
          documents.filter((d) => d.ocrStatus === "completed").length >= 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: showCompare
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${showCompare ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"}`,
                  color: showCompare
                    ? "rgba(255,255,255,0.75)"
                    : "rgba(255,255,255,0.40)",
                }}
              >
                <GitCompare size={11} />
                Comparer des docs
              </button>
              <button
                onClick={() =>
                  setInput(
                    "Génère un graphique camembert à partir des données de mes documents"
                  )
                }
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.40)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.40)";
                }}
              >
                <BarChart2 size={11} />
                Graphique
              </button>
            </div>
          )}

        {/* Compare picker */}
        {showCompare && level === 2 && (
          <div
            className="flex items-center gap-2 p-2 rounded-lg flex-wrap"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { val: compareDoc1, set: setCompareDoc1, label: "Doc 1" },
              { val: compareDoc2, set: setCompareDoc2, label: "Doc 2" },
            ].map(({ val, set, label }) => (
              <select
                key={label}
                value={val}
                onChange={(e) => set(e.target.value)}
                className="flex-1 h-7 px-2 rounded-md text-[11px] outline-none min-w-0"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.60)",
                  fontFamily: "inherit",
                }}
              >
                <option value="">{label}…</option>
                {documents
                  .filter((d) => d.ocrStatus === "completed")
                  .map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
              </select>
            ))}
            <button
              disabled={
                !compareDoc1 || !compareDoc2 || compareDoc1 === compareDoc2
              }
              onClick={() => {
                setInput(
                  `Compare le document "${compareDoc1}" avec le document "${compareDoc2}". Identifie les points communs, les différences clés et donne une synthèse comparative.`
                );
                setShowCompare(false);
              }}
              className="px-3 h-7 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-30"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Comparer
            </button>
          </div>
        )}

        {/* Textarea + send */}
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              level === 1
                ? "Posez une question sur vos documents…"
                : level === 2
                  ? "Demandez une analyse, un tableau, un graphique…"
                  : "Décrivez l'action à exécuter…"
            }
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[13px] placeholder:font-normal leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.82)",
              maxHeight: "120px",
              fontFamily: "inherit",
            }}
          />
          {/* Voice input button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTyping || isTranscribing}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 disabled:opacity-25"
            title={isRecording ? "Arrêter l'enregistrement" : "Dicter un message"}
            style={{
              background: isRecording ? "rgba(239,68,68,0.15)" : isTranscribing ? "rgba(59,130,246,0.10)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isRecording ? "rgba(239,68,68,0.30)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            {isTranscribing ? (
              <Loader2 size={12} className="animate-spin" style={{ color: "#60a5fa" }} />
            ) : isRecording ? (
              <MicOff size={12} style={{ color: "#f87171" }} />
            ) : (
              <Mic size={12} style={{ color: "rgba(255,255,255,0.35)" }} />
            )}
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 disabled:opacity-25"
            style={{
              background:
                input.trim() && !isTyping
                  ? "rgba(255,255,255,0.14)"
                  : "rgba(255,255,255,0.05)",
              border: `1px solid ${input.trim() && !isTyping ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <Send
              size={12}
              style={{
                color:
                  input.trim() && !isTyping
                    ? "rgba(255,255,255,0.82)"
                    : "rgba(255,255,255,0.30)",
              }}
            />
          </button>
        </div>

        <p
          className="text-[10px] text-center"
          style={{ color: "rgba(255,255,255,0.16)" }}
        >
          Entrée pour envoyer · Maj+Entrée pour sauter une ligne
        </p>
      </div>
    </div>
  );
}
