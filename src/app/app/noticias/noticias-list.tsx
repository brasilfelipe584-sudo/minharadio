"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Share2, Heart, Clock } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/flashmix/section-header";

type Noticia = {
  id: string; title: string; summary: string; content: string;
  imageUrl?: string | null; category: string; publishedAt: string; isFeatured: boolean;
};

export function NoticiasList({
  noticias, categorias, currentCategory, currentQuery,
}: {
  noticias: Noticia[];
  categorias: string[];
  currentCategory: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(currentQuery);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q); else params.delete("q");
    router.push(`/app/noticias?${params.toString()}`);
  };

  const setCategory = (c: string) => {
    const params = new URLSearchParams(sp.toString());
    if (c === "Todas") params.delete("category"); else params.set("category", c);
    router.push(`/app/noticias?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-white">Notícias</h1>
        <p className="text-sm text-white/60">Fique por dentro do que acontece</p>
      </header>

      {/* Busca */}
      <form onSubmit={submitSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar notícia..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
        />
      </form>

      {/* Filtros */}
      <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
              currentCategory === c
                ? "bg-[#E30613] text-white glow-red"
                : "border border-white/15 text-white/70 hover:bg-white/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista */}
      {noticias.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/50">Nenhuma notícia encontrada.</p>
      ) : (
        <div className="space-y-3">
          {noticias.map((n) => (
            <Link
              key={n.id}
              href={`/noticias/${n.id}`}
              className="group block overflow-hidden rounded-2xl glass transition hover:border-[#E30613]/40"
            >
              {n.imageUrl && (
                <div className="relative h-40 overflow-hidden">
                  { }
                  <img
                    src={n.imageUrl}
                    alt={n.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#E30613] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white glow-red">
                    {n.category}
                  </span>
                  {n.isFeatured && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      ★ Destaque
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="line-clamp-2 text-base font-bold text-white group-hover:text-[#E30613] transition">
                  {n.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/60">{n.summary}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <Clock className="h-3 w-3" />
                    {fmtDate(n.publishedAt)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="grid h-7 w-7 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-[#E30613] transition"
                      aria-label="Curtir"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="grid h-7 w-7 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition"
                      aria-label="Compartilhar"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
