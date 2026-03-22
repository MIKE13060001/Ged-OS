"use client";

import { Mic, Clock, Play } from "lucide-react";
import { AudioRecorder } from "@/components/audio/AudioRecorder";
import { BlurFade } from "@/components/magicui/blur-fade";

const recentRecordings = [
  { title: "Réunion stratégie Q2", date: "14 Mars", time: "12:45", duration: "32:14" },
  { title: "Point Équipe Hebdo", date: "13 Mars", time: "09:00", duration: "18:07" },
  { title: "Interview Client Leblanc", date: "12 Mars", time: "15:30", duration: "45:22" },
];

export default function AudioPage() {
  return (
    <div className="p-7">
      <BlurFade>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">
            Module Audio
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Enregistrez, transcrivez et exploitez vos réunions — stockage souverain garanti.
          </p>
        </div>

        {/* Recorder */}
        <div className="flex justify-center mb-10">
          <AudioRecorder />
        </div>

        {/* Recent recordings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: "rgba(99,102,241,0.8)" }} />
            <h2 className="text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
              Enregistrements récents
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRecordings.map((rec, i) => (
              <BlurFade key={rec.title} inView delay={i * 0.08}>
                <div
                  className="p-5 rounded-2xl cursor-pointer group relative overflow-hidden transition-all duration-200"
                  style={{
                    background: "hsl(240 12% 7%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 30% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <Mic size={16} style={{ color: "#818cf8" }} />
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <Play size={12} className="text-white/60" />
                    </div>
                  </div>

                  <h4 className="text-[13px] font-semibold text-white/90 mb-1 truncate relative z-10">{rec.title}</h4>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {rec.date} · {rec.time}
                    </span>
                    <span className="text-[11px] font-mono font-bold" style={{ color: "rgba(129,140,248,0.8)" }}>
                      {rec.duration}
                    </span>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
