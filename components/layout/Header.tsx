"use client";

import { Search, Command } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/ui/NotificationPanel";

export function Header() {
  return (
    <header
      className="h-12 flex items-center justify-between px-4 shrink-0 z-20 relative"
      style={{
        background: "rgba(10,10,16,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Search */}
      <div className="flex items-center flex-1 max-w-sm">
        <div className="relative w-full group">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
            size={13}
            style={{ color: "rgba(255,255,255,0.22)" }}
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full h-7 pl-8 pr-16 text-[13px] rounded-md outline-none transition-all duration-150 placeholder:font-normal"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(59,130,246,0.35)";
              e.currentTarget.style.background = "rgba(59,130,246,0.04)";
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <Command size={9} style={{ color: "rgba(255,255,255,0.18)" }} />
            <span
              className="text-[9px] font-semibold"
              style={{ color: "rgba(255,255,255,0.18)", fontFamily: "inherit" }}
            >
              K
            </span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5 ml-3">
        {/* System status */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md mr-1"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-400">Tous les systèmes actifs</span>
        </div>

        {/* Notification */}
        <NotificationPanel />

        {/* Divider */}
        <div className="w-px h-4 mx-0.5" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/[0.05] group"
            >
              <div className="text-right hidden md:block">
                <p className="text-[11px] font-semibold text-white/85 leading-none">Valentin DOS</p>
                <p
                  className="text-[9px] font-medium mt-0.5"
                  style={{ color: "rgba(99,102,241,0.75)" }}
                >
                  Enterprise
                </p>
              </div>
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
              >
                V
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            style={{
              background: "hsl(240 12% 8%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            }}
          >
            <DropdownMenuLabel className="font-normal py-2.5">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-white/90">Valentin DOS</p>
<p className="text-[11px] text-white/38">valentin@documentsofficesolutions.fr</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.07)" }} />
            <DropdownMenuItem className="text-white/60 focus:text-white focus:bg-white/[0.05] text-[13px] font-medium cursor-pointer">
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/60 focus:text-white focus:bg-white/[0.05] text-[13px] font-medium cursor-pointer">
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.07)" }} />
            <DropdownMenuItem className="text-red-400/80 focus:text-red-400 focus:bg-red-500/[0.08] text-[13px] font-medium cursor-pointer">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
