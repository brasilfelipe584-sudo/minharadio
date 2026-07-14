import { db } from "@/lib/db";
import { auth } from "@/auth";
import { AppShell } from "@/components/flashmix/app-shell";
import { PerfilContent } from "./perfil-content";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true, email: true, name: true, role: true, isGuest: true,
      city: true, state: true, avatarUrl: true, createdAt: true,
    },
  });
  if (!user) redirect("/login");

  const [favCount, historyCount, recadoCount] = await Promise.all([
    db.favorite.count({ where: { userId: user.id } }),
    db.history.count({ where: { userId: user.id } }),
    db.recado.count({ where: { userId: user.id } }),
  ]);

  return (
    <AppShell>
      <PerfilContent
        user={JSON.parse(JSON.stringify(user))}
        stats={{ favoritos: favCount, historico: historyCount, recados: recadoCount }}
      />
    </AppShell>
  );
}
