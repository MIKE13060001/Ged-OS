"use client";

import { Mic, Clock, Play } from "lucide-react";
import { AudioRecorder } from "@/components/audio/AudioRecorder";
import { BlurFade } from "@/components/magicui/blur-fade";

const recentRecordings = [
  { title: "Réunion stratégie Q2", date: "14 Mars", time: "12:45", duration: "32:14", tags: ["stratégie", "Q2"] },
  { title: "Point Équipe Hebdo", date: "13 Mars", time: "09:00", duration: "18:07", tags: ["équipe"] },
  { title: "Interview Client Leblanc", date: "12 Mars", time: "15:30", duration: "45:22", tags: ["client", "vente"] },
];

export default function AudioPage() {
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
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <Mic size={14} className="text-violet-400" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Module Audio</h1>
          </div>
          <p className="text-[13px] ml-9" style={{ color: "rgba(255,255,255,0.4)" }}>
            Enregistrez, transcrivez et exploitez vos réunions — stockage souverain garanti.
          </p>
        </BlurFade>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Recorder section */}
        <div
          className="px-6 py-8 flex justify-center"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <BlurFade delay={0.05}>
            <AudioRecorder />
          </BlurFade>
        </div>

        {/* Recent recordings */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
            <h2 className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              Enregistrements récents
            </h2>
          </div>

          <div className="space-y-2">
            {recentRecordings.map((rec, i) => (
              <BlurFade key={rec.title} inView delay={i * 0.06}>
                <div
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer group transition-all duration-150"
                  style={{
                    background: "hsl(240 12% 7%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.background = "hsl(240 12% 8%)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.background = "hsl(240 12% 7%)";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)" }}
                  >
                    <Mic size={15} style={{ color: "#a78bfa" }} />
                    <div
                      className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(139,92,246,0.15)" }}
                    >
                      <Play size={14} className="text-violet-300" fill="currentColor" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white/90 truncate">{rec.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {rec.date} · {rec.time}
                      </span>
                      {rec.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                          style={{
                            background: "rgba(139,92,246,0.08)",
                            color: "rgba(167,139,250,0.7)",
                            border: "1px solid rgba(139,92,246,0.12)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <span
                    className="text-[13px] font-mono font-semibold tabular-nums shrink-0"
                    style={{ color: "rgba(167,139,250,0.8)" }}
                  >
                    {rec.duration}
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
