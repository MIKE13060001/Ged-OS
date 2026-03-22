"use client";

import { useState } from "react";
import {
  Plus,
  FolderPlus,
  FileCheck,
  Zap,
  Bell,
  HardDrive,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  Folder,
  FolderOpen,
  Trash2,
  X,
} from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { UploadZone } from "@/components/documents/UploadZone";
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
  accentColor: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, unit, trend, up, accentColor, delay }: StatCardProps) {
  return (
    <BlurFade delay={delay} inView>
      <div
        className="rounded-xl p-4 relative overflow-hidden cursor-default group"
        style={{
          background: "hsl(240 12% 7%)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Subtle color glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 20% 50%, ${accentColor}09 0%, transparent 70%)` }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
            >
              <Icon size={15} style={{ color: accentColor }} />
            </div>
            <div
              className="flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
              style={{
                color: up ? "#10b981" : "#f87171",
                background: up ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
              }}
            >
              {up
                ? <ArrowUpRight size={10} />
                : <ArrowDownRight size={10} />
              }
              {trend}
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white tracking-tight">
              {typeof value === "number" ? <NumberTicker value={value} /> : value}
            </span>
            {unit && (
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                {unit}
              </span>
            )}
          </div>
          <p className="text-[11px] font-medium mt-1" style={{ color: "rgba(255,255,255,0.38)" }}>
            {label}
          </p>
        </div>
      </div>
    </BlurFade>
  );
}

type Tab = "recents" | "epingles" | "corbeille";
type ViewMode = "grid" | "list";

export default function DocumentsPage() {
  const { documents, folders, selectedFolderId, addFolder, removeFolder, setSelectedFolder } = useDocumentStore();
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("recents");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    addFolder({
      id: crypto.randomUUID(),
      tenantId: "local",
      name,
      path: `/${name}`,
      createdBy: "local",
      createdAt: new Date().toISOString(),
    });
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const folderFiltered = selectedFolderId
    ? documents.filter((d) => d.folderId === selectedFolderId)
    : documents.filter((d) => !d.folderId);

  const filteredDocuments = folderFiltered.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.originalName?.toLowerCase().includes(q) ||
      doc.tags?.some((t) => t.toLowerCase().includes(q)) ||
      doc.ocrText?.toLowerCase().includes(q)
    );
  });

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "recents", label: "Récents", count: filteredDocuments.length },
    { key: "epingles", label: "Épinglés", count: 0 },
    { key: "corbeille", label: "Corbeille" },
  ];

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
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>Mon GED</span>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
                <span className="text-[11px] font-medium" style={{ color: "#3b82f6" }}>Documents</span>
              </div>
              <h1 className="text-xl font-semibold text-white tracking-tight">Espace documentaire</h1>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {documents.length} document{documents.length !== 1 ? "s" : ""} indexé{documents.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewFolder(true)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium transition-all duration-150 hover:bg-white/[0.06] active:bg-white/[0.08]"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <FolderPlus size={13} />
                Nouveau dossier
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:opacity-80"
                style={{
                  background: "#3b82f6",
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.5), 0 4px 16px rgba(59,130,246,0.25)",
                }}
              >
                <Plus size={13} />
                Téléverser
              </button>
            </div>
          </div>
        </BlurFade>
      </div>

      {/* Stats row */}
      <div className="px-6 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={FileCheck} label="Documents indexés"
            value={documents.length} trend="+12%" up={true}
            accentColor="#3b82f6" delay={0}
          />
          <StatCard
            icon={Zap} label="Précision OCR"
            value="98.4" unit="%" trend="+2%" up={true}
            accentColor="#f59e0b" delay={0.04}
          />
          <StatCard
            icon={Bell} label="Actions en attente"
            value={14} trend="-5%" up={false}
            accentColor="#8b5cf6" delay={0.08}
          />
          <StatCard
            icon={HardDrive} label="Espace utilisé"
            value="4.2" unit="GB" trend="+1%" up={true}
            accentColor="#10b981" delay={0.12}
          />
        </div>
      </div>

      {/* Folder navigation */}
      {folders.length > 0 && (
        <div
          className="px-6 py-3 flex items-center gap-2 flex-wrap shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <button
            onClick={() => setSelectedFolder(null)}
            className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[12px] font-medium transition-all"
            style={{
              background: !selectedFolderId ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${!selectedFolderId ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
              color: !selectedFolderId ? "#60a5fa" : "rgba(255,255,255,0.4)",
            }}
          >
            <Folder size={11} />
            Racine
          </button>
          {folders.map((f) => (
            <div key={f.id} className="flex items-center gap-0.5 group">
              <button
                onClick={() => setSelectedFolder(f.id)}
                className="flex items-center gap-1.5 h-7 px-3 rounded-l-lg text-[12px] font-medium transition-all"
                style={{
                  background: selectedFolderId === f.id ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedFolderId === f.id ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
                  borderRight: "none",
                  color: selectedFolderId === f.id ? "#60a5fa" : "rgba(255,255,255,0.4)",
                }}
              >
                {selectedFolderId === f.id ? <FolderOpen size={11} /> : <Folder size={11} />}
                {f.name}
              </button>
              <button
                onClick={() => removeFolder(f.id)}
                className="h-7 px-1.5 rounded-r-lg opacity-0 group-hover:opacity-100 transition-all flex items-center"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(248,113,113,0.6)",
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        {/* Tabs */}
        <div className="flex items-center gap-0.5">
          {tabs.map(({ key, label, count }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150"
                style={{
                  color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)",
                  background: active ? "rgba(255,255,255,0.07)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                }}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                    style={{
                      background: active ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)",
                      color: active ? "#60a5fa" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              type="text"
              placeholder="Filtrer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-7 pr-3 rounded-lg text-[12px] outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${searchQuery ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: "rgba(255,255,255,0.7)",
                width: searchQuery ? "200px" : "140px",
                fontFamily: "inherit",
                transition: "width 0.2s, border-color 0.15s",
              }}
            />
          </div>

          {/* Filter */}
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-white/[0.06]"
            style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <SlidersHorizontal size={12} />
          </button>

          {/* View mode */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {(["grid", "list"] as const).map((mode) => {
              const Icon = mode === "grid" ? LayoutGrid : List;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="w-7 h-7 flex items-center justify-center transition-all duration-150"
                  style={{
                    background: viewMode === mode ? "rgba(255,255,255,0.08)" : "transparent",
                    color: viewMode === mode ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.28)",
                  }}
                >
                  <Icon size={12} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Document grid */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <DocumentGrid documents={activeTab === "corbeille" ? [] : filteredDocuments} />
      </div>

      {/* Document Viewer */}
      <DocumentViewer />

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent
          className="max-w-sm"
          style={{
            background: "hsl(240 12% 7%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-semibold text-base flex items-center gap-2">
              <FolderPlus size={16} className="text-blue-400" />
              Nouveau dossier
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex flex-col gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Nom du dossier..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              className="h-9 px-3 rounded-lg text-[13px] outline-none w-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "inherit",
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewFolder(false)}
                className="flex-1 h-8 rounded-lg text-[12px] font-medium transition-all hover:bg-white/[0.06]"
                style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 h-8 rounded-lg text-[12px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "#3b82f6" }}
              >
                Créer
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent
          className="max-w-xl"
          style={{
            background: "hsl(240 12% 7%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-semibold text-base">Téléversement intelligent</DialogTitle>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              OCR et indexation sémantique via Gemini Vision
            </p>
          </DialogHeader>
          <div className="mt-2">
            <UploadZone onComplete={() => setShowUpload(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
