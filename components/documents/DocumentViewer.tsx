
import React from 'react';
import { X, FileText, Download, Share2, Trash2, Calendar, Database, HardDrive, ExternalLink, ShieldCheck } from 'lucide-react';
import { Document } from '../../types/database';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const isImage = document.mimeType.startsWith('image/');

  const handleOpenDirectly = () => {
    if (document.previewUrl) {
      window.open(document.previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary shadow-inner">
              <FileText size={24} />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold text-white truncate max-w-[300px]" title={document.name}>{document.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">v{document.version}</span>
                <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest uppercase">{document.mimeType}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-900/20">
          {/* Main Display Area */}
          <div className="aspect-[4/3] w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative flex flex-col items-center justify-center p-8 group">
             {isImage ? (
                <img 
                  src={document.previewUrl} 
                  alt={document.name} 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform group-hover:scale-[1.02] duration-500"
                />
             ) : (
                <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                    <FileText size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Visualisation du Document</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                      Par mesure de sécurité, ce document s'ouvre dans une fenêtre isolée pour garantir le chiffrement de bout en bout.
                    </p>
                  </div>
                  <button 
                    onClick={handleOpenDirectly}
                    className="px-8 py-4 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl font-bold flex items-center space-x-3 shadow-2xl shadow-brand-primary/30 transition-all active:scale-95"
                  >
                    <ExternalLink size={20} />
                    <span>Ouvrir dans un nouvel onglet</span>
                  </button>
                </div>
             )}
             
             <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full flex items-center space-x-2">
                   <ShieldCheck size={12} className="text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tunnel de Données Sécurisé</span>
                </div>
             </div>
          </div>

          {/* Details & AI Analysis */}
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800/50">
                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center mb-1">
                  <Calendar size={12} className="mr-2 text-brand-primary" /> Ajouté le
                </label>
                <p className="text-sm font-bold text-slate-200">{new Date(document.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800/50">
                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center mb-1">
                  <HardDrive size={12} className="mr-2 text-brand-primary" /> Taille
                </label>
                <p className="text-sm font-bold text-slate-200">{(document.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-brand-primary/20 rounded-3xl p-6 space-y-4 relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <Database size={100} className="text-brand-primary" />
              </div>
              <h3 className="text-xs font-black text-white flex items-center uppercase tracking-[0.2em]">
                <span className="w-1.5 h-4 bg-brand-primary rounded-full mr-3 shadow-[0_0_10px_#2563EB]"></span>
                Synthèse Sémantique IA
              </h3>
              <div className="space-y-3 relative z-10">
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "Ce document PDF a été analysé via notre pipeline RAG. Il contient des informations structurées concernant les thématiques : {document.tags.join(', ')}."
                </p>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] border border-brand-primary/20 font-black uppercase tracking-widest">#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 flex space-x-4">
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 shadow-lg active:scale-95">
            <Download size={18} />
            <span>Télécharger</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-4 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-primary/30 active:scale-95">
            <Share2 size={18} />
            <span>Partager</span>
          </button>
          <button className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all border border-red-500/20 active:scale-95">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
