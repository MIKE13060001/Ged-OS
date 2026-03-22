"use client";

import { FileText, Download, Trash2, ExternalLink, Clock, CheckCircle2, AlertCircle, MoreVertical, FileImage, FolderInput } from "lucide-react";
import { Document, OCRStatus } from "@/types/database";
import { useDocumentStore } from "@/stores/documentStore";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function openInNewTab(previewUrl: string) {
  const [header, base64] = previewUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  const blobUrl = URL.createObjectURL(blob);
  const win = window.open(blobUrl, "_blank");
  if (win) win.addEventListener("beforeunload", () => URL.revokeObjectURL(blobUrl));
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<OCRStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  pending:    { icon: Clock,        color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   label: "En attente" },
  processing: { icon: Clock,        color: "#3b82f6", bg: "rgba(59,130,246,0.1)",   label: "Analyse…" },
  completed:  { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)",   label: "Indexé" },
  failed:     { icon: AlertCircle,  color: "#f87171", bg: "rgba(248,113,113,0.1)",  label: "Échec" },
};

function getMimeIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return { Icon: FileImage, color: "#a855f7" };
  if (mimeType.includes("pdf"))       return { Icon: FileText,  color: "#f87171" };
  return { Icon: FileText, color: "#3b82f6" };
}

export function DocumentCard({ doc }: { doc: Document }) {
  const { setSelectedDocument, removeDocument, folders, moveDocument } = useDocumentStore();
  const status = statusConfig[doc.ocrStatus];
  const StatusIcon = status.icon;
  const { Icon: MimeIcon, color: mimeColor } = getMimeIcon(doc.mimeType);

  const sizeLabel = doc.sizeBytes >= 1024 * 1024
    ? `${(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB`
    : `${(doc.sizeBytes / 1024).toFixed(0)} KB`;

  return (
    <div
      className="rounded-xl p-4 cursor-pointer group relative overflow-hidden"
      style={{
        background: "hsl(240 12% 7%)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
      }}
      onClick={() => setSelectedDocument(doc)}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Color glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{ background: `radial-gradient(ellipse 70% 50% at 15% 30%, ${mimeColor}07 0%, transparent 70%)` }}
      />

      {/* Top row: icon + menu */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
          style={{
            background: `${mimeColor}12`,
            border: `1px solid ${mimeColor}22`,
          }}
        >
          <MimeIcon size={15} style={{ color: mimeColor }} />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
              >
                <MoreVertical size={12} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                background: "hsl(240 12% 9%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
              }}
            >
              {doc.previewUrl && (
                <DropdownMenuItem
                  className="text-white/65 focus:text-white focus:bg-white/[0.05] text-[12px] gap-2 cursor-pointer"
                  onClick={() => openInNewTab(doc.previewUrl!)}
                >
                  <ExternalLink size={12} /> Ouvrir
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-white/65 focus:text-white focus:bg-white/[0.05] text-[12px] gap-2 cursor-pointer">
                <Download size={12} /> Télécharger
              </DropdownMenuItem>
              {folders.length > 0 && (
                <>
                  <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.06)" }} />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-white/65 focus:text-white focus:bg-white/[0.05] text-[12px] gap-2 cursor-pointer">
                      <FolderInput size={12} /> Déplacer vers
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                      style={{
                        background: "hsl(240 12% 9%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
                      }}
                    >
                      {doc.folderId && (
                        <DropdownMenuItem
                          className="text-white/65 focus:text-white focus:bg-white/[0.05] text-[12px] gap-2 cursor-pointer"
                          onClick={() => moveDocument(doc.id, null)}
                        >
                          Racine (retirer du dossier)
                        </DropdownMenuItem>
                      )}
                      {folders.filter(f => f.id !== doc.folderId).map(f => (
                        <DropdownMenuItem
                          key={f.id}
                          className="text-white/65 focus:text-white focus:bg-white/[0.05] text-[12px] gap-2 cursor-pointer"
                          onClick={() => moveDocument(doc.id, f.id)}
                        >
                          {f.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              )}
              <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.06)" }} />
              <DropdownMenuItem
                className="text-red-400/80 focus:text-red-400 focus:bg-red-500/[0.08] text-[12px] gap-2 cursor-pointer"
                onClick={() => removeDocument(doc.id)}
              >
                <Trash2 size={12} /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Document name */}
      <div className="relative z-10 mb-3">
        <h3
          className="text-[13px] font-medium leading-snug truncate mb-0.5"
          style={{ color: "rgba(255,255,255,0.88)" }}
          title={doc.name}
        >
          {doc.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>
            {sizeLabel}
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>
            {new Date(doc.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </span>
        </div>
      </div>

      {/* Footer: status + tag */}
      <div
        className="flex items-center justify-between pt-2.5 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
          style={{ background: status.bg, color: status.color }}
        >
          <StatusIcon size={9} />
          {status.label}
        </div>
        {doc.tags && doc.tags.length > 0 && (
          <span
            className="text-[10px] font-medium truncate max-w-[80px]"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            #{doc.tags[0]}
          </span>
        )}
      </div>
    </div>
  );
}
