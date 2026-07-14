"use client";

import { Play, Heart, Share2, Eye, Clock } from "lucide-react";
import { useState } from "react";

type Video = {
  id: string; title: string; description?: string | null;
  youtubeId: string; thumbnailUrl?: string | null; duration?: number | null;
  views: number; publishedAt: string;
};

export function VideosContent({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<Video | null>(null);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Vídeos</h1>
        <p className="text-sm text-white/60">Os melhores momentos em vídeo</p>
      </header>

      {/* Player principal */}
      {active && (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`}
              title={active.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="glass-red p-4">
            <h3 className="font-bold text-white">{active.title}</h3>
            {active.description && <p className="mt-1 text-sm text-white/70">{active.description}</p>}
            <div className="mt-2 flex items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {active.views} views</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(active.publishedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {videos.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/50">Nenhum vídeo disponível.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              className="group block overflow-hidden rounded-2xl glass text-left transition hover:border-[#E30613]/40"
            >
              <div className="relative aspect-video overflow-hidden">
                {v.thumbnailUrl && (
                   
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#E30613] text-white glow-red">
                    <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {v.duration ? `${Math.floor(v.duration / 60)}:${(v.duration % 60).toString().padStart(2, "0")}` : ""}
                </span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-bold text-white group-hover:text-[#E30613] transition">
                  {v.title}
                </h3>
                <div className="mt-1.5 flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {v.views}</span>
                  <div className="flex gap-1">
                    <button onClick={(e) => e.stopPropagation()} className="grid h-6 w-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-[#E30613]" aria-label="Curtir">
                      <Heart className="h-3 w-3" />
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="grid h-6 w-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white" aria-label="Compartilhar">
                      <Share2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
