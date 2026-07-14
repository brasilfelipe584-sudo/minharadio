import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminVideosPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true, full: true },
    { name: "description", label: "Descrição", type: "textarea", full: true },
    { name: "youtubeId", label: "YouTube ID", type: "text", required: true, placeholder: "ex: dQw4w9WgXcQ" },
    { name: "duration", label: "Duração (s)", type: "number" },
  ];

  const columns: ColumnDef[] = [
    { name: "thumbnailUrl", label: "", renderType: "image" },
    { name: "title", label: "Título", renderType: "truncate" },
    { name: "youtubeId", label: "YouTube ID", renderType: "badge", badgeColor: "#ff0000" },
    { name: "views", label: "Views", renderType: "text" },
  ];

  return <AdminCrud entity="videos" title="Vídeos" singular="Vídeo" fields={fields} columns={columns} />;
}
