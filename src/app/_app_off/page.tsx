import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { HomeContent } from "../home-content";

export const revalidate = 60;

export default async function AppHomePage() {
  const today = new Date().getDay();

  const [programaAtual, destaques, musicas, categorias, noticias, promocoes, banner, programasHoje] =
    await Promise.all([
      db.programa.findFirst({
        where: { isLive: true },
        include: { locutor: true },
      }) ??
        db.programa.findFirst({
          where: { dayOfWeek: today },
          orderBy: { startTime: "asc" },
          include: { locutor: true },
        }),
      db.programa.findMany({ take: 6, include: { locutor: true }, orderBy: { startTime: "asc" } }),
      db.musica.findMany({ orderBy: { playedAt: "desc" }, take: 10 }),
      db.categoria.findMany({ orderBy: { order: "asc" } }),
      db.noticia.findMany({ orderBy: { publishedAt: "desc" }, take: 6 }),
      db.promocao.findMany({ where: { isActive: true }, take: 4, orderBy: { endDate: "asc" } }),
      db.banner.findFirst({ where: { isActive: true, position: "home" }, orderBy: { order: "asc" } }),
      db.programa.findMany({
        where: { dayOfWeek: today },
        include: { locutor: true },
        orderBy: { startTime: "asc" },
      }),
    ]);

  return (
    <AppShell>
      <HomeContent
        programaAtual={JSON.parse(JSON.stringify(programaAtual))}
        destaques={JSON.parse(JSON.stringify(destaques))}
        musicas={JSON.parse(JSON.stringify(musicas))}
        categorias={JSON.parse(JSON.stringify(categorias))}
        noticias={JSON.parse(JSON.stringify(noticias))}
        promocoes={JSON.parse(JSON.stringify(promocoes))}
        programasHoje={JSON.parse(JSON.stringify(programasHoje))}
        banner={JSON.parse(JSON.stringify(banner))}
      />
    </AppShell>
  );
}
