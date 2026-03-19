"use client";

import { useState } from "react";
import {
  Plus,
  FolderPlus,
  Filter,
  ChevronRight,
  FileCheck,
  Zap,
  Bell,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { UploadZone } from "@/components/documents/UploadZone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";

function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  trend: string;
  color: string;
}) {
  return (
    <Card className="border-border hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">
          {typeof value === "number" ? <NumberTicker value={value} /> : value}
        </div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function DocumentsPage() {
  const { documents } = useDocumentStore();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="p-8">
      <BlurFade>
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">
              Espace Documentaire
            </h1>
            <div className="flex items-center text-muted-foreground text-sm font-medium">
              <span className="hover:text-foreground cursor-pointer">Mon GED</span>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-primary font-bold">Tous les documents</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <FolderPlus size={18} />
              Dossier
            </Button>
            <Button onClick={() => setShowUpload(true)} className="gap-2 shadow-lg shadow-primary/20">
              <Plus size={18} />
              Téléverser
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard icon={FileCheck} label="Indexés" value={documents.length} trend="+12%" color="bg-blue-600" />
          <StatsCard icon={Zap} label="Précision OCR" value="98.4%" trend="+2%" color="bg-amber-500" />
          <StatsCard icon={Bell} label="Actions en attente" value={14} trend="-5%" color="bg-indigo-600" />
          <StatsCard icon={LayoutGrid} label="Espace utilisé" value="4.2 GB" trend="+1%" color="bg-emerald-600" />
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <button className="text-primary border-b-2 border-primary pb-4">Récents</button>
            <button className="text-muted-foreground hover:text-foreground pb-4 transition-colors">Épinglés</button>
            <button className="text-muted-foreground hover:text-foreground pb-4 transition-colors">Corbeille</button>
          </div>
          <Button variant="ghost" size="icon">
            <Filter size={18} />
          </Button>
        </div>

        {/* Document Grid */}
        <DocumentGrid documents={documents} />
      </BlurFade>

      {/* Document Viewer Sheet */}
      <DocumentViewer />

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Téléversement intelligent</DialogTitle>
          </DialogHeader>
          <UploadZone onComplete={() => setShowUpload(false)} />
          <p className="text-xs text-muted-foreground text-center">
            L&apos;OCR et l&apos;indexation sémantique sont déclenchés automatiquement.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
