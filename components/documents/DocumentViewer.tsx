"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Share2, Trash2, ExternalLink, Calendar, HardDrive, ShieldCheck, Tag, X, Building2, Receipt, Users, Hash, Euro, FileCheck } from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "@/components/ui/scroll-area";

function MetaField({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{
        background: highlight ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${highlight ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <div className="flex items-center gap-1 mb-1">
        <Icon size={9} style={{ color: highlight ? "#34d399" : "rgba(255,255,255,0.3)" }} />
        <span className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
          {label}
        </span>
      </div>
      <p
        className="text-[12px] font-semibold truncate"
        style={{ color: highlight ? "#34d399" : "rgba(255,255,255,0.75)" }}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function openInNewTab(previewUrl: string) {
  const blob = dataUrlToBlob(previewUrl);
  const blobUrl = URL.createObjectURL(blob);
  const win = window.open(blobUrl, "_blank");
  if (win) win.addEventListener("beforeunload", () => URL.revokeObjectURL(blobUrl));
}

export function DocumentViewer() {
  const { selectedDocument: doc, setSelectedDocument, removeDocument } = useDocumentStore();
  const isImage = doc?.mimeType.startsWith("image/");
  const isPdf = doc?.mimeType === "application/pdf";

  function handleDownload() {
    if (!doc?.previewUrl) return;
    const blob = dataUrlToBlob(doc.previewUrl);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.originalName || doc.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    if (!doc) return;
    const text = `${doc.name}\nType : ${doc.mimeType}\nTags : ${doc.tags?.join(", ") || "—"}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: doc.name, text });
        return;
      } catch {
        // fallback si annulé
      }
    }
    await navigator.clipboard.writeText(text);
  }

  // Convert data URL to blob URL for PDF iframe rendering
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!doc?.previewUrl) { setPdfBlobUrl(null); return; }
    if (!doc.previewUrl.startsWith("data:")) { setPdfBlobUrl(doc.previewUrl); return; }
    try {
      const blob = dataUrlToBlob(doc.previewUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setPdfBlobUrl(null);
    }
  }, [doc?.previewUrl]);

  const sizeLabel = doc
    ? doc.sizeBytes >= 1024 * 1024
      ? `${(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB`
      : `${(doc.sizeBytes / 1024).toFixed(0)} KB`
    : "";

  return (
    <Sheet open={!!doc} onOpenChange={(open) => !open && setSelectedDocument(null)}>
      <SheetContent
        side="right"
        className="w-[520px] sm:max-w-[520px] p-0 flex flex-col"
        style={{
          background: "hsl(240 14% 5%)",
          border: "none",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.6)",
        }}
      >
        <VisuallyHidden><SheetTitle>Document</SheetTitle></VisuallyHidden>
        {doc && (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <FileText size={15} className="text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white/90 truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                    >
                      v{doc.version}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: "rgba(59,130,246,0.7)" }}>
                      {doc.mimeType.split("/")[1]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.06] shrink-0"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <X size={14} />
              </button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-5 space-y-5">
                {/* Preview */}
                <div
                  className="w-full rounded-xl overflow-hidden relative flex flex-col items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    minHeight: isPdf ? "420px" : "200px",
                  }}
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.previewUrl}
                      alt={doc.name}
                      className="max-w-full max-h-64 object-contain rounded-lg p-4"
                    />
                  ) : isPdf && pdfBlobUrl ? (
                    <iframe
                      src={pdfBlobUrl}
                      title={doc.name}
                      className="w-full rounded-xl"
                      style={{ height: "420px", border: "none" }}
                    />
                  ) : doc.ocrText ? (
                    <div className="w-full p-4 overflow-y-auto" style={{ maxHeight: "420px" }}>
                      <pre
                        className="text-[9px] leading-[1.6] whitespace-pre-wrap break-all font-mono w-full"
                        style={{ color: "rgba(255,255,255,0.7)", wordBreak: "break-word", overflowWrap: "anywhere" }}
                      >
                        {doc.ocrText}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-8 gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                      >
                        <FileText size={30} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-white/85">Aperçu non disponible</p>
                        <p className="text-[12px] mt-1 max-w-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                          Ce format ne peut pas être prévisualisé directement.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security badge */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <ShieldCheck size={9} className="text-emerald-400" />
                      <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Tunnel chiffré
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: Calendar, label: "Ajouté le", value: new Date(doc.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
                    { icon: HardDrive, label: "Taille", value: sizeLabel },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon size={10} className="text-blue-400" />
                        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {label}
                        </span>
                      </div>
                      <p className="text-[13px] font-semibold text-white/85">{value}</p>
                    </div>
                  ))}
                </div>

                {/* AI tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(59,130,246,0.05)",
                      border: "1px solid rgba(59,130,246,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={11} className="text-blue-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(59,130,246,0.8)" }}>
                        Synthèse sémantique IA
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed italic mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                      &quot;Thématiques identifiées : {doc.tags.join(", ")}.&quot;
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide"
                          style={{
                            background: "rgba(59,130,246,0.12)",
                            color: "#60a5fa",
                            border: "1px solid rgba(59,130,246,0.2)",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted metadata */}
                {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                  <div
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: "rgba(16,185,129,0.04)",
                      border: "1px solid rgba(16,185,129,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileCheck size={11} className="text-emerald-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(16,185,129,0.8)" }}>
                        Métadonnées extraites (OCR)
                      </span>
                    </div>

                    {/* Type badge */}
                    {doc.extractedData.type && (
                      <span
                        className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background:
                            doc.extractedData.type === "facture_fournisseur" ? "rgba(239,68,68,0.12)" :
                            doc.extractedData.type === "facture_client" ? "rgba(16,185,129,0.12)" :
                            doc.extractedData.type === "compte_rendu" ? "rgba(139,92,246,0.12)" :
                            "rgba(255,255,255,0.06)",
                          color:
                            doc.extractedData.type === "facture_fournisseur" ? "#f87171" :
                            doc.extractedData.type === "facture_client" ? "#34d399" :
                            doc.extractedData.type === "compte_rendu" ? "#a78bfa" :
                            "rgba(255,255,255,0.5)",
                          border: `1px solid ${
                            doc.extractedData.type === "facture_fournisseur" ? "rgba(239,68,68,0.2)" :
                            doc.extractedData.type === "facture_client" ? "rgba(16,185,129,0.2)" :
                            doc.extractedData.type === "compte_rendu" ? "rgba(139,92,246,0.2)" :
                            "rgba(255,255,255,0.08)"
                          }`,
                        }}
                      >
                        {doc.extractedData.type.replace(/_/g, " ")}
                      </span>
                    )}

                    {/* Fields grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {doc.extractedData.fournisseur && (
                        <MetaField icon={Building2} label="Fournisseur" value={doc.extractedData.fournisseur} />
                      )}
                      {doc.extractedData.client && (
                        <MetaField icon={Building2} label="Client" value={doc.extractedData.client} />
                      )}
                      {doc.extractedData.numero && (
                        <MetaField icon={Hash} label="N° Facture" value={doc.extractedData.numero} />
                      )}
                      {doc.extractedData.date && (
                        <MetaField icon={Calendar} label="Date" value={new Date(doc.extractedData.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} />
                      )}
                      {doc.extractedData.montantHT != null && (
                        <MetaField icon={Euro} label="Montant HT" value={`${doc.extractedData.montantHT.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`} />
                      )}
                      {doc.extractedData.tva != null && doc.extractedData.tva > 0 && (
                        <MetaField icon={Receipt} label="TVA" value={`${doc.extractedData.tva.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`} />
                      )}
                      {doc.extractedData.montantTTC != null && (
                        <MetaField icon={Euro} label="Total TTC" value={`${doc.extractedData.montantTTC.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`} highlight />
                      )}
                      {doc.extractedData.participants && (
                        <div className="col-span-2">
                          <MetaField icon={Users} label="Participants" value={doc.extractedData.participants.join(", ")} />
                        </div>
                      )}
                    </div>

                    {doc.extractedData.objet && (
                      <div className="pt-1">
                        <p className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Objet</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                          {doc.extractedData.objet}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* OCR text */}
                {doc.ocrText && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Texte extrait
                    </p>
                    <div
                      className="rounded-xl p-4 max-h-40 overflow-y-auto"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <pre
                        className="text-[9px] leading-[1.6] whitespace-pre-wrap break-all font-mono w-full"
                        style={{ color: "rgba(255,255,255,0.5)", wordBreak: "break-word", overflowWrap: "anywhere" }}
                      >
                        {doc.ocrText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div
              className="px-5 py-3.5 flex items-center gap-2 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-medium transition-all hover:bg-white/[0.06]"
                style={{ color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Download size={13} /> Télécharger
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#3b82f6" }}
              >
                <Share2 size={13} /> Partager
              </button>
              <button
                onClick={() => { removeDocument(doc.id); setSelectedDocument(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-red-500/[0.1]"
                style={{ color: "rgba(248,113,113,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
