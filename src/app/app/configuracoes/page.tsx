import { AppShell } from "@/components/flashmix/app-shell";
import { ConfiguracoesContent } from "./configuracoes-content";

export const dynamic = "force-dynamic";

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <ConfiguracoesContent />
    </AppShell>
  );
}
