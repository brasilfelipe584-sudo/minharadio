import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import {
  Play, Pause, Heart, Share2, Volume2, Moon, Cast, Bluetooth,
  ChevronLeft, Clock, Radio as RadioIcon, Mic2,
} from "lucide-react";
import { RadioClient } from "./radio-client";

export const dynamic = "force-dynamic";


export default async function RadioPage() {
  let historico: any[] = [];
  let config: any = null;

  try {
    [historico, config] = await Promise.all([
      db.musica.findMany({ orderBy: { playedAt: "desc" }, take: 8 }),
      db.radioConfig.findFirst(),
    ]);
  } catch (e) {}

  const streamUrl = config?.streamUrl || "http://s02.taaqui.org:8874/stream";
  const nowPlayingTitle = config?.nowPlayingTitle || "Flash Mix Digital - Ao Vivo";
  const nowPlayingArtist = config?.nowPlayingArtist || "Campo Grande / MS";

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 glass-dark border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/app" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>
          <Image src="/logo/flashmix-logo.png" alt="Flash Mix" width={100} height={68} className="h-7 w-auto object-contain" />
          <Link href="/login" className="text-sm text-[#E30613] font-medium">Entrar</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        <RadioClient
          streamUrl={streamUrl}
          nowPlayingTitle={nowPlayingTitle}
          nowPlayingArtist={nowPlayingArtist}
          historico={JSON.parse(JSON.stringify(historico))}
        />
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-1.5">
          {[
            { href: "/app", label: "Início", icon: Mic2 },
            { href: "/app/radio", label: "Rádio", icon: RadioIcon, active: true },
            { href: "/app/recados", label: "Recados", icon: Mic2 },
            { href: "/app/programacao", label: "Programação", icon: Clock },
            { href: "/app/promocoes", label: "Promoções", icon: Mic2 },
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
