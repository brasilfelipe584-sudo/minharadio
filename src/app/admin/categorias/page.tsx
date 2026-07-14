import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminCategoriasPage() {
  const fields: FieldDef[] = [
    { name: "name", label: "Nome", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "ex: pop, rock, forro" },
    { name: "iconName", label: "Ícone (Lucide)", type: "text", placeholder: "Music, Newspaper..." },
    { name: "color", label: "Cor", type: "color" },
    { name: "order", label: "Ordem", type: "number" },
  ];

  const columns: ColumnDef[] = [
    { name: "color", label: "", renderType: "badge" },
    { name: "name", label: "Nome", renderType: "text" },
    { name: "slug", label: "Slug", renderType: "text" },
    { name: "iconName", label: "Ícone", renderType: "text" },
    { name: "order", label: "Ordem", renderType: "text" },
  ];

  return <AdminCrud entity="categorias" title="Categorias" singular="Categoria" fields={fields} columns={columns} />;
}
