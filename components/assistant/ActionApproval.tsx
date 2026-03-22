"use client";

import React from "react";
import { Mail, FolderPlus, Plug, Check, X, AlertTriangle, ChevronRight } from "lucide-react";

export interface ActionPayload {
  type: "email" | "folder" | "api";
  explanation: string;
  payload: Record<string, string>;
}

interface ActionApprovalProps extends ActionPayload {
  onApprove: () => void;
  onReject: () => void;
}

const TYPE_META = {
  email: { icon: Mail, label: "Envoi d'email", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
  folder: { icon: FolderPlus, label: "Création de dossier", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  api: { icon: Plug, label: "Appel API externe", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.25)" },
};

export function ActionApproval({ type, explanation, payload, onApprove, onReject }: ActionApprovalProps) {
  const meta = TYPE_META[type] ?? TYPE_META.api;
  const Icon = meta.icon;

  return (
    <div
      className="mt-2.5 rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid rgba(245,158,11,0.15)", background: "rgba(245,158,11,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
          >
            <Icon size={11} style={{ color: meta.color }} />
          </div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Action N3 · {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <AlertTriangle size={10} />
          <span className="text-[10px] font-semibold">Approbation requise</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2.5">
        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          {explanation}
        </p>

        {/* Payload */}
        <div
          className="rounded-lg px-3 py-2 text-[10px] font-mono space-y-1"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {Object.entries(payload).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="uppercase shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{k}</span>
              <ChevronRight size={9} className="shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }} />
              <span className="break-all" style={{ color: "rgba(255,255,255,0.7)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
          >
            <X size={12} />
            Rejeter
          </button>
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[11px] font-bold transition-all hover:opacity-90"
            style={{ background: "#f59e0b", color: "#000" }}
          >
            <Check size={12} />
            Approuver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionApproval;
