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
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/audio", icon: Mic, label: "Audio" },
  { href: "/assistant", icon: MessageSquare, label: "Assistant IA" },
];

const bottomNavItems = [
  { href: "/settings", icon: Settings, label: "Paramètres" },
  { href: "/admin", icon: ShieldCheck, label: "Administration" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative h-screen bg-[hsl(var(--sidebar-background))] border-r border-border transition-all duration-300 ease-in-out flex flex-col shrink-0",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 h-16 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Sparkles size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-black tracking-tight text-foreground">GEDOS</span>
              <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">IA GED</p>
            </div>
          )}
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return collapsed ? (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center justify-center w-full p-3 rounded-xl transition-all duration-200",
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon size={20} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm",
                  active
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-border">
            {bottomNavItems.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href);
              return collapsed ? (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center justify-center w-full p-3 rounded-xl transition-all duration-200 mb-1",
                        active
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm mb-1",
                    active
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center w-full p-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all">
                  <Globe size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Changer la langue</TooltipContent>
            </Tooltip>
          ) : (
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all text-sm font-medium">
              <Globe size={18} />
              Français
            </button>
          )}

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center w-full p-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                  <LogOut size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Déconnexion</TooltipContent>
            </Tooltip>
          ) : (
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all text-sm font-medium">
              <LogOut size={18} />
              Déconnexion
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-xl z-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </TooltipProvider>
  );
}
