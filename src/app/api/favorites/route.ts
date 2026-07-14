import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ items: [] });

  const { searchParams } = new URL(req.url);
  const contentType = searchParams.get("contentType");

  const where: any = { userId: (session.user as any).id };
  if (contentType) where.contentType = contentType;

  const items = await db.favorite.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { contentType, contentId } = await req.json();
  if (!contentType || !contentId) {
    return NextResponse.json({ error: "contentType e contentId obrigatórios" }, { status: 400 });
  }

  try {
    const fav = await db.favorite.create({
      data: {
        userId: (session.user as any).id,
        contentType,
        contentId,
      },
    });
    return NextResponse.json({ ok: true, id: fav.id, favorited: true });
  } catch (e: any) {
    // Já existe → remove
    if (e?.code === "P2002") {
      await db.favorite.deleteMany({
        where: {
          userId: (session.user as any).id,
          contentType,
          contentId,
        },
      });
      return NextResponse.json({ ok: true, favorited: false });
    }
    return NextResponse.json({ error: e.message ?? "Erro" }, { status: 500 });
  }
}
