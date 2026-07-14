import { db } from "@/lib/db";
import { AppShell } from "@/components/flashmix/app-shell";
import { RadioContent } from "./radio-content";

export const dynamic = "force-dynamic";

export default async function RadioPage() {
  const historico = await db.musica.findMany({
    orderBy: { playedAt: "desc" },
    take: 8,
  });

  return (
    <AppShell>
      <RadioContent historico={JSON.parse(JSON.stringify(historico))} />
    </AppShell>
  );
}
