"use client";

import { FileText, Download, Trash2, ExternalLink, Clock, CheckCircle2, AlertCircle, MoreVertical, FileImage } from "lucide-react";
import { Document, OCRStatus } from "@/types/database";
import { useDocumentStore } from "@/stores/documentStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<OCRStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  pending:    { icon: Clock,        color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "En attente" },
  processing: { icon: Clock,        color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  label: "En cours…" },
  completed:  { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)",  label: "Indexé" },
  failed:     { icon: AlertCircle,  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   label: "Échec" },
};

function getMimeIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return { Icon: FileImage, color: "#a855f7" };
  if (mimeType.includes("pdf"))       return { Icon: FileText,  color: "#ef4444" };
  return { Icon: FileText, color: "#3b82f6" };
}

export function DocumentCard({ doc }: { doc: Document }) {
  const { setSelectedDocument, removeDocument } = useDocumentStore();
  const status = statusConfig[doc.ocrStatus];
  const StatusIcon = status.icon;
  const { Icon: MimeIcon, color: mimeColor } = getMimeIcon(doc.mimeType);

  return (
    <div
      className="rounded-2xl p-4 cursor-pointer group relative overflow-hidden transition-all duration-200"
      style={{
        background: "hsl(240 12% 7%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onClick={() => setSelectedDocument(doc)}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Subtle bg glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 0%, ${mimeColor}08 0%, transparent 60%)` }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ background: `${mimeColor}18`, border: `1px solid ${mimeColor}28` }}
        >
          <MimeIcon size={18} style={{ color: mimeColor }} />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
              >
                <MoreVertical size={13} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{ background: "hsl(240 12% 9%)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {doc.previewUrl && (
                <DropdownMenuItem
                  className="text-white/70 focus:text-white focus:bg-white/5 text-xs gap-2"
                  onClick={() => window.open(doc.previewUrl, "_blank")}
                >
                  <ExternalLink size={13} /> Ouvrir
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/5 text-xs gap-2">
                <Download size={13} /> Télécharger
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-300 focus:bg-red-500/10 text-xs gap-2"
                onClick={() => removeDocument(doc.id)}
              >
                <Trash2 size={13} /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Name */}
      <div className="relative z-10 mb-3">
        <h3
          className="text-[13px] font-semibold leading-snug mb-1 truncate"
          style={{ color: "rgba(255,255,255,0.9)" }}
          title={doc.name}
        >
          {doc.name}
        </h3>
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB · {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
          style={{ background: status.bg, color: status.color }}
        >
          <StatusIcon size={9} />
          {status.label}
        </div>
        {doc.tags && doc.tags.length > 0 && (
          <span
            className="text-[10px] font-semibold truncate max-w-[90px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            #{doc.tags[0]}
          </span>
        )}
      </div>
    </div>
  );
}
