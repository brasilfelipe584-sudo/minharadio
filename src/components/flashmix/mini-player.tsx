"use client";

import Image from "next/image";
import { Play, Pause, ChevronUp, Heart } from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";
import { useRouter } from "next/navigation";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useState, useEffect } from "react";

export function MiniPlayer() {
  const router = useRouter();
  const { nowPlaying, playback, togglePlay, liked, toggleLike } = usePlayerStore();
  useAudioPlayer();
  const [mounted, setMounted] = useState(false);

  // Evita hidratação: sempre renderiza null no SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // No SSR e antes de montar, não renderiza nada
  if (!mounted || !nowPlaying) return null;

  const playing = playback === "playing";

  return (
    <div className="fixed bottom-[64px] left-0 right-0 z-30 px-2 pb-1 sm:px-4">
      <div className="mx-auto max-w-md sm:max-w-2xl">
        <div className="glass-red flex items-center gap-3 rounded-2xl p-2 shadow-2xl">
          {/* Capa / Logo */}
          <button
            onClick={() => router.push("/app/radio")}
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10"
            aria-label="Abrir player completo"
          >
            {nowPlaying.coverUrl ? (
              <img
                src={nowPlaying.coverUrl}
                alt={nowPlaying.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408]">
                <Image
                  src="/logo/flashmix-logo.png"
                  alt="Flash Mix"
                  width={28}
                  height={20}
                  className="object-contain"
                />
              </div>
            )}
            {playing && (
              <div className="absolute inset-0 grid place-items-center bg-black/30">
                <div className="flex items-end gap-[2px] h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="eq-bar"
                      style={{
                        width: 2,
                        height: "100%",
                        background: "#E30613",
                        animationDelay: `${i * 0.12}s`,
                        boxShadow: "0 0 4px #E30613",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </button>

          {/* Info */}
          <button
            onClick={() => router.push("/app/radio")}
            className="min-w-0 flex-1 text-left"
          >
            <p className="truncate text-sm font-semibold text-white">
              {nowPlaying.title}
            </p>
            <p className="truncate text-xs text-white/60">{nowPlaying.artist}</p>
          </button>

          {/* Like */}
          <button
            onClick={toggleLike}
            aria-label="Curtir"
            className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-[#E30613] text-[#E30613]" : ""}`}
            />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Tocar"}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#E30613] text-white glow-red hover:scale-105 active:scale-95 transition"
          >
            {playing ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
            )}
          </button>

          {/* Expandir */}
          <button
            onClick={() => router.push("/app/radio")}
            aria-label="Expandir"
            className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
