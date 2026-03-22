"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Globe, Palette, Database, Users, ChevronRight } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    id: "security",
    icon: Shield,
    title: "Sécurité & Authentification",
    desc: "MFA, SSO, politiques de mots de passe et sessions",
    status: "Configuré",
    statusType: "success" as const,
    color: "#3b82f6",
    settings: [
      { label: "Authentification multi-facteurs (MFA)", value: "Activé", toggle: true, active: true },
      { label: "Single Sign-On (SSO)", value: "SAML 2.0", toggle: false },
      { label: "Durée de session", value: "8 heures", toggle: false },
      { label: "Tentatives de connexion max", value: "5 essais", toggle: false },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    desc: "Alertes email, webhooks et résumés périodiques",
    status: "Actif",
    statusType: "success" as const,
    color: "#10b981",
    settings: [
      { label: "Alertes email en temps réel", value: "Activé", toggle: true, active: true },
      { label: "Webhooks sortants", value: "2 endpoints", toggle: false },
      { label: "Résumé hebdomadaire", value: "Lundi 09:00", toggle: false },
    ],
  },
  {
    id: "language",
    icon: Globe,
    title: "Langue & Région",
    desc: "Langue d'interface, fuseau horaire et formats",
    status: "FR",
    statusType: "info" as const,
    color: "#8b5cf6",
    settings: [
      { label: "Langue d'interface", value: "Français (FR)", toggle: false },
      { label: "Fuseau horaire", value: "Europe/Paris (UTC+1)", toggle: false },
      { label: "Format de date", value: "DD/MM/YYYY", toggle: false },
    ],
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Apparence",
    desc: "Thème, densité et préférences visuelles",
    status: "Sombre",
    statusType: "secondary" as const,
    color: "#6366f1",
    settings: [
      { label: "Thème", value: "Sombre (forcé)", toggle: false },
      { label: "Densité d'interface", value: "Compacte", toggle: false },
      { label: "Animations réduites", value: "Désactivé", toggle: true, active: false },
    ],
  },
  {
    id: "storage",
    icon: Database,
    title: "Stockage & Rétention",
    desc: "Politique de conservation et archivage RGPD",
    status: "7 ans",
    statusType: "warning" as const,
    color: "#f59e0b",
    settings: [
      { label: "Durée de rétention", value: "7 ans (RGPD)", toggle: false },
      { label: "Archivage automatique", value: "Activé après 1 an", toggle: true, active: true },
      { label: "Chiffrement at-rest", value: "AES-256", toggle: false },
    ],
  },
  {
    id: "team",
    icon: Users,
    title: "Équipe & Accès",
    desc: "Membres, invitations et contrôle d'accès (RBAC)",
    status: "3 membres",
    statusType: "info" as const,
    color: "#ec4899",
    settings: [
      { label: "Membres actifs", value: "3 utilisateurs", toggle: false },
      { label: "Invitations en attente", value: "1 invitation", toggle: false },
      { label: "Domaine vérifié", value: "@gedos.fr", toggle: false },
    ],
  },
];

const statusColors = {
  success: { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.2)" },
  info: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  warning: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  secondary: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.1)" },
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("security");

  const current = sections.find((s) => s.id === activeSection)!;
  const statusStyle = statusColors[current.statusType];

  return (
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
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Settings size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Paramètres</h1>
          </div>
          <p className="text-[13px] ml-9" style={{ color: "rgba(255,255,255,0.4)" }}>
            Configuration générale de votre espace GEDOS
          </p>
        </BlurFade>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left nav */}
        <div
          className="w-56 shrink-0 py-3 px-2 space-y-0.5 overflow-y-auto"
          style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          {sections.map(({ id, icon: Icon, title, statusType }) => {
            const active = activeSection === id;
            const dot = statusColors[statusType];
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150"
                style={{
                  background: active ? "rgba(255,255,255,0.07)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.09)" : "1px solid transparent",
                  color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                }}
              >
                <Icon size={14} style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                <span className="text-[12px] font-medium flex-1 truncate">{title}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: dot.color }}
                />
              </button>
            );
          })}
        </div>

        {/* Right content */}
        <div className="flex-1 overflow-y-auto p-6">
          <BlurFade key={activeSection}>
            <div>
              {/* Section header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${current.color}12`,
                      border: `1px solid ${current.color}25`,
                    }}
                  >
                    <current.icon size={17} style={{ color: current.color }} />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-white">{current.title}</h2>
                    <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {current.desc}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  {current.status}
                </div>
              </div>

              {/* Settings items */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {current.settings.map((setting, i) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between px-5 py-4 group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    style={{
                      borderBottom: i < current.settings.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                        {setting.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
                        {setting.value}
                      </span>
                      {setting.toggle !== undefined ? (
                        <div
                          className="w-8 h-4.5 rounded-full relative transition-colors"
                          style={{
                            background: ("active" in setting && setting.active) ? current.color : "rgba(255,255,255,0.1)",
                            width: "32px",
                            height: "18px",
                          }}
                        >
                          <div
                            className="absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all"
                            style={{
                              left: ("active" in setting && setting.active) ? "calc(100% - 18px)" : "2px",
                              width: "14px",
                              height: "14px",
                            }}
                          />
                        </div>
                      ) : (
                        <ChevronRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save button */}
              <div className="flex items-center gap-2 mt-5">
                <button
                  className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90"
                  style={{
                    background: current.color,
                    boxShadow: `0 0 0 1px ${current.color}50, 0 4px 12px ${current.color}25`,
                  }}
                >
                  Sauvegarder
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 hover:bg-white/[0.06]"
                  style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
