"use client";

import { FileText } from "lucide-react";
import { Document } from "@/types/database";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { BlurFade } from "@/components/magicui/blur-fade";

export function DocumentGrid({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl">
        <FileText size={48} className="text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">Aucun document. Commencez par en téléverser un.</p>
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
