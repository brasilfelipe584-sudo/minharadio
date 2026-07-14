import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminPromocoesPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true, full: true },
    { name: "description", label: "Descrição", type: "textarea", required: true, full: true },
    { name: "rules", label: "Regulamento", type: "textarea", full: true },
    { name: "prize", label: "Prêmio", type: "text", placeholder: "Ex: R$ 10.000,00" },
    { name: "imageUrl", label: "URL da Imagem", type: "image", full: true },
    { name: "endDate", label: "Data de Encerramento", type: "datetime" },
    { name: "isActive", label: "Ativa", type: "boolean" },
    { name: "participants", label: "Participantes", type: "number" },
  ];

  const columns: ColumnDef[] = [
    { name: "imageUrl", label: "", renderType: "image" },
    { name: "title", label: "Título", renderType: "truncate" },
    { name: "prize", label: "Prêmio", renderType: "text" },
    { name: "participants", label: "Participantes", renderType: "text" },
    { name: "isActive", label: "Ativa", renderType: "boolean" },
    { name: "endDate", label: "Encerra", renderType: "datetime" },
  ];

  return <AdminCrud entity="promocoes" title="Promoções" singular="Promoção" fields={fields} columns={columns} />;
}
