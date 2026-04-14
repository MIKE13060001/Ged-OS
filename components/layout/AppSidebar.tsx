"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useRole } from "@/hooks/useRole";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/rbac";

const navItems = [
  { href: "/documents", icon: FileText, label: "Documents", shortcut: "D", color: "#3b82f6" },
  { href: "/audio", icon: Mic, label: "Audio", shortcut: "A", color: "#8b5cf6" },
  { href: "/assistant", icon: MessageSquare, label: "Assistant IA", shortcut: "I", color: "#10b981" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  shortcut,
  color,
  collapsed,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  shortcut: string | null;
  color: string;
  collapsed: boolean;
  active: boolean;
}) {
  const inner = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 w-full rounded-lg transition-all duration-150 relative group select-none",
        collapsed ? "p-2 justify-center" : "px-2.5 py-2",
        active
          ? "text-white"
          : "text-white/40 hover:text-white/75 hover:bg-white/[0.04]"
      )}
      style={active ? {
        background: "rgba(255,255,255,0.06)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      } : {}}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      )}
      <Icon
        size={15}
        style={{ color: active ? color : undefined }}
        className={cn(!active && "opacity-50 group-hover:opacity-80 transition-opacity")}
      />
      {!collapsed && (
        <>
          <span className={cn("text-[13px] font-medium flex-1", active ? "text-white" : "")}>
            {label}
          </span>
          {shortcut && (
            <kbd
              className="text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-inter), monospace",
              }}
            >
              {shortcut}
            </kbd>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {label}
          {shortcut && <span className="ml-2 opacity-50">{shortcut}</span>}
        </TooltipContent>
      </Tooltip>
    );
  }
  return inner;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut, isConfigured } = useAuth();
  const { role, isAdmin } = useRole();

  const displayName = "Valentin";
  const initials = "V";
  const roleColors = ROLE_COLORS[role];

  async function handleSignOut() {
    await signOut();
    if (isConfigured) router.push("/auth/login");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative h-screen flex flex-col shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "w-[56px]" : "w-[216px]"
        )}
        style={{
          background: "hsl(240 16% 3%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }}
        />

        {/* Workspace switcher */}
        <div
          className={cn(
            "flex items-center shrink-0 border-b",
            collapsed ? "p-3 justify-center h-14" : "p-3 h-14 gap-2.5"
          )}
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          {collapsed ? (
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white">
              <img src="/dos-logo.png" alt="Documents Office Solutions" className="w-full h-full object-contain p-0.5" />
            </div>
          ) : (
            <div className="flex-1 min-w-0 flex items-center">
              <img src="/dos-logo.png" alt="Documents Office Solutions" className="h-8 w-auto object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {/* Main section */}
          <div className="space-y-0.5">
            {!collapsed && (
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] px-2.5 pb-1.5 pt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                Espace de travail
              </p>
            )}
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} collapsed={collapsed} active={pathname.startsWith(item.href)} />
            ))}
          </div>

          <div className="my-3" style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginLeft: collapsed ? 0 : "0.5rem", marginRight: collapsed ? 0 : "0.5rem" }} />

          {/* Bottom section */}
          <div className="space-y-0.5">
            {!collapsed && (
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] px-2.5 pb-1.5 pt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                Système
              </p>
            )}
            <NavItem href="/settings" icon={Settings} label="Paramètres" shortcut="P" color="#94a3b8" collapsed={collapsed} active={pathname.startsWith("/settings")} />
            {/* Admin link — visible only to admins */}
            {isAdmin && (
              <NavItem href="/admin" icon={ShieldCheck} label="Administration" shortcut={null} color="#f59e0b" collapsed={collapsed} active={pathname.startsWith("/admin")} />
            )}
          </div>
        </nav>

        {/* User footer */}
        <div className="shrink-0 p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full flex justify-center p-2 rounded-lg transition-colors hover:bg-white/[0.04]">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                  >
                    {initials}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{displayName} · {ROLE_LABELS[role]}</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer group hover:bg-white/[0.04] transition-colors">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white/90 truncate leading-none">{displayName}</p>
                <span
                  className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 leading-none"
                  style={{ background: roleColors.bg, color: roleColors.text, border: `1px solid ${roleColors.border}` }}
                >
                  {ROLE_LABELS[role]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400"
                title="Déconnexion"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-50 transition-all duration-150 hover:scale-110 active:scale-95"
          style={{
            background: "hsl(240 12% 10%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {collapsed
            ? <ChevronRight size={10} className="text-white/40" />
            : <ChevronLeft size={10} className="text-white/40" />
          }
        </button>
      </aside>
    </TooltipProvider>
  );
}
