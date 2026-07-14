import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ items: [] });

  const items = await db.recado.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  const { userName, city, message, isPublic } = await req.json();
  if (!userName || !message) {
    return NextResponse.json({ error: "Nome e mensagem são obrigatórios" }, { status: 400 });
  }

  const recado = await db.recado.create({
    data: {
      userId: (session?.user as any)?.id || null,
      userName,
      city: city || null,
      message,
      isPublic: isPublic ?? true,
      status: "PENDING",
    },
  });
  return NextResponse.json({ ok: true, id: recado.id });
}
