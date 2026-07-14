import { db } from "@/lib/db";
import { auth } from "@/auth";
import { AppShell } from "@/components/flashmix/app-shell";
import { FavoritosContent } from "./favoritos-content";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const favoritos = await db.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Busca entidades relacionadas
  const idsByType: Record<string, Set<string>> = {};
  for (const f of favoritos) {
    if (!idsByType[f.contentType]) idsByType[f.contentType] = new Set();
    idsByType[f.contentType].add(f.contentId);
  }

  const [musicas, noticias, podcasts, programas, promocoes, videos] = await Promise.all([
    idsByType.MUSICA ? db.musica.findMany({ where: { id: { in: [...idsByType.MUSICA] } } }) : [],
    idsByType.NOTICIA ? db.noticia.findMany({ where: { id: { in: [...idsByType.NOTICIA] } } }) : [],
    idsByType.PODCAST ? db.podcast.findMany({ where: { id: { in: [...idsByType.PODCAST] } } }) : [],
    idsByType.PROGRAMA ? db.programa.findMany({ where: { id: { in: [...idsByType.PROGRAMA] } } }) : [],
    idsByType.PROMOCAO ? db.promocao.findMany({ where: { id: { in: [...idsByType.PROMOCAO] } } }) : [],
    idsByType.VIDEO ? db.video.findMany({ where: { id: { in: [...idsByType.VIDEO] } } }) : [],
  ]);

  const merged = favoritos.map((f) => {
    let item: any = null;
    switch (f.contentType) {
      case "MUSICA": item = musicas.find((m) => m.id === f.contentId); break;
      case "NOTICIA": item = noticias.find((m) => m.id === f.contentId); break;
      case "PODCAST": item = podcasts.find((m) => m.id === f.contentId); break;
      case "PROGRAMA": item = programas.find((m) => m.id === f.contentId); break;
      case "PROMOCAO": item = promocoes.find((m) => m.id === f.contentId); break;
      case "VIDEO": item = videos.find((m) => m.id === f.contentId); break;
    }
    return { ...f, item };
  }).filter((f) => f.item);

  return (
    <AppShell>
      <FavoritosContent items={JSON.parse(JSON.stringify(merged))} />
    </AppShell>
  );
}
