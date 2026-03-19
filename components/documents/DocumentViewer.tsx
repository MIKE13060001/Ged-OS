"use client";

import { FileText, Download, Share2, Trash2, ExternalLink, Calendar, Database, HardDrive, ShieldCheck } from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function DocumentViewer() {
  const { selectedDocument: doc, setSelectedDocument, removeDocument } = useDocumentStore();
  const isImage = doc?.mimeType.startsWith("image/");

  return (
    <Sheet open={!!doc} onOpenChange={(open) => !open && setSelectedDocument(null)}>
      <SheetContent side="right" className="w-[580px] sm:max-w-[580px] p-0 flex flex-col">
        {doc && (
          <>
            <SheetHeader className="px-6 py-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <FileText size={22} />
                </div>
                <div className="overflow-hidden flex-1">
                  <SheetTitle className="truncate text-base" title={doc.name}>{doc.name}</SheetTitle>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] py-0">v{doc.version}</Badge>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{doc.mimeType}</span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Preview Area */}
                <div className="aspect-[4/3] w-full bg-muted/30 rounded-2xl border border-border overflow-hidden relative flex flex-col items-center justify-center p-6 group">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.previewUrl}
                      alt={doc.name}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform group-hover:scale-[1.02] duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                        <FileText size={40} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Visualisation du Document</h3>
                        <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                          Ce document s&apos;ouvre dans un onglet isolé pour garantir le chiffrement de bout en bout.
                        </p>
                      </div>
                      {doc.previewUrl && (
                        <Button onClick={() => window.open(doc.previewUrl, "_blank")} className="gap-2">
                          <ExternalLink size={16} />
                          Ouvrir dans un nouvel onglet
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center">
                    <div className="px-3 py-1 bg-background/80 backdrop-blur border border-border rounded-full flex items-center gap-2">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Tunnel Sécurisé</span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                      <Calendar size={10} className="text-primary" /> Ajouté le
                    </label>
                    <p className="text-sm font-bold text-foreground">
                      {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                      <HardDrive size={10} className="text-primary" /> Taille
                    </label>
                    <p className="text-sm font-bold text-foreground">
                      {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* AI Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="bg-gradient-to-br from-card to-background border border-primary/20 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-5 opacity-[0.04]">
                      <Database size={80} className="text-primary" />
                    </div>
                    <h3 className="text-xs font-black text-foreground flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(217,91%,60%)]" />
                      Synthèse Sémantique IA
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &quot;Ce document a été analysé via notre pipeline RAG. Thématiques : {doc.tags.join(", ")}.&quot;
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[10px] border border-primary/20 font-black uppercase tracking-widest">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* OCR Text preview */}
                {doc.ocrText && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Texte extrait</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {doc.ocrText}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1 gap-2">
                <Download size={16} /> Télécharger
              </Button>
              <Button className="flex-1 gap-2">
                <Share2 size={16} /> Partager
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => { removeDocument(doc.id); setSelectedDocument(null); }}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
