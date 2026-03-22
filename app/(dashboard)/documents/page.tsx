"use client";

import { useState } from "react";
import {
  Plus,
  FolderPlus,
  Filter,
  FileCheck,
  Zap,
  Bell,
  HardDrive,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { UploadZone } from "@/components/documents/UploadZone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  unit?: string;
  trend: string;
  up: boolean;
  gradient: string;
  glow: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, unit, trend, up, gradient, glow, delay }: StatCardProps) {
  return (
    <BlurFade delay={delay} inView>
      <div
        className="rounded-2xl p-5 relative overflow-hidden group cursor-default"
        style={{
          background: "hsl(240 12% 7%)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "border-color 0.2s, transform 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* BG glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 50%, ${glow} 0%, transparent 70%)` }} />

        <div className="relative z-10">
          {/* Icon + trend */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: gradient }}>
              <Icon size={18} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${up ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
              {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {trend}
            </div>
          </div>

          {/* Value */}
          <div className="text-[28px] font-black text-white tracking-tight leading-none mb-1">
            {typeof value === "number"
              ? <NumberTicker value={value} />
              : value}
            {unit && <span className="text-base font-semibold text-white/40 ml-1">{unit}</span>}
          </div>

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/35 mt-1">{label}</p>
        </div>
      </div>
    </BlurFade>
  );
}

export default function DocumentsPage() {
  const { documents } = useDocumentStore();
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<"recents" | "epingles" | "corbeille">("recents");

  return (
    <div className="p-7">
      <BlurFade>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span>Mon GED</span>
              <ChevronRight size={12} className="opacity-50" />
              <span style={{ color: "#3b82f6" }}>Documents</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white leading-none">
              Espace Documentaire
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <FolderPlus size={15} />
              Dossier
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 25px rgba(59,130,246,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.35)")}
            >
              <Plus size={15} />
              Téléverser
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FileCheck} label="Documents indexés"
            value={documents.length} trend="+12%" up={true}
            gradient="linear-gradient(135deg, #2563eb, #3b82f6)"
            glow="rgba(59,130,246,0.08)" delay={0}
          />
          <StatCard
            icon={Zap} label="Précision OCR"
            value="98.4" unit="%" trend="+2%" up={true}
            gradient="linear-gradient(135deg, #d97706, #f59e0b)"
            glow="rgba(245,158,11,0.08)" delay={0.05}
          />
          <StatCard
            icon={Bell} label="Actions en attente"
            value={14} trend="-5%" up={false}
            gradient="linear-gradient(135deg, #7c3aed, #8b5cf6)"
            glow="rgba(139,92,246,0.08)" delay={0.1}
          />
          <StatCard
            icon={HardDrive} label="Espace utilisé"
            value="4.2" unit="GB" trend="+1%" up={true}
            gradient="linear-gradient(135deg, #059669, #10b981)"
            glow="rgba(16,185,129,0.08)" delay={0.15}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex gap-1">
            {(["recents", "epingles", "corbeille"] as const).map((tab) => {
              const labels = { recents: "Récents", epingles: "Épinglés", corbeille: "Corbeille" };
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                  style={{
                    color: active ? "white" : "rgba(255,255,255,0.35)",
                    background: active ? "rgba(59,130,246,0.12)" : "transparent",
                    border: active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Filter size={15} />
          </button>
        </div>

        {/* Grid */}
        <DocumentGrid documents={documents} />
      </BlurFade>

      {/* Document Viewer */}
      <DocumentViewer />

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent
          className="max-w-2xl"
          style={{
            background: "hsl(240 12% 7%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-bold">Téléversement intelligent</DialogTitle>
          </DialogHeader>
          <UploadZone onComplete={() => setShowUpload(false)} />
          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            OCR et indexation sémantique déclenchés automatiquement via Gemini Vision
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
