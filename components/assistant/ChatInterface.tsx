"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Database,
  FileText,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  AlertTriangle,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
}

const levels = [
  { id: 1, label: "Recherche", desc: "Recherche sémantique dans vos documents", color: "#3b82f6", shortColor: "blue" },
  { id: 2, label: "Analyse", desc: "Extraction structurée et rapports", color: "#8b5cf6", shortColor: "violet" },
  { id: 3, label: "Action", desc: "Actions avec validation humaine", color: "#f59e0b", shortColor: "amber" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <Bot size={11} className="text-blue-400" />
      </div>
      <div
        className="px-3 py-2.5 rounded-xl rounded-tl-none"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/30"
              style={{
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Bonjour. Je suis votre assistant GEDOS avec accès à ${documents.length} document${documents.length !== 1 ? "s" : ""} indexé${documents.length !== 1 ? "s" : ""}. Comment puis-je vous aider ?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [level, setLevel] = useState(1);
  const [showKB, setShowKB] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        body: JSON.stringify({ history, level, documents }),
      });

      const data = res.ok ? await res.json() : { text: "Désolé, une erreur s'est produite." };

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text || "Désolé, je n'ai pas pu traiter cette demande.",
          level,
          timestamp: new Date(),
          file: data.file || undefined,
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
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{
        background: "hsl(240 12% 6%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <Sparkles size={13} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white/90">
              {compact ? "Assistant GEDOS" : "Assistant Souverain"}
            </p>
            <button
              onClick={() => setShowKB(!showKB)}
              className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-white/60"
              style={{ color: "rgba(59,130,246,0.7)" }}
            >
              <Database size={9} />
              {documents.length} doc{documents.length !== 1 ? "s" : ""} en mémoire
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
                color: level === l.id ? "white" : "rgba(255,255,255,0.35)",
                background: level === l.id ? l.color : "transparent",
              }}
            >
              N{l.id}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge base panel */}
      {showKB && (
        <div
          className="px-4 py-3 flex flex-wrap gap-1.5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
        >
          {documents.length === 0 ? (
            <span className="text-[11px] italic" style={{ color: "rgba(255,255,255,0.3)" }}>
              Aucun document en mémoire
            </span>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <FileText size={9} className="text-blue-400 shrink-0" />
                <span className="text-[10px] font-medium truncate max-w-[100px]" style={{ color: "rgba(147,197,253,0.8)" }}>
                  {doc.name}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Level description bar */}
      {!compact && (
        <div
          className="px-4 py-2 shrink-0"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: `${currentLevel.color}08`,
          }}
        >
          <p className="text-[10px] font-semibold" style={{ color: `${currentLevel.color}cc` }}>
            N{currentLevel.id} · {currentLevel.label} — {currentLevel.desc}
          </p>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}
            >
              <div className={cn("flex items-end gap-2", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                {/* Avatar */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                  style={m.role === "assistant"
                    ? { background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  {m.role === "assistant"
                    ? <Bot size={11} className="text-blue-400" />
                    : <User size={11} style={{ color: "rgba(255,255,255,0.5)" }} />
                  }
                </div>

                {/* Bubble */}
                <div
                  className="max-w-[80%] rounded-xl text-[13px] leading-relaxed overflow-hidden"
                  style={m.role === "user"
                    ? {
                      background: "#3b82f6",
                      borderRadius: "12px 4px 12px 12px",
                      color: "rgba(255,255,255,0.95)",
                    }
                    : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "4px 12px 12px 12px",
                      color: "rgba(255,255,255,0.85)",
                    }
                  }
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* File download button */}
                  {m.file && (
                    <button
                      onClick={() => {
                        const byteChars = atob(m.file!.base64);
                        const byteNums = Array.from(byteChars, (c) => c.charCodeAt(0));
                        const blob = new Blob([new Uint8Array(byteNums)], { type: m.file!.mimeType });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = m.file!.filename;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="mt-2.5 flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-150 hover:opacity-80"
                      style={{
                        background: m.file.type === "xlsx"
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(59,130,246,0.12)",
                        border: `1px solid ${m.file.type === "xlsx" ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.25)"}`,
                      }}
                    >
                      {m.file.type === "xlsx"
                        ? <FileSpreadsheet size={13} className="text-emerald-400 shrink-0" />
                        : <FileText size={13} className="text-blue-400 shrink-0" />
                      }
                      <span
                        className="text-[11px] font-medium flex-1 text-left truncate"
                        style={{ color: m.file.type === "xlsx" ? "rgba(110,231,183,0.9)" : "rgba(147,197,253,0.9)" }}
                      >
                        {m.file.filename}
                      </span>
                      <Download size={11} style={{ color: "rgba(255,255,255,0.4)" }} />
                    </button>
                  )}
                </div>
              </div>

              <span
                className="text-[9px] font-medium mt-1 mx-8"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div
        className="px-3 pb-3 pt-2.5 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {level === 3 && (
          <div
            className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}
          >
            <AlertTriangle size={11} className="text-amber-400 shrink-0" />
            <p className="text-[10px] font-medium text-amber-400">
              Mode Action — Toute action requiert votre validation explicite
            </p>
          </div>
        )}

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
            placeholder="Posez une question sur vos documents…"
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[13px] placeholder:font-normal"
            style={{
              color: "rgba(255,255,255,0.85)",
              maxHeight: "120px",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 disabled:opacity-30"
            style={{
              background: input.trim() && !isTyping ? "#3b82f6" : "rgba(255,255,255,0.07)",
            }}
          >
            <Send size={12} className="text-white" />
          </button>
        </div>

        <p className="text-[10px] text-center mt-2" style={{ color: "rgba(255,255,255,0.18)" }}>
          Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}
