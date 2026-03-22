"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        router.push("/documents");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isConfigured) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "hsl(240 12% 5%)" }}
      >
        <div
          className="rounded-2xl p-8 max-w-sm w-full text-center"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <AlertCircle size={32} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-white font-semibold mb-2">Supabase non configuré</h2>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            Ajoutez <code className="text-amber-400">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
            <code className="text-amber-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans votre fichier{" "}
            <code className="text-amber-400">.env.local</code>.
          </p>
          <button
            onClick={() => router.push("/documents")}
            className="mt-6 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Continuer sans auth →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "hsl(240 12% 5%)" }}
    >
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            <Sparkles size={18} className="text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">GEDOS</h1>
          <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Gestion Documentaire Intelligente
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex rounded-lg overflow-hidden mb-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className="flex-1 py-2 text-[12px] font-semibold transition-all"
                style={{
                  color: mode === m ? "white" : "rgba(255,255,255,0.35)",
                  background: mode === m ? "#3b82f6" : "transparent",
                }}
              >
                {m === "login" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div
              className="flex items-center gap-2.5 rounded-xl px-3 h-10"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Mail size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }}
              />
            </div>

            {/* Password */}
            <div
              className="flex items-center gap-2.5 rounded-xl px-3 h-10"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Lock size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
              >
                <AlertCircle size={12} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl text-[13px] font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "#3b82f6" }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer le compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
