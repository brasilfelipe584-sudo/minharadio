"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Heart, History, MessageSquare, Settings, Bell, HelpCircle, Star,
  LogOut, ChevronRight, Calendar, User as UserIcon, Clock,
} from "lucide-react";

type User = {
  id: string; email: string; name: string | null;
  role: string; isGuest: boolean;
  city: string | null; state: string | null;
  avatarUrl: string | null; createdAt: string;
};

export function PerfilContent({ user, stats }: { user: User; stats: { favoritos: number; historico: number; recados: number } }) {
  const router = useRouter();

  const tempoOuvindo = (() => {
    const dias = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (dias < 1) return "Hoje";
    if (dias < 30) return `${dias} dias`;
    const m = Math.floor(dias / 30);
    return `${m} ${m === 1 ? "mês" : "meses"}`;
  })();

  const menuGroups = [
    {
      title: "Atividade",
      items: [
        { icon: Heart, label: "Favoritos", href: "/favoritos", count: stats.favoritos },
        { icon: History, label: "Histórico", href: "/historico", count: stats.historico },
        { icon: MessageSquare, label: "Recados", href: "/recados", count: stats.recados },
      ],
    },
    {
      title: "Conta",
      items: [
        { icon: Bell, label: "Notificações", href: "/notificacoes" },
        { icon: Settings, label: "Configurações", href: "/configuracoes" },
      ],
    },
    {
      title: "Sobre",
      items: [
        { icon: HelpCircle, label: "Ajuda / Fale Conosco", href: "/sobre" },
        { icon: Star, label: "Avaliar aplicativo", href: "/sobre" },
        { icon: UserIcon, label: "Sobre o App", href: "/sobre" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header do perfil */}
      <header className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-[#E30613]/60 bg-gradient-to-br from-[#0B1836] to-[#2a0408] text-3xl font-bold text-white glow-red">
            {user.name?.charAt(0).toUpperCase() || "V"}
          </div>
          {user.role === "ADMIN" && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#E30613] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Admin
            </span>
          )}
        </div>
        <h1 className="mt-3 text-xl font-bold text-white">{user.name || "Visitante"}</h1>
        <p className="text-sm text-white/60">{user.email}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
          {user.city && <span className="flex items-center gap-1">📍 {user.city}{user.state ? `/${user.state}` : ""}</span>}
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Desde {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ouvindo há {tempoOuvindo}</span>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: "Favoritos", value: stats.favoritos, icon: Heart },
          { label: "Histórico", value: stats.historico, icon: History },
          { label: "Recados", value: stats.recados, icon: MessageSquare },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={
                s.label === "Favoritos" ? "/favoritos" :
                s.label === "Histórico" ? "/historico" :
                "/recados"
              }
              className="glass flex flex-col items-center gap-1 rounded-2xl p-3 transition hover:border-[#E30613]/40"
            >
              <Icon className="h-5 w-5 text-[#E30613]" />
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/60">{s.label}</p>
            </Link>
          );
        })}
      </section>

      {/* Menu */}
      {menuGroups.map((group) => (
        <section key={group.title}>
          <h3 className="mb-2 px-1 text-xs uppercase tracking-widest text-white/40">{group.title}</h3>
          <div className="glass overflow-hidden rounded-2xl">
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 transition hover:bg-white/5 ${
                    i < group.items.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#E30613]" />
                  <span className="flex-1 text-sm font-medium text-white">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">{item.count}</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Admin */}
      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          className="block rounded-2xl border border-[#E30613]/50 bg-[#E30613]/10 p-4 text-center text-sm font-bold uppercase tracking-wider text-[#E30613] transition hover:bg-[#E30613]/20"
        >
          ⚙️ Painel Administrativo
        </Link>
      )}

      {/* Sair */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-white hover:bg-[#E30613]/10 hover:text-[#E30613] transition"
      >
        <LogOut className="h-4 w-4" />
        Sair da Conta
      </button>
    </div>
  );
}
