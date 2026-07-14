import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default function AdminMusicasPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "artist", label: "Artista", type: "text", required: true },
    { name: "album", label: "Álbum", type: "text" },
    { name: "coverUrl", label: "URL da Capa", type: "image", full: true, placeholder: "https://..." },
    { name: "category", label: "Categoria", type: "select", options: [
      { value: "Pop", label: "Pop" }, { value: "Rock", label: "Rock" },
      { value: "Forró", label: "Forró" }, { value: "Sertanejo", label: "Sertanejo" },
      { value: "Eletrônica", label: "Eletrônica" }, { value: "Flashback", label: "Flashback" },
      { value: "Funk", label: "Funk" }, { value: "Gospel", label: "Gospel" },
    ]},
    { name: "duration", label: "Duração (s)", type: "number" },
    { name: "isPlaying", label: "Tocando Agora", type: "boolean" },
  ];

  const columns: ColumnDef[] = [
    { name: "coverUrl", label: "", renderType: "image" },
    { name: "title", label: "Música", renderType: "text" },
    { name: "artist", label: "Artista", renderType: "text" },
    { name: "category", label: "Categoria", renderType: "badge", badgeColor: "#E30613" },
    { name: "isPlaying", label: "Tocando", renderType: "boolean" },
  ];

  return <AdminCrud entity="musicas" title="Músicas" singular="Música" fields={fields} columns={columns} />;
}
