"use client";

import { FileText, Download, Trash2, ExternalLink, Clock, CheckCircle2, AlertCircle, MoreVertical } from "lucide-react";
import { Document, OCRStatus } from "@/types/database";
import { useDocumentStore } from "@/stores/documentStore";
import { MagicCard } from "@/components/magicui/magic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<OCRStatus, { icon: React.ElementType; variant: "warning" | "info" | "success" | "destructive"; label: string }> = {
  pending:    { icon: Clock,         variant: "warning",     label: "En attente" },
  processing: { icon: Clock,         variant: "info",        label: "En cours..." },
  completed:  { icon: CheckCircle2,  variant: "success",     label: "Indexé" },
  failed:     { icon: AlertCircle,   variant: "destructive", label: "Échec" },
};

export function DocumentCard({ doc }: { doc: Document }) {
  const { setSelectedDocument, removeDocument } = useDocumentStore();
  const status = statusConfig[doc.ocrStatus];
  const StatusIcon = status.icon;

  return (
    <MagicCard className="p-4 cursor-pointer group transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div
          className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors"
          onClick={() => setSelectedDocument(doc)}
        >
          <FileText className="text-primary" size={22} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {doc.previewUrl && (
              <DropdownMenuItem onClick={() => window.open(doc.previewUrl, "_blank")}>
                <ExternalLink size={14} className="mr-2" /> Ouvrir
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Download size={14} className="mr-2" /> Télécharger
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => removeDocument(doc.id)}
            >
              <Trash2 size={14} className="mr-2" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Name & meta */}
      <div onClick={() => setSelectedDocument(doc)}>
        <h3 className="font-semibold text-foreground truncate mb-1 text-sm leading-tight" title={doc.name}>
          {doc.name}
        </h3>
        <div className="flex items-center text-muted-foreground text-[11px] mb-3">
          <span>{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
          <span className="mx-1.5">•</span>
          <span>{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Badge variant={status.variant} className="text-[10px] py-0.5">
          <StatusIcon size={10} className="mr-1" />
          {status.label}
        </Badge>
        {doc.tags && doc.tags.length > 0 && (
          <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
            #{doc.tags[0]}
          </span>
        )}
      </div>
    </MagicCard>
  );
}
