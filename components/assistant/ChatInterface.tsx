
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Paperclip, Mic, Database, BarChart3, Zap, ShieldCheck, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { getTranslation } from '../../lib/i18n';
import { gemini, ChatMessage } from '../../lib/ai/gemini';
import ActionApproval from './ActionApproval';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  level?: number;
  pendingAction?: any;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const { language } = useUIStore();
  const t = getTranslation(language);
  const documents = useDocumentStore(state => state.documents);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Bonjour ! Je suis votre assistant GEDOS. J'ai ${documents.length} documents chargés en mémoire perpétuelle. Comment puis-je vous aider ?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [level, setLevel] = useState(1);
  const [showKB, setShowKB] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userQuery = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Conversion pour l'API Gemini (Historique complet)
      const historyForAI: ChatMessage[] = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const response = await gemini.chat(historyForAI, level, documents);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "Désolé, je n'ai pas pu traiter cette demande.",
        level,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50 rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
      {/* Header avec indicateur de base de connaissances */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-primary/20 rounded-lg">
            <Sparkles className="text-brand-primary" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">Assistant Sovereign</h2>
            <button 
              onClick={() => setShowKB(!showKB)}
              className="flex items-center space-x-1.5 text-[10px] text-brand-primary font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              <Database size={10} />
              <span>{documents.length} Docs en mémoire</span>
              {showKB ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          </div>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-lg">
          {[1, 2, 3].map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                level === l ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              N{l}
            </button>
          ))}
        </div>
      </div>

      {/* Panneau de la base de connaissances (Knowledge Base Tray) */}
      {showKB && (
        <div className="bg-slate-900/90 border-b border-slate-800 p-3 flex flex-wrap gap-2 animate-in slide-in-from-top duration-300">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center space-x-2 px-2 py-1 bg-slate-800 border border-slate-700 rounded-md">
              <FileText size={12} className="text-brand-primary" />
              <span className="text-[10px] text-slate-300 truncate max-w-[120px]">{doc.name}</span>
            </div>
          ))}
          {documents.length === 0 && <span className="text-[10px] text-slate-500 italic">Aucun document chargé...</span>}
        </div>
      )}

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-slate-900/20">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
            <span className="mt-1 text-[9px] text-slate-600 uppercase font-bold tracking-widest">
              {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-500 italic text-xs animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span>Flash 3 parcourt votre base perpétuelle...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez une question sur n'importe quel document déposé..."
            className="w-full pl-4 pr-12 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-primary/50 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-brand-primary text-white rounded-xl disabled:bg-slate-800 disabled:text-slate-600 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
