"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Mic,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/documents", icon: FileText, label: "Documents", color: "text-blue-400" },
  { href: "/audio", icon: Mic, label: "Audio", color: "text-violet-400" },
  { href: "/assistant", icon: MessageSquare, label: "Assistant IA", color: "text-emerald-400" },
];

const bottomNavItems = [
  { href: "/settings", icon: Settings, label: "Paramètres", color: "text-slate-400" },
  { href: "/admin", icon: ShieldCheck, label: "Administration", color: "text-amber-400" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        style={{ background: "hsl(240 16% 4%)" }}
        className={cn(
          "relative h-screen border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col shrink-0",
          collapsed ? "w-[68px]" : "w-[220px]"
        )}
      >
        {/* Gradient accent top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Logo */}
        <div className={cn("flex items-center gap-3 h-16 shrink-0 border-b border-white/5", collapsed ? "px-4 justify-center" : "px-5")}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}>
            <Zap size={16} className="text-white" fill="white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-[15px] font-black tracking-tight text-white">GEDOS</span>
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: "rgba(99,102,241,0.9)" }}>IA GED</p>
            </div>
          )}
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-hidden">
          <div className="mb-3">
            {!collapsed && (
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] px-3 mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                Espace de travail
              </p>
            )}
            {navItems.map(({ href, icon: Icon, label, color }) => {
              const active = pathname.startsWith(href);
              const item = (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-xl transition-all duration-200 relative group",
                    collapsed ? "p-2.5 justify-center" : "px-3 py-2.5",
                    active
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
                  )}
                  style={active ? {
                    background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.1) 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.2)"
                  } : {}}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: "linear-gradient(180deg, #3b82f6, #6366f1)" }} />
                  )}
                  <Icon size={17} className={active ? "text-blue-400" : color + " opacity-60 group-hover:opacity-100 transition-opacity"} />
                  {!collapsed && (
                    <span className={cn("text-[13px] font-semibold", active ? "text-white" : "")}>
                      {label}
                    </span>
                  )}
                </Link>
              );
              return collapsed ? (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{item}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
                </Tooltip>
              ) : item;
            })}
          </div>

          <div className="pt-3 mt-1 border-t border-white/5">
            {!collapsed && (
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] px-3 mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                Configuration
              </p>
            )}
            {bottomNavItems.map(({ href, icon: Icon, label, color }) => {
              const active = pathname.startsWith(href);
              const item = (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-xl transition-all duration-200 relative group",
                    collapsed ? "p-2.5 justify-center" : "px-3 py-2.5",
                    active ? "text-white" : "text-white/35 hover:text-white/70"
                  )}
                  style={active ? {
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)"
                  } : {}}
                >
                  <Icon size={17} className={active ? "text-white/90" : color + " opacity-60 group-hover:opacity-90 transition-opacity"} />
                  {!collapsed && (
                    <span className="text-[13px] font-semibold">{label}</span>
                  )}
                </Link>
              );
              return collapsed ? (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{item}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
                </Tooltip>
              ) : item;
            })}
          </div>
        </nav>

        {/* Footer — User */}
        <div className="p-3 border-t border-white/5 shrink-0">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full flex justify-center p-2.5 rounded-xl transition-colors hover:bg-white/5">
                  <LogOut size={16} className="text-white/30 hover:text-red-400 transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Déconnexion</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                G
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-white/90 truncate">G. Architect</p>
                <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(99,102,241,0.7)" }}>Enterprise Admin</p>
              </div>
              <button className="text-white/20 hover:text-red-400 transition-colors ml-1">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-50 transition-all hover:scale-110"
          style={{
            background: "hsl(240 12% 10%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)"
          }}
        >
          {collapsed ? <ChevronRight size={11} className="text-white/50" /> : <ChevronLeft size={11} className="text-white/50" />}
        </button>
      </aside>
    </TooltipProvider>
  );
}
