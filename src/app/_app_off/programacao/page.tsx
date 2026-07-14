import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { ProgramacaoContent } from "./programacao-content";

export const dynamic = "force-dynamic";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function ProgramacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string }>;
}) {
  const sp = await searchParams;
  const diaParam = sp.dia ? parseInt(sp.dia) : new Date().getDay();
  const diaAtual = isNaN(diaParam) ? new Date().getDay() : diaParam;

  const [programas, locutores] = await Promise.all([
    db.programa.findMany({
      where: { dayOfWeek: diaAtual },
      include: { locutor: true },
      orderBy: { startTime: "asc" },
    }),
    db.locutor.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AppShell>
      <ProgramacaoContent
        programas={JSON.parse(JSON.stringify(programas))}
        locutores={JSON.parse(JSON.stringify(locutores))}
        diaAtual={diaAtual}
        dias={DIAS}
      />
    </AppShell>
  );
}
