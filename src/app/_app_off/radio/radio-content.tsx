"use client";

import Image from "next/image";
import {
  Play, Pause, Heart, Share2, Cast, Bluetooth, Moon, Volume2, Clock, Radio as RadioIcon, ChevronLeft, Settings2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/lib/player-store";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { EqVisualizer } from "@/components/flashmix/eq-visualizer";
import { SoundWaves } from "@/components/flashmix/sound-waves";

type Musica = { id: string; title: string; artist: string; coverUrl?: string | null; playedAt: string };

export function RadioContent({ historico }: { historico: Musica[] }) {
  const router = useRouter();
  const {
    nowPlaying, playback, togglePlay, liked, toggleLike,
    volume, setVolume, sleepTimerMin, startSleepTimer, cancelSleepTimer,
  } = usePlayerStore();
  useAudioPlayer();

  const [showSleepOpts, setShowSleepOpts] = useState(false);
  const playing = playback === "playing";

  if (!nowPlaying) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-white/60">Carregando rádio...</div>
      </div>
    );
  }

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Flash Mix Digital",
          text: `Ouvindo ${nowPlaying.title} - ${nowPlaying.artist}`,
          url: window.location.href,
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Voltar */}
      <button
        onClick={() => router.push("/app")}
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </button>

      {/* Player gigante */}
      <section className="relative overflow-hidden rounded-3xl glass-red p-6 shadow-2xl">
        <SoundWaves color="rgba(227,6,19,0.5)" count={5} />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(227,6,19,0.25) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          {/* Logo circular com neon */}
          <div className="relative">
            {/* Anéis neon girando */}
            {playing && (
              <>
                <div className="pointer-events-none absolute -inset-3 rounded-full border-2 border-[#E30613]/30 animate-spin-slow" />
                <div className="pointer-events-none absolute -inset-6 rounded-full border border-[#E30613]/20 animate-spin-slower" />
                <div className="pointer-events-none absolute -inset-2 rounded-full border-2 border-[#E30613]/60 animate-glow-pulse" />
              </>
            )}

            <div className="relative h-44 w-44 overflow-hidden rounded-full border-2 border-[#E30613]/60 bg-gradient-to-br from-[#0B1836] via-[#1a0408] to-[#090909]">
              <div className="absolute inset-0 grid place-items-center p-8">
                <Image
                  src="/logo/flashmix-logo.png"
                  alt="Flash Mix Digital"
                  width={140}
                  height={96}
                  className={`object-contain ${playing ? "animate-spin-slower" : ""}`}
                  priority
                />
              </div>
            </div>

            {/* Equalizer sobreposto */}
            {playing && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#E30613] px-3 py-1 glow-red">
                <EqVisualizer bars={6} height={12} barColor="#FFFFFF" />
              </div>
            )}
          </div>

          {/* Status AO VIVO */}
          {nowPlaying.isLive && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E30613] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white glow-red">
              <span className="h-2 w-2 animate-pulse-live rounded-full bg-white" />
              Ao Vivo
            </div>
          )}

          {/* Info da música */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white">{nowPlaying.title}</h1>
            <p className="text-sm text-white/70">{nowPlaying.artist}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
              {nowPlaying.streamName}
            </p>
          </div>

          {/* Botão Play gigante */}
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Tocar"}
            className="mt-6 grid h-20 w-20 place-items-center rounded-full bg-[#E30613] text-white glow-red-strong hover:scale-105 active:scale-95 transition"
          >
            {playing ? (
              <Pause className="h-9 w-9" fill="currentColor" />
            ) : (
              <Play className="h-9 w-9 translate-x-1" fill="currentColor" />
            )}
          </button>
        </div>
      </section>

      {/* Controles secundários */}
      <section className="grid grid-cols-4 gap-2">
        {[
          { icon: Heart, label: "Curtir", active: liked, onClick: toggleLike },
          { icon: Share2, label: "Share", onClick: share },
          { icon: Cast, label: "Cast" },
          { icon: Bluetooth, label: "Bluetooth" },
        ].map((b, i) => {
          const Icon = b.icon;
          return (
            <button
              key={i}
              onClick={b.onClick}
              className={`flex flex-col items-center gap-1.5 rounded-2xl glass p-3 transition hover:border-[#E30613]/40 ${
                b.active ? "text-[#E30613]" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${b.active ? "fill-[#E30613]" : ""}`} />
              <span className="text-[10px] uppercase tracking-wider">{b.label}</span>
            </button>
          );
        })}
      </section>

      {/* Volume + Sleep Timer */}
      <section className="glass space-y-4 rounded-3xl p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
              <Volume2 className="h-4 w-4" /> Volume
            </label>
            <span className="text-xs text-white/60">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#E30613]"
            aria-label="Volume"
          />
        </div>

        <div>
          <button
            onClick={() => setShowSleepOpts(!showSleepOpts)}
            className="mb-2 flex w-full items-center justify-between text-xs uppercase tracking-widest text-white/60 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Moon className="h-4 w-4" /> Sleep Timer
            </span>
            <span className={sleepTimerMin > 0 ? "text-[#E30613]" : ""}>
              {sleepTimerMin > 0 ? `${sleepTimerMin} min` : "Off"}
            </span>
          </button>
          {showSleepOpts && (
            <div className="flex flex-wrap gap-2">
              {[0, 15, 30, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  onClick={() => (m === 0 ? cancelSleepTimer() : startSleepTimer(m))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    sleepTimerMin === m
                      ? "bg-[#E30613] text-white glow-red"
                      : "border border-white/15 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {m === 0 ? "Desligar" : `${m} min`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <Settings2 className="h-3 w-3" /> Qualidade: Auto
          </span>
          <span>Velocidade: 1x</span>
        </div>
      </section>

      {/* Histórico */}
      {historico.length > 0 && (
        <section>
          <h3 className="mb-3 px-1 text-base font-bold uppercase tracking-wide text-white">
            Histórico
          </h3>
          <div className="space-y-2">
            {historico.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-2xl p-2 hover:bg-white/5 transition"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  {m.coverUrl ? (
                     
                    <img src={m.coverUrl} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-white/40">
                      <RadioIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{m.title}</p>
                  <p className="truncate text-xs text-white/60">{m.artist}</p>
                </div>
                <div className="text-right text-xs text-white/40">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {new Date(m.playedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
