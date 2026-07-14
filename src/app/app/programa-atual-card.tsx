"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

type Programa = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  locutor?: { name: string } | null;
};

type ProgramaComStatus = Programa & {
  isLive: boolean;
  isPast: boolean;
  isUpcoming: boolean;
  progress: number;
  remaining: string;
};

// Converte "HH:MM" para minutos
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

// Calcula status de um programa baseado no horário atual
function getProgramStatus(p: Programa) {
  const current = getCurrentMinutesSP();
  const start = timeToMinutes(p.startTime);
  let end = timeToMinutes(p.endTime);
  if (p.endTime === "23:59") end = 1440;
  if (end <= start) end = 1440;

  const isLive = current >= start && current < end;
  const isPast = current >= end;
  const isUpcoming = current < start;

  const total = end - start;
  const elapsed = current - start;
  const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

  const remaining = end - current;
  let remainingText = "";
  if (remaining > 0 && isLive) {
    const h = Math.floor(remaining / 60);
    const m = remaining % 60;
    if (h > 0) remainingText = `Termina em ${h}h${m.toString().padStart(2, "0")}min`;
    else remainingText = `Termina em ${m}min`;
  }

  return { isLive, isPast, isUpcoming, progress, remaining: remainingText };
}

export function ProgramaAtualCard({ programas }: { programas: Programa[] }) {
  const [tick, setTick] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  // Atualiza a cada 30 segundos (sem recarregar a página)
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
      setTick((t) => t + 1);
    };

    update();
    const interval = setInterval(update, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") update();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!programas || programas.length === 0) return null;

  // Encontra o programa ao vivo
  const programasComStatus = programas.map((p) => ({ ...p, ...getProgramStatus(p) }));
  const programaAtual = programasComStatus.find((p) => p.isLive);
  const proximoPrograma = programasComStatus.find((p) => p.isUpcoming);

  // Se há um programa ao vivo, mostra ele
  if (programaAtual) {
    return (
      <section className="glass-red rounded-3xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: "radial-gradient(circle at 30% 50%, rgba(227,6,19,0.5) 0%, transparent 70%)"
        }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white glow-red">
              <span className="h-2 w-2 animate-pulse-live rounded-full bg-white" />
              Programa Atual
            </div>
            {currentTime && (
              <span className="text-xs text-white/60">{currentTime}</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="mt-1 truncate text-lg font-bold text-white">{programaAtual.title}</h3>
              <p className="truncate text-sm text-white/60">
                <Clock className="mr-1 inline h-3 w-3" />
                {programaAtual.startTime} - {programaAtual.endTime}
                {programaAtual.locutor && ` • ${programaAtual.locutor.name}`}
              </p>
              <p className="mt-1 text-xs font-medium text-[#E30613]">
                {programaAtual.remaining}
              </p>
              {/* Barra de progresso */}
              <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#E30613] glow-red transition-all duration-1000"
                    style={{ width: `${programaAtual.progress}%` }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[9px] text-white/40">
                  {Math.round(programaAtual.progress)}% concluído
                </p>
              </div>
            </div>
            <Link
              href="/app/programacao"
              className="shrink-0 rounded-full border border-[#E30613]/50 bg-[#E30613]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#E30613] hover:bg-[#E30613]/20 transition"
            >
              Ver Programação
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Se não há programa ao vivo, mostra o próximo
  if (proximoPrograma) {
    return (
      <section className="glass rounded-3xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/60">
            <Clock className="h-3 w-3" />
            Próximo Programa
          </div>
          {currentTime && (
            <span className="text-xs text-white/60">{currentTime}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="mt-1 truncate text-lg font-bold text-white">{proximoPrograma.title}</h3>
            <p className="truncate text-sm text-white/60">
              <Clock className="mr-1 inline h-3 w-3" />
              {proximoPrograma.startTime} - {proximoPrograma.endTime}
              {proximoPrograma.locutor && ` • ${proximoPrograma.locutor.name}`}
            </p>
            <p className="mt-1 text-xs text-white/40">
              Inicia em breve
            </p>
          </div>
          <Link
            href="/app/programacao"
            className="shrink-0 rounded-full border border-[#E30613]/50 bg-[#E30613]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#E30613] hover:bg-[#E30613]/20 transition"
          >
            Ver Programação
          </Link>
        </div>
      </section>
    );
  }

  // Se todos os programas já acabaram
  return (
    <section className="glass rounded-3xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
            Programação de hoje encerrada
          </p>
          <h3 className="mt-1 truncate text-lg font-bold text-white/60">
            Volte amanhã! 🎵
          </h3>
        </div>
        <Link
          href="/app/programacao"
          className="shrink-0 rounded-full border border-[#E30613]/50 bg-[#E30613]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#E30613] hover:bg-[#E30613]/20 transition"
        >
          Ver Programação
        </Link>
      </div>
    </section>
  );
}
