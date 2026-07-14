import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const data = await req.json();
  const existing = await db.radioConfig.findFirst();

  let config;
  if (existing) {
    config = await db.radioConfig.update({
      where: { id: existing.id },
      data: {
        streamUrl: data.streamUrl,
        streamName: data.streamName,
        nowPlayingTitle: data.nowPlayingTitle || null,
        nowPlayingArtist: data.nowPlayingArtist || null,
        isLive: data.isLive,
      },
    });
  } else {
    config = await db.radioConfig.create({
      data: {
        streamUrl: data.streamUrl,
        streamName: data.streamName,
        nowPlayingTitle: data.nowPlayingTitle || null,
        nowPlayingArtist: data.nowPlayingArtist || null,
        isLive: data.isLive,
      },
    });
  }

  return NextResponse.json({ ok: true, config });
}
