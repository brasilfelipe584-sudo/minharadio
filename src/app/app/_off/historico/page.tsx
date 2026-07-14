import { db } from "@/lib/db";
import { auth } from "@/auth";
import { AppShell } from "@/components/flashmix/app-shell";
import { redirect } from "next/navigation";
import { HistoryContent } from "./historico-content";

export const dynamic = "force-dynamic";

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const period = sp.period || "all";

  const now = new Date();
  let since = new Date(0);
  if (period === "today") { since = new Date(now); since.setHours(0, 0, 0, 0); }
  else if (period === "week") { since = new Date(now); since.setDate(now.getDate() - 7); }
  else if (period === "month") { since = new Date(now); since.setMonth(now.getMonth() - 1); }

  const userId = (session.user as any).id;
  const history = await db.history.findMany({
    where: { userId, playedAt: { gte: since } },
    orderBy: { playedAt: "desc" },
    take: 100,
  });

  const musicIds = history.filter(h => h.contentType === "MUSICA").map(h => h.contentId);
  const podcastIds = history.filter(h => h.contentType === "PODCAST").map(h => h.contentId);
  const videoIds = history.filter(h => h.contentType === "VIDEO").map(h => h.contentId);

  const [musicas, podcasts, videos] = await Promise.all([
    musicIds.length ? db.musica.findMany({ where: { id: { in: musicIds } } }) : Promise.resolve([]),
    podcastIds.length ? db.podcast.findMany({ where: { id: { in: podcastIds } } }) : Promise.resolve([]),
    videoIds.length ? db.video.findMany({ where: { id: { in: videoIds } } }) : Promise.resolve([]),
  ]);

  const enriched = history.map((h) => {
    let item: any = null;
    if (h.contentType === "MUSICA") item = musicas.find((m) => m.id === h.contentId);
    else if (h.contentType === "PODCAST") item = podcasts.find((m) => m.id === h.contentId);
    else if (h.contentType === "VIDEO") item = videos.find((m) => m.id === h.contentId);
    return { ...h, item };
  }).filter((h) => h.item);

  return (
    <AppShell>
      <HistoryContent items={JSON.parse(JSON.stringify(enriched))} period={period} />
    </AppShell>
  );
}
