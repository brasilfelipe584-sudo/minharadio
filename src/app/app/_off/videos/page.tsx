import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { VideosContent } from "./videos-content";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await db.video.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <AppShell>
      <VideosContent videos={JSON.parse(JSON.stringify(videos))} />
    </AppShell>
  );
}
