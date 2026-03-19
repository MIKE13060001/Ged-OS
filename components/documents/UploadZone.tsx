
import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { getTranslation } from '../../lib/i18n';
import { gemini } from '../../lib/ai/gemini';
import { Document } from '../../types/database';

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'ocr' | 'completed' | 'failed';
  error?: string;
}

const SUPPORTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const UploadZone: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { language } = useUIStore();
  const t = getTranslation(language);
  const addDocument = useDocumentStore(state => state.addDocument);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    const id = Math.random().toString(36).substring(7);
    
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setFiles(prev => [...prev, { 
        id, 
        name: file.name, 
        progress: 100, 
        status: 'failed', 
        error: "Format non supporté (PDF, JPG, PNG requis)" 
      }]);
      return;
    }

    setFiles(prev => [...prev, { id, name: file.name, progress: 20, status: 'uploading' }]);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<{data: string, full: string}>((resolve, reject) => {
        reader.onload = () => resolve({
          data: (reader.result as string).split(',')[1],
          full: reader.result as string
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const fileContent = await base64Promise;

      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 50, status: 'ocr' } : f));

      // Indexation profonde via Gemini
      const extraction = await gemini.indexDocumentContent(fileContent.data, file.type, file.name);

      const doc: Document = {
        id: Math.random().toString(36).substring(7),
        tenantId: 't1',
        name: file.name,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        storagePath: `/vault/${id}`,
        // CRUCIAL: On stocke le Base64 complet pour la persistance au refresh (URL.createObjectURL meurt au refresh)
        previewUrl: fileContent.full, 
        version: 1,
        ocrStatus: 'completed',
        ocrText: extraction.text,
        extractedData: {},
        tags: extraction.tags,
        metadata: {},
        createdBy: 'u1',
        createdAt: new Date().toISOString()
      };

      addDocument(doc);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100, status: 'completed' } : f));
    } catch (error: any) {
      console.error("OCR Error:", error);
      setFiles(prev => prev.map(f => f.id === id ? { 
        ...f, 
        status: 'failed', 
        error: error.message || "Erreur d'analyse visuelle" 
      } : f));
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach(processFile);
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center ${
          isDragging ? 'border-brand-primary bg-brand-primary/10 scale-[1.01]' : 'border-slate-800 bg-slate-900/40'
        }`}
      >
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4 text-brand-primary">
          <Upload size={32} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Dépôt Souverain</h3>
        <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
          Glissez vos fichiers. L'IA Gemini 3 Flash analysera visuellement vos images et documents pour une précision totale.
        </p>
        <input 
          type="file" 
          multiple 
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files && Array.from(e.target.files).forEach(processFile)}
        />
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {files.map(file => (
          <div key={file.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
            <div className={`p-2 rounded-lg ${file.status === 'failed' ? 'bg-red-500/10' : 'bg-slate-900'}`}>
              {file.status === 'failed' ? <XCircle className="text-red-500" size={20} /> : <FileText className="text-brand-primary" size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300 truncate pr-4">{file.name}</span>
                <span className={`text-[9px] font-black uppercase whitespace-nowrap ${file.status === 'failed' ? 'text-red-500' : 'text-brand-primary'}`}>
                  {file.status === 'ocr' ? 'Analyse Vision...' : file.status}
                </span>
              </div>
              {file.status === 'failed' ? (
                <p className="text-[10px] text-red-400 font-medium">{file.error}</p>
              ) : (
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary transition-all duration-700 ease-out"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {files.some(f => f.status === 'completed') && (
        <button 
          onClick={onComplete}
          className="w-full py-4 bg-brand-primary hover:bg-brand-hover text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
        >
          Valider l'indexation
        </button>
      )}
    </div>
  );
};

export default UploadZone;
