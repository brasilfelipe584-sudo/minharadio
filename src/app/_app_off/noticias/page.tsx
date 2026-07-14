import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { NoticiasList } from "./noticias-list";

export const dynamic = "force-dynamic";

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.category && sp.category !== "Todas") where.category = sp.category;
  if (sp.q) where.title = { contains: sp.q };

  const [noticias, categorias] = await Promise.all([
    db.noticia.findMany({ where, orderBy: { publishedAt: "desc" } }),
    db.noticia.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  return (
    <AppShell>
      <NoticiasList
        noticias={JSON.parse(JSON.stringify(noticias))}
        categorias={["Todas", ...categorias.map((c) => c.category)]}
        currentCategory={sp.category || "Todas"}
        currentQuery={sp.q || ""}
      />
    </AppShell>
  );
}
