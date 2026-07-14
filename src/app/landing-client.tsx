"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Play, Pause, Volume2, Heart, Share2, Radio, Newspaper, Calendar,
  Gift, Podcast, Video, MessageSquare, Search, ChevronRight,
  Zap, TrendingUp, Clock, Sparkles, Instagram, Facebook, Youtube,
  Menu, X, ArrowRight, Headphones, Mic2, ExternalLink,
} from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { EqVisualizer } from "@/components/flashmix/eq-visualizer";
import { formatDateLong } from "@/lib/utils";

type Programa = { id: string; title: string; startTime: string; endTime: string; locutor?: { name: string } | null };
type Noticia = { id: string; title: string; summary: string; imageUrl?: string | null; publishedAt: string; category: string };
type Promocao = { id: string; title: string; description: string; imageUrl?: string | null; prize?: string | null };
type Config = { streamUrl: string; streamName: string; isLive: boolean; nowPlayingTitle: string | null; nowPlayingArtist: string | null };

export function LandingClient({
  config, programaAtual, promocoes, noticias, programasHoje,
}: {
  config: Config | null;
  programaAtual: Programa | null;
  promocoes: Promocao[];
  noticias: Noticia[];
  programasHoje: Programa[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    nowPlaying, playback, togglePlay, setNowPlaying, volume, setVolume, liked, toggleLike,
  } = usePlayerStore();
  useAudioPlayer();

  useEffect(() => {
    setMounted(true);
    if (!nowPlaying) {
      fetch("/api/radio/now-playing")
        .then((r) => r.json())
        .then((data) => {
          setNowPlaying({
            title: data.title,
            artist: data.artist,
            coverUrl: data.coverUrl,
            isLive: data.isLive,
            streamUrl: data.streamUrl,
            streamName: data.streamName,
          });
        })
        .catch(() => {});
    }
  }, [setNowPlaying, nowPlaying]);

  // No SSR sempre falso para evitar mismatch; no cliente usa o estado real
  const playing = mounted && playback === "playing";

  const startRadio = () => {
    if (!nowPlaying) {
      setNowPlaying({
        title: config?.nowPlayingTitle || "Flash Mix Digital - Ao Vivo",
        artist: config?.nowPlayingArtist || "Campo Grande / MS",
        coverUrl: null,
        isLive: true,
        streamUrl: config?.streamUrl || "http://s02.taaqui.org:8874/stream",
        streamName: "Flash Mix Digital",
      });
    }
    setTimeout(() => togglePlay(), 50);
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Flash Mix Digital",
          text: "Ouça a Flash Mix Digital ao vivo!",
          url: window.location.href,
        });
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/flashmix-logo.png" alt="Flash Mix Digital" width={140} height={96} priority className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/app" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition rounded-full hover:bg-white/5">Início</Link>
            <Link href="/app/radio" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition rounded-full hover:bg-white/5">Rádio</Link>
            <Link href="/app/noticias" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition rounded-full hover:bg-white/5">Notícias</Link>
            <Link href="/app/programacao" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition rounded-full hover:bg-white/5">Programação</Link>
            <Link href="/app/promocoes" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition rounded-full hover:bg-white/5">Promoções</Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition rounded-full hover:bg-white/5">Entrar</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={startRadio}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#E30613] px-5 py-2 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-105 active:scale-95 transition"
            >
              {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
              {playing ? "Pausar" : "Ouça Ao Vivo"}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/5"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden glass-dark border-t border-white/5 px-4 py-3 flex flex-col gap-1">
            {[
              { label: "Início", href: "/app" },
              { label: "Rádio", href: "/app/radio" },
              { label: "Notícias", href: "/app/noticias" },
              { label: "Programação", href: "/app/programacao" },
              { label: "Promoções", href: "/app/promocoes" },
              { label: "Podcasts", href: "/app/podcasts" },
              { label: "Vídeos", href: "/app/videos" },
              { label: "Recados", href: "/app/recados" },
              { label: "Entrar", href: "/login" },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 rounded-xl">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* HERO com PLAYER */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(227,6,19,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(11,24,54,0.7) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(227,6,19,0.15) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-red px-4 py-1.5 mb-6 animate-fade-in-up">
            <span className="h-2 w-2 animate-pulse-live rounded-full bg-[#E30613] glow-red" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">Ao Vivo Agora</span>
            {programaAtual && <span className="text-xs text-white/60">• {programaAtual.title}</span>}
          </div>

          <div className="mx-auto mb-8 animate-splash-scale animate-splash-glow">
            <Image src="/logo/flashmix-logo.png" alt="Flash Mix Digital" width={400} height={274} priority className="mx-auto w-72 sm:w-96 h-auto object-contain" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 animate-fade-in-up">
            A Rádio Online <span className="text-[#E30613] text-glow-red">Premium</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8 animate-fade-in-up">
            Campo Grande / MS — Brasil. Música, notícias, programação e muito mais, com design dark neon e player em segundo plano.
          </p>

          {/* PLAYER REAL com áudio */}
          <div className="max-w-2xl mx-auto glass-red rounded-3xl p-5 sm:p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              {/* Logo no círculo com anéis neon */}
              <div className="relative shrink-0">
                {playing && (
                  <>
                    <div className="pointer-events-none absolute -inset-2 rounded-full border-2 border-[#E30613]/40 animate-spin-slow" />
                    <div className="pointer-events-none absolute -inset-1 rounded-full border-2 border-[#E30613]/70 animate-glow-pulse" />
                  </>
                )}
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-[#E30613]/60 bg-gradient-to-br from-[#0B1836] to-[#2a0408] grid place-items-center p-3">
                  <Image
                    src="/logo/flashmix-logo.png"
                    alt="Flash Mix"
                    width={48}
                    height={33}
                    className={`object-contain ${playing ? "animate-spin-slower" : ""}`}
                  />
                </div>
              </div>

              {/* Info música */}
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[10px] uppercase tracking-widest text-[#E30613] font-bold">No Ar</p>
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                  {mounted && nowPlaying?.title ? nowPlaying.title : "Flash Mix Digital - Ao Vivo"}
                </h3>
                <p className="text-sm text-white/60 truncate">
                  {mounted && nowPlaying?.artist ? nowPlaying.artist : "Campo Grande / MS"}
                </p>
                {playing && <EqVisualizer bars={20} height={16} className="mt-1" />}
              </div>

              {/* Botão play grande */}
              <button
                onClick={startRadio}
                aria-label={playing ? "Pausar" : "Tocar"}
                className="grid h-14 w-14 sm:h-16 sm:w-16 shrink-0 place-items-center rounded-full bg-[#E30613] text-white glow-red-strong hover:scale-105 active:scale-95 transition"
              >
                {playing ? (
                  <Pause className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
                ) : (
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 translate-x-0.5" fill="currentColor" />
                )}
              </button>
            </div>

            {/* Volume + ações */}
            <div className="mt-4 flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-white/60 shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={mounted ? volume : 0.8}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#E30613]"
                aria-label="Volume"
              />
              <button onClick={toggleLike} aria-label="Curtir" className="grid h-9 w-9 place-items-center rounded-full glass text-white/80 hover:text-white transition shrink-0">
                <Heart className={`h-4 w-4 ${liked ? "fill-[#E30613] text-[#E30613]" : ""}`} />
              </button>
              <button onClick={share} aria-label="Compartilhar" className="grid h-9 w-9 place-items-center rounded-full glass text-white/80 hover:text-white transition shrink-0">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-white/40">
              {playing ? "🔴 Tocando ao vivo agora" : "Clique no play para ouvir a rádio ao vivo"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up">
            <Link href="/app" className="inline-flex items-center gap-2 rounded-full bg-white text-[#090909] px-6 py-3 text-sm font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition">
              <Headphones className="h-4 w-4" /> Abrir o App
            </Link>
            <Link href="/app/programacao" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition">
              <Calendar className="h-4 w-4" /> Ver Programação
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Ouvintes Online", value: "1.247", icon: Headphones },
              { label: "Programas Semanais", value: "45+", icon: Mic2 },
              { label: "Músicas no Ar", value: "500+", icon: TrendingUp },
              { label: "Anos no Ar", value: "10+", icon: Sparkles },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-[#E30613]" />
                  <p className="mt-2 text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/50">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ATALHOS */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Tudo em um <span className="text-[#E30613]">só lugar</span>
            </h2>
            <p className="mt-2 text-white/60">Acesse todos os recursos da Flash Mix Digital</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Radio, label: "Rádio ao Vivo", desc: "Ouça agora", href: "/app/radio", color: "#E30613" },
              { icon: Newspaper, label: "Notícias", desc: `${noticias.length} matérias`, href: "/app/noticias", color: "#3b82f6" },
              { icon: Calendar, label: "Programação", desc: "Grade completa", href: "/app/programacao", color: "#22c55e" },
              { icon: Gift, label: "Promoções", desc: `${promocoes.length} ativas`, href: "/app/promocoes", color: "#f59e0b" },
              { icon: Podcast, label: "Podcasts", desc: "On-demand", href: "/app/podcasts", color: "#a855f7" },
              { icon: Video, label: "Vídeos", desc: "YouTube", href: "/app/videos", color: "#ec4899" },
              { icon: MessageSquare, label: "Recados", desc: "Mande o seu", href: "/app/recados", color: "#06b6d4" },
              { icon: Search, label: "Buscar", desc: "Top 10 + busca", href: "/app/busca", color: "#E30613" },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.href} href={q.href} className="group glass rounded-3xl p-5 transition hover:scale-105 active:scale-95">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl mb-3 transition group-hover:scale-110" style={{ background: `${q.color}20`, color: q.color }}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="font-bold text-white">{q.label}</p>
                  <p className="text-xs text-white/50">{q.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold" style={{ color: q.color }}>
                    Acessar <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMAÇÃO HOJE */}
      {programasHoje.length > 0 && (
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent via-[#0B1836]/30 to-transparent">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E30613] font-bold">Hoje no ar</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Programação de Hoje</h2>
              </div>
              <Link href="/app/programacao" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#E30613] hover:text-[#ff1f2c]">
                Ver tudo <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {programasHoje.slice(0, 8).map((p, i) => (
                <div key={p.id} className={`glass rounded-2xl p-4 transition hover:scale-105 ${i === 0 ? "border-[#E30613]/60 glow-red" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#E30613]">{p.startTime}</span>
                    {i === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E30613] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Ao Vivo
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white mb-1">{p.title}</h3>
                  {p.locutor && <p className="text-xs text-white/50">com {p.locutor.name}</p>}
                  <p className="text-xs text-white/40 mt-1">{p.startTime} - {p.endTime}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROMOÇÕES */}
      {promocoes.length > 0 && (
        <section className="py-16 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-[#E30613] font-bold">Promoções ativas</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Participe e <span className="text-[#E30613]">concorra</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {promocoes.map((p) => (
                <Link key={p.id} href={`/app/promocoes/${p.id}`} className="group relative overflow-hidden rounded-3xl border border-white/10 transition hover:scale-[1.02] active:scale-95">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="h-56 w-full object-cover transition group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E30613] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white glow-red mb-2">
                      <Sparkles className="h-3 w-3" /> Promoção
                    </span>
                    <h3 className="text-xl font-bold text-white">{p.title}</h3>
                    {p.prize && <p className="text-sm text-white/80 mt-1">{p.prize}</p>}
                    <p className="text-sm text-white/60 line-clamp-2 mt-1">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOTÍCIAS */}
      {noticias.length > 0 && (
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent via-[#0B1836]/30 to-transparent">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E30613] font-bold">Notícias</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Últimas Atualizações</h2>
              </div>
              <Link href="/app/noticias" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#E30613] hover:text-[#ff1f2c]">
                Ver todas <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {noticias.slice(0, 3).map((n) => (
                <Link key={n.id} href={`/app/noticias/${n.id}`} className="group glass rounded-3xl overflow-hidden transition hover:scale-[1.02] active:scale-95">
                  {n.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">{n.category}</span>
                    <h3 className="text-lg font-bold text-white mt-1 line-clamp-2 group-hover:text-[#E30613] transition">{n.title}</h3>
                    <p className="text-sm text-white/60 mt-2 line-clamp-2">{n.summary}</p>
                    <p className="text-xs text-white/40 mt-3">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {formatDateLong(n.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-[#E30613] font-bold">Por que Flash Mix Digital</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Experiência <span className="text-[#E30613]">premium</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: "Player em 2º plano", desc: "Continue ouvindo enquanto usa outros apps. Media Session API integrada." },
              { icon: Headphones, title: "Áudio HD Ao Vivo", desc: "Stream Shoutcast AAC+ direto de Campo Grande/MS com qualidade superior." },
              { icon: Sparkles, title: "Dark Mode Neon", desc: "Visual premium com glow vermelho, anéis luminosos e equalizer animado." },
              { icon: Calendar, title: "Programação 24/7", desc: "Grade completa de segunda a domingo com seus locutores favoritos." },
              { icon: MessageSquare, title: "Recados interativos", desc: "Mande mensagens para a rádio e receba respostas ao vivo." },
              { icon: TrendingUp, title: "Top 10 Semanal", desc: "As músicas mais tocadas, atualizadas semanalmente." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass rounded-3xl p-6 transition hover:border-[#E30613]/40">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E30613]/15 text-[#E30613] mb-3">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-bold text-white text-lg">{f.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="glass-red rounded-[2rem] p-8 sm:p-12 text-center relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Pronto para ouvir?</h2>
            <p className="text-white/70 mb-6">Entre agora e leve a Flash Mix Digital para onde você for.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={startRadio} className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white glow-red-strong hover:scale-105 active:scale-95 transition">
                {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
                {playing ? "Pausar Agora" : "Tocar Agora"}
              </button>
              <Link href="/app" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition">
                <Headphones className="h-4 w-4" /> Abrir App Completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Image src="/logo/flashmix-logo.png" alt="Flash Mix Digital" width={140} height={96} className="h-12 w-auto object-contain mb-3" />
              <p className="text-sm text-white/60">A rádio online premium de Campo Grande / MS. Música, notícias e entretenimento 24 horas no ar.</p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#E30613] font-bold mb-3">Navegação</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/app/radio" className="text-white/60 hover:text-white transition">Rádio ao Vivo</Link></li>
                <li><Link href="/app/noticias" className="text-white/60 hover:text-white transition">Notícias</Link></li>
                <li><Link href="/app/programacao" className="text-white/60 hover:text-white transition">Programação</Link></li>
                <li><Link href="/app/promocoes" className="text-white/60 hover:text-white transition">Promoções</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#E30613] font-bold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>📍 Campo Grande / MS — Brasil</li>
                <li>📞 (67) 3000-0000</li>
                <li>✉️ contato@flashmix.com.br</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#E30613] font-bold mb-3">Redes Sociais</h4>
              <div className="flex gap-2">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: Youtube, label: "YouTube" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.label} href="#" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full glass text-white/70 hover:text-[#E30613] hover:scale-105 transition">
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/40">
            © 2026 Flash Mix Digital. Todos os direitos reservados. •
            <Link href="/app/sobre" className="hover:text-white ml-1">Sobre</Link> •
            <Link href="/app/sobre" className="hover:text-white ml-1">Privacidade</Link> •
            <Link href="/login" className="hover:text-white ml-1">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
