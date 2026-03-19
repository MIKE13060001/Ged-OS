
import React from 'react';
import { 
  FileText, 
  FolderIcon, 
  Mic, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Globe
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { getTranslation } from '../../lib/i18n';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
    {!collapsed && <span className="ml-3 font-medium">{label}</span>}
  </button>
);

const Sidebar: React.FC<{ activeView: string; setView: (v: string) => void }> = ({ activeView, setView }) => {
  const { sidebarOpen, toggleSidebar, language, setLanguage } = useUIStore();
  const t = getTranslation(language);

  return (
    <aside 
      className={`relative h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          {sidebarOpen && <span className="text-xl font-bold tracking-tight text-white">GEDOS</span>}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem 
          icon={FileText} 
          label={t.sidebar.documents} 
          active={activeView === 'documents'} 
          onClick={() => setView('documents')}
          collapsed={!sidebarOpen}
        />
        <NavItem 
          icon={Mic} 
          label={t.sidebar.audio} 
          active={activeView === 'audio'} 
          onClick={() => setView('audio')}
          collapsed={!sidebarOpen}
        />
        <NavItem 
          icon={MessageSquare} 
          label={t.sidebar.assistant} 
          active={activeView === 'assistant'} 
          onClick={() => setView('assistant')}
          collapsed={!sidebarOpen}
        />
        <div className="pt-4 mt-4 border-t border-slate-800/50">
          <NavItem 
            icon={Settings} 
            label={t.sidebar.settings} 
            active={activeView === 'settings'} 
            onClick={() => setView('settings')}
            collapsed={!sidebarOpen}
          />
          <NavItem 
            icon={ShieldCheck} 
            label={t.sidebar.admin} 
            active={activeView === 'admin'} 
            onClick={() => setView('admin')}
            collapsed={!sidebarOpen}
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center w-full p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Globe size={18} />
          {sidebarOpen && <span className="ml-3 text-sm">{language === 'fr' ? 'English' : 'Français'}</span>}
        </button>

        <button className="flex items-center w-full p-2 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={18} />
          {sidebarOpen && <span className="ml-3 text-sm">Déconnexion</span>}
        </button>

        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-xl z-50"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
