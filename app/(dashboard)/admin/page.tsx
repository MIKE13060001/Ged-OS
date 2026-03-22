"use client";

import {
  ShieldCheck,
  Users,
  Activity,
  FileStack,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useAuditStore } from "@/stores/auditStore";
import { useDocumentStore } from "@/stores/documentStore";
import { RoleGate, AccessDeniedBadge } from "@/components/auth/RoleGate";

const compliance = [
  { label: "Chiffrement at-rest", value: 100, status: "OK" },
  { label: "Chiffrement in-transit", value: 100, status: "OK" },
  { label: "Journalisation complète", value: 100, status: "OK" },
  { label: "DPA signé", value: 100, status: "OK" },
  { label: "Droit à l'effacement", value: 85, status: "Partiel" },
];

const statusConfig = {
  success: { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  error:   { icon: XCircle,      color: "#f87171", bg: "rgba(248,113,113,0.08)" },
  warning: { icon: Clock,        color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return `Il y a ${Math.floor(hrs / 24)}j`;
}

export default function AdminPage() {
  const { events, clearEvents } = useAuditStore();
  const { documents } = useDocumentStore();

  const stats = [
    { icon: Users,         label: "Utilisateurs actifs", value: 1,              color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)",  trend: "local" },
    { icon: FileStack,     label: "Documents totaux",    value: documents.length, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)",  trend: "réel" },
    { icon: Activity,      label: "Événements loggés",  value: events.length,   color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)",  trend: "réel" },
    { icon: AlertTriangle, label: "Erreurs",            value: events.filter(e => e.status === 'error').length, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", trend: "réel" },
  ];

  return (
    <RoleGate
      permission="viewAdmin"
      fallback={
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <AccessDeniedBadge message="Administration réservée aux administrateurs" />
        </div>
      }
    >
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div
        className="px-6 pt-6 pb-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <BlurFade>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <ShieldCheck size={14} className="text-amber-400" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Administration</h1>
          </div>
          <p className="text-[13px] ml-9" style={{ color: "rgba(255,255,255,0.4)" }}>
            Supervision, conformité RGPD et journal d&apos;audit en temps réel
          </p>
        </BlurFade>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <BlurFade>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(({ icon: Icon, label, value, color, bg, border, trend }, i) => (
              <BlurFade key={label} delay={i * 0.05} inView>
                <div
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    background: "hsl(240 12% 7%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: bg, border: `1px solid ${border}` }}
                    >
                      <Icon size={15} style={{ color }} />
                    </div>
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    <NumberTicker value={value} />
                  </div>
                  <p className="text-[11px] font-medium mt-1" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* RGPD Compliance */}
          <BlurFade delay={0.1} inView>
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "hsl(240 12% 7%)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-400" />
                  <span className="text-[13px] font-semibold text-white/90">Conformité RGPD</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
                >
                  <TrendingUp size={10} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400">97%</span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4 space-y-4">
                {compliance.map(({ label, value, status }) => {
                  const isOk = value === 100;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {isOk
                            ? <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                            : <Clock size={11} className="text-amber-400 shrink-0" />
                          }
                          <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {label}
                          </span>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: isOk ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                            color: isOk ? "#10b981" : "#f59e0b",
                          }}
                        >
                          {status}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${value}%`,
                            background: isOk
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : "linear-gradient(90deg, #f59e0b, #fcd34d)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BlurFade>

          {/* Audit log */}
          <BlurFade delay={0.15} inView>
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "hsl(240 12% 7%)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-blue-400" />
                  <span className="text-[13px] font-semibold text-white/90">Journal d&apos;audit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-emerald-400">En direct</span>
                  </div>
                  {events.length > 0 && (
                    <button
                      onClick={clearEvents}
                      className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-red-400"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      <Trash2 size={10} /> Vider
                    </button>
                  )}
                </div>
              </div>

              {/* Logs */}
              <div className="px-5 py-3 max-h-80 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Aucun événement enregistré. Importez un document pour commencer.
                    </p>
                  </div>
                ) : (
                  events.slice(0, 50).map((event, i) => {
                    const { icon: StatusIcon, color, bg } = statusConfig[event.status];
                    return (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 py-2.5"
                        style={{ borderBottom: i < Math.min(events.length, 50) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: bg }}
                        >
                          <StatusIcon size={11} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-white/85 truncate">{event.action}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                              {event.user}
                            </span>
                            <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                            <span className="text-[10px] font-mono truncate max-w-[120px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                              {event.detail}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
                          {timeAgo(event.timestamp)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
    </RoleGate>
  );
}
