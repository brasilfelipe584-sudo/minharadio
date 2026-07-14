"use client";

import { useState } from "react";
import { Loader2, Save, Radio, ChevronLeft, Check } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Config = {
  id: string;
  streamUrl: string;
  streamName: string;
  nowPlayingTitle: string | null;
  nowPlayingArtist: string | null;
  isLive: boolean;
};

export function RadioConfigContent({ config }: { config: Config | null }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    streamUrl: config?.streamUrl || "https://icecast.wmncdn.net/somfmtop3",
    streamName: config?.streamName || "Flash Mix Digital",
    nowPlayingTitle: config?.nowPlayingTitle || "",
    nowPlayingArtist: config?.nowPlayingArtist || "",
    isLive: config?.isLive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const url = config ? `/api/admin/radio-config` : `/api/admin/radio-config`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      toast({ title: "Salvo!", description: "Configuração da rádio atualizada" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin" className="mb-1 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white">
          <ChevronLeft className="h-3 w-3" /> Dashboard
        </Link>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Radio className="h-6 w-6 text-[#E30613]" />
          Configuração da Rádio
        </h1>
        <p className="text-sm text-white/60">Defina a URL do stream e a música tocando agora</p>
      </header>

      {/* Status atual */}
      <section className="glass-red flex items-center gap-4 rounded-3xl p-5">
        <div className="relative">
          <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#E30613]/60 bg-gradient-to-br from-[#0B1836] to-[#2a0408]">
            <Radio className={`h-7 w-7 text-[#E30613] ${form.isLive ? "animate-pulse" : ""}`} />
          </div>
          {form.isLive && <div className="absolute -inset-1 rounded-full border-2 border-[#E30613]/60 animate-glow-pulse" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {form.isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E30613] px-2 py-0.5 text-[10px] font-bold uppercase text-white glow-red">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Ao Vivo
              </span>
            )}
            <p className="text-sm font-medium text-white/80">{form.streamName}</p>
          </div>
          <p className="mt-1 text-lg font-bold text-white">{form.nowPlayingTitle || "Sem música definida"}</p>
          <p className="text-sm text-white/60">{form.nowPlayingArtist || "—"}</p>
        </div>
      </section>

      {/* Formulário */}
      <section className="glass space-y-4 rounded-3xl p-5">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">
            URL do Stream (Icecast/Shoutcast)
          </label>
          <input
            value={form.streamUrl}
            onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
            placeholder="https://stream.flashmix.com.br/radio.mp3"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
          />
          <p className="mt-1 text-xs text-white/40">
            Stream placeholder atual: SomaFM. Troque pela URL real da Flash Mix Digital.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">
            Nome da Rádio
          </label>
          <input
            value={form.streamName}
            onChange={(e) => setForm({ ...form, streamName: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#E30613]/60 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">
              Música Tocando Agora
            </label>
            <input
              value={form.nowPlayingTitle}
              onChange={(e) => setForm({ ...form, nowPlayingTitle: e.target.value })}
              placeholder="Ex: Blinding Lights"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">
              Artista
            </label>
            <input
              value={form.nowPlayingArtist}
              onChange={(e) => setForm({ ...form, nowPlayingArtist: e.target.value })}
              placeholder="Ex: The Weeknd"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div>
            <p className="text-sm font-medium text-white">Rádio ao vivo</p>
            <p className="text-xs text-white/50">Marque como ativa quando estiver transmitindo</p>
          </div>
          <button
            onClick={() => setForm({ ...form, isLive: !form.isLive })}
            className={`relative h-7 w-12 rounded-full transition ${form.isLive ? "bg-[#E30613] glow-red" : "bg-white/10"}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${form.isLive ? "left-6" : "left-1"}`} />
          </button>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E30613] py-3.5 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-[1.02] active:scale-95 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Configuração
        </button>
      </section>

      {/* Instruções */}
      <section className="glass rounded-3xl p-5">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#E30613]">Como integrar streaming real</h3>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-white/70">
          <li>Contrate um servidor Icecast ou Shoutcast (ex: Cast, Radio.co, Live365).</li>
          <li>Configure seu software de transmissão (SAM Broadcaster, RadioBoss, Mixxx) para enviar áudio ao servidor.</li>
          <li>Copie a URL pública do stream (ex: <code className="rounded bg-white/10 px-1 text-white">https://stream.flashmix.com.br/radio.mp3</code>).</li>
          <li>Cole a URL no campo acima e salve.</li>
          <li>O app passa a tocar o stream ao vivo automaticamente.</li>
        </ol>
      </section>
    </div>
  );
}
