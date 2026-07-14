"use client";

import Link from "next/link";
import { useState } from "react";
import { Music, Newspaper, Mic2, Radio, Gift, Video, Heart, Trash2 } from "lucide-react";

type Item = {
  id: string;
  contentType: string;
  createdAt: string;
  item: {
    id: string;
    title: string;
    artist?: string;
    summary?: string;
    description?: string;
    coverUrl?: string | null;
    imageUrl?: string | null;
    category?: string | null;
  };
};

const tabs = [
  { id: "all", label: "Tudo", icon: Heart },
  { id: "MUSICA", label: "Músicas", icon: Music },
  { id: "NOTICIA", label: "Notícias", icon: Newspaper },
  { id: "PODCAST", label: "Podcasts", icon: Mic2 },
  { id: "PROGRAMA", label: "Programas", icon: Radio },
  { id: "PROMOCAO", label: "Promoções", icon: Gift },
  { id: "VIDEO", label: "Vídeos", icon: Video },
];

export function FavoritosContent({ items }: { items: Item[] }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? items : items.filter((i) => i.contentType === tab);

  const hrefFor = (item: Item) => {
    switch (item.contentType) {
      case "MUSICA": return "/radio";
      case "NOTICIA": return `/noticias/${item.item.id}`;
      case "PODCAST": return "/podcasts";
      case "PROGRAMA": return "/programacao";
      case "PROMOCAO": return `/promocoes/${item.item.id}`;
      case "VIDEO": return "/videos";
      default: return "#";
    }
  };

  const removeFav = async (item: Item) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: item.contentType, contentId: item.contentId }),
    });
    // Recarrega
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Favoritos</h1>
        <p className="text-sm text-white/60">{items.length} itens salvos</p>
      </header>

      {/* Tabs */}
      <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                tab === t.id
                  ? "bg-[#E30613] text-white glow-red"
                  : "border border-white/15 text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon className="h-3 w-3" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/50">Nenhum favorito nesta categoria.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <div key={`${f.contentType}-${f.contentId}`} className="group flex items-center gap-3 rounded-2xl glass p-2">
              <Link href={hrefFor(f)} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  {(f.item.coverUrl || f.item.imageUrl) && (
                     
                    <img
                      src={f.item.coverUrl || f.item.imageUrl!}
                      alt={f.item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">
                    {f.contentType}
                  </span>
                  <p className="truncate text-sm font-semibold text-white">{f.item.title}</p>
                  <p className="truncate text-xs text-white/60">
                    {f.item.artist || f.item.summary || f.item.description || f.item.category}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => removeFav(f)}
                className="grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-[#E30613] transition"
                aria-label="Remover dos favoritos"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
