import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminUsuariosPage() {
  const fields: FieldDef[] = [
    { name: "name", label: "Nome", type: "text", full: true },
    { name: "email", label: "Email", type: "text", required: true, full: true },
    { name: "city", label: "Cidade", type: "text" },
    { name: "state", label: "Estado", type: "text" },
    { name: "role", label: "Papel", type: "select", options: [
      { value: "USER", label: "Usuário" }, { value: "ADMIN", label: "Administrador" },
      { value: "GUEST", label: "Visitante" },
    ]},
    { name: "isGuest", label: "É Visitante", type: "boolean" },
  ];

  const columns: ColumnDef[] = [
    { name: "name", label: "Nome", renderType: "text" },
    { name: "email", label: "Email", renderType: "truncate" },
    { name: "city", label: "Cidade", renderType: "text" },
    { name: "role", label: "Papel", renderType: "badge", badgeColor: "#E30613" },
    { name: "isGuest", label: "Visitante", renderType: "boolean" },
    { name: "createdAt", label: "Cadastro", renderType: "datetime" },
  ];

  return (
    <AdminCrud
      entity="usuarios"
      title="Usuários"
      singular="Usuário"
      fields={fields}
      columns={columns}
      canCreate={false}
    />
  );
}
