import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ items: [] });

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "all"; // today | week | month | all

  const now = new Date();
  let since = new Date(0);
  if (period === "today") {
    since = new Date(now);
    since.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    since = new Date(now);
    since.setDate(now.getDate() - 7);
  } else if (period === "month") {
    since = new Date(now);
    since.setMonth(now.getMonth() - 1);
  }

  const items = await db.history.findMany({
    where: {
      userId: (session.user as any).id,
      playedAt: { gte: since },
    },
    orderBy: { playedAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
  }

  const { contentType, contentId } = await req.json();
  if (!contentType || !contentId) {
    return NextResponse.json({ error: "contentType e contentId obrigatórios" }, { status: 400 });
  }

  const item = await db.history.create({
    data: {
      userId: (session.user as any).id,
      contentType,
      contentId,
    },
  });
  return NextResponse.json({ ok: true, id: item.id });
}
