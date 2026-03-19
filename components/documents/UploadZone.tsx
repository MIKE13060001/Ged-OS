"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { Document } from "@/types/database";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "ocr" | "completed" | "failed";
  error?: string;
}

const SUPPORTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export function UploadZone({ onComplete }: { onComplete: () => void }) {
  const addDocument = useDocumentStore((state) => state.addDocument);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    const id = Math.random().toString(36).substring(7);

    if (!SUPPORTED_TYPES.includes(file.type)) {
      setFiles((prev) => [
        ...prev,
        { id, name: file.name, progress: 100, status: "failed", error: "Format non supporté (PDF, JPG, PNG requis)" },
      ]);
      return;
    }

    setFiles((prev) => [...prev, { id, name: file.name, progress: 20, status: "uploading" }]);

    try {
      const reader = new FileReader();
      const fileContent = await new Promise<{ data: string; full: string }>((resolve, reject) => {
        reader.onload = () =>
          resolve({
            data: (reader.result as string).split(",")[1],
            full: reader.result as string,
          });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress: 50, status: "ocr" } : f)));

      // Call the OCR API route
      const ocrRes = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: fileContent.data, mimeType: file.type, fileName: file.name }),
      });

      const extraction = ocrRes.ok ? await ocrRes.json() : { text: "", tags: [] };

      const doc: Document = {
        id: Math.random().toString(36).substring(7),
        tenantId: "t1",
        name: file.name,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        storagePath: `/vault/${id}`,
        previewUrl: fileContent.full,
        version: 1,
        ocrStatus: "completed",
        ocrText: extraction.text,
        extractedData: {},
        tags: extraction.tags || [],
        metadata: {},
        createdBy: "u1",
        createdAt: new Date().toISOString(),
      };

      addDocument(doc);
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress: 100, status: "completed" } : f)));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur d'analyse";
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "failed", error: msg } : f)));
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      Array.from(e.dataTransfer.files).forEach(processFile);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const hasCompleted = files.some((f) => f.status === "completed");

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center text-center overflow-hidden",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        {isDragging && <BorderBeam duration={3} borderWidth={2} />}

        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
          <Upload size={30} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Dépôt Intelligent</h3>
        <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
          Glissez vos fichiers PDF, JPG, PNG ou WebP. L&apos;IA analyse visuellement chaque document pour une indexation précise.
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && Array.from(e.target.files).forEach(processFile)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {files.map((file) => (
            <div key={file.id} className="p-3 bg-muted/30 border border-border rounded-xl flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", file.status === "failed" ? "bg-destructive/10" : "bg-primary/10")}>
                {file.status === "failed" ? (
                  <XCircle className="text-destructive" size={18} />
                ) : file.status === "completed" ? (
                  <CheckCircle2 className="text-emerald-500" size={18} />
                ) : (
                  <FileText className="text-primary" size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-foreground truncate pr-4">{file.name}</span>
                  <span className={cn("text-[9px] font-black uppercase whitespace-nowrap", file.status === "failed" ? "text-destructive" : "text-primary")}>
                    {file.status === "ocr" ? "Analyse IA..." : file.status === "completed" ? "✓ Indexé" : file.status}
                  </span>
                </div>
                {file.status === "failed" ? (
                  <p className="text-[10px] text-destructive">{file.error}</p>
                ) : (
                  <Progress value={file.progress} className="h-1" />
                )}
              </div>
              {file.status === "ocr" && <Loader2 size={14} className="animate-spin text-primary shrink-0" />}
            </div>
          ))}
        </div>
      )}

      {hasCompleted && (
        <Button onClick={onComplete} className="w-full gap-2" size="lg">
          <CheckCircle2 size={18} />
          Valider l&apos;indexation ({files.filter((f) => f.status === "completed").length} fichier{files.filter((f) => f.status === "completed").length > 1 ? "s" : ""})
        </Button>
      )}
    </div>
  );
}
