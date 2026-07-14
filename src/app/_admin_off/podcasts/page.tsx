import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminPodcastsPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true, full: true },
    { name: "description", label: "Descrição", type: "textarea", full: true },
    { name: "imageUrl", label: "URL da Imagem", type: "image", full: true },
    { name: "audioUrl", label: "URL do Áudio", type: "text", full: true, placeholder: "https://...mp3" },
    { name: "category", label: "Categoria", type: "text" },
    { name: "season", label: "Temporada", type: "number" },
    { name: "episode", label: "Episódio", type: "number" },
    { name: "duration", label: "Duração (s)", type: "number" },
  ];

  const columns: ColumnDef[] = [
    { name: "imageUrl", label: "", renderType: "image" },
    { name: "title", label: "Título", renderType: "truncate" },
    { name: "category", label: "Categoria", renderType: "badge", badgeColor: "#3b82f6" },
    { name: "season", label: "Temp.", renderType: "text" },
    { name: "episode", label: "Ep.", renderType: "text" },
  ];

  return <AdminCrud entity="podcasts" title="Podcasts" singular="Podcast" fields={fields} columns={columns} />;
}
