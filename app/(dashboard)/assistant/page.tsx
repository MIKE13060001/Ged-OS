"use client";

import { ChatInterface } from "@/components/assistant/ChatInterface";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Sparkles, Brain, Database, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "N1 – Recherche documentaire",
    desc: "Recherche sémantique, résumés et FAQ basés sur vos documents.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Database,
    title: "N2 – Traitement de données",
    desc: "Extraction, tableaux Excel, graphiques et rapports structurés.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "N3 – Actions validées",
    desc: "Emails, création de dossiers, intégrations API avec validation humaine.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function AssistantPage() {
  return (
    <div className="p-8 h-full flex flex-col">
      <BlurFade>
        <div className="mb-6">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-2 flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles size={22} className="text-primary" />
            </span>
            <AnimatedGradientText>Assistant GEDOS</AnimatedGradientText>
          </h1>
          <p className="text-muted-foreground">3 niveaux d&apos;intelligence : recherche, analyse, et action</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <Card key={title} className="border-border hover:border-primary/20 transition-all">
              <CardContent className="p-4">
                <div className={`p-2.5 rounded-xl w-fit mb-3 ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat interface */}
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </BlurFade>
    </div>
  );
}
