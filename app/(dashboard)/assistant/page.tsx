"use client";

import { ChatInterface } from "@/components/assistant/ChatInterface";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Sparkles, Brain, Database, Zap } from "lucide-react";

const levels = [
  {
    id: 1,
    icon: Brain,
    label: "N1 · Recherche",
    desc: "Recherche sémantique, résumés et FAQ basés sur vos documents.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.16)",
  },
  {
    id: 2,
    icon: Database,
    label: "N2 · Analyse",
    desc: "Extraction de données, tableaux Excel, graphiques et rapports structurés.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.16)",
  },
  {
    id: 3,
    icon: Zap,
    label: "N3 · Action",
    desc: "Emails, création de dossiers, intégrations API avec validation humaine.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.16)",
  },
];

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div
        className="px-6 pt-6 pb-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <BlurFade>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <Sparkles size={14} className="text-blue-400" />
                </div>
                <h1 className="text-xl font-semibold text-white tracking-tight">Assistant GEDOS</h1>
              </div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                3 niveaux d&apos;intelligence — recherche, analyse et action
              </p>
            </div>
          </div>
        </BlurFade>
      </div>

      <div className="flex-1 min-h-0 flex flex-col p-6 gap-4 overflow-hidden">
        {/* Level cards */}
        <BlurFade>
          <div className="grid grid-cols-3 gap-3 shrink-0">
            {levels.map(({ id, icon: Icon, label, desc, color, bg, border }) => (
              <div
                key={id}
                className="rounded-xl p-3.5 relative overflow-hidden"
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color }} />
                  <span className="text-[12px] font-semibold" style={{ color }}>
                    {label}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* Chat */}
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
