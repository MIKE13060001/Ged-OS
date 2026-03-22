"use client";

import { Search, Bell, Command } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header
      className="h-14 flex items-center justify-between px-5 shrink-0 z-20 relative"
      style={{
        background: "rgba(9,9,14,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
            size={14}
            style={{ color: "rgba(255,255,255,0.25)" }}
          />
          <input
            type="text"
            placeholder="Rechercher un document, une action..."
            className="w-full h-8 pl-9 pr-10 text-[13px] rounded-lg outline-none transition-all placeholder:text-white/20 text-white/80"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(59,130,246,0.4)";
              e.currentTarget.style.background = "rgba(59,130,246,0.05)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <Command size={10} style={{ color: "rgba(255,255,255,0.18)" }} />
            <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.18)" }}>K</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notification */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
        >
          <Bell size={15} style={{ color: "rgba(255,255,255,0.45)" }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#3b82f6", boxShadow: "0 0 6px rgba(59,130,246,0.8)" }} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/8" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-white/5 group">
              <div className="text-right hidden md:block">
                <p className="text-[12px] font-bold text-white/90 leading-none">G. Architect</p>
                <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "rgba(99,102,241,0.8)" }}>
                  Enterprise Admin
                </p>
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
              >
                GA
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52"
            style={{
              background: "hsl(240 12% 8%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-bold text-white/90">G. Architect</p>
                <p className="text-xs text-white/40">admin@gedos.fr</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/8" />
            <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/5 text-sm">Profil</DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/5 text-sm">Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/8" />
            <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-500/10 text-sm">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
