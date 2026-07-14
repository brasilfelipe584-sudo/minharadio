import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { PodcastsContent } from "./podcasts-content";

export const dynamic = "force-dynamic";

export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.category) where.category = sp.category;

  const [podcasts, categorias] = await Promise.all([
    db.podcast.findMany({ where, orderBy: { publishedAt: "desc" } }),
    db.podcast.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  return (
    <AppShell>
      <PodcastsContent
        podcasts={JSON.parse(JSON.stringify(podcasts))}
        categorias={["Todos", ...categorias.map((c) => c.category).filter(Boolean)]}
        currentCategory={sp.category || "Todos"}
      />
    </AppShell>
  );
}
