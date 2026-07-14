import { db } from "@/lib/db";
import { auth } from "@/auth";
import { AppShell } from "@/components/flashmix/app-shell";
import { NotificacoesContent } from "./notificacoes-content";

export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  // Notificações do usuário + globais
  const where = userId
    ? { OR: [{ userId }, { userId: null }] }
    : { userId: null };

  const notifications = await db.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AppShell>
      <NotificacoesContent items={JSON.parse(JSON.stringify(notifications))} />
    </AppShell>
  );
}
