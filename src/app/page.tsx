import { db } from "@/lib/db";
import { LandingClient } from "./landing-client";

export const dynamic = "force-dynamic";

// ISR 60s

export default async function LandingPage() {
  let programaAtual: any = null;
  let promocoes: any[] = [];
  let noticias: any[] = [];
  let programasHoje: any[] = [];
  let config: any = null;

  try {
    [programaAtual, promocoes, noticias, programasHoje, config] = await Promise.all([
      db.programa.findFirst({
        where: { isLive: true },
        include: { locutor: true },
      }) ??
        db.programa.findFirst({
          where: { dayOfWeek: new Date().getDay() },
          orderBy: { startTime: "asc" },
          include: { locutor: true },
        }),
      db.promocao.findMany({ where: { isActive: true }, orderBy: { endDate: "asc" }, take: 3 }),
      db.noticia.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
      db.programa.findMany({
        where: { dayOfWeek: new Date().getDay() },
        orderBy: { startTime: "asc" },
        take: 8,
        include: { locutor: true },
      }),
      db.radioConfig.findFirst(),
    ]);
  } catch (e) {
    // Banco indisponível, segue com arrays vazios
  }

  return (
    <LandingClient
      config={config ? JSON.parse(JSON.stringify(config)) : null}
      programaAtual={programaAtual ? JSON.parse(JSON.stringify(programaAtual)) : null}
      promocoes={JSON.parse(JSON.stringify(promocoes))}
      noticias={JSON.parse(JSON.stringify(noticias))}
      programasHoje={JSON.parse(JSON.stringify(programasHoje))}
    />
  );
}
