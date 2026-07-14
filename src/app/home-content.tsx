"use client";

import Link from "next/link";
import {
  Mic2, BarChart3, Newspaper, Play, Heart, Sparkles,
  Radio, Clock, ChevronRight, Calendar, Gift, Podcast, Video,
  MessageSquare, Search, TrendingUp, Zap,
} from "lucide-react";
import { LiveBanner } from "@/components/flashmix/live-banner";
import { SectionHeader } from "@/components/flashmix/section-header";
import { EqVisualizer } from "@/components/flashmix/eq-visualizer";
import { usePlayerStore } from "@/lib/player-store";
import { useAudioPlayer } from "@/hooks/use-audio-player";

type Programa = {
  id: string; title: string; description?: string | null;
  imageUrl?: string | null; startTime: string; endTime: string; dayOfWeek: number;
  locutor?: { name: string; avatarUrl?: string | null } | null;
};
type Musica = {
  id: string; title: string; artist: string; coverUrl?: string | null;
  category?: string | null; playedAt: string;
};
type Categoria = {
  id: string; name: string; slug: string; iconName?: string | null; color?: string | null;
};
type Noticia = {
  id: string; title: string; summary: string; imageUrl?: string | null;
  publishedAt: string; category: string;
};
type Promocao = {
  id: string; title: string; description: string; imageUrl?: string | null;
  prize?: string | null; endDate?: string | null;
};

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function HomeContent({
  programaAtual, destaques, musicas, categorias, noticias, promocoes, programasHoje,
}: {
  programaAtual: Programa | null;
  destaques: Programa[];
  musicas: Musica[];
  categorias: Categoria[];
  noticias: Noticia[];
  promocoes: Promocao[];
  programasHoje: Programa[];
}) {
  const { togglePlay, playback, setNowPlaying, appendHistory, nowPlaying } = usePlayerStore();
  useAudioPlayer();

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Agora";
    if (m < 60) return `${m} min atrás`;
    const h = Math.floor(m / 60);
    return `${h}h atrás`;
  };

  const playMusica = (m: Musica) => {
    setNowPlaying({
      title: m.title,
      artist: m.artist,
      coverUrl: m.coverUrl,
      isLive: false,
      streamUrl: nowPlaying?.streamUrl || "http://s02.taaqui.org:8874/stream",
      streamName: "Flash Mix Digital",
    });
    appendHistory({ title: m.title, artist: m.artist });
    if (playback !== "playing") togglePlay();
  };

  const today = new Date().getDay();

  // Atalhos rápidos na home (ícones grandes)
  const quickAccess = [
    { icon: Radio, label: "Rádio", href: "/radio", color: "#E30613" },
    { icon: Newspaper, label: "Notícias", href: "/noticias", color: "#3b82f6" },
    { icon: Calendar, label: "Programação", href: "/programacao", color: "#22c55e" },
    { icon: Gift, label: "Promoções", href: "/promocoes", color: "#f59e0b" },
    { icon: Podcast, label: "Podcasts", href: "/podcasts", color: "#a855f7" },
    { icon: Video, label: "Vídeos", href: "/videos", color: "#ec4899" },
    { icon: MessageSquare, label: "Recados", href: "/recados", color: "#06b6d4" },
    { icon: Search, label: "Buscar", href: "/busca", color: "#E30613" },
  ];

  return (
    <div className="space-y-6">
      {/* Banner principal AO VIVO */}
      <LiveBanner />

      {/* Atalhos rápidos */}
      <section>
        <div className="grid grid-cols-4 gap-3">
          {quickAccess.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                prefetch
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl border transition group-hover:scale-105 group-active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${q.color}20, ${q.color}05)`,
                    borderColor: `${q.color}40`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: q.color }} />
                </span>
                <span className="text-[11px] font-medium text-white/80">{q.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Programa atual + Ver Programação */}
      {programaAtual && (
        <section className="glass relative overflow-hidden rounded-3xl p-5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(227,6,19,0.15) 0%, transparent 60%)",
            }}
          />
          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#E30613] font-bold">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-[#E30613]" />
                No Ar Agora
              </p>
              <h3 className="mt-1 truncate text-xl font-bold text-white">
                {programaAtual.title}
              </h3>
              <p className="truncate text-sm text-white/60">
                <Clock className="mr-1 inline h-3 w-3" />
                {programaAtual.startTime} - {programaAtual.endTime}
                {programaAtual.locutor && ` • ${programaAtual.locutor.name}`}
              </p>
            </div>
            <Link
              href="/app/programacao"
              prefetch
              className="shrink-0 rounded-full border border-[#E30613]/50 bg-[#E30613]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#E30613] hover:bg-[#E30613]/20 active:scale-95 transition"
            >
              Programação
            </Link>
          </div>
        </section>
      )}

      {/* Destaques */}
      <section>
        <SectionHeader title="Destaques" href="/app/noticias" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { type: "PROGRAMA", icon: Mic2, title: programaAtual?.title ?? "Manhã Flash", subtitle: programaAtual ? `${programaAtual.startTime} - ${programaAtual.endTime}` : "06:00 - 09:00", href: "/programacao", color: "#E30613" },
            { type: "TOP 10", icon: BarChart3, title: "Mais tocadas", subtitle: "Atualizado hoje", href: "/busca", color: "#22c55e" },
            { type: "NOTÍCIAS", icon: Newspaper, title: "Notícias", subtitle: `${noticias.length} matérias`, href: "/noticias", color: "#3b82f6" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                prefetch
                className="group glass flex flex-col gap-2 rounded-2xl p-3 transition hover:scale-[1.03] hover:border-[#E30613]/40 active:scale-95"
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: card.color }}
                >
                  {card.type}
                </span>
                <span
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{ background: `${card.color}20`, color: card.color }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="line-clamp-2 text-xs font-semibold text-white">{card.title}</p>
                <p className="truncate text-[10px] text-white/50">{card.subtitle}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Programação de hoje (preview) */}
      {programasHoje.length > 0 && (
        <section>
          <SectionHeader title={`Programação ${DIAS[today]}`} href="/app/programacao" />
          <div className="no-scrollbar -mx-3 flex gap-3 overflow-x-auto px-3">
            {programasHoje.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href="/app/programacao"
                prefetch
                className="group glass flex w-44 shrink-0 flex-col gap-2 rounded-2xl p-3 transition hover:border-[#E30613]/40 active:scale-95"
              >
                <span className="text-xs font-bold text-[#E30613]">{p.startTime}</span>
                <p className="line-clamp-1 text-sm font-semibold text-white">{p.title}</p>
                <p className="truncate text-xs text-white/50">
                  {p.locutor?.name || "Flash Mix"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categorias */}
      {categorias.length > 0 && (
        <section>
          <SectionHeader title="Categorias" href="/app/busca" />
          <div className="no-scrollbar -mx-3 flex gap-3 overflow-x-auto px-3">
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/busca?q=${encodeURIComponent(c.name)}`}
                prefetch
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <span
                  className="grid h-16 w-16 place-items-center rounded-full border border-[#E30613]/40 bg-gradient-to-br from-[#0B1836] to-[#1a0408] text-[#E30613] hover:glow-red hover:scale-105 active:scale-95 transition"
                >
                  <Music2Icon />
                </span>
                <span className="text-[10px] font-medium text-white/80">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Últimas tocadas */}
      <section>
        <SectionHeader title="Últimas Tocadas" href="/app/historico" />
        <div className="space-y-1.5">
          {musicas.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-white/50">
              Nenhuma música tocada ainda.
            </p>
          )}
          {musicas.slice(0, 6).map((m, i) => (
            <button
              key={m.id}
              onClick={() => playMusica(m)}
              className="group flex w-full items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5 active:scale-[0.98]"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {m.coverUrl ? (
                  <img src={m.coverUrl} alt={m.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-white/40">
                    <Radio className="h-5 w-5" />
                  </div>
                )}
                <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <Play className="h-5 w-5 text-white" fill="currentColor" />
                </div>
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-white">{m.title}</p>
                <p className="truncate text-xs text-white/60">{m.artist}</p>
              </div>
              <div className="text-right text-xs text-white/50">
                <p>{fmtTime(m.playedAt)}</p>
                {i === 0 && <EqVisualizer bars={6} height={12} className="ml-auto mt-1" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Promoções em destaque */}
      {promocoes.length > 0 && (
        <section>
          <SectionHeader title="Promoções" href="/app/promocoes" />
          <div className="no-scrollbar -mx-3 flex gap-3 overflow-x-auto px-3">
            {promocoes.map((p) => (
              <Link
                key={p.id}
                href={`/promocoes/${p.id}`}
                prefetch
                className="group relative h-40 w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 active:scale-95 transition"
              >
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E30613] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white glow-red">
                    <Sparkles className="h-3 w-3" />
                    Promo
                  </span>
                  <h4 className="mt-1 line-clamp-1 text-sm font-bold text-white">{p.title}</h4>
                  <p className="line-clamp-1 text-xs text-white/70">{p.prize ?? p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Notícias */}
      {noticias.length > 0 && (
        <section>
          <SectionHeader title="Notícias" href="/app/noticias" />
          <div className="space-y-2">
            {noticias.slice(0, 3).map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                prefetch
                className="group flex gap-3 rounded-2xl p-2 transition hover:bg-white/5 active:scale-[0.98]"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  {n.imageUrl && (
                    <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">
                    {n.category}
                  </span>
                  <h4 className="line-clamp-2 text-sm font-semibold text-white">{n.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-white/60">{n.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="glass-red rounded-3xl p-5 text-center">
        <Zap className="mx-auto h-8 w-8 text-[#E30613]" />
        <h3 className="mt-2 text-lg font-bold text-white">Baixe nosso app</h3>
        <p className="mt-1 text-sm text-white/70">
          Leve a Flash Mix Digital para onde você for
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <Link
            href="/app/sobre"
            prefetch
            className="rounded-full bg-[#E30613] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white glow-red active:scale-95 transition"
          >
            Saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}

function Music2Icon() {
  return <Mic2 className="h-6 w-6" />;
}
