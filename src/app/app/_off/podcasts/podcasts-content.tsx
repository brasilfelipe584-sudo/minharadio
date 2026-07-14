"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Play, Download, Heart, Mic2 } from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";
import { useAudioPlayer } from "@/hooks/use-audio-player";

type Podcast = {
  id: string; title: string; description?: string | null;
  imageUrl?: string | null; audioUrl?: string | null; duration?: number | null;
  category?: string | null; episode?: number | null; season?: number | null;
};

export function PodcastsContent({
  podcasts, categorias, currentCategory,
}: {
  podcasts: Podcast[];
  categorias: string[];
  currentCategory: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const { setNowPlaying, togglePlay, playback, appendHistory } = usePlayerStore();
  useAudioPlayer();

  const setCategory = (c: string) => {
    const params = new URLSearchParams(sp.toString());
    if (c === "Todos") params.delete("category"); else params.set("category", c);
    router.push(`/app/podcasts?${params.toString()}`);
  };

  const playPodcast = (p: Podcast) => {
    if (!p.audioUrl) return;
    setNowPlaying({
      title: p.title,
      artist: p.category || "Podcast Flash Mix",
      coverUrl: p.imageUrl,
      isLive: false,
      streamUrl: p.audioUrl,
      streamName: "Flash Mix Digital - Podcasts",
    });
    appendHistory({ title: p.title, artist: p.category || "Podcast" });
    if (playback !== "playing") togglePlay();
  };

  const fmtDuration = (s?: number | null) => {
    if (!s) return "--:--";
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Podcasts</h1>
        <p className="text-sm text-white/60">Ouça quando quiser, offline ou online</p>
      </header>

      {/* Filtros */}
      <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
              currentCategory === c
                ? "bg-[#E30613] text-white glow-red"
                : "border border-white/15 text-white/70 hover:bg-white/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista */}
      {podcasts.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/50">Nenhum podcast disponível.</p>
      ) : (
        <div className="space-y-3">
          {podcasts.map((p) => (
            <div key={p.id} className="group glass flex items-center gap-3 rounded-2xl p-3 transition hover:border-[#E30613]/40">
              <button
                onClick={() => playPodcast(p)}
                disabled={!p.audioUrl}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 disabled:opacity-50"
                aria-label={`Tocar ${p.title}`}
              >
                {p.imageUrl ? (
                   
                  <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-[#E30613]">
                    <Mic2 className="h-6 w-6" />
                  </div>
                )}
                <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <Play className="h-6 w-6 text-white" fill="currentColor" />
                </div>
              </button>
              <div className="min-w-0 flex-1">
                {p.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">
                    {p.category}
                    {p.episode && ` • Ep ${p.episode}`}
                  </span>
                )}
                <h3 className="line-clamp-1 text-sm font-bold text-white">{p.title}</h3>
                {p.description && (
                  <p className="line-clamp-1 text-xs text-white/60">{p.description}</p>
                )}
                <p className="mt-0.5 text-xs text-white/40">{fmtDuration(p.duration)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition" aria-label="Favoritar">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition" aria-label="Download">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
