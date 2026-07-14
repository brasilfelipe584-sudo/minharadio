"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Music, Newspaper, Mic2, Radio, Gift, User, Video, TrendingUp, X } from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";

type Results = {
  musicas: any[]; noticias: any[]; podcasts: any[]; programas: any[]; promocoes: any[]; locutores: any[]; videos: any[];
};

export function BuscaContent({
  initialQuery, results, top10, categorias, isTop10,
}: {
  initialQuery: string;
  results: Results;
  top10: any[];
  categorias: any[];
  isTop10: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [tab, setTab] = useState<string>("all");

  const { setNowPlaying, togglePlay, playback, appendHistory, nowPlaying } = usePlayerStore();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/app/busca?q=${encodeURIComponent(q.trim())}`);
  };

  const playMusica = (m: any) => {
    setNowPlaying({
      title: m.title, artist: m.artist, coverUrl: m.coverUrl,
      isLive: false,
      streamUrl: nowPlaying?.streamUrl || "https://icecast.wmncdn.net/somfmtop3",
      streamName: "Flash Mix Digital",
    });
    appendHistory({ title: m.title, artist: m.artist });
    if (playback !== "playing") togglePlay();
  };

  const sections = [
    { id: "musicas", label: "Músicas", icon: Music, items: results.musicas, href: (i: any) => "/radio", onClick: playMusica },
    { id: "noticias", label: "Notícias", icon: Newspaper, items: results.noticias, href: (i: any) => `/noticias/${i.id}` },
    { id: "podcasts", label: "Podcasts", icon: Mic2, items: results.podcasts, href: (i: any) => "/podcasts" },
    { id: "programas", label: "Programas", icon: Radio, items: results.programas, href: (i: any) => "/programacao" },
    { id: "promocoes", label: "Promoções", icon: Gift, items: results.promocoes, href: (i: any) => `/promocoes/${i.id}` },
    { id: "videos", label: "Vídeos", icon: Video, items: results.videos, href: (i: any) => "/videos" },
    { id: "locutores", label: "Locutores", icon: User, items: results.locutores, href: (i: any) => "/programacao" },
  ];

  const visibleSections = sections.filter((s) => s.items && s.items.length > 0);
  const filteredSections = tab === "all" ? visibleSections : visibleSections.filter((s) => s.id === tab);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Busca</h1>
        <p className="text-sm text-white/60">Encontre músicas, programas, notícias e mais</p>
      </header>

      {/* Busca */}
      <form onSubmit={submit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Pesquisar..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); router.push("/app/busca"); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            aria-label="Limpar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Quando não há busca: Top 10 + categorias */}
      {!q && !isTop10 && (
        <>
          {/* Top 10 */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 px-1 text-base font-bold uppercase tracking-wide text-white">
              <TrendingUp className="h-4 w-4 text-[#E30613]" /> Top 10 Mais Tocadas
            </h3>
            <div className="space-y-2">
              {top10.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => playMusica(m)}
                  className="group flex w-full items-center gap-3 rounded-2xl glass p-2 text-left transition hover:border-[#E30613]/40"
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    i < 3 ? "bg-[#E30613] text-white glow-red" : "bg-white/10 text-white/70"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    {m.coverUrl && (
                       
                      <img src={m.coverUrl} alt={m.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{m.title}</p>
                    <p className="truncate text-xs text-white/60">{m.artist}</p>
                  </div>
                  {m.category && (
                    <span className="rounded-full bg-[#E30613]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[#E30613]">
                      {m.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Categorias */}
          <section>
            <h3 className="mb-3 px-1 text-base font-bold uppercase tracking-wide text-white">Categorias</h3>
            <div className="grid grid-cols-3 gap-3">
              {categorias.map((c) => (
                <Link
                  key={c.id}
                  href={`/busca?q=${encodeURIComponent(c.name)}`}
                  className="glass flex flex-col items-center gap-2 rounded-2xl p-4 transition hover:border-[#E30613]/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-[#E30613]/40 bg-gradient-to-br from-[#0B1836] to-[#1a0408] text-[#E30613]">
                    <Music className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-white">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Resultados */}
      {q && (
        <>
          {/* Filtro tipo */}
          {visibleSections.length > 0 && (
            <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
              <button
                onClick={() => setTab("all")}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  tab === "all" ? "bg-[#E30613] text-white glow-red" : "border border-white/15 text-white/70"
                }`}
              >
                Tudo
              </button>
              {visibleSections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setTab(s.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      tab === s.id ? "bg-[#E30613] text-white glow-red" : "border border-white/15 text-white/70"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {s.label} ({s.items.length})
                  </button>
                );
              })}
            </div>
          )}

          {/* Resultados por seção */}
          {filteredSections.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/50">
              Nenhum resultado para &quot;{q}&quot;
            </p>
          ) : (
            filteredSections.map((s) => {
              const Icon = s.icon;
              return (
                <section key={s.id}>
                  <h3 className="mb-2 flex items-center gap-2 px-1 text-sm font-bold uppercase tracking-wide text-white">
                    <Icon className="h-4 w-4 text-[#E30613]" />
                    {s.label}
                  </h3>
                  <div className="space-y-2">
                    {s.items.map((item: any) => (
                      <Link
                        key={item.id}
                        href={s.href(item)}
                        onClick={s.onClick ? () => s.onClick!(item) : undefined}
                        className="group flex items-center gap-3 rounded-2xl glass p-2 transition hover:border-[#E30613]/40"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                          {(item.coverUrl || item.imageUrl || item.avatarUrl) && (
                             
                            <img
                              src={item.coverUrl || item.imageUrl || item.avatarUrl}
                              alt={item.title || item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {item.title || item.name}
                          </p>
                          {item.artist && <p className="truncate text-xs text-white/60">{item.artist}</p>}
                          {item.summary && <p className="truncate text-xs text-white/60">{item.summary}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
