"use client";

import { Settings, Shield, Bell, Globe, Palette, Database, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/magicui/blur-fade";

const sections = [
  {
    icon: Shield,
    title: "Sécurité & Authentification",
    desc: "MFA, SSO, politiques de mots de passe",
    status: "Configuré",
    variant: "success" as const,
  },
  {
    icon: Bell,
    title: "Notifications",
    desc: "Alertes email, webhooks, résumés",
    status: "Actif",
    variant: "success" as const,
  },
  {
    icon: Globe,
    title: "Langue & Région",
    desc: "Français (FR), fuseau Europe/Paris",
    status: "FR",
    variant: "info" as const,
  },
  {
    icon: Palette,
    title: "Apparence",
    desc: "Thème sombre, densité d'interface",
    status: "Sombre",
    variant: "secondary" as const,
  },
  {
    icon: Database,
    title: "Stockage & Rétention",
    desc: "Politique de conservation, archivage RGPD",
    status: "7 ans",
    variant: "warning" as const,
  },
  {
    icon: Users,
    title: "Équipe & Accès",
    desc: "Gestion des membres, invitations, RBAC",
    status: "3 membres",
    variant: "info" as const,
  },
];

export default function SettingsPage() {
  return (
    <div className="p-8">
      <BlurFade>
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-2 flex items-center gap-3">
            <Settings size={36} className="text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Configuration générale de votre espace GEDOS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(({ icon: Icon, title, desc, status, variant }, i) => (
            <BlurFade key={title} delay={i * 0.05} inView>
              <Card className="border-border hover:border-primary/30 transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <Badge variant={variant}>{status}</Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Separator className="mb-3" />
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary w-full justify-start p-0 h-auto font-semibold">
                    Configurer →
                  </Button>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </BlurFade>
    </div>
  );
}
