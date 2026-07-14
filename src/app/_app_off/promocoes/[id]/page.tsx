import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import Link from "next/link";
import { ChevronLeft, Users, Trophy, Calendar, Sparkles, Share2, Heart, FileText } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PromocaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await db.promocao.findUnique({ where: { id } });
  if (!p) return notFound();

  await db.promocao.update({ where: { id }, data: { participants: { increment: 1 } } });

  return (
    <AppShell>
      <div className="space-y-5">
        <Link href="/app/promocoes" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
          <ChevronLeft className="h-4 w-4" /> Voltar para Promoções
        </Link>

        {p.imageUrl && (
          <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10">
            { }
            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#E30613] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white glow-red">
              <Sparkles className="h-3 w-3" /> Promoção
            </span>
            {p.prize && (
              <div className="absolute inset-x-4 bottom-4">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-black/60 px-4 py-2 backdrop-blur">
                  <Trophy className="h-5 w-5 text-[#E30613]" />
                  <span className="text-base font-bold text-white">{p.prize}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-white">{p.title}</h1>
          <p className="mt-2 text-sm text-white/70">{p.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-3 text-center">
            <Users className="mx-auto h-5 w-5 text-[#E30613]" />
            <p className="mt-1 text-lg font-bold text-white">{p.participants}</p>
            <p className="text-xs text-white/60">Participantes</p>
          </div>
          {p.endDate && (
            <div className="glass rounded-2xl p-3 text-center">
              <Calendar className="mx-auto h-5 w-5 text-[#E30613]" />
              <p className="mt-1 text-sm font-bold text-white">
                {new Date(p.endDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </p>
              <p className="text-xs text-white/60">Encerra em</p>
            </div>
          )}
        </div>

        {p.rules && (
          <section className="glass rounded-3xl p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#E30613]">
              <FileText className="h-4 w-4" /> Regulamento
            </h3>
            <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">{p.rules}</p>
          </section>
        )}

        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#E30613] py-3.5 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-[1.02] active:scale-95 transition">
            <Sparkles className="h-4 w-4" /> Participar
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition" aria-label="Favoritar">
            <Heart className="h-5 w-5" />
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition" aria-label="Compartilhar">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
