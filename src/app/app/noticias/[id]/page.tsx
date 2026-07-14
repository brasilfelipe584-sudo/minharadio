import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import Link from "next/link";
import { ChevronLeft, Clock, Heart, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NoticiaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticia = await db.noticia.findUnique({ where: { id } });
  if (!noticia) return notFound();

  // Incrementa views
  await db.noticia.update({ where: { id }, data: { views: { increment: 1 } } });

  const relacionadas = await db.noticia.findMany({
    where: { id: { not: id }, category: noticia.category },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <Link
          href="/app/noticias"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para Notícias
        </Link>

        {noticia.imageUrl && (
          <div className="relative h-56 overflow-hidden rounded-3xl border border-white/10">
            { }
            <img src={noticia.imageUrl} alt={noticia.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-[#E30613] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white glow-red">
              {noticia.category}
            </span>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold leading-tight text-white">{noticia.title}</h1>
          <p className="mt-2 text-sm text-white/50">
            {new Date(noticia.publishedAt).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
            {" • "}
            {noticia.views} visualizações
          </p>
        </div>

        <p className="text-base font-medium text-white/80">{noticia.summary}</p>

        <div className="prose prose-invert max-w-none">
          {noticia.content.split("\n").map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-white/80">{p}</p>
          ))}
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
            <Heart className="h-4 w-4" /> Curtir
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
            <Share2 className="h-4 w-4" /> Compartilhar
          </button>
        </div>

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <section>
            <h3 className="mb-3 px-1 text-base font-bold uppercase tracking-wide text-white">
              Relacionadas
            </h3>
            <div className="space-y-2">
              {relacionadas.map((r) => (
                <Link
                  key={r.id}
                  href={`/noticias/${r.id}`}
                  className="flex gap-3 rounded-2xl p-2 hover:bg-white/5 transition"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    {r.imageUrl && (
                       
                      <img src={r.imageUrl} alt={r.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">
                      {r.category}
                    </span>
                    <h4 className="line-clamp-2 text-sm font-semibold text-white">{r.title}</h4>
                    <p className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="h-3 w-3" />
                      {new Date(r.publishedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
