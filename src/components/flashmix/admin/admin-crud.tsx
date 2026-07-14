"use client";

import { useState, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, X, Loader2, ChevronLeft, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "image" | "datetime" | "time" | "color";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  full?: boolean;
  placeholder?: string;
};

export type ColumnRenderType = "text" | "image" | "boolean" | "datetime" | "time" | "badge" | "truncate";

export type ColumnDef = {
  name: string;
  label: string;
  renderType?: ColumnRenderType;
  // Para colunas com lookup (ex: locutor.name a partir de locutorId)
  lookup?: string; // ex: "locutor.name"
  badgeColor?: string; // hex color para badge
  className?: string;
};

interface AdminCrudProps {
  entity: string;
  title: string;
  singular: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  searchPlaceholder?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

function renderCell(item: any, col: ColumnDef) {
  let value: any = item[col.name];
  if (col.lookup) {
    const parts = col.lookup.split(".");
    value = parts.reduce((acc, p) => acc?.[p], item);
  }
  if (value === undefined || value === null) return <span className="text-white/30">—</span>;

  switch (col.renderType) {
    case "image":
      return value ? (
         
        <img src={value} alt="" className="h-10 w-10 rounded-lg object-cover border border-white/10" />
      ) : <span className="text-white/30">—</span>;
    case "boolean":
      return value ? (
        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-green-400">Sim</span>
      ) : (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/50">Não</span>
      );
    case "datetime":
      return <span className="text-white/70">{new Date(value).toLocaleString("pt-BR")}</span>;
    case "badge":
      return (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
          style={{ background: `${col.badgeColor || "#E30613"}20`, color: col.badgeColor || "#E30613" }}
        >
          {String(value)}
        </span>
      );
    case "truncate":
      return <span className="block max-w-[200px] truncate text-white/70">{String(value)}</span>;
    default:
      return <span className="text-white/80">{String(value)}</span>;
  }
}

export function AdminCrud({
  entity, title, singular, fields, columns,
  searchPlaceholder = "Buscar...",
  canCreate = true, canEdit = true, canDelete = true,
}: AdminCrudProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async (query?: string) => {
    setLoading(true);
    try {
      const url = `/api/admin/${entity}${query ? `?q=${encodeURIComponent(query)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      toast({ title: "Erro", description: "Falha ao carregar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const openNew = () => {
    const empty: any = {};
    fields.forEach((f) => {
      empty[f.name] = f.type === "boolean" ? false : f.type === "number" ? 0 : "";
    });
    setForm(empty);
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setEditing(item);
    setFormOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/${entity}/${editing.id}` : `/api/admin/${entity}`;
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar");
      toast({
        title: editing ? "Atualizado!" : "Criado!",
        description: `${singular} ${editing ? "atualizado" : "criado"} com sucesso`,
      });
      setFormOpen(false);
      load();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/${entity}/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      toast({ title: "Excluído!", description: `${singular} excluído com sucesso` });
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin" className="mb-1 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white">
            <ChevronLeft className="h-3 w-3" /> Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-white/60">{items.length} {items.length === 1 ? singular.toLowerCase() : title.toLowerCase()}</p>
        </div>
        {canCreate && (
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-[1.02] active:scale-95 transition"
          >
            <Plus className="h-4 w-4" /> Novo
          </button>
        )}
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#E30613]" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-white/50">Nenhum item encontrado.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl glass">
          <table className="hidden w-full text-sm sm:table">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-white/40">
                {columns.map((c) => (
                  <th key={c.name} className={`px-4 py-3 font-medium ${c.className || ""}`}>{c.label}</th>
                ))}
                {(canEdit || canDelete) && <th className="px-4 py-3 text-right font-medium">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                  {columns.map((c) => (
                    <td key={c.name} className={`px-4 py-3 ${c.className || ""}`}>{renderCell(item, c)}</td>
                  ))}
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {canEdit && (
                          <button onClick={() => openEdit(item)} className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-[#E30613] transition" aria-label="Editar">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => setDeleteId(item.id)} className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-red-400 transition" aria-label="Excluir">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sm:hidden">
            {items.map((item) => (
              <div key={item.id} className="border-b border-white/5 p-3 last:border-0">
                {columns.map((c) => (
                  <div key={c.name} className="mb-1.5 flex items-start gap-2 last:mb-0">
                    <span className="w-20 shrink-0 text-[10px] uppercase tracking-wider text-white/40">{c.label}:</span>
                    <div className="flex-1">{renderCell(item, c)}</div>
                  </div>
                ))}
                {(canEdit || canDelete) && (
                  <div className="mt-2 flex gap-2">
                    {canEdit && (
                      <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                        <Edit2 className="h-3 w-3" /> Editar
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => setDeleteId(item.id)} className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-400">
                        <Trash2 className="h-3 w-3" /> Excluir
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="glass-dark border-white/10 max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? `Editar ${singular}` : `Novo ${singular}`}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">
                  {f.label} {f.required && <span className="text-[#E30613]">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    rows={3}
                    placeholder={f.placeholder}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
                  />
                ) : f.type === "boolean" ? (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, [f.name]: !form[f.name] })}
                    className={`relative h-7 w-12 rounded-full transition ${form[f.name] ? "bg-[#E30613]" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${form[f.name] ? "left-6" : "left-1"}`} />
                  </button>
                ) : f.type === "select" ? (
                  <select
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E30613]/60 focus:outline-none"
                  >
                    <option value="">Selecione...</option>
                    {f.options?.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : f.type === "datetime" ? "datetime-local" : f.type === "time" ? "time" : f.type === "color" ? "color" : "text"}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({
                      ...form,
                      [f.name]: f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
                    })}
                    placeholder={f.placeholder}
                    className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none ${f.type === "color" ? "h-10 p-1" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setFormOpen(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white hover:bg-white/5 transition">
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-5 py-2 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-[1.02] active:scale-95 transition disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-dark border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-[#E30613]" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Tem certeza que deseja excluir este {singular.toLowerCase()}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-white/15 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-full bg-[#E30613] text-white hover:bg-[#E30613]/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
