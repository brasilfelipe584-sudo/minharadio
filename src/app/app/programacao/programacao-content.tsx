"use client";

import { useRouter } from "next/navigation";
import { Mic2, Clock, Calendar, User, Radio } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

type Programa = {
  id: string; title: string; description?: string | null;
  imageUrl?: string | null; startTime: string; endTime: string; isLive: boolean;
  locutor?: { name: string; avatarUrl?: string | null; instagram?: string | null } | null;
};
type Locutor = { id: string; name: string; avatarUrl?: string | null; bio?: string | null };

// Converte "HH:MM" para minutos desde meia-noite
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Pega hora atual em São Paulo em minutos
function getCurrentMinutesSP(): number {
  const now = new Date();
  const spTime = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const [h, m] = spTime.split(":").map(Number);
  return h * 60 + m;
}

// Pega o dia da semana atual em São Paulo (0=Dom, 6=Sáb)
function getCurrentDaySP(): number {
  const now = new Date();
  const spDay = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
  }).format(now);
  const map: Record<string, number> = {
    "dom": 0, "domingo": 0,
    "seg": 1, "segunda": 1,
    "ter": 2, "terça": 2,
    "qua": 3, "quarta": 3,
    "qui": 4, "quinta": 4,
    "sex": 5, "sexta": 5,
    "sáb": 6, "sabado": 6, "sábado": 6,
  };
  return map[spDay.toLowerCase()] ?? new Date().getDay();
}

// Verifica se um programa está ao vivo agora
function isProgramLive(p: Programa): boolean {
  const current = getCurrentMinutesSP();
  const start = timeToMinutes(p.startTime);
  let end = timeToMinutes(p.endTime);
  if (p.endTime === "23:59") end = 1440;
  if (end <= start) end = 1440;
  return current >= start && current < end;
}

