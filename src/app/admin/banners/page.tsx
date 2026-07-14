import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminBannersPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "subtitle", label: "Subtítulo", type: "text" },
    { name: "imageUrl", label: "URL da Imagem", type: "image", full: true, required: true },
    { name: "linkUrl", label: "Link de Destino", type: "text", full: true, placeholder: "/noticias ou https://..." },
    { name: "position", label: "Posição", type: "select", options: [
      { value: "home", label: "Home" }, { value: "radio", label: "Rádio" },
      { value: "noticias", label: "Notícias" }, { value: "promocoes", label: "Promoções" },
    ]},
    { name: "order", label: "Ordem", type: "number" },
    { name: "isActive", label: "Ativo", type: "boolean" },
  ];

  const columns: ColumnDef[] = [
    { name: "imageUrl", label: "", renderType: "image" },
    { name: "title", label: "Título", renderType: "text" },
    { name: "position", label: "Posição", renderType: "badge", badgeColor: "#3b82f6" },
    { name: "order", label: "Ordem", renderType: "text" },
    { name: "isActive", label: "Ativo", renderType: "boolean" },
  ];

  return <AdminCrud entity="banners" title="Banners" singular="Banner" fields={fields} columns={columns} />;
}
