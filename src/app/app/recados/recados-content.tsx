"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, Check, CheckCheck, MapPin, User } from "lucide-react";

type Recado = {
  id: string; userName: string; city?: string | null;
  message: string; status: string; answer?: string | null; createdAt: string;
};

export function RecadosContent({ recadosPublicos }: { recadosPublicos: Recado[] }) {
  const [form, setForm] = useState({ userName: "", city: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [meusRecados, setMeusRecados] = useState<Recado[]>([]);

  useEffect(() => {
    fetch("/api/recados")
      .then((r) => r.json())
      .then((d) => setMeusRecados(d.items || []))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userName || !form.message) return;
    setSending(true);
    try {
      const res = await fetch("/api/recados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setForm({ userName: "", city: "", message: "" });
        setTimeout(() => setSent(false), 3000);
        // Recarrega meus recados
        const r2 = await fetch("/api/recados");
        const d2 = await r2.json();
        setMeusRecados(d2.items || []);
      }
    } finally {
      setSending(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "ANSWERED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-400">
          <CheckCheck className="h-3 w-3" /> Respondido
        </span>
      );
    }
    if (status === "READ") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
          <Check className="h-3 w-3" /> Lido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
        Pendente
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Recados</h1>
        <p className="text-sm text-white/60">Mande seu recado para a rádio</p>
      </header>

      {/* Formulário */}
      <form onSubmit={submit} className="glass space-y-3 rounded-3xl p-4">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60">
            <User className="h-3 w-3" /> Nome
          </label>
          <input
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            required
            maxLength={50}
            placeholder="Seu nome"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60">
            <MapPin className="h-3 w-3" /> Cidade
          </label>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            maxLength={60}
            placeholder="Sua cidade (opcional)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60">
            <MessageSquare className="h-3 w-3" /> Mensagem
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            maxLength={500}
            rows={3}
            placeholder="Escreva seu recado..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
          />
          <p className="mt-1 text-right text-[10px] text-white/40">{form.message.length}/500</p>
        </div>
        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E30613] py-3 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-[1.02] active:scale-95 transition disabled:opacity-60"
        >
          {sent ? (
            <>
              <Check className="h-4 w-4" /> Enviado!
            </>
          ) : sending ? (
            "Enviando..."
          ) : (
            <>
              <Send className="h-4 w-4" /> Enviar Recado
            </>
          )}
        </button>
      </form>

      {/* Meus recados */}
      {meusRecados.length > 0 && (
        <section>
          <h3 className="mb-3 px-1 text-base font-bold uppercase tracking-wide text-white">Meus Recados</h3>
          <div className="space-y-2">
            {meusRecados.map((r) => (
              <div key={r.id} className="glass rounded-2xl p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-medium text-white/70">{new Date(r.createdAt).toLocaleString("pt-BR")}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-white">{r.message}</p>
                {r.answer && (
                  <div className="mt-2 rounded-xl bg-[#E30613]/10 p-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">Resposta da Rádio</p>
                    <p className="mt-0.5 text-sm text-white/80">{r.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recados públicos */}
      {recadosPublicos.length > 0 && (
        <section>
          <h3 className="mb-3 px-1 text-base font-bold uppercase tracking-wide text-white">Recados dos Ouvintes</h3>
          <div className="space-y-2">
            {recadosPublicos.map((r) => (
              <div key={r.id} className="glass rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#E30613] to-[#0B1836] text-xs font-bold text-white">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{r.userName}</p>
                    {r.city && <p className="truncate text-xs text-white/50">{r.city}</p>}
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/80">{r.message}</p>
                {r.answer && (
                  <div className="mt-2 rounded-xl bg-[#E30613]/10 p-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E30613]">Resposta</p>
                    <p className="mt-0.5 text-sm text-white/80">{r.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
