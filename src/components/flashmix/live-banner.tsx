"use client";

import Image from "next/image";
import { Play, Pause, Heart, Share2, Cast, Volume2 } from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";
import { EqVisualizer } from "./eq-visualizer";
import { SoundWaves } from "./sound-waves";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export function LiveBanner() {
  const {
    nowPlaying,
    playback,
    togglePlay,
    liked,
    toggleLike,
    volume,
    setVolume,
  } = usePlayerStore();
  useAudioPlayer();

  if (!nowPlaying) {
    return (
      <div className="glass-red animate-pulse h-64 rounded-3xl" />
    );
  }

  const playing = playback === "playing";

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
    <section className="relative overflow-hidden rounded-3xl glass-red p-5 shadow-2xl">
      {/* Ondas no fundo */}
      <SoundWaves color="rgba(227,6,19,0.4)" count={4} />

      {/* Glow de fundo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(227,6,19,0.25) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(11,24,54,0.6) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Topo: status AO VIVO */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white glow-red">
            <span className="h-2 w-2 animate-pulse-live rounded-full bg-white" />
            Ao Vivo
          </div>
          <div className="text-xs uppercase tracking-widest text-white/60">
            {nowPlaying.streamName}
          </div>
        </div>

        {/* Logo + info */}
        <div className="mt-5 flex items-center gap-4">
          <div className="relative">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B1836] to-[#2a0408]">
              <div className="absolute inset-0 grid place-items-center p-2">
                <Image
                  src="/logo/flashmix-logo.png"
                  alt="Flash Mix Digital"
                  width={56}
                  height={38}
                  className={`object-contain ${playing ? "animate-spin-slower" : ""}`}
                />
              </div>
            </div>
            {/* Anel neon */}
            {playing && (
              <div className="pointer-events-none absolute -inset-1 rounded-3xl border-2 border-[#E30613]/60 animate-glow-pulse" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-[#E30613] font-bold">
              No Ar
            </p>
            <h2 className="truncate text-2xl font-bold text-white">
              {nowPlaying.title}
            </h2>
            <p className="truncate text-sm text-white/70">{nowPlaying.artist}</p>
            <div className="mt-2">
              <EqVisualizer bars={20} height={20} />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Tocar"}
            className="grid h-16 w-16 place-items-center rounded-full bg-[#E30613] text-white glow-red-strong hover:scale-105 active:scale-95 transition"
          >
            {playing ? (
              <Pause className="h-7 w-7" fill="currentColor" />
            ) : (
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLike}
              aria-label="Curtir"
              className="grid h-11 w-11 place-items-center rounded-full glass text-white/80 hover:text-white transition"
            >
              <Heart
                className={`h-5 w-5 ${liked ? "fill-[#E30613] text-[#E30613]" : ""}`}
              />
            </button>
            <button
              onClick={share}
              aria-label="Compartilhar"
              className="grid h-11 w-11 place-items-center rounded-full glass text-white/80 hover:text-white transition"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              aria-label="Chromecast"
              className="grid h-11 w-11 place-items-center rounded-full glass text-white/80 hover:text-white transition"
            >
              <Cast className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Volume */}
        <div className="mt-4 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-white/60" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#E30613]"
            aria-label="Volume"
          />
        </div>
      </div>
    </section>
  );
}
