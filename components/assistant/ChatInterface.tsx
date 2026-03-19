"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Database,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  level?: number;
  timestamp: Date;
}

const levelConfig = {
  1: { label: "N1 · Recherche", description: "Recherche et restitution d'informations", color: "text-blue-400" },
  2: { label: "N2 · Analyse", description: "Traitement et structuration des données", color: "text-violet-400" },
  3: { label: "N3 · Action", description: "Actions avec validation humaine", color: "text-amber-400" },
};

export function ChatInterface({ compact = false }: { compact?: boolean }) {
  const documents = useDocumentStore((state) => state.documents);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Bonjour ! Je suis votre assistant GEDOS. J'ai ${documents.length} document${documents.length > 1 ? "s" : ""} chargé${documents.length > 1 ? "s" : ""} en mémoire. Comment puis-je vous aider ?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [level, setLevel] = useState(1);
  const [showKB, setShowKB] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Une erreur réseau s'est produite. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/30 rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <Sparkles className="text-primary" size={18} />
          </div>
          <div>
            {compact ? (
              <h2 className="font-semibold text-foreground text-sm">Assistant GEDOS</h2>
            ) : (
              <AnimatedGradientText className="font-bold text-base">
                Assistant Sovereign
              </AnimatedGradientText>
            )}
            <button
              onClick={() => setShowKB(!showKB)}
              className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-widest hover:text-foreground transition-colors"
            >
              <Database size={10} />
              <span>{documents.length} doc{documents.length !== 1 ? "s" : ""} en mémoire</span>
              {showKB ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          </div>
        </div>

        {/* Level selector */}
        <Tabs value={level.toString()} onValueChange={(v) => setLevel(Number(v))}>
          <TabsList className="h-8 bg-muted/50">
            {[1, 2, 3].map((l) => (
              <TabsTrigger key={l} value={l.toString()} className="text-xs px-2.5 h-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                N{l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Knowledge Base panel */}
      {showKB && (
        <div className="bg-muted/30 border-b border-border p-3 flex flex-wrap gap-2">
          {documents.length === 0 ? (
            <span className="text-[10px] text-muted-foreground italic">Aucun document chargé...</span>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-1.5 px-2 py-1 bg-card border border-border rounded-md">
                <FileText size={10} className="text-primary" />
                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{doc.name}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Level description */}
      {!compact && (
        <div className="px-4 py-2 bg-muted/20 border-b border-border">
          <p className={cn("text-[10px] font-bold uppercase tracking-wider", levelConfig[level as keyof typeof levelConfig].color)}>
            {levelConfig[level as keyof typeof levelConfig].label} — {levelConfig[level as keyof typeof levelConfig].description}
          </p>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m, index) => (
            <BlurFade key={m.id} delay={index === messages.length - 1 ? 0 : 0} inView={false}>
              <div className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                <div className="flex items-end gap-2">
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mb-1">
                      <Bot size={12} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-card border border-border text-card-foreground rounded-tl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mb-1">
                      <User size={12} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="mt-1 text-[9px] text-muted-foreground uppercase font-bold tracking-widest ml-8">
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </BlurFade>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Loader2 size={12} className="animate-spin text-primary" />
              </div>
              <span className="italic">L&apos;assistant parcourt votre base documentaire...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card/50 shrink-0">
        {level === 3 && (
          <div className="mb-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              ⚠ Mode Action — Toute action requiert votre validation
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Posez une question sur vos documents..."
            className="bg-muted/50 border-border focus-visible:ring-primary/50"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
