import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { RecadosContent } from "./recados-content";

export const dynamic = "force-dynamic";

export default async function RecadosPage() {
  const recadosPublicos = await db.recado.findMany({
    where: { isPublic: true, status: { in: ["READ", "ANSWERED"] } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <AppShell>
      <RecadosContent recadosPublicos={JSON.parse(JSON.stringify(recadosPublicos))} />
    </AppShell>
  );
}
