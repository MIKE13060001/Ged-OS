
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DocumentGrid from './components/documents/DocumentGrid';
import ChatInterface from './components/assistant/ChatInterface';
import UploadZone from './components/documents/UploadZone';
import AudioRecorder from './components/audio/AudioRecorder';
import DocumentViewer from './components/documents/DocumentViewer';
import { useUIStore } from './stores/uiStore';
import { useDocumentStore } from './stores/documentStore';
import { getTranslation } from './lib/i18n';
// FIX: Added Mic and Sparkles to the import list from lucide-react
import { 
  Search, Bell, Plus, FolderPlus, Filter, LayoutGrid, List, ChevronRight,
  TrendingUp, FileCheck, Zap, X, Mic, Sparkles
} from 'lucide-react';

const StatsCard: React.FC<{ icon: React.ElementType, label: string, value: string, trend: string, color: string }> = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex items-center space-x-1 text-emerald-400 text-xs font-medium">
        <TrendingUp size={12} />
        <span>{trend}</span>
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-100">{value}</div>
    <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{label}</div>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const { language, assistantPanelOpen, toggleAssistantPanel } = useUIStore();
  const { documents, selectedDocument, setSelectedDocument } = useDocumentStore();
  const t = getTranslation(language);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar activeView={activeView} setView={setActiveView} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 z-20">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={t.documents.search} 
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5 ml-6">
            <button className="p-2.5 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl border border-slate-800 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-200">G. Architect</p>
                <p className="text-[10px] text-brand-primary font-bold tracking-tighter uppercase">Enterprise Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-primary group-hover:border-brand-primary transition-all">
                <LayoutGrid size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {activeView === 'documents' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-white mb-2">Espace Documentaire</h1>
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <span className="hover:text-slate-300 cursor-pointer">Mon GED</span>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-brand-primary font-bold">Tous les documents</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all font-semibold">
                    <FolderPlus size={18} className="mr-2" />
                    Dossier
                  </button>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl shadow-2xl shadow-brand-primary/20 transition-all font-bold"
                  >
                    <Plus size={18} className="mr-2" />
                    {t.documents.upload}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard icon={FileCheck} label="Indexés" value={documents.length.toString()} trend="+12%" color="bg-blue-600" />
                <StatsCard icon={Zap} label="OCR" value="98.4%" trend="+2%" color="bg-amber-500" />
                <StatsCard icon={Bell} label="Actions" value="14" trend="-5%" color="bg-indigo-600" />
                <StatsCard icon={LayoutGrid} label="Espace" value="4.2 GB" trend="+1%" color="bg-emerald-600" />
              </div>

              <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex space-x-8 text-sm font-bold uppercase tracking-widest">
                   <button className="text-brand-primary border-b-2 border-brand-primary pb-4">Récents</button>
                   <button className="text-slate-500 hover:text-slate-300 pb-4 transition-colors">Épinglés</button>
                   <button className="text-slate-500 hover:text-slate-300 pb-4 transition-colors">Corbeille</button>
                </div>
                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Filter size={20} /></button>
              </div>

              <DocumentGrid documents={documents} />
            </div>
          )}

          {activeView === 'assistant' && (
            <div className="h-full animate-in fade-in duration-500">
              <ChatInterface />
            </div>
          )}

          {activeView === 'audio' && (
            <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-500">
              <AudioRecorder onTranscription={(text) => alert(text)} />
              <div className="grid grid-cols-3 gap-8 max-w-3xl w-full">
                {['Dernière Réunion', 'Point Équipe', 'Interview Client'].map(title => (
                   <div key={title} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/50 transition-all group">
                      <div className="p-3 bg-slate-800 rounded-xl w-fit mb-4 text-brand-primary group-hover:scale-110 transition-transform"><Mic size={20} /></div>
                      <h4 className="font-bold text-sm mb-1">{title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">14 Mars • 12:45</p>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating AI Button (Toggle) - Only visible when panel is closed */}
        {activeView !== 'assistant' && !assistantPanelOpen && (
          <button 
            onClick={toggleAssistantPanel}
            className="fixed bottom-8 right-8 w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-primary/40 hover:scale-110 hover:rotate-3 transition-all z-40 group animate-in zoom-in duration-300"
          >
            <Sparkles size={28} className="group-hover:animate-pulse" />
          </button>
        )}

        {/* Right Side AI Panel */}
        {assistantPanelOpen && activeView !== 'assistant' && (
          <div className="fixed right-6 top-24 bottom-6 w-[450px] z-50 animate-in slide-in-from-right duration-500 ease-out shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="relative h-full">
              <button 
                onClick={toggleAssistantPanel}
                className="absolute -left-3 top-4 w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-[60] shadow-xl"
                title="Fermer l'assistant"
              >
                <X size={20} />
              </button>
              <ChatInterface />
            </div>
          </div>
        )}

        {/* Document Viewer Side Panel */}
        {selectedDocument && (
          <DocumentViewer 
            document={selectedDocument} 
            onClose={() => setSelectedDocument(null)} 
          />
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">Téléversement intelligent</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8">
                <UploadZone onComplete={() => setShowUploadModal(false)} />
              </div>
              <div className="p-6 bg-slate-950/50 border-t border-slate-800 text-center">
                 <p className="text-xs text-slate-500 font-medium">L'OCR et l'indexation sémantique sont déclenchés automatiquement.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
