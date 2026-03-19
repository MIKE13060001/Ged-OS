"use client";

import { Mic, Clock } from "lucide-react";
import { AudioRecorder } from "@/components/audio/AudioRecorder";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";

const recentRecordings = [
  { title: "Dernière Réunion", date: "14 Mars", time: "12:45", duration: "32:14" },
  { title: "Point Équipe", date: "13 Mars", time: "09:00", duration: "18:07" },
  { title: "Interview Client", date: "12 Mars", time: "15:30", duration: "45:22" },
];

export default function AudioPage() {
  return (
    <div className="p-8 flex flex-col items-center">
      <BlurFade className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">
            Module Audio
          </h1>
          <p className="text-muted-foreground">
            Enregistrez, transcrivez et exploitez vos réunions avec l&apos;IA — stockage souverain garanti.
          </p>
        </div>

        {/* Recorder */}
        <div className="flex justify-center mb-10">
          <AudioRecorder />
        </div>

        {/* Recent recordings */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Enregistrements récents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRecordings.map((rec) => (
              <BlurFade key={rec.title} inView delay={0.1}>
                <Card className="border-border hover:border-primary/30 transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-3 text-primary group-hover:scale-110 transition-transform">
                      <Mic size={20} />
                    </div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{rec.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {rec.date} · {rec.time}
                      </p>
                      <span className="text-xs font-mono text-muted-foreground">{rec.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
