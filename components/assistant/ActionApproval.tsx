
import React from 'react';
import { Mail, Check, X, AlertTriangle, ChevronRight } from 'lucide-react';

interface ActionApprovalProps {
  type: 'email' | 'folder' | 'api';
  payload: any;
  explanation: string;
  onApprove: () => void;
  onReject: () => void;
}

const ActionApproval: React.FC<ActionApprovalProps> = ({ type, payload, explanation, onApprove, onReject }) => {
  return (
    <div className="bg-slate-900 border-2 border-brand-primary/30 rounded-2xl overflow-hidden shadow-2xl my-4">
      <div className="bg-brand-primary/10 px-6 py-4 flex items-center justify-between border-b border-brand-primary/20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-primary rounded-lg text-white">
            {type === 'email' && <Mail size={18} />}
            {type === 'folder' && <Check size={18} />}
          </div>
          <span className="font-bold text-brand-primary uppercase tracking-wider text-xs">Action suggérée - Niveau 3</span>
        </div>
        <div className="flex items-center text-amber-500 text-xs font-semibold">
          <AlertTriangle size={14} className="mr-1" />
          Approbation requise
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-slate-200 text-sm mb-6 leading-relaxed">
          {explanation}
        </p>
        
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 font-mono text-xs text-slate-400">
          <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
            <span>DÉTAILS DE L'ACTION</span>
            <span className="text-slate-600">ID: ACT-4821</span>
          </div>
          {Object.entries(payload).map(([key, val]: [string, any]) => (
            <div key={key} className="flex py-1">
              <span className="w-20 text-slate-500 uppercase">{key}:</span>
              <span className="flex-1 text-slate-300 break-all">{val.toString()}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onReject}
            className="flex-1 px-4 py-2.5 border border-slate-700 hover:border-red-500/50 hover:bg-red-500/5 text-slate-400 hover:text-red-400 rounded-xl font-semibold transition-all flex items-center justify-center"
          >
            <X size={18} className="mr-2" />
            Rejeter
          </button>
          <button 
            onClick={onApprove}
            className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-brand-primary/20 transition-all"
          >
            <Check size={18} className="mr-2" />
            Approuver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionApproval;
