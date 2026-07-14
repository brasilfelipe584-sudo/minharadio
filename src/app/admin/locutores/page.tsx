import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminLocutoresPage() {
  const fields: FieldDef[] = [
    { name: "name", label: "Nome", type: "text", required: true, full: true },
    { name: "bio", label: "Biografia", type: "textarea", full: true },
    { name: "avatarUrl", label: "URL do Avatar", type: "image", full: true, placeholder: "https://..." },
    { name: "instagram", label: "Instagram", type: "text", placeholder: "@usuario" },
    { name: "facebook", label: "Facebook", type: "text" },
    { name: "whatsapp", label: "WhatsApp", type: "text" },
  ];

  const columns: ColumnDef[] = [
    { name: "avatarUrl", label: "", renderType: "image" },
    { name: "name", label: "Nome", renderType: "text" },
    { name: "bio", label: "Bio", renderType: "truncate" },
    { name: "instagram", label: "Instagram", renderType: "text" },
  ];

  return <AdminCrud entity="locutores" title="Locutores" singular="Locutor" fields={fields} columns={columns} />;
}
