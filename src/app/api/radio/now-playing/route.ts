import { NextResponse } from "next/server";
import { db } from "@/lib/db";

let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 10_000;

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const streamUrl = process.env.STREAM_URL || "http://s02.taaqui.org:8874/stream";
  const streamName = process.env.STREAM_NAME || "Flash Mix Digital";

  const config = await db.radioConfig.findFirst();

  const current = config?.nowPlayingTitle
    ? null
    : await db.musica.findFirst({
        where: { isPlaying: true },
        orderBy: { playedAt: "desc" },
      }) ?? await db.musica.findFirst({
        orderBy: { playedAt: "desc" },
      });

  const data = {
    streamUrl: config?.streamUrl || streamUrl,
    streamName: config?.streamName || streamName,
    isLive: config?.isLive ?? true,
    title: config?.nowPlayingTitle || current?.title || "Flash Mix Digital - Ao Vivo",
    artist: config?.nowPlayingArtist || current?.artist || "Campo Grande / MS",
    coverUrl: current?.coverUrl || null,
  };

  cache = { data, ts: Date.now() };
  return NextResponse.json(data);
}
