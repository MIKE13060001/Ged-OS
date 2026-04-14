"use client";

import { ChatInterface } from "@/components/assistant/ChatInterface";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Sparkles, Search, BarChart3, Zap } from "lucide-react";

const levels = [
  {
    id: 1,
    icon: Search,
    label: "N1",
    sublabel: "Recherche",
    desc: "Recherche sémantique, résumés et FAQ basés sur vos documents.",
  },
  {
    id: 2,
    icon: BarChart3,
    label: "N2",
    sublabel: "Analyse",
    desc: "Extraction de données, tableaux Excel, graphiques et rapports.",
  },
  {
    id: 3,
    icon: Zap,
    label: "N3",
    sublabel: "Action",
    desc: "Emails, dossiers, intégrations API — avec validation humaine.",
  },
];

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full">
      {/* ── Page header ──────────────────────────────────── */}
      <div
        className="px-6 pt-5 pb-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <BlurFade>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Sparkles size={13} style={{ color: "rgba(255,255,255,0.55)" }} />
            </div>
            <div>
              <h1
                className="text-[15px] font-semibold leading-tight"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                Assistant Documents Office Solutions
              </h1>
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                3 niveaux d&apos;intelligence — sélectionnez dans le chat
              </p>
            </div>
          </div>
        </BlurFade>
      </div>

      <div className="flex-1 min-h-0 flex flex-col p-6 gap-4 overflow-hidden">
        {/* Level cards */}
        <BlurFade>
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            {levels.map(({ id, icon: Icon, label, sublabel, desc }) => (
              <div
                key={id}
                className="rounded-xl p-3.5 group transition-all duration-150"
                style={{
                  background: "hsl(240 10% 8%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.10)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.06)";
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon
                      size={12}
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-[11px] font-bold font-mono"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: "rgba(255,255,255,0.70)" }}
                    >
                      {sublabel}
                    </span>
                  </div>
                </div>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                >
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
