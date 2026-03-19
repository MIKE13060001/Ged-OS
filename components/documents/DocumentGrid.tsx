
import React from 'react';
import { FileText, MoreVertical, Download, Trash2, Clock, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Document, OCRStatus } from '../../types/database';
import { useUIStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { getTranslation } from '../../lib/i18n';

const StatusBadge: React.FC<{ status: OCRStatus }> = ({ status }) => {
  const { language } = useUIStore();
  const t = getTranslation(language);

  const configs = {
    pending: { icon: Clock, color: 'text-amber-500 bg-amber-500/10', label: t.documents.status.pending },
    processing: { icon: Clock, color: 'text-blue-500 bg-blue-500/10 animate-pulse', label: t.documents.status.processing },
    completed: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10', label: t.documents.status.completed },
    failed: { icon: AlertCircle, color: 'text-red-500 bg-red-500/10', label: t.documents.status.failed },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
      <Icon size={10} className="mr-1" />
      {config.label}
    </div>
  );
};

const DocumentCard: React.FC<{ doc: Document }> = ({ doc }) => {
  const setSelectedDocument = useDocumentStore(state => state.setSelectedDocument);

  const handleCardClick = () => {
    // 1. Sélectionner pour le panneau latéral
    setSelectedDocument(doc);
    
    // 2. Ouvrir IMMÉDIATEMENT dans un nouvel onglet (Window Open) pour contourner les blocages d'iframe
    if (doc.previewUrl) {
      window.open(doc.previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/80 hover:border-brand-primary/50 transition-all duration-200 shadow-sm cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
          <FileText className="text-brand-primary" size={24} />
        </div>
        <div className="flex space-x-1">
           <button className="text-slate-500 hover:text-white p-1" onClick={(e) => {
             e.stopPropagation();
             window.open(doc.previewUrl, '_blank');
           }}>
             <ExternalLink size={14} />
           </button>
           <button className="text-slate-500 hover:text-white p-1" onClick={(e) => e.stopPropagation()}>
             <MoreVertical size={16} />
           </button>
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-100 truncate mb-1 text-sm leading-tight" title={doc.name}>
        {doc.name}
      </h3>
      
      <div className="flex items-center text-slate-400 text-[11px] mb-3">
        <span>{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
        <span className="mx-1.5">•</span>
        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <StatusBadge status={doc.ocrStatus} />
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded" onClick={(e) => e.stopPropagation()}>
            <Download size={14} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded" onClick={(e) => e.stopPropagation()}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentGrid: React.FC<{ documents: Document[] }> = ({ documents }) => {
  const { language } = useUIStore();
  const t = getTranslation(language);

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-2xl">
        <FileText size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-500">{t.documents.empty}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
};

export default DocumentGrid;
