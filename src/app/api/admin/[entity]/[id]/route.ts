import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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

const INCLUDES: Record<string, any> = {
  programas: { locutor: true },
};

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { entity, id } = await params;
  const model = MODELS[entity];
  if (!model) return NextResponse.json({ error: "Entidade inválida" }, { status: 404 });

  const data = await req.json();
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;

  try {
    const item = await model.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { entity, id } = await params;
  const model = MODELS[entity];
  if (!model) return NextResponse.json({ error: "Entidade inválida" }, { status: 404 });

  try {
    await model.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro ao excluir" }, { status: 500 });
  }
}
