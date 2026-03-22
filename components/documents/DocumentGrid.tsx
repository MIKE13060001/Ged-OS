"use client";

import { FileText } from "lucide-react";
import { Document } from "@/types/database";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { BlurFade } from "@/components/magicui/blur-fade";

export function DocumentGrid({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-xl"
        style={{
          border: "2px dashed rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <FileText size={22} className="text-blue-400/60" />
        </div>
        <p className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
          Aucun document
        </p>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Téléversez votre premier fichier pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {documents.map((doc, index) => (
        <BlurFade key={doc.id} delay={index * 0.05} inView>
          <DocumentCard doc={doc} />
        </BlurFade>
      ))}
    </div>
  );
}
