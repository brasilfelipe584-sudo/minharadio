import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import Link from "next/link";
import { Sparkles, Users, Trophy, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PromocoesPage() {
  const promocoes = await db.promocao.findMany({
    where: { isActive: true },
    orderBy: { endDate: "asc" },
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-white">Promoções</h1>
          <p className="text-sm text-white/60">Participe e concorra a prêmios</p>
        </header>

        {promocoes.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/50">Nenhuma promoção ativa no momento.</p>
        ) : (
          <div className="space-y-4">
            {promocoes.map((p) => (
              <Link
                key={p.id}
                href={`/promocoes/${p.id}`}
                className="group block overflow-hidden rounded-3xl glass transition hover:border-[#E30613]/40"
              >
                {p.imageUrl && (
                  <div className="relative h-44 overflow-hidden">
                    { }
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#E30613] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white glow-red">
                      <Sparkles className="h-3 w-3" />
                      Promoção
                    </span>
                    {p.prize && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                        <Trophy className="h-3 w-3" />
                        {p.prize}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#E30613] transition">
                    {p.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/70">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {p.participants} participantes
                    </span>
                    {p.endDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        até {new Date(p.endDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
