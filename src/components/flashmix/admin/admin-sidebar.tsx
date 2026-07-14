"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Mic2, User, Music, Newspaper, Podcast, Gift,
  Video, Image as ImageIcon, MessageSquare, Users, Tags, Radio,
  Menu, X, ChevronRight, LogOut, ExternalLink,
} from "lucide-react";

const menu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/radio", label: "Rádio (Now Playing)", icon: Radio },
  { href: "/admin/programas", label: "Programas", icon: Mic2 },
  { href: "/admin/locutores", label: "Locutores", icon: User },
  { href: "/admin/musicas", label: "Músicas", icon: Music },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { href: "/admin/podcasts", label: "Podcasts", icon: Podcast },
  { href: "/admin/promocoes", label: "Promoções", icon: Gift },
  { href: "/admin/videos", label: "Vídeos", icon: Video },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/recados", label: "Recados", icon: MessageSquare },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {menu.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? "bg-[#E30613] text-white glow-red"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {active && <ChevronRight className="ml-auto h-4 w-4" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between glass-dark px-4 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/5"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image
          src="/logo/flashmix-logo.png"
          alt="Flash Mix Digital"
          width={100}
          height={68}
          className="h-7 w-auto object-contain"
        />
        <Link
          href="/"
          className="grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/5"
          aria-label="Ver site"
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 glass-dark p-4 animate-slide-up">
            <div className="mb-4 flex items-center justify-between">
              <Image
                src="/logo/flashmix-logo.png"
                alt="Flash Mix Digital"
                width={120}
                height={82}
              />
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="mt-4 border-t border-white/5 pt-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5"
              >
                <ExternalLink className="h-4 w-4" /> Ver Site
              </Link>
              <button
                onClick={() => router.push("/login")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col glass-dark border-r border-white/5 lg:flex">
        <div className="border-b border-white/5 p-5">
          <Image
            src="/logo/flashmix-logo.png"
            alt="Flash Mix Digital"
            width={140}
            height={96}
            className="object-contain"
          />
          <p className="mt-1 text-xs uppercase tracking-widest text-white/40">Painel Admin</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <NavLinks />
        </div>
        <div className="border-t border-white/5 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5"
          >
            <ExternalLink className="h-4 w-4" /> Ver Site
          </Link>
        </div>
      </aside>
    </>
  );
}
