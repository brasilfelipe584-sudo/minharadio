import { db } from "@/lib/db";
import Link from "next/link";
import {
  Mic2, Music, Newspaper, Gift, Video, MessageSquare,
  Users, TrendingUp, Eye, Heart, ChevronRight, Radio, Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    programas, locutores, musicas, noticias, promocoes, podcasts,
    videos, recados, usuarios, banners, favoritos, history,
  ] = await Promise.all([
    db.programa.count(),
    db.locutor.count(),
    db.musica.count(),
    db.noticia.count(),
    db.promocao.count({ where: { isActive: true } }),
    db.podcast.count(),
    db.video.count(),
    db.recado.count(),
    db.user.count(),
    db.banner.count({ where: { isActive: true } }),
    db.favorite.count(),
    db.history.count(),
  ]);

  // Recados pendentes
  const recadosPendentes = await db.recado.count({ where: { status: "PENDING" } });

  // Atividade recente (histórico)
  const recentHistory = await db.history.findMany({
    take: 8,
    orderBy: { playedAt: "desc" },
  });
  const recentMusicIds = recentHistory.filter(h => h.contentType === "MUSICA").map(h => h.contentId);
  const recentMusicas = recentMusicIds.length
    ? await db.musica.findMany({ where: { id: { in: recentMusicIds } } })
    : [];

  const stats = [
    { label: "Programas", value: programas, icon: Mic2, color: "#E30613", href: "/admin/programas" },
    { label: "Locutores", value: locutores, icon: Users, color: "#3b82f6", href: "/admin/locutores" },
    { label: "Músicas", value: musicas, icon: Music, color: "#E30613", href: "/admin/musicas" },
    { label: "Notícias", value: noticias, icon: Newspaper, color: "#3b82f6", href: "/admin/noticias" },
    { label: "Promoções", value: promocoes, icon: Gift, color: "#22c55e", href: "/admin/promocoes" },
    { label: "Podcasts", value: podcasts, icon: Radio, color: "#E30613", href: "/admin/podcasts" },
    { label: "Vídeos", value: videos, icon: Video, color: "#3b82f6", href: "/admin/videos" },
    { label: "Usuários", value: usuarios, icon: Users, color: "#E30613", href: "/admin/usuarios" },
    { label: "Favoritos", value: favoritos, icon: Heart, color: "#22c55e", href: "/admin/usuarios" },
    { label: "Reproduções", value: history, icon: TrendingUp, color: "#3b82f6", href: "/admin/musicas" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/60">Visão geral da Flash Mix Digital</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        >
          Ver Site <ChevronRight className="h-3 w-3" />
        </Link>
      </header>

      {/* Alertas */}
      {recadosPendentes > 0 && (
        <Link
          href="/admin/recados"
          className="block rounded-2xl border border-[#E30613]/40 bg-[#E30613]/10 p-4 transition hover:bg-[#E30613]/20"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E30613] text-white glow-red">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">
                {recadosPendentes} recado{recadosPendentes > 1 ? "s" : ""} pendente{recadosPendentes > 1 ? "s" : ""} de resposta
              </p>
              <p className="text-xs text-white/60">Toque para responder</p>
            </div>
            <ChevronRight className="h-5 w-5 text-[#E30613]" />
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group glass rounded-2xl p-4 transition hover:border-[#E30613]/40 hover:scale-[1.02]"
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-white/50">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Audiência simulada */}
      <section className="glass rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
            <Activity className="h-4 w-4 text-[#E30613]" />
            Audiência em Tempo Real
          </h3>
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-bold text-green-400">
            <span className="h-2 w-2 animate-pulse-live rounded-full bg-green-400" />
            AO VIVO
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Ouvintes agora", value: "1.247", icon: Radio },
            { label: "Pico hoje", value: "1.892", icon: TrendingUp },
            { label: "Sessões hoje", value: "3.541", icon: Eye },
            { label: "Curtidas hoje", value: favoritos, icon: Heart },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-2xl bg-white/5 p-3">
                <Icon className="h-4 w-4 text-[#E30613]" />
                <p className="mt-2 text-xl font-bold text-white">{m.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/50">{m.label}</p>
              </div>
            );
          })}
        </div>
        {/* Mini gráfico de barras (visual) */}
        <div className="mt-4 flex h-24 items-end gap-1.5">
          {Array.from({ length: 24 }).map((_, i) => {
            const h = 30 + Math.sin(i * 0.5) * 25 + Math.random() * 30;
            return (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-[#0B1836] to-[#E30613]"
                style={{ height: `${h}%`, opacity: 0.6 + (i / 24) * 0.4 }}
                title={`${i}h`}
              />
            );
          })}
        </div>
        <p className="mt-2 text-right text-xs text-white/40">Últimas 24 horas</p>
      </section>

      {/* Atividade recente */}
      <section className="glass rounded-3xl p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Atividade Recente</h3>
        {recentHistory.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/50">Nenhuma atividade ainda.</p>
        ) : (
          <div className="space-y-2">
            {recentHistory.map((h) => {
              const musica = recentMusicas.find((m) => m.id === h.contentId);
              return (
                <div key={h.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E30613]/15 text-[#E30613]">
                    <Music className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {musica?.title || `Item ${h.contentId.slice(-6)}`}
                    </p>
                    <p className="text-xs text-white/50">
                      {musica?.artist || h.contentType} •{" "}
                      {new Date(h.playedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Links rápidos */}
      <section>
        <h3 className="mb-2 text-xs uppercase tracking-widest text-white/40">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { href: "/admin/musicas", label: "Cadastrar Música", icon: Music },
            { href: "/admin/noticias", label: "Nova Notícia", icon: Newspaper },
            { href: "/admin/promocoes", label: "Nova Promoção", icon: Gift },
            { href: "/admin/radio", label: "Atualizar Now Playing", icon: Radio },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-2xl bg-[#E30613]/10 p-3 transition hover:bg-[#E30613]/20"
              >
                <Icon className="h-5 w-5 text-[#E30613]" />
                <span className="text-sm font-medium text-white">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
