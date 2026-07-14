import { db } from "@/lib/db";
import { AdminCrud, type FieldDef, type ColumnDef } from "@/components/flashmix/admin/admin-crud";

export const dynamic = "force-dynamic";

export default async function AdminProgramasPage() {
  const locutores = await db.locutor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  const fields: FieldDef[] = [
    { name: "title", label: "Título", type: "text", required: true, full: true },
    { name: "description", label: "Descrição", type: "textarea", full: true },
    { name: "imageUrl", label: "URL da Imagem", type: "image", full: true, placeholder: "https://..." },
    { name: "dayOfWeek", label: "Dia da Semana", type: "select", required: true, options: [
      { value: "0", label: "Domingo" }, { value: "1", label: "Segunda" },
      { value: "2", label: "Terça" }, { value: "3", label: "Quarta" },
      { value: "4", label: "Quinta" }, { value: "5", label: "Sexta" },
      { value: "6", label: "Sábado" },
    ]},
    { name: "startTime", label: "Início", type: "time", required: true },
    { name: "endTime", label: "Fim", type: "time", required: true },
    { name: "locutorId", label: "Locutor", type: "select", options: locutores.map((l) => ({ value: l.id, label: l.name })) },
    { name: "isLive", label: "Ao Vivo Agora", type: "boolean" },
  ];

  const columns: ColumnDef[] = [
    { name: "title", label: "Programa", renderType: "text" },
    { name: "horario", label: "Horário", lookup: "_computed", renderType: "text" },
    { name: "locutor", label: "Locutor", lookup: "locutor.name", renderType: "text" },
  ];

  // Note: o "horario" lookup não funciona diretamente — vamos usar duas colunas
  const realColumns: ColumnDef[] = [
    { name: "title", label: "Programa", renderType: "text" },
    { name: "startTime", label: "Início", renderType: "time" },
    { name: "endTime", label: "Fim", renderType: "time" },
    { name: "locutor", label: "Locutor", lookup: "locutor.name", renderType: "text" },
    { name: "isLive", label: "Ao Vivo", renderType: "boolean" },
  ];

  return (
    <AdminCrud
      entity="programas"
      title="Programas"
      singular="Programa"
      fields={fields}
      columns={realColumns}
      searchPlaceholder="Buscar programa..."
    />
  );
}