// Calcula progresso do programa ao vivo (0-100%)
function getLiveProgress(p: Programa): number {
  const current = getCurrentMinutesSP();
  const start = timeToMinutes(p.startTime);
  let end = timeToMinutes(p.endTime);
  if (p.endTime === "23:59") end = 1440;
  if (end <= start) end = 1440;
  const total = end - start;
  const elapsed = current - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// Tempo restante formatado
function getRemainingTime(p: Programa): string {
  const current = getCurrentMinutesSP();
  let end = timeToMinutes(p.endTime);
  if (p.endTime === "23:59") end = 1440;
  const remaining = end - current;
  if (remaining <= 0) return "Encerrado";
  const h = Math.floor(remaining / 60);
  const m = remaining % 60;
  if (h > 0) return `Termina em ${h}h${m.toString().padStart(2, "0")}min`;
  return `Termina em ${m}min`;
}

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
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDaySP, setCurrentDaySP] = useState<number>(diaAtual);
  const [tick, setTick] = useState(0); // força re-render
  const liveRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  // Atualiza o horário e força re-render (sem recarregar a página) a cada 30 segundos
  // IMPORTANTE: não usa router.refresh() para não interromper o player de áudio
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const spTime = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setCurrentTime(spTime);
      // Força re-render para recalcular qual programa está ao vivo
      // Isso NÃO recarrega a página, apenas atualiza os componentes
      setTick(t => t + 1);
    };

    // Atualiza imediatamente
    update();

    // Atualiza a cada 30 segundos
    const interval = setInterval(update, 30000);

    // Também atualiza quando a aba volta a ficar visível
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        update();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Auto-scroll para o programa ao vivo
  useEffect(() => {
    if (hasScrolled.current) return;
    if (tab !== "hoje" && tab !== "semana") return;
    const liveProgram = programas.find((p) => isProgramLive(p));
    if (liveProgram && liveRef.current) {
      setTimeout(() => {
        liveRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        hasScrolled.current = true;
      }, 500);
    }
  }, [programas, tab, tick]);

  const isToday = diaAtual === currentDaySP;
  const liveProgram = isToday ? programas.find((p) => isProgramLive(p)) : null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Programação</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-white/60">Confira a grade completa da Flash Mix Digital</p>
          {currentTime && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
              <Clock className="h-3 w-3 text-[#E30613]" />
              {currentTime}
            </span>
          )}
        </div>
      </header>

      {/* Card AO VIVO agora (se hoje) */}
      {liveProgram && (tab === "hoje" || tab === "semana") && (
        <div className="glass-red rounded-3xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            background: "radial-gradient(circle at 30% 50%, rgba(227,6,19,0.5) 0%, transparent 70%)"
          }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white glow-red">
                <span className="h-2 w-2 animate-pulse-live rounded-full bg-white" />
                Ao Vivo Agora
              </div>
              <span className="text-xs text-white/60">{getRemainingTime(liveProgram)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E30613]/60">
                {liveProgram.imageUrl ? (
                  <img src={liveProgram.imageUrl} alt={liveProgram.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-[#E30613]">
                    <Radio className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white truncate">{liveProgram.title}</h3>
                {liveProgram.locutor && (
                  <p className="text-xs text-white/60 truncate">com {liveProgram.locutor.name}</p>
                )}
                <p className="text-xs font-medium text-[#E30613]">
                  {liveProgram.startTime} - {liveProgram.endTime}
                </p>
              </div>
            </div>
            {/* Barra de progresso */}
            <div className="mt-3">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[#E30613] glow-red transition-all duration-1000"
                  style={{ width: `${getLiveProgress(liveProgram)}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[10px] text-white/40">
                {Math.round(getLiveProgress(liveProgram))}% concluído
              </p>
            </div>
          </div>
        </div>
      )}

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
            programas.map((p) => {
              const live = isToday && isProgramLive(p);
              const isPast = isToday && timeToMinutes(p.endTime) < getCurrentMinutesSP() && !live;
              const isUpcoming = isToday && timeToMinutes(p.startTime) > getCurrentMinutesSP();
              return (
                <div
                  key={p.id}
                  ref={live ? liveRef : null}
                  className={`relative overflow-hidden rounded-2xl glass p-4 transition-all duration-500 ${
                    live ? "border-[#E30613]/60 glow-red scale-[1.02]" : isPast ? "opacity-50" : ""
                  }`}
                >
                  {live && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                      background: "linear-gradient(135deg, rgba(227,6,19,0.3) 0%, transparent 50%)"
                    }} />
                  )}
                  <div className="relative flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-[#E30613]">
                          <Mic2 className="h-6 w-6" />
                        </div>
                      )}
                      {live && (
                        <div className="absolute inset-0 grid place-items-center bg-[#E30613]/50">
                          <span className="rounded-full bg-[#E30613] px-2 py-0.5 text-[9px] font-bold uppercase text-white glow-red">
                            <span className="inline-block h-1.5 w-1.5 animate-pulse-live rounded-full bg-white mr-1" />
                            Ao Vivo
                          </span>
                        </div>
                      )}
                      {isPast && (
                        <div className="absolute top-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white/60">
                          Encerrado
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white">{p.title}</h3>
                      {p.locutor && (
                        <p className="text-xs text-white/60">com {p.locutor.name}</p>
                      )}
                      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                        live ? "text-[#E30613]" : isPast ? "text-white/40" : "text-white/60"
                      }`}>
                        <Clock className="h-3 w-3" />
                        {p.startTime} - {p.endTime}
                        {live && <span className="ml-1">• {getRemainingTime(p)}</span>}
                        {isUpcoming && <span className="ml-1 text-white/40">• Em breve</span>}
                      </p>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-white/60">{p.description}</p>
                      )}
                      {/* Barra de progresso para programa ao vivo */}
                      {live && (
                        <div className="mt-2">
                          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full bg-[#E30613] glow-red transition-all duration-1000"
                              style={{ width: `${getLiveProgress(p)}%` }}
                            />
                          </div>
                          <p className="mt-0.5 text-right text-[9px] text-white/40">
                            {Math.round(getLiveProgress(p))}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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
