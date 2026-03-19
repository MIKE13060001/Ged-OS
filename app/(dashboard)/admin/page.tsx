"use client";

import { ShieldCheck, Users, Activity, FileStack, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";

const auditLogs = [
  { action: "Document indexé", user: "G. Architect", time: "Il y a 2 min", status: "success" },
  { action: "Connexion réussie (MFA)", user: "M. Dupont", time: "Il y a 15 min", status: "success" },
  { action: "Tentative d'accès refusée", user: "Inconnu", time: "Il y a 1h", status: "error" },
  { action: "Export CSV généré", user: "L. Martin", time: "Il y a 2h", status: "warning" },
  { action: "Document supprimé", user: "G. Architect", time: "Il y a 3h", status: "success" },
];

export default function AdminPage() {
  return (
    <div className="p-8">
      <BlurFade>
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-2 flex items-center gap-3">
            <ShieldCheck size={36} className="text-primary" />
            Administration
          </h1>
          <p className="text-muted-foreground">Supervision, conformité RGPD et journal d&apos;audit</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Utilisateurs actifs", value: 12, color: "bg-blue-600" },
            { icon: FileStack, label: "Documents totaux", value: 342, color: "bg-violet-600" },
            { icon: Activity, label: "Actions ce mois", value: 1847, color: "bg-emerald-600" },
            { icon: AlertTriangle, label: "Alertes sécurité", value: 3, color: "bg-amber-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} className="border-border">
              <CardContent className="p-5">
                <div className={`p-2.5 rounded-xl w-fit mb-3 ${color}`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <NumberTicker value={value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Conformité RGPD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Chiffrement at-rest", value: 100, status: "OK" },
                { label: "Chiffrement in-transit", value: 100, status: "OK" },
                { label: "Journalisation complète", value: 98, status: "OK" },
                { label: "DPA signé", value: 100, status: "OK" },
                { label: "Droit à l'effacement", value: 85, status: "Partiel" },
              ].map(({ label, value, status }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-foreground">{label}</span>
                    <Badge variant={value === 100 ? "success" : "warning"} className="text-[10px]">
                      {status}
                    </Badge>
                  </div>
                  <Progress value={value} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Audit log */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Journal d&apos;audit récent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log, i) => (
                  <BlurFade key={i} delay={i * 0.05} inView>
                    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                      <div className="mt-0.5 shrink-0">
                        {log.status === "success" ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : log.status === "error" ? (
                          <AlertTriangle size={14} className="text-destructive" />
                        ) : (
                          <Clock size={14} className="text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.user} · {log.time}</p>
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </BlurFade>
    </div>
  );
}
