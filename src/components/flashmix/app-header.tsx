"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Bell, UserCircle2, X } from "lucide-react";
import Image from "next/image";

const menuItems = [
  { label: "Início", href: "/app" },
  { label: "Rádio", href: "/app/radio" },
  { label: "Notícias", href: "/app/noticias" },
  { label: "Programação", href: "/app/programacao" },
  { label: "Promoções", href: "/app/promocoes" },
  { label: "Podcasts", href: "/app/podcasts" },
  { label: "Vídeos", href: "/app/videos" },
  { label: "Recados", href: "/app/recados" },
  { label: "Favoritos", href: "/app/favoritos" },
  { label: "Histórico", href: "/app/historico" },
  { label: "Busca", href: "/app/busca" },
  { label: "Perfil", href: "/app/perfil" },
  { label: "Configurações", href: "/app/configuracoes" },
  { label: "Entrar", href: "/login" },
];

export function AppHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Evita hidratação: só renderiza elementos interativos após montagem
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 glass-dark border-b border-white/5">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-3 sm:max-w-2xl sm:px-4">
        {/* Menu lateral - só funciona no cliente */}
        <button
          aria-label="Abrir menu"
          onClick={() => mounted && setMenuOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/5 hover:text-white transition"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo central */}
        <Link
          href="/app"
          className="flex items-center gap-2"
          aria-label="Flash Mix Digital"
        >
          <Image
            src="/logo/flashmix-logo.png"
            alt="Flash Mix Digital"
            width={120}
            height={82}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Notificações + perfil */}
        <div className="flex items-center gap-1">
          <button
            aria-label="Notificações"
            onClick={() => router.push("/app/notificacoes")}
            className="relative grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E30613] glow-red" />
          </button>
          <button
            aria-label="Perfil"
            onClick={() => router.push("/app/perfil")}
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            <UserCircle2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Drawer lateral — renderizado condicionalmente no cliente para evitar hidratação */}
      {mounted && menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 glass-dark p-4 animate-slide-up overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <Image
                src="/logo/flashmix-logo.png"
                alt="Flash Mix Digital"
                width={120}
                height={82}
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/5"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col px-2 py-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
