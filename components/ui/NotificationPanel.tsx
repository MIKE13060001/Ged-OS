"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  FileText,
  FolderOpen,
  Trash2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  RefreshCw,
  X,
  CheckCheck,
  Inbox,
} from "lucide-react";
import { useAuditStore, AuditEvent } from "@/stores/auditStore";
import { useNotificationStore } from "@/stores/notificationStore";

/* ─── helpers ──────────────────────────────────────────────────────────── */

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "À l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `Il y a ${d}j`;
}

const ACTION_META: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Document importé": { icon: Upload, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  "Document supprimé": { icon: Trash2, color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
  "Dossier créé": { icon: FolderOpen, color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  "Dossier supprimé": { icon: Trash2, color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
  "OCR terminé": { icon: ScanLine, color: "#10b981", bg: "rgba(16,185,129,0.10)" },
  "Traitement en cours": { icon: RefreshCw, color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
  "Document déplacé": { icon: FolderOpen, color: "#06b6d4", bg: "rgba(6,182,212,0.10)" },
};

function getActionMeta(action: string) {
  return (
    ACTION_META[action] ?? {
      icon: FileText,
      color: "rgba(255,255,255,0.45)",
      bg: "rgba(255,255,255,0.06)",
    }
  );
}

function statusColor(status: AuditEvent["status"]) {
  if (status === "error") return "#ef4444";
  if (status === "warning") return "#f59e0b";
  return "#10b981";
}

/* ─── NotificationItem ───────────────────────────────────────────────── */

function NotificationItem({
  event,
  unread,
}: {
  event: AuditEvent;
  unread: boolean;
}) {
  const { icon: Icon, color, bg } = getActionMeta(event.action);

  return (
    <div
      className="group flex items-start gap-3 px-4 py-3 transition-colors duration-100 hover:bg-white/[0.03] cursor-default relative"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* left accent */}
      {unread && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-7 rounded-r-full"
          style={{ background: "#3b82f6" }}
        />
      )}

      {/* icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: bg }}
      >
        <Icon size={13} style={{ color }} />
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[12px] font-semibold leading-tight"
            style={{ color: unread ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.55)" }}
          >
            {event.action}
          </p>
          <span
            className="text-[10px] shrink-0 mt-0.5"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            {relativeTime(event.timestamp)}
          </span>
        </div>
        <p
          className="text-[11px] mt-0.5 truncate"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
          {event.detail}
        </p>
        {/* status pill */}
        <div className="flex items-center gap-1 mt-1.5">
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: statusColor(event.status) }}
          />
          <span
            className="text-[9px] font-semibold uppercase tracking-wide"
            style={{ color: statusColor(event.status) }}
          >
            {event.status === "success"
              ? "Succès"
              : event.status === "warning"
              ? "Avertissement"
              : "Erreur"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── NotificationPanel ──────────────────────────────────────────────── */

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const events = useAuditStore((s) => s.events);
  const clearEvents = useAuditStore((s) => s.clearEvents);
  const { lastSeenAt, markAllSeen } = useNotificationStore();

  const unreadCount = lastSeenAt
    ? events.filter((e) => new Date(e.timestamp) > new Date(lastSeenAt)).length
    : events.length;

  const displayed = events.slice(0, 30);

  function handleOpen() {
    setOpen((v) => !v);
  }

  function handleMarkAll() {
    markAllSeen();
  }

  function handleClear() {
    clearEvents();
    markAllSeen();
    setOpen(false);
  }

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  /* mark seen when opened */
  useEffect(() => {
    if (open) markAllSeen();
  }, [open]);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell trigger */}
      <button
        onClick={handleOpen}
        className="relative w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-white/[0.06] active:bg-white/[0.08]"
        style={open ? { background: "rgba(255,255,255,0.07)" } : {}}
        aria-label="Notifications"
      >
        <Bell
          size={14}
          style={{ color: open ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}
        />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[6px] h-[6px] rounded-full flex items-center justify-center"
            style={{
              background: "#3b82f6",
              boxShadow: "0 0 6px rgba(59,130,246,0.9)",
            }}
          />
        )}
      </button>

      {/* Panel */}
      <div
        className="absolute right-0 top-[calc(100%+8px)] z-50 overflow-hidden"
        style={{
          width: 340,
          background: "hsl(240 14% 6%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset",
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform 180ms cubic-bezier(0.16,1,0.3,1), opacity 150ms ease",
          transformOrigin: "top right",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>
              Notifications
            </p>
            {unreadCount > 0 && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59,130,246,0.25)",
                }}
              >
                {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {events.length > 0 && (
              <>
                <button
                  onClick={handleMarkAll}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors hover:bg-white/[0.05]"
                  style={{ color: "rgba(255,255,255,0.30)" }}
                  title="Tout marquer comme lu"
                >
                  <CheckCheck size={11} />
                  Tout lire
                </button>
                <button
                  onClick={handleClear}
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-white/[0.05]"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                  title="Effacer tout"
                >
                  <X size={11} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: 380 }}
        >
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Inbox size={18} style={{ color: "rgba(255,255,255,0.20)" }} />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.30)" }}>
                  Aucune notification
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>
                  Les actions s'afficheront ici
                </p>
              </div>
            </div>
          ) : (
            displayed.map((event) => (
              <NotificationItem
                key={event.id}
                event={event}
                unread={
                  !lastSeenAt || new Date(event.timestamp) > new Date(lastSeenAt)
                }
              />
            ))
          )}
        </div>

        {/* Footer */}
        {events.length > 0 && (
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.20)" }}>
              {events.length} action{events.length > 1 ? "s" : ""} enregistrée{events.length > 1 ? "s" : ""}
            </span>
            <div
              className="flex items-center gap-1"
              style={{ color: "rgba(16,185,129,0.6)" }}
            >
              <CheckCircle2 size={9} />
              <span className="text-[9px] font-medium">Synchronisé</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
