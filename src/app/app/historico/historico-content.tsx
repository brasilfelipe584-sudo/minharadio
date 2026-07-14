"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Music, Mic2, Video, Clock } from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";

type Item = {
  id: string; contentType: string; contentId: string; playedAt: string;
  item: { id: string; title: string; artist?: string; coverUrl?: string | null; imageUrl?: string | null };
};

const periods = [
  { id: "today", label: "Hoje" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
  { id: "all", label: "Tudo" },
];

export function HistoryContent({ items, period }: { items: Item[]; period: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { setNowPlaying, togglePlay, playback, appendHistory, nowPlaying } = usePlayerStore();

  const setPeriod = (p: string) => {
    const params = new URLSearchParams(sp.toString());
    params.set("period", p);
    router.push(`/app/historico?${params.toString()}`);
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Agora";
    if (m < 60) return `${m} min atrás`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h atrás`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const IconFor = ({ type }: { type: string }) => {
    if (type === "PODCAST") return <Mic2 className="h-5 w-5" />;
    if (type === "VIDEO") return <Video className="h-5 w-5" />;
    return <Music className="h-5 w-5" />;
  };

  const replay = (item: Item) => {
    if (item.contentType === "MUSICA") {
      setNowPlaying({
        title: item.item.title,
        artist: item.item.artist || "Flash Mix",
        coverUrl: item.item.coverUrl,
        isLive: false,
        streamUrl: nowPlaying?.streamUrl || "https://icecast.wmncdn.net/somfmtop3",
        streamName: "Flash Mix Digital",
      });
      appendHistory({ title: item.item.title, artist: item.item.artist || "" });
      if (playback !== "playing") togglePlay();
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Histórico</h1>
        <p className="text-sm text-white/60">Tudo o que você ouviu</p>
      </header>

      {/* Filtros período */}
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              period === p.id
                ? "bg-[#E30613] text-white glow-red"
                : "border border-white/15 text-white/70 hover:bg-white/5"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/50">Nenhum histórico neste período.</p>
      ) : (
        <div className="space-y-2">
          {items.map((h) => (
            <button
              key={h.id}
              onClick={() => replay(h)}
              className="group flex w-full items-center gap-3 rounded-2xl glass p-2 text-left transition hover:border-[#E30613]/40"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {(h.item.coverUrl || h.item.imageUrl) ? (
                   
                  <img src={h.item.coverUrl || h.item.imageUrl!} alt={h.item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-[#E30613]">
                    <IconFor type={h.contentType} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">
                  {h.contentType}
                </span>
                <p className="truncate text-sm font-semibold text-white">{h.item.title}</p>
                {h.item.artist && <p className="truncate text-xs text-white/60">{h.item.artist}</p>}
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-white/40">
                <Clock className="h-3 w-3" />
                {fmtTime(h.playedAt)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
