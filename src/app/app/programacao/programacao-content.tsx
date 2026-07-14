"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mic2, Clock, Calendar, User } from "lucide-react";
import { useState } from "react";

type Programa = {
  id: string; title: string; description?: string | null;
  imageUrl?: string | null; startTime: string; endTime: string; isLive: boolean;
  locutor?: { name: string; avatarUrl?: string | null; instagram?: string | null } | null;
};
type Locutor = { id: string; name: string; avatarUrl?: string | null; bio?: string | null };

export function ProgramacaoContent({
  programas, locutores, diaAtual, dias,
}: {
  programas: Programa[];
  locutores: Locutor[];
  diaAtual: number;
  dias: string[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"hoje" | "semana" | "locutores">("hoje");

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Programação</h1>
        <p className="text-sm text-white/60">Confira a grade completa da Flash Mix Digital</p>
      </header>

      {/* Tabs */}
      <div className="flex rounded-full bg-white/5 p-1">
        {[
          { id: "hoje", label: "Hoje" },
          { id: "semana", label: "Semana" },
          { id: "locutores", label: "Locutores" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
              tab === t.id ? "bg-[#E30613] text-white glow-red" : "text-white/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Seleção de dia */}
      {(tab === "hoje" || tab === "semana") && (
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
          {dias.map((d, i) => (
            <button
              key={i}
              onClick={() => router.push(`/app/programacao?dia=${i}`)}
              className={`shrink-0 flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition ${
                diaAtual === i
                  ? "bg-[#E30613] text-white glow-red"
                  : "border border-white/15 text-white/70 hover:bg-white/5"
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest">{d}</span>
              <span className="text-base font-bold">{getDayNumber(i)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Conteúdo */}
      {tab === "locutores" ? (
        <div className="grid grid-cols-2 gap-3">
          {locutores.map((l) => (
            <div key={l.id} className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#E30613]/40">
                {l.avatarUrl ? (
                   
                  <img src={l.avatarUrl} alt={l.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-[#E30613]">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              <p className="font-semibold text-white">{l.name}</p>
              {l.bio && <p className="line-clamp-2 text-xs text-white/60">{l.bio}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {programas.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/50">Nenhum programa para este dia.</p>
          ) : (
            programas.map((p) => (
              <div
                key={p.id}
                className={`relative overflow-hidden rounded-2xl glass p-4 transition ${
                  p.isLive ? "border-[#E30613]/60 glow-red" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    {p.imageUrl ? (
                       
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-[#E30613]">
                        <Mic2 className="h-6 w-6" />
                      </div>
                    )}
                    {p.isLive && (
                      <div className="absolute inset-0 grid place-items-center bg-[#E30613]/40">
                        <span className="rounded-full bg-[#E30613] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                          Ao Vivo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white">{p.title}</h3>
                    {p.locutor && (
                      <p className="text-xs text-white/60">com {p.locutor.name}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#E30613]">
                      <Clock className="h-3 w-3" />
                      {p.startTime} - {p.endTime}
                    </p>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-white/60">{p.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function getDayNumber(i: number) {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() - now.getDay() + i);
  return d.getDate();
}
