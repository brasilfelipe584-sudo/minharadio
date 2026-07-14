import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminRecadosPage() {
  const fields: FieldDef[] = [
    { name: "userName", label: "Nome", type: "text", required: true, full: true },
    { name: "city", label: "Cidade", type: "text" },
    { name: "message", label: "Mensagem", type: "textarea", required: true, full: true },
    { name: "status", label: "Status", type: "select", options: [
      { value: "PENDING", label: "Pendente" }, { value: "READ", label: "Lido" },
      { value: "ANSWERED", label: "Respondido" },
    ]},
    { name: "answer", label: "Resposta", type: "textarea", full: true, placeholder: "Resposta da rádio..." },
    { name: "isPublic", label: "Público", type: "boolean" },
  ];

  const columns: ColumnDef[] = [
    { name: "userName", label: "Remetente", renderType: "text" },
    { name: "city", label: "Cidade", renderType: "text" },
    { name: "message", label: "Mensagem", renderType: "truncate" },
    { name: "status", label: "Status", renderType: "badge", badgeColor: "#E30613" },
    { name: "createdAt", label: "Recebido", renderType: "datetime" },
  ];

  return (
    <AdminCrud
      entity="recados"
      title="Recados"
      singular="Recado"
      fields={fields}
      columns={columns}
      canCreate={false}
      canDelete={true}
    />
  );
}
