import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminNoticiasPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true, full: true },
    { name: "summary", label: "Resumo", type: "textarea", required: true, full: true },
    { name: "content", label: "Conteúdo", type: "textarea", full: true, placeholder: "Texto completo da notícia" },
    { name: "imageUrl", label: "URL da Imagem", type: "image", full: true, placeholder: "https://..." },
    { name: "category", label: "Categoria", type: "select", options: [
      { value: "Geral", label: "Geral" }, { value: "Música", label: "Música" },
      { value: "Cultura", label: "Cultura" }, { value: "Tecnologia", label: "Tecnologia" },
      { value: "Esporte", label: "Esporte" }, { value: "Cidade", label: "Cidade" },
      { value: "Promoção", label: "Promoção" },
    ]},
    { name: "isFeatured", label: "Destaque", type: "boolean" },
  ];

  const columns: ColumnDef[] = [
    { name: "imageUrl", label: "", renderType: "image" },
    { name: "title", label: "Título", renderType: "truncate" },
    { name: "category", label: "Categoria", renderType: "badge", badgeColor: "#E30613" },
    { name: "isFeatured", label: "Destaque", renderType: "boolean" },
    { name: "publishedAt", label: "Publicado", renderType: "datetime" },
  ];

  return <AdminCrud entity="noticias" title="Notícias" singular="Notícia" fields={fields} columns={columns} />;
}
