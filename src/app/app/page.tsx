import { db } from "@/lib/db";
import Link from "next/link";
import {
  Radio, Newspaper, Calendar, Gift, Podcast, Video,
  MessageSquare, Search, Heart, History, Bell, User,
  ChevronRight, Clock, Sparkles, Play, Mic2, TrendingUp,
} from "lucide-react";
import { ProgramaAtualCard } from "./programa-atual-card";

export const dynamic = "force-dynamic";

// Função para converter "HH:MM" em minutos
function timeToMinutes(time: string): number {
  if (!time) return 0;
  const parts = time.split(":");
  if (parts.length < 2) return 0;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

// Pega minutos atuais em São Paulo
function getCurrentMinutesSP(): number {
  try {
    const now = new Date();
    const spTime = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const [h, m] = spTime.split(":").map(Number);
    return h * 60 + m;
  } catch {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
}

export default async function AppHomePage() {
  const today = new Date().getDay();
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  // Variáveis com defaults seguros
  let programaAtual: any = null;
  let musicas: any[] = [];
  let categorias: any[] = [];
  let noticias: any[] = [];
  let promocoes: any[] = [];
  let programasHoje: any[] = [];
  let config: any = null;
  let debugError: string | null = null;

  // Tenta buscar dados do banco com try/catch robusto
  try {
    const todosProgramasHoje = await db.programa.findMany({
      where: { dayOfWeek: today },
      include: { locutor: true },
      orderBy: { startTime: "asc" },
    });

    // Determina programa atual baseado no horário
    const currentMin = getCurrentMinutesSP();
    programaAtual = todosProgramasHoje.find((p) => {
      const start = timeToMinutes(p.startTime);
      let end = timeToMinutes(p.endTime);
      if (p.endTime === "23:59") end = 1440;
      return currentMin >= start && currentMin < end;
    }) || todosProgramasHoje[0] || null;

    programasHoje = todosProgramasHoje;

    // Busca dados restantes em paralelo
    const [musicasData, categoriasData, noticiasData, promocoesData, configData] = await Promise.all([
      db.musica.findMany({ orderBy: { playedAt: "desc" }, take: 6 }).catch(() => []),
      db.categoria.findMany({ orderBy: { order: "asc" } }).catch(() => []),
      db.noticia.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
      db.promocao.findMany({ where: { isActive: true }, take: 3, orderBy: { endDate: "asc" } }).catch(() => []),
      db.radioConfig.findFirst().catch(() => null),
    ]);

    musicas = musicasData;
    categorias = categoriasData;
    noticias = noticiasData;
    promocoes = promocoesData;
    config = configData;
  } catch (e: any) {
    debugError = e?.message || String(e);
    console.error("Erro ao carregar /app:", e);
  }

  const streamUrl = config?.streamUrl || "http://s02.taaqui.org:8874/stream";
  const nowPlayingTitle = config?.nowPlayingTitle || "Flash Mix Digital - Ao Vivo";
  const nowPlayingArtist = config?.nowPlayingArtist || "Campo Grande / MS";

  const fmtTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1) return "Agora";
      if (m < 60) return `${m} min atrás`;
      return `${Math.floor(m / 60)}h atrás`;
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* DEBUG: mostra erro se houver */}
      {debugError && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white p-4 text-sm">
          <strong>DEBUG ERROR:</strong> {debugError}
        </div>
      )}

      {/* HEADER fixo */}
      <header className="sticky top-0 z-40 glass-dark border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="w-16" />
          <img src="/logo/flashmix-logo.png" alt="Flash Mix" className="h-7 w-auto object-contain" />
          <Link href="/login" className="text-sm text-[#E30613] font-medium hover:text-white">Entrar</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4 space-y-6">
        {/* PLAYER AO VIVO no topo */}
        <section className="relative overflow-hidden rounded-3xl glass-red p-5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(circle at 30% 20%, rgba(227,6,19,0.25) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(11,24,54,0.6) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white glow-red">
                <span className="h-2 w-2 animate-pulse-live rounded-full bg-white" />
                Ao Vivo
              </div>
              <span className="text-xs uppercase tracking-widest text-white/60">Flash Mix Digital</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="pointer-events-none absolute -inset-1 rounded-full border-2 border-[#E30613]/60 animate-glow-pulse" />
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#E30613]/60 bg-gradient-to-br from-[#0B1836] to-[#2a0408] grid place-items-center p-2">
                  <img src="/logo/flashmix-logo.png" alt="Flash Mix" className="object-contain animate-spin-slower w-9 h-6" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[#E30613] font-bold">No Ar</p>
                <h2 className="truncate text-lg font-bold text-white">
                  {nowPlayingTitle}
                </h2>
                <p className="truncate text-sm text-white/70">
                  {nowPlayingArtist}
                </p>
              </div>
              <a
                href="/app/radio"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#E30613] text-white glow-red-strong hover:scale-105 active:scale-95 transition"
                aria-label="Tocar"
              >
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
              </a>
            </div>
          </div>
        </section>

        {/* Programa atual — componente client que atualiza sozinho */}
        <ProgramaAtualCard programas={JSON.parse(JSON.stringify(programasHoje || []))} />

        {/* Atalhos rápidos */}
        <section>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Radio, label: "Rádio", href: "/app/radio", color: "#E30613" },
              { icon: Newspaper, label: "Notícias", href: "/app/noticias", color: "#3b82f6" },
              { icon: Calendar, label: "Programação", href: "/app/programacao", color: "#22c55e" },
              { icon: Gift, label: "Promoções", href: "/app/promocoes", color: "#f59e0b" },
              { icon: Podcast, label: "Podcasts", href: "/app/podcasts", color: "#a855f7" },
              { icon: Video, label: "Vídeos", href: "/app/videos", color: "#ec4899" },
              { icon: MessageSquare, label: "Recados", href: "/app/recados", color: "#06b6d4" },
              { icon: Search, label: "Buscar", href: "/app/busca", color: "#E30613" },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.href} href={q.href} className="group flex flex-col items-center gap-2">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl border transition group-hover:scale-105 group-active:scale-95"
                    style={{ background: `${q.color}20`, borderColor: `${q.color}40`, color: q.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[11px] font-medium text-white/80">{q.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Programação de hoje (preview) */}
        {programasHoje && programasHoje.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">
                Programação {DIAS[today]}
              </h3>
              <Link href="/app/programacao" className="text-xs font-semibold uppercase tracking-wider text-[#E30613]">
                Ver tudo →
              </Link>
            </div>
            <div className="space-y-2">
              {programasHoje.slice(0, 6).map((p, i) => (
                <div key={p.id} className={`glass rounded-2xl p-3 ${i === 0 ? "border-[#E30613]/60" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#E30613] w-12">{p.startTime}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{p.title}</p>
                      {p.locutor && <p className="truncate text-xs text-white/50">{p.locutor.name}</p>}
                    </div>
                    {i === 0 && (
                      <span className="rounded-full bg-[#E30613] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                        Ao Vivo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Últimas tocadas */}
        {musicas && musicas.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Últimas Tocadas</h3>
              <Link href="/app/historico" className="text-xs font-semibold uppercase tracking-wider text-[#E30613]">
                Ver tudo →
              </Link>
            </div>
            <div className="space-y-1.5">
              {musicas.map((m, i) => (
                <Link
                  key={m.id}
                  href="/app/radio"
                  className="group flex w-full items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5 active:scale-[0.98]"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    {m.coverUrl && <img src={m.coverUrl} alt={m.title} className="h-full w-full object-cover" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{m.title}</p>
                    <p className="truncate text-xs text-white/60">{m.artist}</p>
                  </div>
                  <div className="text-right text-xs text-white/50">{fmtTime(m.playedAt)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Promoções */}
        {promocoes && promocoes.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Promoções</h3>
              <Link href="/app/promocoes" className="text-xs font-semibold uppercase tracking-wider text-[#E30613]">
                Ver tudo →
              </Link>
            </div>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
              {promocoes.map((p) => (
                <Link
                  key={p.id}
                  href={`/app/promocoes/${p.id}`}
                  className="group relative h-36 w-60 shrink-0 overflow-hidden rounded-2xl border border-white/10 active:scale-95 transition"
                >
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E30613] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white glow-red">
                      <Sparkles className="h-3 w-3" /> Promo
                    </span>
                    <h4 className="mt-1 line-clamp-1 text-sm font-bold text-white">{p.title}</h4>
                    <p className="line-clamp-1 text-xs text-white/70">{p.prize || p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Notícias */}
        {noticias && noticias.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Notícias</h3>
              <Link href="/app/noticias" className="text-xs font-semibold uppercase tracking-wider text-[#E30613]">
                Ver tudo →
              </Link>
            </div>
            <div className="space-y-2">
              {noticias.map((n) => (
                <Link
                  key={n.id}
                  href={`/app/noticias/${n.id}`}
                  className="group flex gap-3 rounded-2xl p-2 transition hover:bg-white/5 active:scale-[0.98]"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    {n.imageUrl && <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">{n.category}</span>
                    <h4 className="line-clamp-2 text-sm font-semibold text-white">{n.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="glass-red rounded-3xl p-5 text-center">
          <TrendingUp className="mx-auto h-6 w-6 text-[#E30613]" />
          <h3 className="mt-2 text-base font-bold text-white">Top 10 Mais Tocadas</h3>
          <p className="mt-1 text-xs text-white/70">Confira as músicas que bombaram esta semana</p>
          <Link
            href="/app/busca"
            className="mt-3 inline-block rounded-full bg-[#E30613] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white glow-red active:scale-95 transition"
          >
            Ver Top 10
          </Link>
        </section>

        {/* DEBUG: mostra info de debug no final */}
        <div className="text-center text-[10px] text-white/30 pt-4">
          <p>DEBUG: {programasHoje?.length || 0} programas hoje | {musicas?.length || 0} músicas | {noticias?.length || 0} notícias</p>
          {config && <p>Config OK</p>}
          {!config && <p>Sem config — usando defaults</p>}
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-1.5">
          {[
            { href: "/app", label: "Início", icon: Radio, active: true },
            { href: "/app/radio", label: "Rádio", icon: Mic2 },
            { href: "/app/recados", label: "Recados", icon: MessageSquare },
            { href: "/app/programacao", label: "Programação", icon: Calendar },
            { href: "/app/promocoes", label: "Promoções", icon: Gift },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition ${
                  item.active ? "text-[#E30613]" : "text-white/60 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={item.active ? 2.6 : 2} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
