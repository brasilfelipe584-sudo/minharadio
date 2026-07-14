import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { BuscaContent } from "./busca-content";

export const dynamic = "force-dynamic";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim();

  let results: any = { musicas: [], noticias: [], podcasts: [], programas: [], promocoes: [], locutores: [], videos: [] };

  if (q) {
    const [musicas, noticias, podcasts, programas, promocoes, locutores, videos] = await Promise.all([
      db.musica.findMany({ where: { OR: [{ title: { contains: q } }, { artist: { contains: q } }] }, take: 10 }),
      db.noticia.findMany({ where: { OR: [{ title: { contains: q } }, { summary: { contains: q } }] }, take: 10 }),
      db.podcast.findMany({ where: { title: { contains: q } }, take: 10 }),
      db.programa.findMany({ where: { title: { contains: q } }, take: 10 }),
      db.promocao.findMany({ where: { title: { contains: q } }, take: 10 }),
      db.locutor.findMany({ where: { name: { contains: q } }, take: 10 }),
      db.video.findMany({ where: { title: { contains: q } }, take: 10 }),
    ]);
    results = { musicas, noticias, podcasts, programas, promocoes, locutores, videos };
  }

  // Top 10 mais tocadas
  const top10 = await db.musica.findMany({ orderBy: { playedAt: "desc" }, take: 10 });

  // Categorias
  const categorias = await db.categoria.findMany({ orderBy: { order: "asc" } });

  return (
    <AppShell>
      <BuscaContent
        initialQuery={q || ""}
        results={JSON.parse(JSON.stringify(results))}
        top10={JSON.parse(JSON.stringify(top10))}
        categorias={JSON.parse(JSON.stringify(categorias))}
        isTop10={sp.type === "top10"}
      />
    </AppShell>
  );
}
