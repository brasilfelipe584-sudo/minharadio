import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// Mapeia entidade → model do Prisma
const MODELS: Record<string, any> = {
  programas: db.programa,
  locutores: db.locutor,
  musicas: db.musica,
  noticias: db.noticia,
  podcasts: db.podcast,
  promocoes: db.promocao,
  videos: db.video,
  banners: db.banner,
  recados: db.recado,
  usuarios: db.user,
  categorias: db.categoria,
};

// Campos de relacionamento a incluir por entidade
const INCLUDES: Record<string, any> = {
  programas: { locutor: true },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { entity } = await params;
  const model = MODELS[entity];
  if (!model) return NextResponse.json({ error: "Entidade inválida" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const where: any = {};
  if (q) {
    // Busca em campos comuns
    if (entity === "musicas") where.OR = [{ title: { contains: q } }, { artist: { contains: q } }];
    else if (entity === "usuarios") where.OR = [{ email: { contains: q } }, { name: { contains: q } }];
    else if (entity === "noticias") where.title = { contains: q };
    else where.title = { contains: q };
  }

  const items = await model.findMany({
    where,
    include: INCLUDES[entity],
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ items });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { entity } = await params;
  const model = MODELS[entity];
  if (!model) return NextResponse.json({ error: "Entidade inválida" }, { status: 404 });

  const data = await req.json();
  // Sanitiza: remove campos que não devem ser criados pelo cliente
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;

  try {
    const item = await model.create({ data });
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro ao criar" }, { status: 500 });
  }
}
